import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const C = {
  bg: '#080A1C',
  input: '#212857',
  inputBorder: '#2E3A73',
  button: '#5B6CFF',
  text: '#FFFFFF',
  muted: '#9AA2C6',
  subtext: '#C9CCDF',
  accent: '#73E2FF',
  link: '#7C68FF',
  error: '#FF727B',
};

function PasswordInput({ label, value, onChangeText, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <View style={s.fieldWrap}>
      <Text style={s.label}>{label}</Text>
      <View style={s.inputRow}>
        <Ionicons name="lock-closed-outline" size={18} color={C.link} style={s.inputIcon} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={C.muted}
          secureTextEntry={!show}
          autoCapitalize="none"
          style={s.input}
        />
        <Pressable onPress={() => setShow((v) => !v)} hitSlop={8}>
          <Ionicons name={show ? 'eye-off-outline' : 'eye-outline'} size={18} color={C.muted} />
        </Pressable>
      </View>
    </View>
  );
}

export default function ResetPasswordScreen({ onBack, onReset }) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const matches = password === confirm;
  const valid = password.length >= 6 && confirm.length > 0 && matches;

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.container}>
        <View style={s.topBar}>
          <Pressable onPress={onBack} style={s.backButton} accessibilityRole="button" accessibilityLabel="Go back">
            <Ionicons name="chevron-back" size={18} color={C.text} />
          </Pressable>
          <View style={s.brandRow}>
            <Image source={require('../../../assets/logo.png')} style={s.logo} resizeMode="contain" />
            <Text style={s.brandName}>Study<Text style={{ color: C.accent }}>Gen</Text></Text>
          </View>
        </View>

        <View style={s.iconWrap}>
          <View style={s.iconCircle}>
            <Ionicons name="shield-checkmark-outline" size={32} color={C.accent} />
          </View>
        </View>

        <Text style={s.title}>Set new password</Text>
        <Text style={s.subtitle}>
          Your new password must be at least 6 characters and different from your previous password.
        </Text>

        <View style={s.form}>
          <PasswordInput label="NEW PASSWORD" value={password} onChangeText={setPassword} placeholder="At least 6 characters" />
          <PasswordInput label="CONFIRM NEW PASSWORD" value={confirm} onChangeText={setConfirm} placeholder="Repeat new password" />
        </View>

        {password.length > 0 && confirm.length > 0 && (
          <View style={s.matchRow}>
            <Ionicons name={matches ? 'checkmark-circle' : 'close-circle'} size={16} color={matches ? '#4ADE80' : C.error} />
            <Text style={[s.matchText, { color: matches ? '#4ADE80' : C.error }]}>
              {matches ? 'Passwords match' : 'Passwords do not match'}
            </Text>
          </View>
        )}

        <Pressable
          onPress={() => onReset?.()}
          disabled={!valid}
          style={({ pressed }) => [s.cta, !valid && s.ctaDisabled, pressed && valid && { opacity: 0.88, transform: [{ scale: 0.99 }] }]}
        >
          <Text style={s.ctaText}>Reset password</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  container: { flex: 1, paddingHorizontal: 24, backgroundColor: C.bg },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 12, marginBottom: 12, minHeight: 34, position: 'relative' },
  backButton: { position: 'absolute', left: 0, width: 34, height: 34, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#171D3B' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logo: { width: 26, height: 42.78 },
  brandName: { color: C.text, fontSize: 20, fontWeight: '800', letterSpacing: -0.5 },
  iconWrap: { alignItems: 'center', marginTop: 32, marginBottom: 24 },
  iconCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#1B1F3A', borderWidth: 1, borderColor: '#2E3A73', alignItems: 'center', justifyContent: 'center' },
  title: { color: C.text, fontSize: 28, fontWeight: '800', letterSpacing: -1, marginBottom: 8 },
  subtitle: { color: C.muted, fontSize: 13, lineHeight: 20, marginBottom: 28 },
  form: { gap: 4 },
  fieldWrap: { marginBottom: 16 },
  label: { color: C.subtext, fontSize: 10, fontWeight: '600', letterSpacing: 0.8, marginBottom: 8, textTransform: 'uppercase' },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.input, borderWidth: 1, borderColor: C.inputBorder, borderRadius: 12, height: 48, paddingHorizontal: 16, gap: 8 },
  inputIcon: { width: 22 },
  input: { flex: 1, color: C.text, fontSize: 12, paddingVertical: 0 },
  matchRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4, marginBottom: 24 },
  matchText: { fontSize: 12 },
  cta: { height: 52, borderRadius: 12, backgroundColor: C.button, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginTop: 8 },
  ctaDisabled: { opacity: 0.4 },
  ctaText: { color: '#fff', fontSize: 13, fontWeight: '700' },
});