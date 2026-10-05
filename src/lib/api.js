import { useCallback, useEffect, useState } from 'react';
import * as FileSystem from 'expo-file-system/legacy'; // SDK 54+. On older SDKs use: 'expo-file-system'
import * as NewFS from 'expo-file-system'; // new File API (SDK 54+); File will be undefined on older SDKs
import { decode } from 'base64-arraybuffer';
import { supabase } from './supabase';

const pct = (done, total) => (total ? Math.round((done / total) * 100) : 0);

// ---------- Lists (Home, Reviewers, Stats) ----------

function mapListRow(row) {
  const chapters = Number(row.chapters) || 0;
  const reviewed = Number(row.reviewed_chapters) || 0;
  return {
    id: row.id,
    title: row.title,
    color: row.color,
    cards: Number(row.flashcards) || 0,
    questionCount: Number(row.questions) || 0,
    topicCount: chapters,
    reviewed,
    done: pct(reviewed, chapters),
  };
}

export async function fetchReviewers() {
  const { data, error } = await supabase
    .from('reviewer_stats')
    .select('*')
    .eq('status', 'ready')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(mapListRow);
}

export function useReviewers() {
  const [reviewers, setReviewers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setReviewers(await fetchReviewers());
    } catch (e) {
      setError(e.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { reviewers, loading, error, reload: load };
}

// ---------- One reviewer with everything (notes, flashcards, quiz) ----------

export async function fetchReviewerDetail(id) {
  const [rev, chap, cards, qs] = await Promise.all([
    supabase.from('reviewers').select('*').eq('id', id).single(),
    supabase.from('chapters').select('*').eq('reviewer_id', id).order('position'),
    supabase.from('flashcards').select('*').eq('reviewer_id', id).order('position'),
    supabase.from('questions').select('*').eq('reviewer_id', id).order('position'),
  ]);
  const err = rev.error || chap.error || cards.error || qs.error;
  if (err) throw err;

  const r = rev.data;
  const chapters = chap.data;
  const indexById = {};
  chapters.forEach((c, i) => {
    indexById[c.id] = i;
  });

  const reviewed = chapters.filter((c) => c.reviewed_at).length;
  const quizChapters = new Set(qs.data.map((q) => q.chapter_id).filter(Boolean));
  const quizzes = quizChapters.size || (qs.data.length ? 1 : 0);

  return {
    id: r.id,
    title: r.title,
    color: r.color,
    summary: r.summary || '',
    cards: cards.data.length,
    done: pct(reviewed, chapters.length),
    reviewed,
    inProgress: 0,
    stats: {
      questions: qs.data.length,
      words: r.words || 0,
      flashcards: cards.data.length,
      quizzes,
    },
    topics: chapters.map((c) => ({
      id: c.id,
      reviewed: !!c.reviewed_at,
      title: c.title,
      concepts: c.key_concepts || 0,
      icon: c.icon || 'document-text-outline',
      lib: c.icon_lib === 'mci' ? 'mci' : undefined,
    })),
    notes: chapters.map((c) => ({
      points: c.points || [],
      term: { label: c.term_label || '', text: c.term_text || '' },
      diagrams: c.diagrams || [],
    })),
    flashcardList: cards.data.map((f) => ({
      chapter: indexById[f.chapter_id] ?? 0,
      q: f.front,
      a: f.back,
    })),
    quiz: {
      of: quizzes,
      title: r.title,
      questions: qs.data.map((q) => ({
        topic: q.topic || '',
        text: q.text,
        options: q.options,
        answer: q.answer_index,
        explanation: q.explanation || '',
      })),
    },
  };
}

// ---------- Saving progress ----------

export async function markChapterReviewed(chapterId) {
  const { error } = await supabase
    .from('chapters')
    .update({ reviewed_at: new Date().toISOString() })
    .eq('id', chapterId);
  if (error) throw error;
}

export async function saveQuizAttempt({ reviewerId, score, total, answers }) {
  const { error } = await supabase
    .from('quiz_attempts')
    .insert({ reviewer_id: reviewerId, score, total, answers });
  if (error) throw error;
}

// ---------- Upload and generate ----------

// Tries several ways to read a local file, and reports exactly what happened if all fail.
async function readPdfBytes(uri) {
  const errors = [];

  // Diagnostics: does the file exist and how big is it?
  try {
    const info = await FileSystem.getInfoAsync(uri);
    errors.push(`info: exists=${info.exists} size=${info.size ?? '?'}`);
  } catch (e) {
    errors.push('info failed: ' + (e?.message || e));
  }

  // 1) Legacy API (base64)
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    if (base64) return decode(base64);
  } catch (e) {
    errors.push('legacy read: ' + (e?.message || e));
  }

  // 2) Copy into the app's document folder first (works for content:// and odd cache paths), then read
  try {
    const dest = FileSystem.documentDirectory + `upload-${Date.now()}.pdf`;
    await FileSystem.copyAsync({ from: uri, to: dest });
    const base64 = await FileSystem.readAsStringAsync(dest, {
      encoding: FileSystem.EncodingType.Base64,
    });
    if (base64) return decode(base64);
  } catch (e) {
    errors.push('copy+read: ' + (e?.message || e));
  }

  // 3) New File API (SDK 54+)
  try {
    if (NewFS.File) {
      const bytes = await new NewFS.File(uri).bytes();
      if (bytes?.byteLength) {
        return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
      }
    }
  } catch (e) {
    errors.push('new API: ' + (e?.message || e));
  }

  // 4) Plain fetch
  try {
    const res = await fetch(uri);
    const buf = await res.arrayBuffer();
    if (buf?.byteLength) return buf;
  } catch (e) {
    errors.push('fetch: ' + (e?.message || e));
  }

  throw new Error('Could not read the PDF. ' + errors.join(' | '));
}

export async function uploadPdf({ uri, name, language }) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;

  const user = userData?.user;
  if (!user) throw new Error('Please sign in again.');
  if (!uri) throw new Error('No PDF file was selected.');

  // Create a unique path
  const path = `${user.id}/${Date.now()}.pdf`;

  // Read the PDF (throws a detailed error if every method fails)
  const body = await readPdfBytes(uri);

  // Upload to storage
  const { error: uploadError } = await supabase.storage
    .from('pdfs')
    .upload(path, body, {
      contentType: 'application/pdf',
      upsert: false,
    });
  if (uploadError) throw uploadError;

  // Create the reviewer record
  const { data, error } = await supabase
    .from('reviewers')
    .insert({
      title: String(name || 'Untitled').replace(/\.pdf$/i, ''),
      language,
      file_path: path,
      status: 'processing',
    })
    .select('id')
    .single();
  if (error) throw error;

  return data.id;
}

async function generateStep(body) {
  const { data, error } = await supabase.functions.invoke('generate-reviewer', { body });
  if (error) {
    let message = error.message;
    try {
      const detail = await error.context.json();
      if (detail?.error) message = detail.error;
    } catch (_) {}
    throw new Error(message);
  }
  return data;
}

// Runs the outline, then each chapter, reporting progress to the screen.
export async function generateReviewer({ reviewerId, questionCount, onProgress }) {
  onProgress?.({ stage: 'outline', current: 0, total: 0 });
  const { chapters } = await generateStep({ reviewerId, step: 'outline' });
  const perChapter = Math.min(12, Math.max(3, Math.ceil(questionCount / chapters)));

  for (let i = 1; i <= chapters; i++) {
    onProgress?.({ stage: 'chapters', current: i, total: chapters });
    await generateStep({ reviewerId, step: 'chapter', position: i, questionsPerChapter: perChapter });
  }
}