import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useReviewers } from '../../lib/api';
import { EmptyState, ErrorState, Loading } from '../../components/States';

const C = {
  bg: '#080A1C',
  card: '#12152E',
  line: '#1C2044',
  text: '#FFFFFF',
  muted: '#8E92B2',
  accent: '#6B6CFF',
  track: '#23274D',
};

// Circular progress ring built from plain Views (no extra packages).
function Ring({ size = 72, stroke = 7, percent, color = C.accent, track = C.track, children }) {
  const half = size / 2;
  const deg = Math.min(Math.max(percent, 0), 100) * 3.6;
  const first = Math.min(deg, 180);
  const second = Math.max(deg - 180, 0);
  const base = { position: 'absolute', width: size, height: size, borderRadius: half, borderWidth: stroke, borderColor: 'transparent' };
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View style={[base, { borderColor: track }]} />
      <View style={{ position: 'absolute', left: half, width: half, height: size, overflow: 'hidden' }}>
        <View style={[base, { left: -half, borderTopColor: color, borderRightColor: color, transform: [{ rotate: `${first - 135}deg` }] }]} />
      </View>
      <View style={{ position: 'absolute', left: 0, width: half, height: size, overflow: 'hidden' }}>
        <View style={[base, { left: 0, borderBottomColor: color, borderLeftColor: color, transform: [{ rotate: `${second - 135}deg` }] }]} />
      </View>
      {children}
    </View>
  );
}

export default function StatsScreen({ name = 'there', onOpenReviewer, onUpload }) {
  const { reviewers, loading, error, reload } = useReviewers();

  const current = reviewers[0]; // most recently created
  const totalCards = reviewers.reduce((sum, r) => sum + r.cards, 0);
  const lowest = [...reviewers].sort((a, b) => a.done - b.done)[0];

  return (
    <SafeAreaView edges={['top']} style={s.safe}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <Text style={s.title}>Study progress</Text>
          <View style={s.iconBtn}>
            <Ionicons name="bar-chart-outline" size={19} color="#fff" />
          </View>
        </View>
        <Text style={s.sub}>A clear view of your reviewers, {name}.</Text>

        {loading ? (
          <Loading />
        ) : error ? (
          <View style={{ marginTop: 20 }}>
            <ErrorState message={error} onRetry={reload} />
          </View>
        ) : reviewers.length === 0 ? (
          <View style={{ marginTop: 20 }}>
            <EmptyState
              icon="stats-chart-outline"
              title="No progress yet"
              text="Your progress will show up here once you study your first reviewer."
              button="Upload a PDF"
              onPress={onUpload}
            />
          </View>
        ) : (
          <>
            <View style={s.hero}>
              <Ring size={76} stroke={7} percent={current.done}>
                <Text style={s.ringText}>{current.done}%</Text>
              </Ring>
              <View style={{ flex: 1 }}>
                <Text style={s.heroTitle}>{current.title}</Text>
                <Text style={s.muted}>
                  {current.reviewed} of {current.topicCount} topics reviewed
                </Text>
                <Pressable onPress={() => onOpenReviewer?.(current)} hitSlop={8}>
                  <Text style={s.link}>Continue studying →</Text>
                </Pressable>
              </View>
            </View>

            <View style={s.statsRow}>
              <View style={s.stat}>
                <Text style={s.statValue}>{reviewers.length}</Text>
                <Text style={s.muted}>Study sets in library</Text>
              </View>
              <View style={s.stat}>
                <Text style={s.statValue}>{totalCards}</Text>
                <Text style={s.muted}>Flashcards in these {reviewers.length} sets</Text>
              </View>
            </View>

            <View style={s.sectionRow}>
              <Text style={s.section}>Progress by reviewer</Text>
              <Text style={s.small}>{reviewers.length} reviewers</Text>
            </View>

            <View style={{ gap: 10 }}>
              {reviewers.map((r) => (
                <Pressable key={r.id} onPress={() => onOpenReviewer?.(r)} style={({ pressed }) => [s.row, pressed && { opacity: 0.85 }]}>
                  <View style={s.rowTop}>
                    <Text style={s.rowTitle}>{r.title}</Text>
                    <Text style={s.rowPct}>{r.done}%</Text>
                  </View>
                  <View style={s.track}>
                    <View style={[s.fill, { width: `${r.done}%` }]} />
                  </View>
                  <Text style={[s.small, { marginTop: 8 }]}>
                    {r.cards} flashcards • {r.done}% complete
                  </Text>
                </Pressable>
              ))}
            </View>

            <Pressable onPress={() => onOpenReviewer?.(lowest)} style={({ pressed }) => [s.tip, pressed && { opacity: 0.85 }]}>
              <View style={s.tipIcon}>
                <Ionicons name="sparkles-outline" size={18} color={C.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.tipTitle}>Pick up where you left off</Text>
                <Text style={s.small}>
                  Start with {lowest.title}, which is at {lowest.done}% complete, and do another review.
                </Text>
              </View>
            </Pressable>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { color: C.text, fontSize: 21, fontWeight: '700' },
  iconBtn: { width: 38, height: 38, borderRadius: 10, backgroundColor: '#151833', borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
  sub: { color: C.muted, fontSize: 12, marginTop: 6 },
  muted: { color: C.muted, fontSize: 12 },
  small: { color: C.muted, fontSize: 11 },

  hero: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 18, padding: 16, borderRadius: 18, backgroundColor: '#0F1230', borderWidth: 1, borderColor: '#262B63' },
  ringText: { color: C.text, fontSize: 17, fontWeight: '700' },
  heroTitle: { color: C.text, fontSize: 16, fontWeight: '700', marginBottom: 4 },
  link: { color: C.accent, fontSize: 12, fontWeight: '600', marginTop: 8 },

  statsRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  stat: { flex: 1, padding: 14, borderRadius: 14, backgroundColor: C.card, gap: 4 },
  statValue: { color: C.text, fontSize: 22, fontWeight: '700' },

  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 22, marginBottom: 12 },
  section: { color: C.text, fontSize: 15, fontWeight: '700' },

  row: { padding: 14, borderRadius: 14, backgroundColor: C.card },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowTitle: { color: C.text, fontSize: 14, fontWeight: '500' },
  rowPct: { color: C.accent, fontSize: 13, fontWeight: '700' },
  track: { height: 5, borderRadius: 3, backgroundColor: C.track, marginTop: 10, overflow: 'hidden' },
  fill: { height: 5, borderRadius: 3, backgroundColor: C.accent },

  tip: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 16, padding: 14, borderRadius: 14, backgroundColor: '#0F1230', borderWidth: 1, borderColor: '#262B63' },
  tipIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#1B1F4A', alignItems: 'center', justifyContent: 'center' },
  tipTitle: { color: C.text, fontSize: 13, fontWeight: '700', marginBottom: 2 },
});