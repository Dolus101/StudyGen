import { useCallback, useEffect, useState } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'studyReminder';
const NOTIFICATION_ID = 'study-reminder';
const CHANNEL_ID = 'reminders';
const DEFAULT_TIME = { hour: 19, minute: 0 }; // 7:00 PM

// ---------- helpers ----------

async function ensurePermission() {
  if (Platform.OS === 'android') {
    // Android 8+ requires a channel. Must exist before asking for permission on Android 13+.
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Study reminders',
      importance: Notifications.AndroidImportance.HIGH,
    });
  }

  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;

  if (current.canAskAgain) {
    const request = await Notifications.requestPermissionsAsync();
    return request.granted;
  }
  return false;
}

async function scheduleDaily({ hour, minute }) {
  // Cancel the old one first so there is only ever one reminder
  await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_ID).catch(() => {});

  await Notifications.scheduleNotificationAsync({
    identifier: NOTIFICATION_ID,
    content: {
      title: 'Time to study 📚',
      body: 'A few minutes today keeps your streak going.',
      sound: false,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
      channelId: CHANNEL_ID, // used on Android, ignored on iOS
    },
  });
}

async function readSaved() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

async function save(enabled, time) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ enabled, time }));
  } catch {
    // storage failure shouldn't break the UI
  }
}

/**
 * Call this on sign out so a logged-out device stops getting reminders.
 * It also marks the setting as off, so it matches what the user sees next login.
 */
export async function cancelStudyReminder() {
  await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_ID).catch(() => {});
  const saved = await readSaved();
  await save(false, saved?.time ?? DEFAULT_TIME);
}

// ---------- hook ----------

export function useStudyReminder() {
  const [enabled, setEnabled] = useState(false);
  const [time, setTime] = useState(DEFAULT_TIME);
  const [loaded, setLoaded] = useState(false);

  // Load saved settings, and make sure the OS schedule still matches them
  useEffect(() => {
    let active = true;
    (async () => {
      const saved = await readSaved();
      if (!active) return;
      if (saved) {
        setEnabled(!!saved.enabled);
        setTime(saved.time ?? DEFAULT_TIME);

        if (saved.enabled) {
          const perm = await Notifications.getPermissionsAsync();
          if (perm.granted) {
            await scheduleDaily(saved.time ?? DEFAULT_TIME);
          } else {
            // User turned notifications off in system settings
            setEnabled(false);
            await save(false, saved.time ?? DEFAULT_TIME);
          }
        }
      }
      setLoaded(true);
    })();
    return () => {
      active = false;
    };
  }, []);

  const toggle = useCallback(
    async (value) => {
      if (value) {
        const granted = await ensurePermission();
        if (!granted) {
          Alert.alert(
            'Notifications are off',
            'Turn on notifications for StudyGen in your phone settings to get study reminders.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open settings', onPress: () => Linking.openSettings() },
            ]
          );
          return;
        }
        await scheduleDaily(time);
      } else {
        await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_ID).catch(() => {});
      }
      setEnabled(value);
      save(value, time);
    },
    [time]
  );

  const changeTime = useCallback(
    async (hour, minute) => {
      const next = { hour, minute };
      setTime(next);
      if (enabled) await scheduleDaily(next);
      save(enabled, next);
    },
    [enabled]
  );

  return { enabled, time, loaded, toggle, changeTime };
}