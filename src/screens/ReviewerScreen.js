import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { markChapterReviewed } from '../lib/api';
import NotesTab from '../components/NotesTab';
import FlashcardsTab from '../components/FlashcardsTab';
import QuizTab from '../components/QuizTab';
import { FadeIn } from '../components/Transition';

const C = {
  bg: '#080A1C',
  card: '#12152E',
  line: '#1C2044',
  text: '#FFFFFF',
  muted: '#8E92B2',
  body: '#A9ADCB',
  accent: '#6B6CFF',
  button: '#5B63F0',
  green: '#34D399',
  orange: '#F5A84B',
};

const TABS = ['Overview', 'Notes', 'Flashcards', 'Quiz'];
const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

function IconButton({ name, onPress, label }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} style={({ pressed }) => [s.iconBtn, pressed && { opacity: 0.7 }]}>
      <Ionicons name={name} size={20} color="#fff" />
    </Pressable>
  );
}

function Stat({ icon, color, value, label, mci }) {
  const Icon = mci ? MaterialCommunityIcons : Ionicons;
  return (
    <View style={s.stat}>
      <Icon name={icon} size={18} color={color} />
      <Text style={s.statValue}>{value}</Text>
      <Text style={s.statLabel}>{label}</Text>
    </View>
  );
}

function Overview({ r, onOpenChapter }) {
  const progressText = `${r.reviewed} of ${r.topics.length} topics reviewed${r.inProgress ? ` · ${r.inProgress} in progress` : ''}`;
  return (
    <>
      <View style={s.summary}>
        <View style={s.summaryHead}>
          <View style={s.summaryIcon}>
            <Ionicons name="sparkles-outline" size={18} color={C.accent} />
          </View>
          <Text style={s.summaryTitle}>Summary</Text>
          <View style={s.badge}>
            <Text style={s.badgeText}>Generated</Text>
          </View>
        </View>
        <Text style={s.summaryBody}>{r.summary}</Text>
      </View>

      <View style={s.stats}>
        <Stat icon="help-circle-outline" color={C.accent} value={r.stats.questions} label="Questions" />
        <Stat icon="text-long" mci color="#38BDF8" value={fmt(r.stats.words)} label="Words" />
        <Stat icon="albums-outline" color={C.green} value={r.stats.flashcards} label="Flashcards" />
        <Stat icon="clipboard-outline" color={C.orange} value={r.stats.quizzes} label="Quizzes" />
      </View>

      <View style={s.topicsHead}>
        <Text style={s.h2}>Topics</Text>
        <Text style={s.small}>{r.topics.length} chapters</Text>
      </View>
      <View style={{ gap: 10 }}>
        {r.topics.map((t, i) => {
          const TIcon = t.lib === 'mci' ? MaterialCommunityIcons : Ionicons;
          return (
            <Pressable key={t.id || t.title} onPress={() => onOpenChapter?.(i)} style={({ pressed }) => [s.topic, pressed && { opacity: 0.85 }]}>
              <View style={s.topicIcon}>
                <TIcon name={t.icon} size={18} color={C.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.topicTitle}>{t.title}</Text>
                <Text style={s.topicSub}>{t.concepts} key concepts</Text>
              </View>
              {t.reviewed ? (
                <Ionicons name="checkmark-circle" size={18} color={C.green} />
              ) : (
                <Ionicons name="chevron-forward" size={16} color={C.muted} />
              )}
            </Pressable>
          );
        })}
      </View>

      <View style={s.progress}>
        <View>
          <Text style={s.progressTitle}>Study progress</Text>
          <Text style={s.topicSub}>{progressText}</Text>
        </View>
        <Text style={s.percent}>{r.done}%</Text>
      </View>
    </>
  );
}

