import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useReviewers } from '../lib/api';
import { EmptyState, ErrorState, Loading } from '../components/States';

const C = {
  bg: '#080A1C',
  card: '#12152E',
  line: '#1C2044',
  text: '#FFFFFF',
  muted: '#8E92B2',
  accent: '#6B6CFF',
  button: '#5B63F0',
};

const FILTERS = ['All reviewers', 'In progress', 'Completed'];

function Row({ item, onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.row, pressed && { opacity: 0.85 }]}>
      <View style={[s.rowIcon, { backgroundColor: item.color }]}>
        <Ionicons name="document-text-outline" size={20} color="#fff" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.rowTitle}>{item.title}</Text>
        <Text style={s.rowMeta}>
          {item.cards} flashcards • {item.done}% complete
        </Text>
        <View style={s.track}>
          <View style={[s.fill, { width: `${item.done}%` }]} />
        </View>
        {item.extra ? <Text style={[s.rowMeta, { marginTop: 6 }]}>{item.extra}</Text> : null}
      </View>
      <Ionicons name="chevron-forward" size={16} color={C.muted} style={s.chev} />
    </Pressable>
  );
}

export default function ReviewersScreen({ onUpload, onOpenReviewer }) {
  const { reviewers, loading, error, reload } = useReviewers();
  const [filter, setFilter] = useState('All reviewers');
  const [query, setQuery] = useState('');

  const list = reviewers.filter((r) => {
    if (filter === 'In progress' && !(r.done > 0 && r.done < 100)) return false;
    if (filter === 'Completed' && r.done < 100) return false;
    return r.title.toLowerCase().includes(query.trim().toLowerCase());
  });

  const hasAny = reviewers.length > 0;
  const subtitle = loading
    ? ' '
    : hasAny
    ? `${reviewers.length} study set${reviewers.length === 1 ? '' : 's'} · Ready when you are`
    : 'No study sets yet';

  return (
    <SafeAreaView edges={['top']} style={s.safe}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={s.header}>
          <Text style={s.title}>My Reviewers</Text>
          <Pressable onPress={onUpload} accessibilityRole="button" accessibilityLabel="Add reviewer" style={({ pressed }) => [s.iconBtn, pressed && { opacity: 0.7 }]}>
            <Ionicons name="add" size={22} color="#fff" />
          </Pressable>
        </View>
        <Text style={s.sub}>{subtitle}</Text>

        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : !hasAny ? (
          <EmptyState
            title="No reviewers added yet"
            text="Upload a PDF and StudyGen will turn it into notes, flashcards, and a quiz."
            button="Upload your first PDF"
            onPress={onUpload}
          />
        ) : (
          <>
            <View style={s.search}>
              <Ionicons name="search-outline" size={18} color={C.muted} />
              <TextInput value={query} onChangeText={setQuery} placeholder="Search your reviewers..." placeholderTextColor={C.muted} style={s.input} />
              <Ionicons name="options-outline" size={18} color={C.muted} />
            </View>

            <View style={s.chips}>
              {FILTERS.map((f) => {
                const on = f === filter;
                return (
                  <Pressable key={f} onPress={() => setFilter(f)} style={[s.chip, on && s.chipOn]}>
                    <Text style={[s.chipText, on && s.chipTextOn]}>{f}</Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={s.sectionRow}>
              <Text style={s.section}>Recent study sets</Text>
              <Text style={s.small}>Recent first</Text>
            </View>

            <View style={{ gap: 10 }}>
              {list.map((r) => (
                <Row key={r.id} item={r} onPress={() => onOpenReviewer?.(r)} />
              ))}
              {list.length === 0 && <Text style={[s.small, { textAlign: 'center', paddingVertical: 24 }]}>No reviewers found</Text>}
            </View>

            <View style={s.cta}>
              <Text style={s.ctaTitle}>Turn your PDF into a study set</Text>
              <Text style={s.ctaBody}>Keep notes, flashcards and quizzes together in one reviewer.</Text>
              <Pressable onPress={onUpload} accessibilityRole="button" style={({ pressed }) => [s.ctaBtn, pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] }]}>
                <Ionicons name="document-text-outline" size={18} color="#fff" />
                <Text style={s.ctaBtnText}>Upload PDF</Text>
              </Pressable>
            </View>
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

  search: { flexDirection: 'row', alignItems: 'center', gap: 10, height: 46, borderRadius: 12, paddingHorizontal: 14, marginTop: 18, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: C.line },
  input: { flex: 1, color: C.text, fontSize: 14, padding: 0 },

  chips: { flexDirection: 'row', gap: 8, marginTop: 14 },
  chip: { paddingHorizontal: 14, height: 32, borderRadius: 9, backgroundColor: C.card, alignItems: 'center', justifyContent: 'center' },
  chipOn: { backgroundColor: C.button },
  chipText: { color: C.muted, fontSize: 12, fontWeight: '500' },
  chipTextOn: { color: '#fff', fontWeight: '700' },

  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 22, marginBottom: 12 },
  section: { color: C.text, fontSize: 15, fontWeight: '700' },
  small: { color: C.muted, fontSize: 12 },

  row: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: C.card, borderRadius: 14, padding: 12 },
  rowIcon: { width: 44, height: 44, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  rowTitle: { color: C.text, fontSize: 15, fontWeight: '500' },
  rowMeta: { color: C.muted, fontSize: 11, marginTop: 3 },
  track: { height: 4, borderRadius: 2, backgroundColor: '#23274D', marginTop: 8, overflow: 'hidden' },
  fill: { height: 4, borderRadius: 2, backgroundColor: C.accent },
  chev: { position: 'absolute', top: 12, right: 12 },

  cta: { marginTop: 20, backgroundColor: '#0F1230', borderWidth: 1, borderColor: '#232859', borderRadius: 18, padding: 16 },
  ctaTitle: { color: C.text, fontSize: 15, fontWeight: '700' },
  ctaBody: { color: C.muted, fontSize: 12, lineHeight: 18, marginTop: 6 },
  ctaBtn: { flexDirection: 'row', gap: 8, height: 46, borderRadius: 12, backgroundColor: C.button, alignItems: 'center', justifyContent: 'center', marginTop: 14 },
  ctaBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});