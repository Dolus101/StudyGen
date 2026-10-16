import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { supabase } from '../../lib/supabase';
import { createThemeColors, createThemedStyles } from '../../hooks/useTheme';

const REDIRECT_URL = `${Constants.expoConfig?.scheme ?? 'studygen'}://reset-password`;

const C = createThemeColors({
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
});

export default function ForgotPasswordScreen({ onBack }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const handleSend = async () => {
    if (loading || cooldown > 0) return;
    const trimmed = email.trim();
    if (!trimmed) {
      Alert.alert('Email required', 'Please enter your email address.');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(trimmed, {
        redirectTo: REDIRECT_URL,
      });
      if (error) throw error;
      setSent(true);
      setCooldown(60);
    } catch (e) {
      Alert.alert('Error', e.message || 'Could not send the reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const buttonLabel = cooldown > 0
    ? `Resend link in ${cooldown}s`
    : sent ? 'Resend link' : 'Send reset link';

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
            <Ionicons name={sent ? 'mail-open-outline' : 'lock-open-outline'} size={32} color={C.accent} />
          </View>
        </View>

        <Text style={s.title}>{sent ? 'Check your email' : 'Forgot password?'}</Text>
        <Text style={s.subtitle}>
          {sent
            ? <>We sent a password reset link to <Text style={{ color: C.accent, fontWeight: '700' }}>{email.trim()}</Text>. Open the email on this phone and tap the link to set a new password.</>
            : "No worries! Enter your email address and we'll send you a link to reset your password."}
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
              autoCorrect={false}
              style={s.input}
              returnKeyType="done"
              onSubmitEditing={handleSend}
            />
          </View>
        </View>

        <Pressable
          onPress={handleSend}
          disabled={loading || cooldown > 0}
          style={({ pressed }) => [
            s.cta,
            (loading || cooldown > 0) && { opacity: 0.6 },
            pressed && { opacity: 0.88, transform: [{ scale: 0.99 }] },
          ]}
        >
          {loading
            ? <ActivityIndicator size="small" color="#fff" />
            : <>
                <Text style={s.ctaText}>{buttonLabel}</Text>
                {cooldown === 0 && <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />}
              </>
          }
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

const s = createThemedStyles(() => ({
  safe: { flex: 1, backgroundColor: C.bg },
  container: { flex: 1, paddingHorizontal: 24, backgroundColor: C.bg },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 12, marginBottom: 12, minHeight: 34, position: 'relative' },
  backButton: { position: 'absolute', left: 0, width: 34, height: 34, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: C.surfaceAlt },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logo: { width: 26, height: 42.78 },
  brandName: { color: C.text, fontSize: 20, fontWeight: '800', letterSpacing: -0.5 },
  iconWrap: { alignItems: 'center', marginTop: 32, marginBottom: 24 },
  iconCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: C.panel, borderWidth: 1, borderColor: C.inputBorder, alignItems: 'center', justifyContent: 'center' },
  title: { color: C.text, fontSize: 28, fontWeight: '800', letterSpacing: -1, marginBottom: 8 },
  subtitle: { color: C.muted, fontSize: 13, lineHeight: 20, marginBottom: 28 },
  fieldWrap: { marginBottom: 24 },
  label: { color: C.subtext, fontSize: 10, fontWeight: '600', letterSpacing: 0.8, marginBottom: 8, textTransform: 'uppercase' },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.input, borderWidth: 1, borderColor: C.inputBorder, borderRadius: 12, height: 48, paddingHorizontal: 16, gap: 8 },
  inputIcon: { width: 22 },
  input: { flex: 1, color: C.text, fontSize: 12, paddingVertical: 0 },
  cta: { height: 52, borderRadius: 12, backgroundColor: C.button, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  ctaText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  infoCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: C.panel, borderWidth: 1, borderColor: C.inputBorder, borderRadius: 14, padding: 14, marginTop: 24 },
  infoText: { flex: 1, color: C.muted, fontSize: 12, lineHeight: 18 },
  footerText: { color: C.muted, fontSize: 12, textAlign: 'center', marginTop: 28 },
  footerLink: { color: C.link, fontWeight: '700' },
}));