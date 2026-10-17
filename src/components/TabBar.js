import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createThemeColors, createThemedStyles } from '../hooks/useTheme';

const C = createThemeColors({ accent: '#6B6CFF', muted: '#7C80A0' });

const TABS = [
  { key: 'home', label: 'Home', icon: 'home' },
  { key: 'reviewers', label: 'Reviewers', icon: 'book' },
  { key: 'stats', label: 'Stats', icon: 'stats-chart' },
  { key: 'profile', label: 'Profile', icon: 'person' },
];

export default function TabBar({ active, onChange }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[s.bar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {TABS.map((t) => {
        const on = t.key === active;
        return (
          <Pressable key={t.key} style={s.tab} onPress={() => onChange(t.key)} accessibilityRole="tab" accessibilityState={{ selected: on }}>
            <Ionicons name={on ? t.icon : `${t.icon}-outline`} size={22} color={on ? C.accent : C.muted} />
            <Text style={[s.label, { color: on ? C.accent : C.muted, fontWeight: on ? '700' : '500' }]}>{t.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const s = createThemedStyles((C) => ({
  bar: { flexDirection: 'row', backgroundColor: C.bg, borderTopWidth: 1, borderTopColor: C.line, paddingTop: 10 },
  tab: { flex: 1, alignItems: 'center', gap: 4 },
  label: { fontSize: 10 },
}));
