import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { saveQuizAttempt } from '../lib/api';

const C = { card: '#12152E', line: '#1C2044', text: '#FFFFFF', muted: '#8E92B2', accent: '#6B6CFF', button: '#5B63F0', green: '#34D399', red: '#F87171' };
const LETTERS = ['A', 'B', 'C', 'D'];
const TEXT_TYPES = ['Identification', 'Fill in the blank'];

const TYPE_LABEL = {
  'Multiple Choice': 'Multiple choice',
  'True/False': 'True or false',
  Identification: 'Identification',
  'Fill in the blank': 'Fill in the blank',
};

const PROMPT = {
  'Multiple Choice': 'Choose one answer below.',
  'True/False': 'Is the statement true or false?',
  Identification: 'Type your answer below.',
  'Fill in the blank': 'Type the word that fills the blank.',
};

// Ignore case, punctuation, extra spaces and leading articles ("The stack." matches "stack")
const normalize = (v) =>
  String(v || '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^(a|an|the)\s+/, '');

// Fisher-Yates shuffle (returns a new array)
const shuffle = (arr) => {
  const a = [...arr];
  for (let x = a.length - 1; x > 0; x--) {
    const y = Math.floor(Math.random() * (x + 1));
    [a[x], a[y]] = [a[y], a[x]];
  }
  return a;
};

// Edit distance, for small typos
const lev = (a, b) => {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let x = 1; x <= a.length; x++) {
    for (let y = 1; y <= b.length; y++) {
      dp[x][y] = Math.min(dp[x - 1][y] + 1, dp[x][y - 1] + 1, dp[x - 1][y - 1] + (a[x - 1] === b[y - 1] ? 0 : 1));
    }
  }
  return dp[a.length][b.length];
};

// Accepts exact, tiny typos, or one answer containing the other as whole words.
// answerText can hold alternatives separated by "|".
const matches = (typed, answer) => {
  const t = normalize(typed);
  if (!t) return false;
  return String(answer || '').split('|').some((alt) => {
    const a = normalize(alt);
    if (!a) return false;
    if (t === a) return true;
    const max = a.length > 8 ? 2 : a.length > 4 ? 1 : 0;
    if (lev(t, a) <= max) return true;
    return ` ${t} `.includes(` ${a} `) || (t.length >= 4 && ` ${a} `.includes(` ${t} `));
  });
};

export default function QuizTab({ r, onExit }) {
  const quiz = r.quiz;
  const [i, setI] = useState(0);
  const [sel, setSel] = useState(null);
  const [typed, setTyped] = useState('');
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [done, setDone] = useState(false);
  const [deck, setDeck] = useState(() => shuffle(quiz?.questions ?? []));

  if (!quiz || !quiz.questions.length) return <Text style={s.muted}>No quiz yet</Text>;
  const total = deck.length;
  const q = deck[i];
  const type = q.type || 'Multiple Choice';
  const isText = TEXT_TYPES.includes(type);
  const isTF = type === 'True/False';
  const options = isTF ? ['True', 'False'] : (q.options || []).filter((o) => o && o.trim());
  const score = answers.filter((a) => a.correct).length;

  const canCheck = isText ? typed.trim().length > 0 : sel !== null;
  const isCorrect = isText ? matches(typed, q.answerText) : sel === q.answer;
  const correctLabel = isText ? q.answerText : options[q.answer];

  const check = () => {
    if (!canCheck || checked) return;
    setChecked(true);
    setAnswers((a) => [...a, { topic: q.topic, correct: isCorrect, type }]);
  };
  const next = () => {
    if (i + 1 >= total) {
      saveQuizAttempt({ reviewerId: r.id, score, total, answers }).catch(() => {});
      return setDone(true);
    }
    setI(i + 1);
    setSel(null);
    setTyped('');
    setChecked(false);
  };
  const restart = () => {
    setI(0);
    setSel(null);
    setTyped('');
    setChecked(false);
    setAnswers([]);
    setDone(false);
    setDeck(shuffle(quiz.questions));
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
    ? isCorrect ? 'Correct! Nice work.' : 'Not quite. Check the explanation below.'
    : !canCheck
      ? isText ? 'Type an answer to continue.' : 'Choose one answer to continue.'
      : isText ? "Answer entered · Check it when you're ready." : "Answer selected · Check it when you're ready.";

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
        <Text style={s.muted}>{TYPE_LABEL[type] || type}</Text>
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
        <Text style={[s.muted, { marginTop: 10 }]}>{PROMPT[type] || ''}</Text>
      </View>

      {isText ? (
        <View style={{ marginTop: 12 }}>
          <TextInput
            value={typed}
            onChangeText={setTyped}
            editable={!checked}
            placeholder="Type your answer"
            placeholderTextColor={C.muted}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={check}
            style={[
              s.input,
              checked && isCorrect && { borderColor: C.green, backgroundColor: 'rgba(52,211,153,0.10)' },
              checked && !isCorrect && { borderColor: C.red, backgroundColor: 'rgba(248,113,113,0.10)' },
            ]}
          />
          {checked && !isCorrect && (
            <Text style={s.answerLine}>Correct answer: <Text style={{ color: C.green, fontWeight: '700' }}>{String(q.answerText || '').split('|').map((x) => x.trim()).filter(Boolean).join(' / ')}</Text></Text>
          )}
        </View>
      ) : (
        <View style={{ gap: 8, marginTop: 12 }}>
          {options.map((opt, idx) => {
            const picked = sel === idx;
            const isRight = checked && idx === q.answer;
            const isWrong = checked && picked && idx !== q.answer;
            return (
              <Pressable
                key={`${i}-${idx}`}
                disabled={checked}
                onPress={() => setSel(idx)}
                style={[s.opt, picked && s.optOn, isRight && { borderColor: C.green, backgroundColor: 'rgba(52,211,153,0.10)' }, isWrong && { borderColor: C.red, backgroundColor: 'rgba(248,113,113,0.10)' }]}
              >
                <View style={s.letter}>
                  <Text style={s.letterText}>{isTF ? (idx === 0 ? 'T' : 'F') : LETTERS[idx]}</Text>
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
      )}

      <Text style={s.caption}>{caption}</Text>

      <Pressable
        disabled={!checked && !canCheck}
        onPress={checked ? next : check}
        style={({ pressed }) => [s.primary, !checked && !canCheck && { opacity: 0.4 }, pressed && { opacity: 0.85 }]}
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
              {!isCorrect && !!correctLabel && !isText && (
                <Text style={[s.muted, { color: C.text, marginBottom: 4 }]}>Answer: {correctLabel}</Text>
              )}
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

  input: { height: 52, borderRadius: 12, paddingHorizontal: 14, color: C.text, fontSize: 15, backgroundColor: C.card, borderWidth: 1.5, borderColor: C.line },
  answerLine: { color: C.muted, fontSize: 13, marginTop: 10 },

  caption: { color: C.muted, fontSize: 11, textAlign: 'center', marginTop: 12 },
  primary: { flexDirection: 'row', gap: 8, height: 48, borderRadius: 12, backgroundColor: C.button, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  primaryText: { color: '#fff', fontSize: 15, fontWeight: '700' },

  tip: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', marginTop: 14, padding: 14, borderRadius: 14, backgroundColor: C.card },
  tipTitle: { color: C.text, fontSize: 13, fontWeight: '700', marginBottom: 2 },
  exit: { color: C.muted, fontSize: 12, textAlign: 'center', marginTop: 16 },

  result: { alignItems: 'center', gap: 8, paddingVertical: 40 },
  score: { color: C.accent, fontSize: 44, fontWeight: '800' },
});