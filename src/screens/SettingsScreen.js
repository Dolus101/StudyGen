import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const C = { bg: '#080A1C', card: '#12152E', line: '#1C2044', text: '#FFFFFF', muted: '#8E92B2', accent: '#6B6CFF', button: '#5B63F0', red: '#F4707F' };
const GOALS = [10, 15, 20, 30, 45];

function Row({ icon, title, sub, value, onPress, right, color }) {
  return (
    <Pressable onPress={onPress} disabled={!onPress} style={({ pressed }) => [s.row, pressed && onPress && { opacity: 0.85 }]}>
      <View style={s.icon}>
        <Ionicons name={icon} size={18} color={color || C.accent} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[s.rowTitle, color && { color }]}>{title}</Text>
        {sub ? <Text style={s.rowSub}>{sub}</Text> : null}
      </View>
      {value ? <Text style={s.value}>{value}</Text> : null}
      {right === 'chevron' && <Ionicons name="chevron-forward" size={16} color={C.muted} />}
      {right && right !== 'chevron' && right}
    </Pressable>
  );
}

function Toggle({ value, onValueChange }) {
  return <Switch value={value} onValueChange={onValueChange} trackColor={{ false: '#2A2E55', true: C.button }} thumbColor="#fff" />;
}

export default function SettingsScreen({ onBack }) {
  const [goal, setGoal] = useState(1);
  const [shuffle, setShuffle] = useState(true);
  const [explain, setExplain] = useState(true);
  const [remind, setRemind] = useState(true);

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <Pressable onPress={onBack} accessibilityRole="button" accessibilityLabel="Go back" style={({ pressed }) => [s.iconBtn, pressed && { opacity: 0.7 }]}>
          <Ionicons name="chevron-back" size={20} color="#fff" />
        </Pressable>
        <Text style={s.title}>Settings</Text>
        <View style={s.iconBtn}>
          <Ionicons name="settings-outline" size={19} color="#fff" />
        </View>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Text style={s.lead}>Make StudyGen work for the way you learn.</Text>

        <Text style={s.section}>Study preferences</Text>
        <View style={s.group}>
          <Row icon="radio-button-on-outline" title="Daily study goal" value={`${GOALS[goal]} minutes`} right="chevron" onPress={() => setGoal((g) => (g + 1) % GOALS.length)} />
          <Row icon="shuffle" title="Shuffle flashcards" sub="Mix card order when starting a deck" right={<Toggle value={shuffle} onValueChange={setShuffle} />} />
          <Row icon="bulb-outline" title="Quiz explanations" sub="Show explanations after checking answers." right={<Toggle value={explain} onValueChange={setExplain} />} />
        </View>

        <Text style={s.section}>Notifications</Text>
        <View style={s.group}>
          <Row icon="notifications-outline" title="Study reminders" sub="A gentle nudge to keep learning" right={<Toggle value={remind} onValueChange={setRemind} />} />
          <Row icon="time-outline" title="Reminder time" value="7:00 PM" right="chevron" onPress={() => {}} />
        </View>

        <Text style={s.section}>Appearance</Text>
        <View style={s.group}>
          <Row icon="moon-outline" title="Theme" value="Dark" right="chevron" onPress={() => {}} />
        </View>

        <Text style={s.section}>Account</Text>
        <View style={s.group}>
          <Row icon="lock-closed-outline" title="Change password" right="chevron" onPress={() => {}} />
          <Row icon="shield-checkmark-outline" title="Privacy & data" right="chevron" onPress={() => {}} />
          <Row icon="log-out-outline" title="Sign out" color={C.red} onPress={() => {}} />
        </View>

        <Text style={s.footer}>StudyGen · Your learning, your way</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 14 },
  title: { color: C.text, fontSize: 17, fontWeight: '700' },
  iconBtn: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#151833', borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 28 },
  lead: { color: C.muted, fontSize: 12 },
  section: { color: C.text, fontSize: 14, fontWeight: '700', marginTop: 22, marginBottom: 10 },
  group: { gap: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 56, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, backgroundColor: C.card },
  icon: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#1B1F4A', alignItems: 'center', justifyContent: 'center' },
  rowTitle: { color: C.text, fontSize: 14, fontWeight: '500' },
  rowSub: { color: C.muted, fontSize: 11, marginTop: 2 },
  value: { color: C.muted, fontSize: 12 },
  footer: { color: C.muted, fontSize: 11, textAlign: 'center', marginTop: 28 },
});
