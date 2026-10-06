import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
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
  indigo: '#6366F1',
  blue: '#2B7BCB',
  accent: '#6B6CFF',
};

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good Morning,' : h < 18 ? 'Good Afternoon,' : 'Good Evening,';
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

function ReviewerRow({ item, onPress, onDelete }) {
  return (
    <View style={s.row}>
      <Pressable onPress={onPress} style={({ pressed }) => [s.rowMain, pressed && { opacity: 0.85 }]}>
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
        <Ionicons name="chevron-forward" size={16} color={C.muted} />
      </Pressable>
      <Pressable
        onPress={() => onDelete(item)}
        accessibilityRole="button"
        accessibilityLabel={`Delete ${item.title}`}
        style={({ pressed }) => [s.deleteBtn, pressed && { opacity: 0.7 }]}
      >
        <Ionicons name="trash-outline" size={18} color="#FF727B" />
      </Pressable>
    </View>
  );
}

export default function HomeScreen({ name = 'there', onOpenReviewers, onOpenReviewer, onUpload }) {
  const { reviewers, loading, error, reload } = useReviewers();
  const [query, setQuery] = useState('');
  const [confirmingDelete, setConfirmingDelete] = useState(null);

  const q = query.trim().toLowerCase();
  const list = q ? reviewers.filter((r) => r.title.toLowerCase().includes(q)) : reviewers.slice(0, 3);
  const subtitle = loading ? ' ' : reviewers.length ? `${reviewers.length} study sets` : 'No study sets yet';

  return (
    <SafeAreaView edges={['top']} style={s.safe}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={s.header}>
          <View>
            <Text style={s.greet}>{greeting()}</Text>
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
          <TextInput value={query} onChangeText={setQuery} placeholder="Search your reviewers..." placeholderTextColor={C.muted} style={s.input} />
          <Ionicons name="options-outline" size={18} color={C.muted} />
        </View>

        <Text style={[s.section, { marginTop: 24 }]}>Jump back in</Text>
        <View style={s.actions}>
          <ActionCard glow color={C.indigo} icon="cloud-upload-outline" title="Upload PDF" subtitle="Create a new reviewer" onPress={onUpload} />
          <ActionCard color={C.blue} icon="folder-open-outline" title="My Reviewers" subtitle={subtitle} onPress={onOpenReviewers} />
        </View>

        <View style={s.sectionRow}>
          <Text style={s.section}>Recent Reviewers</Text>
          {reviewers.length > 0 && (
            <Pressable onPress={onOpenReviewers}>
              <Text style={s.seeAll}>See all</Text>
            </Pressable>
          )}
        </View>

        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : reviewers.length === 0 ? (
          <EmptyState
            title="No reviewers yet"
            text="Upload a PDF and StudyGen will turn it into notes, flashcards, and a quiz."
            button="Upload your first PDF"
            onPress={onUpload}
          />
        ) : list.length === 0 ? (
          <Text style={[s.rowMeta, { textAlign: 'center', paddingVertical: 20 }]}>No reviewers found</Text>
        ) : (
          <View style={{ gap: 10 }}>
            {list.map((r) => (
              <ReviewerRow key={r.id} item={r} onPress={() => onOpenReviewer?.(r)} onDelete={setConfirmingDelete} />
            ))}
          </View>
        )}
      </ScrollView>
      {confirmingDelete && (
        <Modal
          transparent
          visible
          animationType="fade"
          statusBarTranslucent
          onRequestClose={() => setConfirmingDelete(null)}
        >
          <View style={s.confirmOverlay}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close confirmation"
              onPress={() => setConfirmingDelete(null)}
              style={StyleSheet.absoluteFill}
            />
            <View style={s.confirmDialog} accessibilityViewIsModal>
              <View style={s.confirmIcon}>
                <Ionicons name="trash-outline" size={22} color="#FF727B" />
              </View>
              <Text style={s.confirmTitle}>Delete study set?</Text>
              <Text style={s.confirmBody}>
                Are you sure you want to delete “{confirmingDelete.title}”?
              </Text>
              <View style={s.confirmActions}>
                <Pressable
                  onPress={() => setConfirmingDelete(null)}
                  accessibilityRole="button"
                  style={({ pressed }) => [s.cancelBtn, pressed && { opacity: 0.75 }]}
                >
                  <Text style={s.cancelText}>Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={() => setConfirmingDelete(null)}
                  accessibilityRole="button"
                  style={({ pressed }) => [s.confirmDeleteBtn, pressed && { opacity: 0.75 }]}
                >
                  <Text style={s.confirmDeleteText}>Delete</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      )}
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

  row: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.card, borderRadius: 14, padding: 12 },
  rowMain: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 14 },
  rowIcon: { width: 44, height: 44, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  rowTitle: { color: C.text, fontSize: 15, fontWeight: '500' },
  rowMeta: { color: C.muted, fontSize: 11, marginTop: 3 },
  track: { height: 4, borderRadius: 2, backgroundColor: '#23274D', marginTop: 8, overflow: 'hidden' },
  fill: { height: 4, borderRadius: 2, backgroundColor: C.accent },
  deleteBtn: { width: 28, height: 28, borderRadius: 8, backgroundColor: 'rgba(255, 114, 123, 0.12)', alignItems: 'center', justifyContent: 'center' },
  confirmOverlay: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: 'rgba(4, 6, 20, 0.78)' },
  confirmDialog: { width: '100%', maxWidth: 360, backgroundColor: '#12152E', borderWidth: 1, borderColor: '#30365F', borderRadius: 16, padding: 20, shadowColor: '#000', shadowOpacity: 0.45, shadowRadius: 24, shadowOffset: { width: 0, height: 12 }, elevation: 18 },
  confirmIcon: { width: 42, height: 42, borderRadius: 12, backgroundColor: 'rgba(255, 114, 123, 0.12)', alignItems: 'center', justifyContent: 'center' },
  confirmTitle: { color: C.text, fontSize: 18, fontWeight: '700', marginTop: 16 },
  confirmBody: { color: C.muted, fontSize: 13, lineHeight: 19, marginTop: 8 },
  confirmActions: { flexDirection: 'row', gap: 10, marginTop: 22 },
  cancelBtn: { flex: 1, height: 44, borderRadius: 10, backgroundColor: '#202445', alignItems: 'center', justifyContent: 'center' },
  cancelText: { color: C.text, fontSize: 14, fontWeight: '600' },
  confirmDeleteBtn: { flex: 1, height: 44, borderRadius: 10, backgroundColor: '#D94B5A', alignItems: 'center', justifyContent: 'center' },
  confirmDeleteText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});