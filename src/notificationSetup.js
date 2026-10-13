import * as Notifications from 'expo-notifications';

// Controls how notifications behave while the app is open (foreground).
// Import this file once at the top of App.js: import './notificationSetup';
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});