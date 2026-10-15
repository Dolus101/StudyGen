import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'studyReminder';
const NOTIFICATION_ID = 'study-reminder';
// New channel id on purpose: Android never lets an app raise the importance of an
// existing channel, so the old 'reminders' channel could be stuck on "silent/low".
const CHANNEL_ID = 'study-reminders-v2';
const OLD_CHANNEL_ID = 'reminders';
const DEFAULT_TIME = { hour: 19, minute: 0 }; // 7:00 PM
const DAYS_AHEAD = 14;

// ---------- queue ----------
// Runs schedule/cancel jobs one at a time so quick changes never overlap.

let queue = Promise.resolve();
function enqueue(task) {
  queue = queue.then(task, task);
  return queue;
}

// ---------- helpers ----------

async function ensurePermission() {
  if (Platform.OS === 'android') {
    // Remove the old low-importance channel so it doesn't clutter phone settings
    await Notifications.deleteNotificationChannelAsync(OLD_CHANNEL_ID).catch(() => {});

    // HIGH importance + vibration = pop-up banner (heads-up).
    // No `sound` property: Android uses the system default notification sound.
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Study reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      enableVibrate: true,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
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

async function cancelRemindersNow() {
  // Old repeating reminder from the previous version
  await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_ID).catch(() => {});

  // The one-time reminders for upcoming days
  const all = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    all
      .filter((n) => n.identifier.startsWith(`${NOTIFICATION_ID}-`))
      .map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier).catch(() => {}))
  );
}

async function scheduleDailyNow({ hour, minute }) {
  await cancelRemindersNow();

  const now = new Date();
  const batch = Date.now(); // makes every schedule run use brand-new identifiers
  for (let i = 0; i < DAYS_AHEAD; i++) {
    const date = new Date();
    date.setDate(now.getDate() + i);
    date.setHours(hour, minute, 0, 0);
    if (date <= now) continue; // skip a time that already passed today

    await Notifications.scheduleNotificationAsync({
      identifier: `${NOTIFICATION_ID}-${batch}-${i}`,
      content: {
        title: 'Time to study 📚',
        body: 'A few minutes today keeps your streak going.',
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date,
        channelId: CHANNEL_ID, // used on Android, ignored on iOS
      },
    });
  }
}

// Public, queued versions
const cancelReminders = () => enqueue(cancelRemindersNow);
const scheduleDaily = (time) => enqueue(() => scheduleDailyNow(time));

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

function showSettingsAlert() {
  Alert.alert(
    'Notifications are off',
    'Turn on notifications for StudyGen in your phone settings to get study reminders.',
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Open settings', onPress: () => Linking.openSettings() },
    ]
  );
}

/**
 * Call this on sign out so a logged-out device stops getting reminders.
 * It also marks the setting as off, so it matches what the user sees next login.
 */
export async function cancelStudyReminder() {
  await cancelReminders();
  const saved = await readSaved();
  await save(false, saved?.time ?? DEFAULT_TIME);
}

// ---------- hook ----------

export function useStudyReminder() {
  const [enabled, setEnabled] = useState(false);
  const [time, setTime] = useState(DEFAULT_TIME);
  const [loaded, setLoaded] = useState(false);

  // Always-current copies so callbacks never use stale values
  const enabledRef = useRef(enabled);
  const timeRef = useRef(time);
  enabledRef.current = enabled;
  timeRef.current = time;

  // Load saved settings, and refresh the next 14 days so they never run out
  useEffect(() => {
    let active = true;
    (async () => {
      const saved = await readSaved();
      if (!active) return;
      if (saved) {
        const savedTime = saved.time ?? DEFAULT_TIME;
        setEnabled(!!saved.enabled);
        setTime(savedTime);

        if (saved.enabled) {
          const perm = await Notifications.getPermissionsAsync();
          if (perm.granted) {
            await ensurePermission(); // makes sure the channel exists
            await scheduleDaily(savedTime);
          } else {
            // User turned notifications off in system settings
            setEnabled(false);
            await save(false, savedTime);
          }
        }
      }
      setLoaded(true);
    })();
    return () => {
      active = false;
    };
  }, []);

  const toggle = useCallback(async (value) => {
    try {
      if (value) {
        const granted = await ensurePermission();
        if (!granted) return showSettingsAlert();
        await scheduleDaily(timeRef.current);
      } else {
        await cancelReminders();
      }
      setEnabled(value);
      save(value, timeRef.current);
    } catch (e) {
      Alert.alert('Could not update reminder', e?.message || 'Something went wrong.');
    }
  }, []);

  // Changing the time while reminders are ON does the same thing as
  // turning the toggle off and on: cancel everything, schedule the new time.
  const changeTime = useCallback(async (hour, minute) => {
    const next = { hour, minute };
    setTime(next);
    timeRef.current = next;
    save(enabledRef.current, next);
    if (!enabledRef.current) return;

    try {
      const granted = await ensurePermission();
      if (!granted) return showSettingsAlert();
      await scheduleDaily(next);
    } catch (e) {
      Alert.alert('Could not update reminder', e?.message || 'Something went wrong.');
    }
  }, []);

  return { enabled, time, loaded, toggle, changeTime };
}