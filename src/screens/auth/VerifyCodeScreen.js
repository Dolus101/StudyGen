import { useRef, useState } from 'react';
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
};

export default function VerifyCodeScreen({ onBack, onVerified, email = 'your email' }) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputs = useRef([]);

  const handleChange = (val, idx) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...code];
    next[idx] = val.slice(-1);
    setCode(next);
    if (val && idx < 5) inputs.current[idx + 1]?.focus();
  };

  const handleKeyPress = (e, idx) => {
    if (e.nativeEvent.key === 'Backspace' && !code[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  };

  const filled = code.every((c) => c !== '');

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
            <Ionicons name="mail-open-outline" size={32} color={C.accent} />
          </View>
        </View>

        <Text style={s.title}>Check your email</Text>
        <Text style={s.subtitle}>
          We sent a 6-digit verification code to{' '}
          <Text style={{ color: C.accent, fontWeight: '700' }}>{email}</Text>.
          Enter it below to continue.
        </Text>

        <View style={s.codeRow}>
          {code.map((digit, idx) => (
            <TextInput
              key={idx}
              ref={(r) => (inputs.current[idx] = r)}
              value={digit}
              onChangeText={(val) => handleChange(val, idx)}
              onKeyPress={(e) => handleKeyPress(e, idx)}
              keyboardType="number-pad"
              maxLength={1}
              style={[s.codeBox, digit && s.codeBoxFilled]}
              selectionColor={C.accent}
            />
          ))}
        </View>

        <Pressable
          onPress={() => onVerified?.()}
          disabled={!filled}
          style={({ pressed }) => [s.cta, !filled && s.ctaDisabled, pressed && filled && { opacity: 0.88, transform: [{ scale: 0.99 }] }]}
        >
          <Text style={s.ctaText}>Verify code</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />
        </Pressable>

        <View style={s.resendRow}>
          <Text style={s.resendText}>Didn't receive the code? </Text>
          <Pressable>
            <Text style={s.resendLink}>Resend</Text>
          </Pressable>
        </View>

        <Text style={s.footerText}>
          Wrong email?{' '}
          <Text onPress={onBack} style={s.footerLink}>Go back</Text>
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
  subtitle: { color: C.muted, fontSize: 13, lineHeight: 20, marginBottom: 32 },
  codeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
  codeBox: { width: 46, height: 56, borderRadius: 12, backgroundColor: C.input, borderWidth: 1, borderColor: C.inputBorder, color: C.text, fontSize: 22, fontWeight: '700', textAlign: 'center' },
  codeBoxFilled: { borderColor: C.link, backgroundColor: '#1A1F4A' },
  cta: { height: 52, borderRadius: 12, backgroundColor: C.button, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  ctaDisabled: { opacity: 0.4 },
  ctaText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  resendRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  resendText: { color: C.muted, fontSize: 12 },
  resendLink: { color: C.link, fontSize: 12, fontWeight: '700' },
  footerText: { color: C.muted, fontSize: 12, textAlign: 'center', marginTop: 16 },
  footerLink: { color: C.link, fontWeight: '700' },
});