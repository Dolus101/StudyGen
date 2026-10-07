import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';

const C = {
  bg: '#080A1C',
  card: '#12152E',
  line: '#1C2044',
  text: '#FFFFFF',
  muted: '#8E92B2',
  accent: '#6B6CFF',
  error: '#FF727B',
};

function PasswordInput({ label, value, onChangeText, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <View>
      <Text style={s.label}>{label}</Text>
      <View style={s.inputWrap}>
        <Ionicons name="lock-closed-outline" size={16} color={C.muted} style={{ marginRight: 10 }} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={C.muted}
          secureTextEntry={!show}
          style={s.input}
          autoCapitalize="none"
          returnKeyType="done"
        />
        <Pressable onPress={() => setShow((v) => !v)} hitSlop={8}>
          <Ionicons name={show ? 'eye-off-outline' : 'eye-outline'} size={18} color={C.muted} />
        </Pressable>
      </View>
    </View>
  );
}

export default function ChangePasswordScreen({ onBack }) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!current || !next || !confirm) {
      Alert.alert('Missing fields', 'Please fill in all fields.');
      return;
    }
    if (next.length < 6) {
      Alert.alert('Too short', 'New password must be at least 6 characters.');
      return;
    }
    if (next !== confirm) {
      Alert.alert('Passwords do not match', 'New password and confirm password must match.');
      return;
    }
    if (current === next) {
      Alert.alert('Same password', 'New password must be different from your current password.');
      return;
    }

    setSaving(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const email = userData?.user?.email;
      if (!email) throw new Error('Could not get your email. Please sign in again.');

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: current,
      });
      if (signInError) throw new Error('Current password is incorrect.');

      const { error: updateError } = await supabase.auth.updateUser({
        password: next,
      });
      if (updateError) throw updateError;

      Alert.alert('Password changed!', 'Your password has been updated successfully.', [
        { text: 'OK', onPress: onBack },
      ]);
    } catch (e) {
      Alert.alert('Error', e.message || 'Could not change password.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView edges={['top']} style={s.safe}>
      <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">

        {/* Header */}
        <View style={s.header}>
          <Pressable onPress={onBack} style={({ pressed }) => [s.backBtn, pressed && { opacity: 0.7 }]}>
            <Ionicons name="chevron-back" size={20} color="#fff" />
          </Pressable>
          <Text style={s.title}>Change Password</Text>
          <View style={{ width: 38 }} />
        </View>

        {/* Info */}
        <View style={s.infoBox}>
          <Ionicons name="shield-checkmark-outline" size={20} color={C.accent} />
          <Text style={s.infoText}>
            Enter your current password to verify it's you, then set a new password.
          </Text>
        </View>

        {/* Fields */}
        <View style={s.form}>
          <PasswordInput
            label="Current password"
            value={current}
            onChangeText={setCurrent}
            placeholder="Enter current password"
          />
          <PasswordInput
            label="New password"
            value={next}
            onChangeText={setNext}
            placeholder="At least 6 characters"
          />
          <PasswordInput
            label="Confirm new password"
            value={confirm}
            onChangeText={setConfirm}
            placeholder="Repeat new password"
          />
        </View>

        {/* Match indicator */}
        {next.length > 0 && confirm.length > 0 && (
          <View style={s.matchRow}>
            <Ionicons
              name={next === confirm ? 'checkmark-circle' : 'close-circle'}
              size={16}
              color={next === confirm ? '#4ADE80' : C.error}
            />
            <Text style={[s.matchText, { color: next === confirm ? '#4ADE80' : C.error }]}>
              {next === confirm ? 'Passwords match' : 'Passwords do not match'}
            </Text>
          </View>
        )}

        {/* Save button */}
        <Pressable
          onPress={handleSave}
          disabled={saving}
          style={({ pressed }) => [s.saveBtn, (pressed || saving) && { opacity: 0.8 }]}
        >
          {saving
            ? <ActivityIndicator size="small" color="#fff" />
            : <Text style={s.saveBtnText}>Update password</Text>
          }
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  backBtn: { width: 38, height: 38, borderRadius: 10, backgroundColor: '#151833', borderWidth: 1, borderColor: '#1C2044', alignItems: 'center', justifyContent: 'center' },
  title: { color: '#fff', fontSize: 18, fontWeight: '700' },
  infoBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: '#0F1230', borderWidth: 1, borderColor: '#232859', borderRadius: 12, padding: 14, marginBottom: 24 },
  infoText: { flex: 1, color: C.muted, fontSize: 12, lineHeight: 18 },
  form: { gap: 16 },
  label: { color: C.text, fontSize: 13, fontWeight: '600', marginBottom: 6 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', height: 48, borderRadius: 12, paddingHorizontal: 14, backgroundColor: C.card, borderWidth: 1, borderColor: C.line },
  input: { flex: 1, color: C.text, fontSize: 14, padding: 0 },
  matchRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 },
  matchText: { fontSize: 12 },
  saveBtn: { marginTop: 32, height: 50, borderRadius: 14, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center' },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});