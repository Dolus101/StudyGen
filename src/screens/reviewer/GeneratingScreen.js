import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { generateReviewer, uploadPdf } from '../../lib/api';

const C = { bg: '#080A1C', card: '#12152E', line: '#1C2044', text: '#FFFFFF', muted: '#8E92B2', accent: '#6B6CFF', button: '#5B63F0', green: '#34D399', red: '#F87171' };

function Step({ state, label }) {
  return (
    <View style={s.step}>
      {state === 'done' ? (
        <View style={[s.dot, { backgroundColor: C.green }]}>
          <Ionicons name="checkmark" size={14} color="#fff" />
        </View>
      ) : state === 'active' ? (
        <View style={s.dot}>
          <ActivityIndicator size="small" color={C.accent} />
        </View>
      ) : (
        <View style={s.dot} />
      )}
      <Text style={[s.stepText, state === 'pending' && { color: C.muted }, state === 'active' && { fontWeight: '700' }]}>{label}</Text>
    </View>
  );
}

export default function GeneratingScreen({ job, onDone, onBack }) {
  const [stage, setStage] = useState('upload');
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState(null);
  const reviewerIdRef = useRef(null);
  const runningRef = useRef(false);
  const mountedRef = useRef(true);

  const run = useCallback(async () => {
    if (runningRef.current) return;
    runningRef.current = true;
    setError(null);
    try {
      if (!reviewerIdRef.current) {
        setStage('upload');
        reviewerIdRef.current = await uploadPdf({
          uri: job.file.uri,
          name: job.file.name,
          language: job.language,
        });
      }
      await generateReviewer({
        reviewerId: reviewerIdRef.current,
        questionCount: parseInt(job.count, 10) || 30,
        types: job.types || ['Multiple Choice'], // ← pass types
        onProgress: (p) => {
          if (!mountedRef.current) return;
          setStage(p.stage);
          setProgress(p);
        },
      });
      if (!mountedRef.current) return;
      setStage('done');
      onDone(reviewerIdRef.current);
    } catch (e) {
      if (mountedRef.current) setError(e.message || 'Something went wrong.');
    } finally {
      runningRef.current = false;
    }
  }, [job, onDone]);

  useEffect(() => {
    mountedRef.current = true;
    run();
    return () => { mountedRef.current = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const percent =
    stage === 'upload' ? 5
    : stage === 'outline' ? 15
    : stage === 'chapters' ? 15 + Math.round(85 * ((progress.current - 1) / Math.max(progress.total, 1)))
    : 100;

  const state = (name) => {
    const order = ['upload', 'outline', 'chapters', 'done'];
    const cur = order.indexOf(stage);
    const idx = order.indexOf(name);
    return idx < cur ? 'done' : idx === cur ? 'active' : 'pending';
  };

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.container}>
        <Text style={s.title}>{error ? 'Something went wrong' : 'Building your reviewer…'}</Text>
        <Text style={s.sub}>
          {error ? 'Your PDF is saved. You can try again.' : "Keep the app open until it's done. This can take a minute or two."}
        </Text>

        {!error && (
          <View style={s.bar}>
            <View style={[s.fill, { width: `${percent}%` }]} />
          </View>
        )}

        {error ? (
          <View style={s.errorCard}>
            <Ionicons name="alert-circle-outline" size={26} color={C.red} />
            <Text style={s.errorText}>{error}</Text>
          </View>
        ) : (
          <View style={s.card}>
            <Step state={state('upload')} label="Uploading your PDF" />
            <Step state={state('outline')} label="Reading the PDF and finding chapters" />
            <Step
              state={state('chapters')}
              label={stage === 'chapters' && progress.total ? `Writing chapter ${progress.current} of ${progress.total}` : 'Writing notes, flashcards and quiz'}
            />
            <Step state={stage === 'done' ? 'done' : 'pending'} label="Finishing up" />
          </View>
        )}

        <View style={{ flex: 1 }} />

        {error && (
          <>
            <Pressable onPress={run} style={({ pressed }) => [s.btn, pressed && { opacity: 0.85 }]}>
              <Text style={s.btnText}>Try again</Text>
            </Pressable>
            <Pressable onPress={onBack} style={s.link}>
              <Text style={s.linkText}>Back to home</Text>
            </Pressable>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 48, paddingBottom: 20 },
  title: { color: C.text, fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  sub: { color: C.muted, fontSize: 13, lineHeight: 20, marginTop: 8 },
  bar: { height: 8, borderRadius: 4, backgroundColor: '#23274D', marginTop: 24, overflow: 'hidden' },
  fill: { height: 8, borderRadius: 4, backgroundColor: C.accent },
  card: { marginTop: 22, padding: 18, borderRadius: 18, backgroundColor: C.card, borderWidth: 1, borderColor: C.line, gap: 18 },
  step: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dot: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#23274D', alignItems: 'center', justifyContent: 'center' },
  stepText: { color: C.text, fontSize: 14 },
  errorCard: { marginTop: 24, padding: 18, borderRadius: 18, backgroundColor: '#2A1418', alignItems: 'center', gap: 10 },
  errorText: { color: '#FCA5A5', fontSize: 13, lineHeight: 19, textAlign: 'center' },
  btn: { height: 52, borderRadius: 14, backgroundColor: C.button, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  link: { alignItems: 'center', paddingVertical: 16 },
  linkText: { color: C.muted, fontSize: 13 },
});