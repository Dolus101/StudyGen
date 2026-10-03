import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { QUIZZES } from '../data/sampleReviewers';

const C = { card: '#12152E', line: '#1C2044', text: '#FFFFFF', muted: '#8E92B2', accent: '#6B6CFF', button: '#5B63F0', green: '#34D399', red: '#F87171' };
const LETTERS = ['A', 'B', 'C', 'D'];

export default function QuizTab({ r, onExit }) {
  const quiz = QUIZZES[r.id];
  const [i, setI] = useState(0);
  const [sel, setSel] = useState(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  if (!quiz) return <Text style={s.muted}>No quiz yet</Text>;
  const total = quiz.questions.length;
  const q = quiz.questions[i];

  const check = () => {
    if (sel === null) return;
    setChecked(true);
    if (sel === q.answer) setScore((x) => x + 1);
  };
  const next = () => {
    if (i + 1 >= total) return setDone(true);
    setI(i + 1);
    setSel(null);
    setChecked(false);
  };
  const restart = () => {
    setI(0); setSel(null); setChecked(false); setScore(0); setDone(false);
  };

  if (done) {
    return (
      <View style={s.result}>
        <Text style={s.h}>Quiz complete</Text>
        <Text style={s.score}>{score} / {total}</Text>
        <Text style={s.muted}>{Math.round((score / total) * 100)}% correct</Text>
        <Pressable onPress={restart} style={[s.primary, { alignSelf: 'stretch' }]}>
          <Text style={s.primaryText}>Try again</Text>
        </Pressable>
        <Pressable onPress={onExit}>
          <Text style={s.exit}>Back to overview</Text>
        </Pressable>
      </View>
    );
  }

  const caption = checked
    ? sel === q.answer ? 'Correct! Nice work.' : 'Not quite. Check the explanation below.'
    : sel === null ? 'Choose one answer to continue.' : "Answer selected · Check it when you're ready.";

  return (
    <View>
      <View style={s.head}>
        <View style={{ flex: 1 }}>
          <Text style={s.h}>Quiz practice</Text>
          <Text style={s.muted}>Quiz 1 of {quiz.of} · {quiz.title}</Text>
        </View>
        <View style={s.badge}>
          <Text style={s.badgeText}>Untimed</Text>
        </View>
      </View>

      <View style={s.countRow}>
        <Text style={s.count}>Question {i + 1} of {total}</Text>
        <Text style={s.muted}>Multiple choice</Text>
      </View>
      <View style={s.track}>
        <View style={[s.fill, { width: `${((i + 1) / total) * 100}%` }]} />
      </View>

      <View style={s.qCard}>
        <View style={s.topicRow}>
          <MaterialCommunityIcons name="layers-outline" size={16} color={C.accent} />
          <Text style={s.topic}>{q.topic}</Text>
        </View>
        <Text style={s.qText}>{q.text}</Text>
        <Text style={[s.muted, { marginTop: 10 }]}>Choose one answer below.</Text>
      </View>

      <View style={{ gap: 8, marginTop: 12 }}>
        {q.options.map((opt, idx) => {
          const picked = sel === idx;
          const isRight = checked && idx === q.answer;
          const isWrong = checked && picked && idx !== q.answer;
          return (
            <Pressable
              key={opt}
              disabled={checked}
              onPress={() => setSel(idx)}
              style={[s.opt, picked && s.optOn, isRight && { borderColor: C.green, backgroundColor: 'rgba(52,211,153,0.10)' }, isWrong && { borderColor: C.red, backgroundColor: 'rgba(248,113,113,0.10)' }]}
            >
              <View style={s.letter}>
                <Text style={s.letterText}>{LETTERS[idx]}</Text>
              </View>
              <Text style={s.optText}>{opt}</Text>
              {isRight ? (
                <Ionicons name="checkmark-circle" size={20} color={C.green} />
              ) : isWrong ? (
                <Ionicons name="close-circle" size={20} color={C.red} />
              ) : (
                <View style={[s.radio, picked && s.radioOn]}>{picked && <View style={s.radioDot} />}</View>
              )}
            </Pressable>
          );
        })}
      </View>

      <Text style={s.caption}>{caption}</Text>

      <Pressable
        disabled={!checked && sel === null}
        onPress={checked ? next : check}
        style={({ pressed }) => [s.primary, sel === null && !checked && { opacity: 0.4 }, pressed && { opacity: 0.85 }]}
      >
        <Ionicons name={checked ? 'arrow-forward' : 'clipboard-outline'} size={18} color="#fff" />
        <Text style={s.primaryText}>{checked ? (i + 1 >= total ? 'See results' : 'Next question') : 'Check answer'}</Text>
      </Pressable>

      <View style={s.tip}>
        <Ionicons name="bulb-outline" size={18} color={C.accent} />
        <View style={{ flex: 1 }}>
          {checked ? (
            <>
              <Text style={s.tipTitle}>Explanation</Text>
              <Text style={s.muted}>{q.explanation}</Text>
            </>
          ) : (
            <Text style={s.muted}>Practice at your own pace. Each answer includes an explanation to help you learn.</Text>
          )}
        </View>
      </View>

      <Pressable onPress={onExit}>
        <Text style={s.exit}>Exit practice</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  muted: { color: C.muted, fontSize: 12, lineHeight: 18 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  h: { color: C.text, fontSize: 16, fontWeight: '700', marginBottom: 2 },
  badge: { backgroundColor: 'rgba(52,211,153,0.14)', borderRadius: 99, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { color: C.green, fontSize: 11, fontWeight: '600' },

  countRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  count: { color: C.text, fontSize: 13, fontWeight: '700' },
  track: { height: 4, borderRadius: 2, backgroundColor: '#23274D', marginTop: 8, overflow: 'hidden' },
  fill: { height: 4, borderRadius: 2, backgroundColor: C.accent },

  qCard: { marginTop: 14, padding: 16, borderRadius: 18, backgroundColor: '#0F1230', borderWidth: 1, borderColor: '#262B63' },
  topicRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  topic: { color: C.accent, fontSize: 11, fontWeight: '700', letterSpacing: 0.8 },
  qText: { color: C.text, fontSize: 17, fontWeight: '600', lineHeight: 24 },

  opt: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 50, borderRadius: 12, paddingHorizontal: 12, backgroundColor: C.card, borderWidth: 1.5, borderColor: C.line },
  optOn: { borderColor: C.accent, backgroundColor: '#161A45' },
  letter: { width: 28, height: 28, borderRadius: 8, backgroundColor: '#1B1F4A', alignItems: 'center', justifyContent: 'center' },
  letterText: { color: C.text, fontSize: 12, fontWeight: '700' },
  optText: { flex: 1, color: C.text, fontSize: 14 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: C.muted, alignItems: 'center', justifyContent: 'center' },
  radioOn: { borderColor: C.accent, backgroundColor: C.accent },
  radioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' },

  caption: { color: C.muted, fontSize: 11, textAlign: 'center', marginTop: 12 },
  primary: { flexDirection: 'row', gap: 8, height: 48, borderRadius: 12, backgroundColor: C.button, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  primaryText: { color: '#fff', fontSize: 15, fontWeight: '700' },

  tip: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', marginTop: 14, padding: 14, borderRadius: 14, backgroundColor: C.card },
  tipTitle: { color: C.text, fontSize: 13, fontWeight: '700', marginBottom: 2 },
  exit: { color: C.muted, fontSize: 12, textAlign: 'center', marginTop: 16 },

  result: { alignItems: 'center', gap: 8, paddingVertical: 40 },
  score: { color: C.accent, fontSize: 44, fontWeight: '800' },
});
