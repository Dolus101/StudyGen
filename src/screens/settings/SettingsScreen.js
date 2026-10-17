import { useState } from 'react';
import { Alert, Modal, Platform, Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { cancelStudyReminder, useStudyReminder } from '../../hooks/useStudyReminder';
import { useSettings } from '../../hooks/useSettings';
import { createThemeColors, createThemedStyles } from '../../hooks/useTheme';

const C = createThemeColors({ bg: '#080A1C', card: '#12152E', line: '#1C2044', text: '#FFFFFF', muted: '#8E92B2', accent: '#6B6CFF', button: '#5B63F0', red: '#F4707F' });

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
  return <Switch value={value} onValueChange={onValueChange} trackColor={{ false: C.trackOff, true: C.button }} thumbColor="#fff" />;
}

function toDate({ hour, minute }) {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  return d;
}

export default function SettingsScreen({ onBack, onSignOut, onChangePassword }) {
  const { shuffle, explain, theme, update } = useSettings();

  // Study reminder (local notification)
  const { enabled: remind, time, toggle: setRemind, changeTime } = useStudyReminder();
  const [showPicker, setShowPicker] = useState(false);
  const [draftTime, setDraftTime] = useState(new Date()); // iOS: holds the spinner value until "Done"

  const timeLabel = toDate(time).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  const openPicker = () => {
    setDraftTime(toDate(time));
    setShowPicker(true);
  };

  const handleSignOut = async () => {
    await cancelStudyReminder();
    onSignOut?.();
  };

  const chooseTheme = () => {
    Alert.alert('Choose theme', undefined, [
      { text: 'Dark', onPress: () => update({ theme: 'dark' }) },
      { text: 'Light', onPress: () => update({ theme: 'light' }) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <Pressable onPress={onBack} accessibilityRole="button" accessibilityLabel="Go back"
          style={({ pressed }) => [s.iconBtn, pressed && { opacity: 0.7 }]}>
          <Ionicons name="chevron-back" size={20} color={C.text} />
        </Pressable>
        <Text style={s.title}>Settings</Text>
        <View style={s.iconBtn}>
          <Ionicons name="settings-outline" size={19} color={C.text} />
        </View>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Text style={s.lead}>Make StudyGen work for the way you learn.</Text>

        <Text style={s.section}>Study preferences</Text>
        <View style={s.group}>
          <Row icon="shuffle" title="Shuffle flashcards" sub="Mix card order when starting a deck" right={<Toggle value={shuffle} onValueChange={(v) => update({ shuffle: v })} />} />
          <Row icon="bulb-outline" title="Quiz explanations" sub="Show explanations after checking answers." right={<Toggle value={explain} onValueChange={(v) => update({ explain: v })} />} />
        </View>

        <Text style={s.section}>Notifications</Text>
        <View style={s.group}>
          <Row
            icon="notifications-outline"
            title="Study reminders"
            sub="A gentle nudge to keep learning"
            right={<Toggle value={remind} onValueChange={setRemind} />}
          />
          <Row
            icon="time-outline"
            title="Reminder time"
            sub={remind ? undefined : 'Turn on study reminders to set a time'}
            value={timeLabel}
            right="chevron"
            onPress={remind ? openPicker : undefined}
          />
        </View>

        <Text style={s.section}>Appearance</Text>
        <View style={s.group}>
          <Row icon={theme === 'light' ? 'sunny-outline' : 'moon-outline'} title="Theme" value={theme === 'light' ? 'Light' : 'Dark'} right="chevron" onPress={chooseTheme} />
        </View>

        <Text style={s.section}>Account</Text>
        <View style={s.group}>
          <Row icon="lock-closed-outline" title="Change password" right="chevron" onPress={onChangePassword} />
          <Row icon="shield-checkmark-outline" title="Privacy & data" right="chevron" onPress={() => {}} />
          <Row icon="log-out-outline" title="Sign out" color={C.red} onPress={handleSignOut} />
        </View>

        <Text style={s.footer}>StudyGen · Your learning, your way</Text>
      </ScrollView>

      {/* Android: native time dialog. It closes itself, so just handle the result. */}
      {showPicker && Platform.OS === 'android' && (
        <DateTimePicker
          mode="time"
          value={toDate(time)}
          display="default"
          onChange={(event, date) => {
            setShowPicker(false);
            if (event.type === 'set' && date) changeTime(date.getHours(), date.getMinutes());
          }}
        />
      )}

      {/* iOS: spinner inside a bottom sheet with Cancel / Done */}
      {Platform.OS === 'ios' && (
        <Modal visible={showPicker} transparent animationType="slide" onRequestClose={() => setShowPicker(false)}>
          <Pressable style={s.backdrop} onPress={() => setShowPicker(false)} />
          <View style={s.sheet}>
            <View style={s.sheetHeader}>
              <Pressable onPress={() => setShowPicker(false)} hitSlop={10}>
                <Text style={s.sheetCancel}>Cancel</Text>
              </Pressable>
              <Text style={s.sheetTitle}>Reminder time</Text>
              <Pressable
                onPress={() => {
                  changeTime(draftTime.getHours(), draftTime.getMinutes());
                  setShowPicker(false);
                }}
                hitSlop={10}
              >
                <Text style={s.sheetDone}>Done</Text>
              </Pressable>
            </View>
            <DateTimePicker
              mode="time"
              value={draftTime}
              display="spinner"
              themeVariant={theme === 'light' ? 'light' : 'dark'}
              textColor={C.text}
              onChange={(_, date) => date && setDraftTime(date)}
            />
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const s = createThemedStyles((C) => ({
  safe: { flex: 1, backgroundColor: C.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 14 },
  title: { color: C.text, fontSize: 17, fontWeight: '700' },
  iconBtn: { width: 40, height: 40, borderRadius: 10, backgroundColor: C.surfaceAlt, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 28 },
  lead: { color: C.muted, fontSize: 12 },
  section: { color: C.text, fontSize: 14, fontWeight: '700', marginTop: 22, marginBottom: 10 },
  group: { gap: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 56, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, backgroundColor: C.card },
  icon: { width: 34, height: 34, borderRadius: 10, backgroundColor: C.iconSurface, alignItems: 'center', justifyContent: 'center' },
  rowTitle: { color: C.text, fontSize: 14, fontWeight: '500' },
  rowSub: { color: C.muted, fontSize: 11, marginTop: 2 },
  value: { color: C.muted, fontSize: 12 },
  footer: { color: C.muted, fontSize: 11, textAlign: 'center', marginTop: 28 },

  // iOS time picker sheet
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: { backgroundColor: C.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 30 },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: C.line },
  sheetTitle: { color: C.text, fontSize: 15, fontWeight: '700' },
  sheetCancel: { color: C.muted, fontSize: 15 },
  sheetDone: { color: C.accent, fontSize: 15, fontWeight: '700' },
}));