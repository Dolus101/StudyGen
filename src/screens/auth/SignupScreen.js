import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const C = {
  bg: "#080A1C",
  panel: "#1B1F3A",
  input: "#212857",
  button: "#171D3B",
  border: "#2E3A73",
  text: "#fff",
  muted: "#9AA2C6",
  subtext: "#C9CCDF",
  accent: "#73E2FF",
};

function Field({ label, placeholder, value, onChangeText, keyboardType = "default", autoCapitalize = "none", secureTextEntry = false, leftIcon, rightIcon, onRightPress }) {
  return (
    <View style={s.fieldWrap}>
      <Text style={s.label}>{label}</Text>
      <View style={s.inputRow}>
        <View style={s.inputLeft}>
          <Ionicons name={leftIcon} size={18} color="#7C68FF" style={s.inputIcon} />
        </View>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={C.muted}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
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

export default function SignupScreen({ onBack, onCreateAccount, onLogIn }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!fullName.trim() || !email.trim()) return setError("Please enter your name and email.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirmPassword) return setError("Passwords do not match.");
    if (!agree) return setError("Please agree to the Terms and Privacy Policy.");
    setError("");
    setLoading(true);
    const message = await onCreateAccount({ fullName: fullName.trim(), email: email.trim(), password });
    setLoading(false);
    if (message) setError(message);
  };

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.container}>
        <View style={s.topBar}>
          <Pressable onPress={onBack} style={s.backButton} accessibilityRole="button" accessibilityLabel="Go back">
            <Ionicons name="chevron-back" size={18} color={C.text} />
          </Pressable>
          <View style={s.brandRow}>
            <Image source={require("../../../assets/logo.png")} style={s.logo} resizeMode="contain" />
            <Text style={s.brandName}>Study<Text style={{ color: C.accent }}>Gen</Text></Text>
          </View>
        </View>

        <Text style={s.title}>Create your account</Text>
        <Text style={s.subtitle}>Turn your PDFs into personal reviewers. Start learning smarter with StudyGen.</Text>

        <View style={s.form}>
          <Field label="FULL NAME" placeholder="Enter your full name" value={fullName} onChangeText={setFullName} autoCapitalize="words" leftIcon="person-outline" />
          <Field label="EMAIL ADDRESS" placeholder="Enter your email" value={email} onChangeText={setEmail} keyboardType="email-address" leftIcon="mail-outline" />
          <Field label="PASSWORD" placeholder="Create a password" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} leftIcon="lock-closed-outline" rightIcon={showPassword ? "eye-off-outline" : "eye-outline"} onRightPress={() => setShowPassword((v) => !v)} />
          <Text style={s.helperText}>Use at least 8 characters.</Text>
          <Field label="CONFIRM PASSWORD" placeholder="Re-enter your password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={!showConfirmPassword} leftIcon="lock-closed-outline" rightIcon={showConfirmPassword ? "eye-off-outline" : "eye-outline"} onRightPress={() => setShowConfirmPassword((v) => !v)} />

          <Pressable onPress={() => setAgree((v) => !v)} style={s.checkboxRow}>
            <View style={[s.checkbox, agree && s.checkboxChecked]}>
              {agree ? <Ionicons name="checkmark" size={12} color="#fff" /> : null}
            </View>
            <Text style={s.checkboxText}>
              I agree to the <Text style={s.checkboxLink}>Terms of Service</Text> and <Text style={s.checkboxLink}>Privacy Policy</Text>.
            </Text>
          </Pressable>
        </View>

        {error ? <Text style={s.error}>{error}</Text> : null}

        <Pressable accessibilityRole="button" accessibilityLabel="Create Account" onPress={submit} disabled={loading}
          style={({ pressed }) => [s.cta, loading && { opacity: 0.7 }, pressed && { opacity: 0.88, transform: [{ scale: 0.99 }] }]}>
          <View style={s.ctaInner}>
            <Text style={s.ctaText}>{loading ? "Creating account…" : "Create Account"}</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={s.ctaIcon} />
          </View>
        </Pressable>

        <Text style={s.footerText}>
          Already have an account?{" "}
          <Text onPress={onLogIn} style={s.footerLink}>Log in</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  container: { flex: 1, paddingHorizontal: 24, paddingBottom: 156, backgroundColor: C.bg },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 12, marginBottom: 12, minHeight: 34, position: "relative" },
  backButton: { position: "absolute", left: 0, width: 34, height: 34, borderRadius: 8, alignItems: "center", justifyContent: "center", backgroundColor: "#171D3B" },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 8, justifyContent: "center" },
  logo: { width: 26, height: 42.78 },
  brandName: { color: C.text, fontSize: 20, fontWeight: "800", letterSpacing: -0.5 },
  title: { color: C.text, fontSize: 28, fontWeight: "800", letterSpacing: -1, marginTop: 28, marginBottom: 8 },
  subtitle: { color: C.muted, fontSize: 13, lineHeight: 22, marginTop: 10, marginBottom: 24, maxWidth: 360 },
  form: { width: "100%" },
  fieldWrap: { marginBottom: 16 },
  label: { color: C.subtext, fontSize: 10, fontWeight: "600", letterSpacing: 0.8, marginBottom: 8, textTransform: "uppercase" },
  inputRow: { flexDirection: "row", alignItems: "center", backgroundColor: C.input, borderWidth: 1, borderColor: C.border, borderRadius: 12, height: 48, paddingHorizontal: 16 },
  inputLeft: { width: 22, alignItems: "center", justifyContent: "center" },
  inputIcon: { marginRight: 4 },
  input: { flex: 1, height: "100%", color: C.text, fontSize: 12, paddingVertical: 0, marginLeft: 6 },
  rightAction: { width: 28, height: 28, alignItems: "center", justifyContent: "center" },
  helperText: { color: C.muted, fontSize: 10, marginTop: -4, marginBottom: 16 },
  checkboxRow: { flexDirection: "row", alignItems: "center", marginTop: 20, marginBottom: 20 },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1, borderColor: "#7B82B8", backgroundColor: "transparent", alignItems: "center", justifyContent: "center", marginRight: 10 },
  checkboxChecked: { backgroundColor: C.button, borderColor: C.button },
  checkboxText: { color: C.subtext, fontSize: 11, flex: 1, lineHeight: 18 },
  checkboxLink: { color: "#7C68FF", fontWeight: "700" },
  error: { color: "#F87171", fontSize: 12, marginTop: -8, marginBottom: 10 },
  cta: { height: 52, borderRadius: 12, backgroundColor: "#5864F2", marginTop: 6, justifyContent: "center", alignItems: "center" },
  ctaInner: { width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "center", paddingHorizontal: 18 },
  ctaText: { color: "#fff", fontSize: 13, fontWeight: "700", textAlign: "center" },
  ctaIcon: { marginLeft: 8, alignSelf: "center" },
  footerText: { color: C.muted, fontSize: 12, textAlign: "center", marginTop: 70 },
  footerLink: { color: "#7C68FF", fontWeight: "700" },
});