import { useCallback, useEffect, useState } from 'react';
import * as FileSystem from 'expo-file-system/legacy';
import * as NewFS from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import { supabase } from './supabase';

const pct = (done, total) => (total ? Math.round((done / total) * 100) : 0);

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

export async function deleteReviewer(id) {
  const tables = ['quiz_attempts', 'questions', 'flashcards', 'chapters'];
  for (const table of tables) {
    const { error } = await supabase.from(table).delete().eq('reviewer_id', id);
    if (error) throw error;
  }
  const { error } = await supabase.from('reviewers').delete().eq('id', id);
  if (error) throw error;
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

  useEffect(() => { load(); }, [load]);

  const remove = useCallback(async (id) => {
    await deleteReviewer(id);
    setReviewers((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return { reviewers, loading, error, reload: load, remove };
}

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
  chapters.forEach((c, i) => { indexById[c.id] = i; });

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
        id: q.id,
        topic: q.topic || '',
        text: q.text,
        options: q.options || [],
        answer: q.answer_index,
        answerText: q.answer_text || '',
        type: q.type || 'Multiple Choice',
        explanation: q.explanation || '',
      })),
    },
  };
}

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

async function readPdfBytes(uri) {
  const errors = [];

  try {
    const info = await FileSystem.getInfoAsync(uri);
    errors.push(`info: exists=${info.exists} size=${info.size ?? '?'}`);
  } catch (e) {
    errors.push('info failed: ' + (e?.message || e));
  }

  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    if (base64) return decode(base64);
  } catch (e) {
    errors.push('legacy read: ' + (e?.message || e));
  }

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

  const path = `${user.id}/${Date.now()}.pdf`;
  const body = await readPdfBytes(uri);

  const { error: uploadError } = await supabase.storage
    .from('pdfs')
    .upload(path, body, { contentType: 'application/pdf', upsert: false });
  if (uploadError) throw uploadError;

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

export async function generateReviewer({ reviewerId, questionCount, types = ['Multiple Choice'], onProgress }) {
  onProgress?.({ stage: 'outline', current: 0, total: 0 });
  const { chapters } = await generateStep({ reviewerId, step: 'outline' });

  // Split the requested total exactly: e.g. 10 questions over 6 chapters = 2,2,2,2,1,1
  const base = Math.floor(questionCount / chapters);
  const extra = questionCount % chapters;

  for (let i = 1; i <= chapters; i++) {
    onProgress?.({ stage: 'chapters', current: i, total: chapters });
    await generateStep({
      reviewerId,
      step: 'chapter',
      position: i,
      questionsPerChapter: base + (i <= extra ? 1 : 0),
      questionTypes: types,
    });
  }
}

export async function fetchProfile() {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  const user = userData?.user;
  if (!user) throw new Error('Not signed in.');

  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, avatar_url')
    .eq('id', user.id)
    .single();
  if (error) throw error;
  return data;
}

export async function updateProfile({ fullName, avatarUri }) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  const user = userData?.user;
  if (!user) throw new Error('Not signed in.');

  let avatar_url = null;

  if (avatarUri) {
    const ext = avatarUri.split('.').pop() || 'jpg';
    const path = `${user.id}/avatar.${ext}`;

    const base64 = await FileSystem.readAsStringAsync(avatarUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const body = decode(base64);

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, body, { contentType: `image/${ext}`, upsert: true });
    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path);
    avatar_url = urlData.publicUrl + '?t=' + Date.now();
  }

  const updates = {};
  if (fullName) updates.full_name = fullName;
  if (avatar_url) updates.avatar_url = avatar_url;

  if (Object.keys(updates).length === 0) return { fullName, avatar_url: null };

  const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
  if (error) throw error;

  return { fullName, avatar_url };
}

export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setProfile(await fetchProfile());
    } catch (e) {
      setError(e.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const update = useCallback(async ({ fullName, avatarUri }) => {
    const result = await updateProfile({ fullName, avatarUri });
    setProfile((prev) => ({
      ...prev,
      ...(result.fullName ? { full_name: result.fullName } : {}),
      ...(result.avatar_url ? { avatar_url: result.avatar_url } : {}),
    }));
    return result;
  }, []);

  return { profile, loading, error, reload: load, update };
}