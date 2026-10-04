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

function Field({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  secureTextEntry = false,
  rightIcon,
  onRightPress,
}) {
  return (
    <View style={s.fieldWrap}>
      <Text style={s.label}>{label}</Text>
      <View style={s.inputRow}>
        <View style={s.inputLeft}>
          <Ionicons
            name={label === 'EMAIL ADDRESS' ? 'mail-outline' : 'lock-closed-outline'}
            size={18}
            color="#7C68FF"
            style={s.inputIcon}
          />
        </View>

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={C.muted}
          keyboardType={keyboardType}
          autoCapitalize="none"
          secureTextEntry={secureTextEntry}
          style={s.input}
        />

        {rightIcon ? (
          <Pressable onPress={onRightPress} style={s.rightAction}>
            <Ionicons name={rightIcon} size={18} color="#7C68FF" />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

export default function LoginScreen({ onBack, onLogin, onCreateAccount }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.container}>
        <View style={s.topBar}>
          <Pressable
            onPress={onBack}
            style={s.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={18} color={C.text} />
          </Pressable>

          <View style={s.brandRow}>
            <Image source={require('../../assets/logo.png')} style={s.logo} resizeMode="contain" />
            <Text style={s.brandName}>
              Study<Text style={{ color: C.accent }}>Gen</Text>
            </Text>
          </View>
        </View>

        <Text style={s.title}>Welcome back!</Text>
        <Text style={s.subtitle}>
          Log in to pick up where you left off and keep your study momentum going.
        </Text>

        <View style={s.form}>
          <Field
            label="EMAIL ADDRESS"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <Field
            label="PASSWORD"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            rightIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
            onRightPress={() => setShowPassword((value) => !value)}
          />

          <View style={s.metaRow}>
            <Pressable onPress={() => setRememberMe((value) => !value)} style={s.rememberRow}>
              <View style={[s.checkbox, rememberMe && s.checkboxChecked]}>
                {rememberMe ? <Ionicons name="checkmark" size={12} color="#fff" /> : null}
              </View>
              <Text style={s.rememberText}>Remember me</Text>
            </Pressable>

            <Text style={s.forgotText}>Forgot password?</Text>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Log In"
          onPress={onLogin}
          style={({ pressed }) => [
            s.cta,
            pressed && { opacity: 0.88, transform: [{ scale: 0.99 }] },
          ]}
        >
          <Text style={s.ctaText}>Log In</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" style={s.ctaIcon} />
        </Pressable>

        <View style={s.summaryCard}>
          <View style={s.iconBox}>
            <Ionicons name="book-outline" size={32} color="#1B1F3A" />
          </View>
          <View style={s.summaryTextWrap}>
            <Text style={s.summaryTitle}>Your next study session awaits</Text>
            <Text style={s.summaryText}>Notes, flashcards, and quizzes. All in one place.</Text>
          </View>
        </View>

        <Text style={s.footerText}>
          New to StudyGen?{' '}
          <Text onPress={onCreateAccount} style={s.footerLink}>
            Create an account
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.bg,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: C.bg,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 12,
    minHeight: 34,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#171D3B',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
  },
  logo: {
    width: 26,
    height: 42.78,
  },
  brandName: {
    color: C.text,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  title: {
    color: C.text,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -1,
    marginTop: 26,
    marginBottom: 8,
  },
  subtitle: {
    color: C.muted,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 28,
  },
  form: {
    width: '100%',
  },
  fieldWrap: {
    marginBottom: 20,
  },
  label: {
    color: C.subtext,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.8,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.input,
    borderWidth: 1,
    borderColor: C.inputBorder,
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 16,
  },
  inputLeft: {
    width: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputIcon: {
    marginRight: 4,
  },
  input: {
    flex: 1,
    height: '100%',
    color: C.text,
    fontSize: 12,
    paddingVertical: 0,
    marginLeft: 6,
  },
  rightAction: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 28,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#7B82B8',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: C.button,
    borderColor: C.button,
  },
  rememberText: {
    color: C.subtext,
    fontSize: 11,
  },
  forgotText: {
    color: C.link,
    fontSize: 11,
    fontWeight: '600',
  },
  cta: {
    height: 52,
    borderRadius: 12,
    backgroundColor: C.button,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  ctaText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  ctaIcon: {
    marginLeft: 8,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1B1F3A',
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginTop: 158,
    marginBottom: 18,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#E9E3FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  summaryTextWrap: {
    flex: 1,
  },
  summaryTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  summaryText: {
    color: C.muted,
    fontSize: 10,
    lineHeight: 18,
  },
  footerText: {
    color: C.muted,
    fontSize: 12,
    textAlign: 'center',
  },
  footerLink: {
    color: C.link,
    fontWeight: '700',
  },
});
