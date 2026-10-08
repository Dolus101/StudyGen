import { Pressable, ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useReviewers, useProfile } from '../../lib/api';

const C = {
  bg: '#080A1C',
  card: '#12152E',
  line: '#1C2044',
  text: '#FFFFFF',
  muted: '#8E92B2',
  accent: '#6B6CFF',
  indigo: '#6366F1',
};

function Item({ icon, title, sub, onPress, last }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.item, !last && s.itemLine, pressed && { opacity: 0.8 }]}>
      <View style={s.itemIcon}>
        <Ionicons name={icon} size={18} color={C.accent} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.itemTitle}>{title}</Text>
        {sub ? <Text style={s.itemSub}>{sub}</Text> : null}
      </View>
      <Ionicons name="chevron-forward" size={16} color={C.muted} />
    </Pressable>
  );
}

export default function ProfileScreen({ onOpenReviewers, onOpenStats, onOpenSettings, onEditProfile }) {
  const { reviewers } = useReviewers();
  const { profile } = useProfile();

  const displayName = profile?.full_name || 'there';
  const avatarSource = profile?.avatar_url ? { uri: profile.avatar_url } : null;

  return (
    <SafeAreaView edges={['top']} style={s.safe}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <Text style={s.title}>Profile</Text>
          <Pressable onPress={onOpenSettings} accessibilityRole="button" accessibilityLabel="Settings"
            style={({ pressed }) => [s.iconBtn, pressed && { opacity: 0.7 }]}>
            <Ionicons name="settings-outline" size={19} color="#fff" />
          </Pressable>
        </View>

        <View style={s.hero}>
          <View style={s.avatarOuter}>
            {avatarSource ? (
              <Image source={avatarSource} style={s.avatarImg} />
            ) : (
              <View style={s.avatar}>
                <Ionicons name="person-outline" size={30} color="#fff" />
              </View>
            )}
          </View>
          <Text style={s.name}>{displayName}</Text>
          <Text style={s.tag}>Your personal study space</Text>
          <Pressable onPress={onEditProfile} style={({ pressed }) => [s.edit, pressed && { opacity: 0.8 }]}>
            <Text style={s.editText}>Edit profile</Text>
          </Pressable>
        </View>

        <Pressable onPress={onOpenReviewers} style={({ pressed }) => [s.sets, pressed && { opacity: 0.85 }]}>
          <Ionicons name="book-outline" size={22} color={C.accent} />
          <View style={{ flex: 1 }}>
            <Text style={s.setsTitle}>{reviewers.length} study sets</Text>
            <Text style={s.itemSub}>All your reviewers, in one place</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={C.muted} />
        </Pressable>

        <Text style={s.section}>My study space</Text>
        <View style={s.group}>
          <Item icon="book-outline" title="My Reviewers" sub="Browse your study sets" onPress={onOpenReviewers} />
          <Item icon="stats-chart-outline" title="Study progress" sub="See progress by reviewer" onPress={onOpenStats} last />
        </View>

        <Text style={s.section}>Account & support</Text>
        <View style={s.group}>
          <Item icon="settings-outline" title="Settings" sub="Study preferences and account" onPress={onOpenSettings} />
          <Item icon="help-circle-outline" title="Help & feedback" last />
        </View>

        <Text style={s.footer}>StudyGen · Learn a little, every day.</Text>
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

  hero: { marginTop: 18, alignItems: 'center', backgroundColor: '#0F1230', borderWidth: 1, borderColor: '#232859', borderRadius: 18, paddingVertical: 22 },
  avatarOuter: { width: 68, height: 68, borderRadius: 34, overflow: 'hidden' },
  avatarImg: { width: 68, height: 68, borderRadius: 34 },
  avatar: { width: 68, height: 68, borderRadius: 34, backgroundColor: C.indigo, alignItems: 'center', justifyContent: 'center' },
  name: { color: C.text, fontSize: 18, fontWeight: '700', marginTop: 12 },
  tag: { color: C.muted, fontSize: 12, marginTop: 4 },
  edit: { marginTop: 14, paddingHorizontal: 18, height: 30, borderRadius: 8, backgroundColor: '#1A1E4A', alignItems: 'center', justifyContent: 'center' },
  editText: { color: C.accent, fontSize: 12, fontWeight: '600' },

  sets: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 14, backgroundColor: C.card, borderRadius: 14, padding: 16 },
  setsTitle: { color: C.text, fontSize: 16, fontWeight: '700' },
  itemSub: { color: C.muted, fontSize: 11, marginTop: 3 },

  section: { color: C.text, fontSize: 14, fontWeight: '700', marginTop: 22, marginBottom: 10 },
  group: { backgroundColor: C.card, borderRadius: 14, overflow: 'hidden' },
  item: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  itemLine: { borderBottomWidth: 1, borderBottomColor: C.line },
  itemIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#1B1F4A', alignItems: 'center', justifyContent: 'center' },
  itemTitle: { color: C.text, fontSize: 14, fontWeight: '500' },

  footer: { color: C.muted, fontSize: 11, textAlign: 'center', marginTop: 26 },
});