export default function ReviewerScreen({ reviewer, onBack }) {
  const [data, setData] = useState(reviewer);
  const [tab, setTab] = useState('Overview');
  const [chapter, setChapter] = useState(0);

  const openChapter = (i) => {
    setChapter(i);
    setTab('Notes');
  };

  const markReviewed = async (i) => {
    const t = data.topics[i];
    if (!t || t.reviewed) return;
    try {
      await markChapterReviewed(t.id);
      setData((prev) => {
        const topics = prev.topics.map((x, idx) => (idx === i ? { ...x, reviewed: true } : x));
        const reviewed = topics.filter((x) => x.reviewed).length;
        return { ...prev, topics, reviewed, done: Math.round((reviewed / topics.length) * 100) };
      });
    } catch (e) {
      Alert.alert('Could not save your progress', e.message || 'Please try again.');
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <IconButton name="chevron-back" label="Go back" onPress={onBack} />
        <Text style={s.title} numberOfLines={1}>{data.title}</Text>
        <IconButton name="ellipsis-horizontal" label="More options" />
      </View>

      <View style={s.tabs}>
        {TABS.map((t) => {
          const on = t === tab;
          return (
            <Pressable key={t} onPress={() => setTab(t)} accessibilityRole="tab" accessibilityState={{ selected: on }} style={[s.tab, on && s.tabOn]}>
              <Text style={[s.tabText, on && s.tabTextOn]}>{t}</Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <FadeIn key={tab}>
          {tab === 'Overview' ? (
            <Overview r={data} onOpenChapter={openChapter} />
          ) : tab === 'Notes' ? (
            <NotesTab r={data} chapter={chapter} onChapterChange={setChapter} onMarkReviewed={markReviewed} />
          ) : tab === 'Flashcards' ? (
            <FlashcardsTab r={data} />
          ) : (
            <QuizTab r={data} onExit={() => setTab('Overview')} />
          )}
        </FadeIn>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingHorizontal: 20, paddingTop: 14 },
  title: { flex: 1, textAlign: 'center', color: C.text, fontSize: 17, fontWeight: '700' },
  iconBtn: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#151833', borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },

  tabs: { flexDirection: 'row', gap: 6, paddingHorizontal: 20, marginTop: 16 },
  tab: { flex: 1, height: 36, borderRadius: 9, backgroundColor: C.card, alignItems: 'center', justifyContent: 'center' },
  tabOn: { backgroundColor: C.button },
  tabText: { color: C.muted, fontSize: 12, fontWeight: '500' },
  tabTextOn: { color: '#fff', fontWeight: '700' },

  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 28 },

  summary: { backgroundColor: '#0F1230', borderWidth: 1, borderColor: '#262B63', borderRadius: 18, padding: 16 },
  summaryHead: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  summaryIcon: { width: 32, height: 32, borderRadius: 9, backgroundColor: '#1E2250', alignItems: 'center', justifyContent: 'center' },
  summaryTitle: { flex: 1, color: C.text, fontSize: 16, fontWeight: '700' },
  badge: { backgroundColor: 'rgba(52,211,153,0.14)', borderRadius: 99, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { color: C.green, fontSize: 11, fontWeight: '600' },
  summaryBody: { color: C.body, fontSize: 13, lineHeight: 20, marginTop: 12 },

  stats: { flexDirection: 'row', gap: 8, marginTop: 14 },
  stat: { flex: 1, backgroundColor: C.card, borderRadius: 14, paddingVertical: 14, alignItems: 'center', gap: 6 },
  statValue: { color: C.text, fontSize: 16, fontWeight: '600' },
  statLabel: { color: C.muted, fontSize: 11 },

  topicsHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 22, marginBottom: 12 },
  h2: { color: C.text, fontSize: 16, fontWeight: '700' },
  small: { color: C.muted, fontSize: 12 },
  topic: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.card, borderRadius: 14, padding: 12 },
  topicIcon: { width: 38, height: 38, borderRadius: 10, backgroundColor: '#1B1F4A', alignItems: 'center', justifyContent: 'center' },
  topicTitle: { color: C.text, fontSize: 14, fontWeight: '500' },
  topicSub: { color: C.muted, fontSize: 11, marginTop: 3 },

  progress: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 18, minHeight: 148, backgroundColor: '#0E1130', borderRadius: 18, paddingHorizontal: 18 },
  progressTitle: { color: C.text, fontSize: 14, fontWeight: '500' },
  percent: { color: C.accent, fontSize: 22, fontWeight: '600' },
});