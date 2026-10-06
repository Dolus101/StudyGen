import { useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { pickPdf } from '../lib/pickPdf';

const C = {
  bg: '#080A1C',
  card: '#121530',
  field: '#101328',
  line: '#1C2044',
  text: '#FFFFFF',
  muted: '#8E92B2',
  accent: '#6B6CFF',
  button: '#5B63F0',
  red: '#F0596B',
};

const OPTIONS = {
  lang: { title: 'Exam language', multi: false, items: ['English', 'Filipino', 'Spanish'] },
  types: { title: 'Question types', multi: true, items: ['Multiple Choice', 'True/False', 'Identification', 'Fill in the blank'] },
  count: { title: 'Number of questions', multi: false, items: ['10 questions', '20 questions', '30 questions', '50 questions', '100 questions'] },
};

const MAX_MB = 10;

function IconButton({ name, onPress, label }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} style={({ pressed }) => [s.iconBtn, pressed && { opacity: 0.7 }]}>
      <Ionicons name={name} size={20} color="#fff" />
    </Pressable>
  );
}

function Select({ label, icon, value, onPress }) {
  return (
    <View style={{ marginTop: 16 }}>
      <Text style={s.label}>{label}</Text>
      <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => [s.select, pressed && { opacity: 0.85 }]}>
        <MaterialCommunityIcons name={icon} size={20} color={C.accent} />
        <Text style={s.selectText} numberOfLines={1}>{value}</Text>
        <Ionicons name="chevron-down" size={18} color={C.muted} />
      </Pressable>
    </View>
  );
}

function OptionSheet({ config, selected, onChange, onClose }) {
  if (!config) return null;
  const pick = (item) => {
    if (config.multi) {
      const has = selected.includes(item);
      if (has && selected.length === 1) return; // keep at least one
      onChange(has ? selected.filter((x) => x !== item) : [...selected, item]);
    } else {
      onChange([item]);
      onClose();
    }
  };
  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Pressable style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.6)' }]} onPress={onClose} />
        <View style={s.sheet}>
          <Text style={s.sheetTitle}>{config.title}</Text>
          {config.items.map((item) => {
            const on = selected.includes(item);
            return (
              <Pressable key={item} onPress={() => pick(item)} style={s.sheetRow}>
                <Text style={[s.sheetText, on && { color: C.accent, fontWeight: '600' }]}>{item}</Text>
                {on && <Ionicons name="checkmark" size={20} color={C.accent} />}
              </Pressable>
            );
          })}
          {config.multi && (
            <Pressable onPress={onClose} style={[s.cta, { marginTop: 12 }]}>
              <Text style={s.ctaText}>Done</Text>
            </Pressable>
          )}
        </View>
      </View>
    </Modal>
  );
}

