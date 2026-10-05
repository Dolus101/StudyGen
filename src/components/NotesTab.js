import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const C = { card: '#12152E', line: '#1C2044', text: '#FFFFFF', muted: '#8E92B2', body: '#B4B8D4', accent: '#6B6CFF', button: '#5B63F0', green: '#34D399' };

function Node({ icon, label, center }) {
  return (
    <View style={s.nodeWrap}>
      <View style={[s.node, center && s.nodeCenter]}>
        <Ionicons name={icon} size={center ? 20 : 24} color={center ? '#fff' : C.accent} />
      </View>
      <Text style={s.nodeLabel} numberOfLines={2}>{label}</Text>
    </View>
  );
}

function Diagram({ d }) {
  const [a, b, c] = d.nodes;
  return (
    <View style={s.diagram}>
      <Node icon={a[0]} label={a[1]} />
      <View style={s.line} />
      <Node icon={b[0]} label={b[1]} center />
      <View style={s.line} />
      <Node icon={c[0]} label={c[1]} />
    </View>
  );
}

export default function NotesTab({ r, chapter = 0, onChapterChange, onMarkReviewed }) {
  const notes = r.notes || [];
  const ch = Math.min(chapter, Math.max(notes.length - 1, 0));
  const [open, setOpen] = useState(false);
  const [di, setDi] = useState(0);

  if (!notes.length) return <Text style={s.muted}>No notes yet</Text>;

  const n = notes[ch];
  const topic = r.topics[ch];
  const diagrams = n.diagrams;
  const diagram = diagrams.length ? diagrams[di % diagrams.length] : null;
  const pick = (i) => {
    onChapterChange?.(i);
    setDi(0);
    setOpen(false);
  };
  const step = (d) => setDi((x) => (x + d + diagrams.length) % diagrams.length);

  return (
    <View style={{ gap: 14 }}>
      <View>
        <Pressable onPress={() => setOpen((o) => !o)} style={s.chapter} accessibilityRole="button">
          <View style={s.badge}>
            <Text style={s.badgeText}>{String(ch + 1).padStart(2, '0')}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.chapterLabel}>CHAPTER {ch + 1}</Text>
            <Text style={s.chapterTitle} numberOfLines={1}>{topic.title}</Text>
          </View>
          <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={C.muted} />
        </Pressable>
        {open && (
          <View style={s.picker}>
            {r.topics.map((t, i) => (
              <Pressable key={t.id || t.title} onPress={() => pick(i)} style={[s.pickRow, i === ch && { backgroundColor: '#1B1F4A' }]}>
                <Text style={[s.pickNum, i === ch && { color: C.accent }]}>{String(i + 1).padStart(2, '0')}</Text>
                <Text style={[s.pickText, i === ch && { fontWeight: '700' }]} numberOfLines={1}>{t.title}</Text>
                {t.reviewed && <Ionicons name="checkmark-circle" size={16} color={C.green} />}
              </Pressable>
            ))}
          </View>
        )}
      </View>

      <View style={s.panel}>
        <View style={s.panelHead}>
          <View style={s.panelIcon}>
            <Ionicons name="key-outline" size={17} color="#2DD4BF" />
          </View>
          <Text style={s.panelTitle}>Key Points</Text>
        </View>
        <View style={{ gap: 10, marginTop: 14 }}>
          {n.points.map((p) => (
            <View key={p} style={s.bullet}>
              <View style={s.dot} />
              <Text style={s.bulletText}>{p}</Text>
            </View>
          ))}
        </View>
        {n.term && n.term.label ? (
          <View style={s.callout}>
            <Text style={s.calloutLabel}>{n.term.label}</Text>
            <Text style={s.bulletText}>{n.term.text}</Text>
          </View>
        ) : null}
      </View>

      {diagram && (
        <View style={s.panel}>
          <View style={s.panelHead}>
            <View style={s.panelIcon}>
              <Ionicons name="git-network-outline" size={17} color="#60A5FA" />
            </View>
            <Text style={[s.panelTitle, { flex: 1 }]}>Diagrams</Text>
            {diagrams.length > 1 && (
              <Pressable onPress={() => step(-1)} hitSlop={8}>
                <Ionicons name="chevron-back" size={16} color={C.muted} />
              </Pressable>
            )}
            <Text style={s.muted}>{(di % diagrams.length) + 1} of {diagrams.length}</Text>
            {diagrams.length > 1 && (
              <Pressable onPress={() => step(1)} hitSlop={8}>
                <Ionicons name="chevron-forward" size={16} color={C.muted} />
              </Pressable>
            )}
          </View>
          <Text style={s.diagramTitle}>{diagram.title}</Text>
          <Diagram d={diagram} />
        </View>
      )}

      <Pressable
        onPress={() => onMarkReviewed?.(ch)}
        disabled={topic.reviewed}
        style={({ pressed }) => [s.reviewBtn, topic.reviewed && s.reviewDone, pressed && { opacity: 0.85 }]}
      >
        <Ionicons name={topic.reviewed ? 'checkmark-circle' : 'checkmark-circle-outline'} size={18} color={topic.reviewed ? C.green : '#fff'} />
        <Text style={[s.reviewText, topic.reviewed && { color: C.green }]}>
          {topic.reviewed ? 'Chapter reviewed' : 'Mark chapter as reviewed'}
        </Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  muted: { color: C.muted, fontSize: 12 },
  chapter: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 14, backgroundColor: '#0F1230', borderWidth: 1, borderColor: '#262B63' },
  badge: { width: 38, height: 38, borderRadius: 10, backgroundColor: C.button, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  chapterLabel: { color: C.accent, fontSize: 10, fontWeight: '700', letterSpacing: 0.6 },
  chapterTitle: { color: C.text, fontSize: 14, fontWeight: '600', marginTop: 2 },
  picker: { marginTop: 6, borderRadius: 14, backgroundColor: C.card, padding: 6 },
  pickRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 11, paddingHorizontal: 10, borderRadius: 10 },
  pickNum: { color: C.muted, fontSize: 12, fontWeight: '700', width: 22 },
  pickText: { flex: 1, color: C.text, fontSize: 13 },

  panel: { padding: 16, borderRadius: 18, backgroundColor: '#0F1230', borderWidth: 1, borderColor: '#262B63' },
  panelHead: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  panelIcon: { width: 32, height: 32, borderRadius: 9, backgroundColor: '#161A45', borderWidth: 1, borderColor: '#262B63', alignItems: 'center', justifyContent: 'center' },
  panelTitle: { color: C.text, fontSize: 15, fontWeight: '700' },

  bullet: { flexDirection: 'row', gap: 10 },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: C.accent, marginTop: 7 },
  bulletText: { flex: 1, color: C.body, fontSize: 13, lineHeight: 19 },

  callout: { marginTop: 16, padding: 12, borderRadius: 10, backgroundColor: '#141945', borderLeftWidth: 3, borderLeftColor: C.accent, gap: 4 },
  calloutLabel: { color: C.accent, fontSize: 10, fontWeight: '700', letterSpacing: 0.8 },

  diagramTitle: { color: C.text, fontSize: 13, fontWeight: '500', marginTop: 14 },
  diagram: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 14, padding: 14, borderRadius: 14, backgroundColor: '#0A0D26', borderWidth: 1, borderColor: C.line },
  nodeWrap: { width: 70, alignItems: 'center', gap: 6 },
  node: { width: 56, height: 56, borderRadius: 14, backgroundColor: '#151A4A', borderWidth: 1, borderColor: '#3A3FA8', alignItems: 'center', justifyContent: 'center' },
  nodeCenter: { width: 44, height: 44, borderRadius: 22, marginTop: 6, backgroundColor: C.button, borderColor: C.button },
  nodeLabel: { color: C.muted, fontSize: 10, textAlign: 'center' },
  line: { flex: 1, height: 2, backgroundColor: '#3A3FA8', marginTop: 27 },

  reviewBtn: { flexDirection: 'row', gap: 8, height: 48, borderRadius: 12, backgroundColor: C.button, alignItems: 'center', justifyContent: 'center' },
  reviewDone: { backgroundColor: 'rgba(52,211,153,0.12)' },
  reviewText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});