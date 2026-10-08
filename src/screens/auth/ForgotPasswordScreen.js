import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const C = {
  bg: '#080A1C',
  panel: '#1B1F3A',
  input: '#212857',
  inputBorder: '#2E3A73',
  button: '#5B6CFF',
  text: '#FFFFFF',
  muted: '#9AA2C6',
  subtext: '#C9CCDF',
  accent: '#73E2FF',
  link: '#7C68FF',
};

export default function ForgotPasswordScreen({ onBack, onCodeSent }) {
  const [email, setEmail] = useState('');

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
            <Ionicons name="lock-open-outline" size={32} color={C.accent} />
          </View>
        </View>

        <Text style={s.title}>Forgot password?</Text>
        <Text style={s.subtitle}>
          No worries! Enter your email address and we'll send you a verification code to reset your password.
        </Text>

        <View style={s.fieldWrap}>
          <Text style={s.label}>EMAIL ADDRESS</Text>
          <View style={s.inputRow}>
            <Ionicons name="mail-outline" size={18} color={C.link} style={s.inputIcon} />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor={C.muted}
              keyboardType="email-address"
              autoCapitalize="none"
              style={s.input}
            />
          </View>
        </View>

        <Pressable
          onPress={() => onCodeSent?.(email.trim())}
          style={({ pressed }) => [s.cta, pressed && { opacity: 0.88, transform: [{ scale: 0.99 }] }]}
        >
          <Text style={s.ctaText}>Send verification code</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />
        </Pressable>

        <View style={s.infoCard}>
          <Ionicons name="information-circle-outline" size={20} color={C.accent} />
          <Text style={s.infoText}>Check your spam folder if you don't see the email within a few minutes.</Text>
        </View>

        <Text style={s.footerText}>
          Remember your password?{' '}
          <Text onPress={onBack} style={s.footerLink}>Log in</Text>
        </Text>
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
  fieldWrap: { marginBottom: 24 },
  label: { color: C.subtext, fontSize: 10, fontWeight: '600', letterSpacing: 0.8, marginBottom: 8, textTransform: 'uppercase' },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.input, borderWidth: 1, borderColor: C.inputBorder, borderRadius: 12, height: 48, paddingHorizontal: 16, gap: 8 },
  inputIcon: { width: 22 },
  input: { flex: 1, color: C.text, fontSize: 12, paddingVertical: 0 },
  cta: { height: 52, borderRadius: 12, backgroundColor: C.button, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  ctaText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  infoCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: '#1B1F3A', borderWidth: 1, borderColor: '#283052', borderRadius: 14, padding: 14, marginTop: 24 },
  infoText: { flex: 1, color: C.muted, fontSize: 12, lineHeight: 18 },
  footerText: { color: C.muted, fontSize: 12, textAlign: 'center', marginTop: 28 },
  footerLink: { color: C.link, fontWeight: '700' },
});