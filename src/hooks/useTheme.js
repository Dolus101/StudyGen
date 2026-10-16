import { StyleSheet } from 'react-native';
import { getSettingsSnapshot } from './useSettings';

const DARK = {
  bg: '#080A1C',
  card: '#12152E',
  panel: '#1B1F3A',
  input: '#212857',
  inputBorder: '#2E3A73',
  border: '#2E3A73',
  line: '#1C2044',
  text: '#FFFFFF',
  muted: '#8E92B2',
  body: '#B4B8D4',
  subtext: '#C9CCDF',
  accent: '#6B6CFF',
  button: '#5B63F0',
  green: '#34D399',
  red: '#F4707F',
  track: '#23274D',
  trackOff: '#2A2E55',
  surface: '#0F1230',
  surfaceAlt: '#151833',
  softSurface: '#1A1E4A',
  iconSurface: '#1B1F4A',
  field: '#101328',
  indigo: '#6366F1',
  blue: '#2B7BCB',
  borderStrong: '#262B63',
  authAccent: '#73E2FF',
  authLink: '#7C68FF',
  authInput: '#212857',
  authInputBorder: '#2E3A73',
  authMuted: '#9AA2C6',
  authSubtext: '#C9CCDF',
  link: '#7C68FF',
};

const LIGHT = {
  bg: '#F4F5FA',
  card: '#FFFFFF',
  panel: '#FFFFFF',
  input: '#FFFFFF',
  inputBorder: '#CDD2E3',
  border: '#CDD2E3',
  line: '#D8DCE9',
  text: '#1B1D2B',
  muted: '#636A80',
  body: '#41485D',
  subtext: '#41485D',
  accent: '#5D5CDD',
  button: '#5559D9',
  green: '#16865E',
  red: '#C83E50',
  track: '#DDE1EF',
  trackOff: '#9BA3B7',
  surface: '#FFFFFF',
  surfaceAlt: '#ECEEF7',
  softSurface: '#E9EAF8',
  iconSurface: '#E6E8F6',
  field: '#FFFFFF',
  indigo: '#6366F1',
  blue: '#2876B7',
  borderStrong: '#CDD2E3',
  authAccent: '#5357D5',
  authLink: '#5555CC',
  authInput: '#FFFFFF',
  authInputBorder: '#CDD2E3',
  authMuted: '#646B80',
  authSubtext: '#41485D',
  link: '#5555CC',
};

export function getThemePalette(theme = getSettingsSnapshot().theme) {
  return theme === 'light' ? LIGHT : DARK;
}

export function createThemeColors(darkOverrides = {}) {
  return new Proxy({}, {
    get: (_, key) => {
      const palette = getThemePalette();
      if (getSettingsSnapshot().theme === 'light') return palette[key] ?? darkOverrides[key];
      return darkOverrides[key] ?? palette[key];
    },
  });
}

export function createThemedStyles(factory, darkOverrides = {}) {
  let cachedTheme;
  let cachedStyles;
  return new Proxy({}, {
    get: (_, key) => {
      const theme = getSettingsSnapshot().theme === 'light' ? 'light' : 'dark';
      if (theme !== cachedTheme) {
        cachedTheme = theme;
        cachedStyles = StyleSheet.create(factory(createThemeColors(darkOverrides)));
      }
      return cachedStyles[key];
    },
  });
}