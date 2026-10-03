import { Image, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const C = {
  bg: '#0A0A1F',
  panel: '#212857',
  purple: '#7B6CF6',
  blue: '#3F9BEF',
  accent: '#22D3EE',
  button: '#5B6CFF',
  text: '#FFFFFF',
  muted: '#9A9DB8',
};

function DocCard({ size, color, style }) {
  const pad = size * 0.15;
  const lh = Math.max(4, size * 0.06);
  const ic = size * 0.2;
  const white = 'rgba(255,255,255,0.85)';
  return (
    <View
      style={[
        {
          position: 'absolute',
          width: size,
          height: size * 1.25,
          borderRadius: size * 0.16,
          padding: pad,
          justifyContent: 'flex-start',
          backgroundColor: color,
        },
        style,
      ]}
    >
      <View style={{ width: ic, height: ic * 1.15, borderRadius: ic * 0.2, borderWidth: 1.5, borderColor: white, marginBottom: size * 0.12 }} />
      {[0.8, 0.55, 0.68].map((w, i) => (
        <View key={i} style={{ width: `${w * 100}%`, height: lh, borderRadius: lh / 2, backgroundColor: 'rgba(255,255,255,0.7)', marginBottom: size * 0.07 }} />
      ))}
    </View>
  );
}

function Illustration() {
  const { width: W } = useWindowDimensions();
  const H = W * 0.7;                 // illustration box height
  const card = W * 0.235;            // document card width
  const panelW = W * 0.564;          // rounded panel behind the book
  const panelH = W * 0.333;
  const panelTop = H * 0.515;
  const book = W * 0.51;             // book width
  const bookH = book * (174 / 458);

  return (
    <View style={s.illoWrap}>
      <View style={{ width: W, height: H }}>
        {/* faint outline behind everything */}
        <View
          style={{
            position: 'absolute', left: (W - panelW) / 2 - 2, width: panelW + 4, top: H * 0.14,
            height: panelTop + panelH - H * 0.14, borderRadius: W * 0.1, borderWidth: 1, borderColor: 'rgba(99,102,241,0.22)',
          }}
        />
        {/* panel with soft purple glow */}
        <View
          style={{
            position: 'absolute', left: (W - panelW) / 2, width: panelW, top: panelTop, height: panelH,
            borderRadius: W * 0.056, backgroundColor: C.panel,
            shadowColor: '#6366F1', shadowOpacity: 0.55, shadowRadius: 22, shadowOffset: { width: 0, height: 0 }, elevation: 12,
          }}
        />
        <Image
          source={require('../../assets/book.png')}
          style={{ position: 'absolute', width: book, height: bookH, left: (W - book) / 2, top: panelTop + (panelH - bookH) / 2 }}
          resizeMode="contain"
        />
        <DocCard size={card} color={C.purple} style={{ left: W * 0.19, top: 0, transform: [{ rotate: '-12deg' }] }} />
        <DocCard size={card} color={C.blue} style={{ left: W * 0.57, top: H * 0.08, transform: [{ rotate: '12deg' }] }} />
      </View>
    </View>
  );
}

export default function WelcomeScreen({ onGetStarted }) {
  return (
    <SafeAreaView style={s.safe}>
      <View style={s.container}>
        <View style={s.brandRow}>
          <Image source={require('../../assets/logo.png')} style={s.logo} resizeMode="contain" />
          <Text style={s.brandName}>
            Study<Text style={{ color: C.accent }}>Gen</Text>
          </Text>
        </View>

        <Illustration />

        <View style={s.copy}>
          <Text style={s.title}>
            Study<Text style={{ color: C.accent }}>Gen</Text>
          </Text>
          <Text style={s.subtitle}>Turn Any PDF Into Your Personal Reviewer</Text>
          <Text style={s.body}>Upload your notes and instantly generate summaries, flashcards, and quizzes.</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Get Started"
          onPress={onGetStarted}
          style={({ pressed }) => [s.cta, pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] }]}
        >
          <Text style={s.ctaText}>Get Started</Text>
        </Pressable>

        <Text style={s.footer}>Learn smarter • Study faster • Succeed</Text>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  container: { flex: 1, paddingHorizontal: 24, paddingBottom: 56 },

  brandRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 36 },
  logo: { width: 35, aspectRatio: 242 / 234 },
  brandName: { color: C.text, fontSize: 17, fontWeight: '800' },

  // negative margin lets the illustration use the full screen width
  illoWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', marginHorizontal: -24, overflow: 'visible' },

  copy: { alignItems: 'center', marginBottom: 24 },
  title: { color: C.text, fontSize: 32, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { color: C.text, fontSize: 18, fontWeight: '500', textAlign: 'center', marginTop: 8, lineHeight: 25 },
  body: { color: C.muted, fontSize: 14, textAlign: 'center', marginTop: 12, lineHeight: 20, maxWidth: 300 },

  cta: { backgroundColor: C.button, borderRadius: 12, height: 48, alignItems: 'center', justifyContent: 'center' },
  ctaText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  footer: { color: C.muted, fontSize: 11, textAlign: 'center', marginTop: 14 },
});