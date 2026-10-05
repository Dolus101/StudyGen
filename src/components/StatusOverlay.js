import { useRef } from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const C = { card: '#12152E', text: '#FFFFFF', muted: '#8E92B2', accent: '#6B6CFF', green: '#34D399' };

// overlay = { state: 'loading' | 'success', title: string, message?: string } or null
export default function StatusOverlay({ overlay }) {
  // Remember the last content so the card stays visible while the modal fades out.
  const last = useRef(overlay);
  if (overlay) last.current = overlay;
  const o = overlay || last.current;
  if (!o) return null;
  const success = o.state === 'success';

  return (
    <Modal transparent visible={!!overlay} animationType="fade" statusBarTranslucent onRequestClose={() => {}}>
      <View style={s.backdrop}>
        <View style={s.card}>
          <View style={[s.iconWrap, success && s.iconSuccess]}>
            {success ? (
              <Ionicons name="checkmark" size={32} color="#fff" />
            ) : (
              <ActivityIndicator size="large" color={C.accent} />
            )}
          </View>
          <Text style={s.title}>{o.title}</Text>
          {o.message ? <Text style={s.message}>{o.message}</Text> : null}
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(8,10,28,0.88)', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  card: { width: '100%', maxWidth: 280, alignItems: 'center', paddingVertical: 28, paddingHorizontal: 20, borderRadius: 22, backgroundColor: C.card, borderWidth: 1, borderColor: '#262B63' },
  iconWrap: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#1B1F4A', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  iconSuccess: { backgroundColor: C.green },
  title: { color: C.text, fontSize: 17, fontWeight: '700', textAlign: 'center' },
  message: { color: C.muted, fontSize: 13, lineHeight: 19, textAlign: 'center', marginTop: 6 },
});