export default function UploadScreen({ onBack, onGenerate }) {
  const [file, setFile] = useState(null);
  const [lang, setLang] = useState(['English']);
  const [types, setTypes] = useState(['Multiple Choice', 'True/False', 'Identification']);
  const [count, setCount] = useState(['50 questions']);
  const [sheet, setSheet] = useState(null);

  const pickFile = async () => {
    try {
      // pickPdf copies the PDF into the app's own storage so it can always be read later
      const f = await pickPdf();
      if (!f) return; // user cancelled
      const mb = (f.size || 0) / 1024 / 1024;
      if (mb > MAX_MB) {
        Alert.alert('File too large', `Please choose a PDF under ${MAX_MB} MB for now.`);
        return;
      }
      setFile({ uri: f.uri, name: f.name, size: `${mb.toFixed(1)} MB` });
    } catch (e) {
      Alert.alert('Could not open the file', e.message || 'Please try again.');
    }
  };

  const state = { lang: [lang, setLang], types: [types, setTypes], count: [count, setCount] };

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <IconButton name="chevron-back" label="Go back" onPress={onBack} />
        <Text style={s.title}>Upload PDF</Text>
        {/* <IconButton name="ellipsis-horizontal" label="More options" /> */}
        <View style={s.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Pressable onPress={pickFile} accessibilityRole="button" accessibilityLabel="Upload PDF" style={s.drop}>
          <View style={s.dropIcon}>
            <Ionicons name="cloud-upload-outline" size={28} color={C.accent} />
          </View>
          <Text style={s.dropTitle}>Tap to upload a PDF</Text>
          <Text style={s.dropSub}>PDF file  •  Maximum size 10 MB</Text>
        </Pressable>

        {file && (
          <View style={s.file}>
            <View style={s.fileIcon}>
              <Ionicons name="document-text-outline" size={20} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.fileName} numberOfLines={1}>{file.name}</Text>
              <Text style={s.fileMeta}>{file.size}  •  Ready to generate</Text>
            </View>
            <Pressable onPress={() => setFile(null)} accessibilityLabel="Remove file" style={s.remove}>
              <Ionicons name="close" size={16} color={C.muted} />
            </Pressable>
          </View>
        )}

        <Text style={s.h2}>Generation Options</Text>
        <Text style={s.h2Sub}>Customize how your reviewer will be created.</Text>

        <Select label="EXAM LANGUAGE" icon="translate" value={lang.join(', ')} onPress={() => setSheet('lang')} />
        <Select label="QUESTION TYPES" icon="format-list-checks" value={types.join(', ')} onPress={() => setSheet('types')} />
        <Select label="NUMBER OF QUESTIONS" icon="pound" value={count.join(', ')} onPress={() => setSheet('count')} />
      </ScrollView>

      <View style={s.footer}>
        <Pressable
          disabled={!file}
          onPress={() => onGenerate?.({ file, language: lang[0], types, count: count[0] })}
          accessibilityRole="button"
          style={({ pressed }) => [s.cta, !file && { opacity: 0.4 }, pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] }]}
        >
          <Ionicons name="sparkles-outline" size={20} color="#fff" />
          <Text style={s.ctaText}>Generate Reviewer</Text>
        </Pressable>
      </View>

      <OptionSheet
        config={sheet ? OPTIONS[sheet] : null}
        selected={sheet ? state[sheet][0] : []}
        onChange={sheet ? state[sheet][1] : () => {}}
        onClose={() => setSheet(null)}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 14, paddingBottom: 6 },
  title: { color: C.text, fontSize: 17, fontWeight: '700' },
  headerSpacer: { width: 40, height: 40 },
  iconBtn: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#151833', borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 20 },

  drop: { height: 150, borderRadius: 16, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#5558E3', backgroundColor: '#101328', alignItems: 'center', justifyContent: 'center' },
  dropIcon: { width: 52, height: 52, borderRadius: 14, backgroundColor: '#1D2150', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  dropTitle: { color: C.text, fontSize: 15, fontWeight: '500' },
  dropSub: { color: C.muted, fontSize: 11, marginTop: 6 },

  file: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 16, padding: 12, borderRadius: 14, backgroundColor: C.card, borderWidth: 1, borderColor: C.line },
  fileIcon: { width: 42, height: 42, borderRadius: 10, backgroundColor: C.red, alignItems: 'center', justifyContent: 'center' },
  fileName: { color: C.text, fontSize: 14, fontWeight: '500' },
  fileMeta: { color: C.muted, fontSize: 11, marginTop: 3 },
  remove: { width: 34, height: 34, borderRadius: 9, backgroundColor: '#1E2144', alignItems: 'center', justifyContent: 'center' },

  h2: { color: C.text, fontSize: 17, fontWeight: '700', marginTop: 26 },
  h2Sub: { color: C.muted, fontSize: 12, marginTop: 4 },
  label: { color: C.muted, fontSize: 11, fontWeight: '600', letterSpacing: 0.8, marginBottom: 8 },
  select: { flexDirection: 'row', alignItems: 'center', gap: 12, height: 48, borderRadius: 12, paddingHorizontal: 14, backgroundColor: C.field, borderWidth: 1, borderColor: C.line },
  selectText: { flex: 1, color: C.text, fontSize: 14 },

  footer: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
  cta: { flexDirection: 'row', gap: 8, height: 52, borderRadius: 14, backgroundColor: C.button, alignItems: 'center', justifyContent: 'center' },
  ctaText: { color: '#fff', fontSize: 15, fontWeight: '700' },

  sheet: { backgroundColor: '#12152E', borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: 20, paddingBottom: 32 },
  sheetTitle: { color: C.text, fontSize: 16, fontWeight: '700', marginBottom: 8 },
  sheetRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.line },
  sheetText: { color: C.text, fontSize: 15 },
});