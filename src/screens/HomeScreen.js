import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { REVIEWERS } from '../data/sampleReviewers';

const C = {
  bg: '#080A1C',
  card: '#121530',
  line: '#1C2044',
  text: '#FFFFFF',
  muted: '#8E92B2',
  indigo: '#6366F1',
  blue: '#2B7BCB',
  accent: '#6B6CFF',
};

function ActionCard({ color, icon, title, subtitle, glow, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({ pressed }) => [
        s.action,
        { backgroundColor: color },
        glow && { shadowColor: C.indigo, shadowOpacity: 0.6, shadowRadius: 18, shadowOffset: { width: 0, height: 6 }, elevation: 10 },
        pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
      ]}
    >
      <View style={s.actionIcon}>
        <Ionicons name={icon} size={20} color="#fff" />
      </View>
      <View>
        <Text style={s.actionTitle}>{title}</Text>
        <Text style={s.actionSub}>{subtitle}</Text>
      </View>
    </Pressable>
  );
}

function ReviewerRow({ item, onPress }) {
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
      </View>
      <Ionicons name="chevron-forward" size={16} color={C.muted} style={s.chev} />
    </Pressable>
  );
}

export default function HomeScreen({ name = 'Nicole', onOpenReviewers, onOpenReviewer, onUpload }) {
  return (
    <SafeAreaView edges={['top']} style={s.safe}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <View>
            <Text style={s.greet}>Good Evening,</Text>
            <Text style={s.name}>{name}!</Text>
          </View>
          <View style={s.avatarRing}>
            <View style={s.avatar}>
              <Ionicons name="person-outline" size={18} color="#fff" />
            </View>
          </View>
        </View>

        <View style={s.search}>
          <Ionicons name="search-outline" size={18} color={C.muted} />
          <TextInput placeholder="Search your reviewers..." placeholderTextColor={C.muted} style={s.input} />
          <Ionicons name="options-outline" size={18} color={C.muted} />
        </View>

        <Text style={s.section}>Jump back in</Text>
        <View style={s.actions}>
          <ActionCard glow color={C.indigo} icon="cloud-upload-outline" title="Upload PDF" subtitle="Create a new reviewer" onPress={onUpload} />
          <ActionCard color={C.blue} icon="folder-open-outline" title="My Reviewers" subtitle="12 study sets" onPress={onOpenReviewers} />
        </View>

        <View style={s.sectionRow}>
          <Text style={s.section}>Recent Reviewers</Text>
          <Pressable onPress={onOpenReviewers}>
            <Text style={s.seeAll}>See all</Text>
          </Pressable>
        </View>
        <View style={{ gap: 10 }}>
          {REVIEWERS.slice(0, 3).map((r) => (
            <ReviewerRow key={r.id} item={r} onPress={() => onOpenReviewer?.(r)} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greet: { color: C.muted, fontSize: 13 },
  name: { color: C.text, fontSize: 21, fontWeight: '600', marginTop: 2 },
  avatarRing: { width: 40, height: 40, borderRadius: 20, borderWidth: 1.5, borderColor: '#4B4FD6', alignItems: 'center', justifyContent: 'center' },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: C.indigo, alignItems: 'center', justifyContent: 'center' },

  search: { flexDirection: 'row', alignItems: 'center', gap: 10, height: 46, borderRadius: 12, paddingHorizontal: 14, marginTop: 20, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: C.line },
  input: { flex: 1, color: C.text, fontSize: 14, padding: 0 },

  section: { color: C.text, fontSize: 15, fontWeight: '700' },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 12 },
  seeAll: { color: C.accent, fontSize: 13, fontWeight: '600' },

  actions: { flexDirection: 'row', gap: 12, marginTop: 12 },
  action: { flex: 1, height: 120, borderRadius: 18, padding: 14, justifyContent: 'space-between' },
  actionIcon: { width: 38, height: 38, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  actionTitle: { color: '#fff', fontSize: 17, fontWeight: '600' },
  actionSub: { color: 'rgba(255,255,255,0.75)', fontSize: 11, marginTop: 2 },

  row: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: C.card, borderRadius: 14, padding: 12 },
  rowIcon: { width: 44, height: 44, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  rowTitle: { color: C.text, fontSize: 15, fontWeight: '500' },
  rowMeta: { color: C.muted, fontSize: 11, marginTop: 3 },
  track: { height: 4, borderRadius: 2, backgroundColor: '#23274D', marginTop: 8, overflow: 'hidden' },
  fill: { height: 4, borderRadius: 2, backgroundColor: C.accent },
  chev: { position: 'absolute', top: 12, right: 12 },
});
