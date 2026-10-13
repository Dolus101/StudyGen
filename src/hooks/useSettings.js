import { useCallback, useEffect, useSyncExternalStore } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'studySettings';
const DEFAULTS = { shuffle: true, explain: true };

// One shared copy of the settings, so Settings, Flashcards and Quiz always agree.
let state = DEFAULTS;
let loading = null;
const listeners = new Set();

const emit = () => listeners.forEach((l) => l());
const subscribe = (l) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const getSnapshot = () => state;

function load() {
  if (!loading) {
    loading = AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (raw) state = { ...DEFAULTS, ...JSON.parse(raw) };
      })
      .catch(() => {})
      .finally(emit);
  }
  return loading;
}

export function useSettings() {
  const settings = useSyncExternalStore(subscribe, getSnapshot);

  useEffect(() => {
    load();
  }, []);

  // update({ shuffle: false }) changes the value everywhere and saves it
  const update = useCallback(async (patch) => {
    await load();
    state = { ...state, ...patch };
    emit();
    AsyncStorage.setItem(KEY, JSON.stringify(state)).catch(() => {});
  }, []);

  return { ...settings, update };
}