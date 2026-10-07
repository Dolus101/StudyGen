import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useProfile } from '../lib/api';

const C = {
  bg: '#080A1C',
  card: '#12152E',
  line: '#1C2044',
  text: '#FFFFFF',
  muted: '#8E92B2',
  accent: '#6B6CFF',
  indigo: '#6366F1',
};

export default function EditProfileScreen({ onBack, onSaved }) {
  const { profile, loading, update } = useProfile();
  const [fullName, setFullName] = useState('');
  const [avatarUri, setAvatarUri] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile?.full_name) setFullName(profile.full_name);
  }, [profile]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to your photo library.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await update({ fullName: fullName.trim(), avatarUri });
      Alert.alert('Saved!', 'Your profile has been updated.', [
        { text: 'OK', onPress: () => onSaved?.() },
      ]);
    } catch (e) {
      Alert.alert('Error', e.message || 'Could not save profile.');
    } finally {
      setSaving(false);
    }
  };

  const avatarSource = avatarUri
    ? { uri: avatarUri }
    : profile?.avatar_url
    ? { uri: profile.avatar_url }
    : null;

  if (loading) {
    return (
      <SafeAreaView edges={['top']} style={s.safe}>
        <View style={s.center}>
          <ActivityIndicator color={C.accent} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={s.safe}>
      <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">

        {/* Header */}
        <View style={s.header}>
          <Pressable onPress={onBack} style={({ pressed }) => [s.backBtn, pressed && { opacity: 0.7 }]}>
            <Ionicons name="chevron-back" size={20} color="#fff" />
          </Pressable>
          <Text style={s.title}>Edit Profile</Text>
          <View style={{ width: 38 }} />
        </View>

        {/* Avatar */}
        <View style={s.avatarWrap}>
          <Pressable onPress={pickImage} style={({ pressed }) => [pressed && { opacity: 0.85 }]}>
            <View style={s.avatarOuter}>
              {avatarSource ? (
                <Image source={avatarSource} style={s.avatarImg} />
              ) : (
                <View style={s.avatarPlaceholder}>
                  <Ionicons name="person-outline" size={36} color="#fff" />
                </View>
              )}
              <View style={s.cameraBtn}>
                <Ionicons name="camera" size={14} color="#fff" />
              </View>
            </View>
          </Pressable>
          <Text style={s.changePhoto}>Tap to change photo</Text>
        </View>

        {/* Form */}
        <View style={s.form}>
          <Text style={s.label}>Full name</Text>
          <View style={s.inputWrap}>
            <Ionicons name="person-outline" size={16} color={C.muted} style={{ marginRight: 10 }} />
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your name"
              placeholderTextColor={C.muted}
              style={s.input}
              autoCapitalize="words"
              returnKeyType="done"
            />
          </View>

          <Text style={s.label}>Email</Text>
          <View style={[s.inputWrap, s.inputDisabled]}>
            <Ionicons name="mail-outline" size={16} color={C.muted} style={{ marginRight: 10 }} />
            <Text style={[s.input, { color: C.muted }]}>{profile?.email ?? '—'}</Text>
          </View>
          <Text style={s.hint}>Email cannot be changed here.</Text>
        </View>

        {/* Save button */}
        <Pressable
          onPress={handleSave}
          disabled={saving}
          style={({ pressed }) => [s.saveBtn, (pressed || saving) && { opacity: 0.8 }]}
        >
          {saving
            ? <ActivityIndicator size="small" color="#fff" />
            : <Text style={s.saveBtnText}>Save changes</Text>
          }
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 },
  backBtn: { width: 38, height: 38, borderRadius: 10, backgroundColor: '#151833', borderWidth: 1, borderColor: '#1C2044', alignItems: 'center', justifyContent: 'center' },
  title: { color: '#fff', fontSize: 18, fontWeight: '700' },

  avatarWrap: { alignItems: 'center', marginBottom: 32 },
  avatarOuter: { position: 'relative', width: 96, height: 96 },
  avatarImg: { width: 96, height: 96, borderRadius: 48, borderWidth: 2, borderColor: C.indigo },
  avatarPlaceholder: { width: 96, height: 96, borderRadius: 48, backgroundColor: C.indigo, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#4B4FD6' },
  cameraBtn: { position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: 14, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: C.bg },
  changePhoto: { color: C.muted, fontSize: 12, marginTop: 10 },

  form: { gap: 6 },
  label: { color: C.text, fontSize: 13, fontWeight: '600', marginTop: 16, marginBottom: 6 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', height: 48, borderRadius: 12, paddingHorizontal: 14, backgroundColor: C.card, borderWidth: 1, borderColor: C.line },
  inputDisabled: { opacity: 0.6 },
  input: { flex: 1, color: C.text, fontSize: 14, padding: 0 },
  hint: { color: C.muted, fontSize: 11, marginTop: 4 },

  saveBtn: { marginTop: 32, height: 50, borderRadius: 14, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center' },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});