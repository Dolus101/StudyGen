import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const C = { text: '#FFFFFF', muted: '#8E92B2', accent: '#6B6CFF', button: '#5B63F0' };

export function Loading() {
  return (
    <View style={s.center}>
      <ActivityIndicator color={C.accent} />
    </View>
  );
}

function Card({ icon, title, text, button, onPress }) {
  return (
    <View style={s.card}>
      <View style={s.icon}>
        <Ionicons name={icon} size={26} color={C.accent} />
      </View>
      <Text style={s.title}>{title}</Text>
      {text ? <Text style={s.text}>{text}</Text> : null}
      {button ? (
        <Pressable onPress={onPress} style={({ pressed }) => [s.btn, pressed && { opacity: 0.85 }]}>
          <Text style={s.btnText}>{button}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function EmptyState({ icon = 'document-text-outline', title, text, button, onPress }) {
  return <Card icon={icon} title={title} text={text} button={button} onPress={onPress} />;
}

export function ErrorState({ message, onRetry }) {
  return (
    <Card
      icon="cloud-offline-outline"
      title="Couldn't load your reviewers"
      text={message}
      button="Try again"
      onPress={onRetry}
    />
  );
}

const s = StyleSheet.create({
  center: { paddingVertical: 40, alignItems: 'center' },
  card: { alignItems: 'center', padding: 22, borderRadius: 18, backgroundColor: '#0F1230', borderWidth: 1, borderColor: '#262B63' },
  icon: { width: 56, height: 56, borderRadius: 16, backgroundColor: '#1B1F4A', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  title: { color: C.text, fontSize: 16, fontWeight: '700', textAlign: 'center' },
  text: { color: C.muted, fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: 6 },
  btn: { marginTop: 16, height: 44, paddingHorizontal: 22, borderRadius: 12, backgroundColor: C.button, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});