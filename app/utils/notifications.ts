import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { Reminder } from '@/types/storage';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Request permissions
export const requestNotificationPermissions = async (): Promise<boolean> => {
  if (!Device.isDevice) {
    console.log('Must use physical device for Push Notifications');
    return false;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Reminders',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#2196F3',
      sound: 'default',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
};

// Schedule a notification
export const scheduleNotification = async (reminder: Reminder): Promise<string | null> => {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      console.log('Notification permission not granted');
      return null;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: reminder.title,
        body: reminder.description || 'Reminder notification',
        sound: 'default',
        priority: Notifications.AndroidNotificationPriority.HIGH,
        categoryIdentifier: 'reminder',
      },
      trigger: {
        date: reminder.datetime,
      },
    });

    return notificationId;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return null;
  }
};

// Cancel a notification
export const cancelNotification = async (notificationId: string): Promise<void> => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error('Error cancelling notification:', error);
  }
};

// Cancel all notifications
export const cancelAllNotifications = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error cancelling all notifications:', error);
  }
};

// Get pending notifications
export const getPendingNotifications = async () => {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error getting pending notifications:', error);
    return [];
  }
};

// Handle notification response
export const addNotificationResponseReceivedListener = (
  listener: (response: Notifications.NotificationResponse) => void
) => {
  return Notifications.addNotificationResponseReceivedListener(listener);
};

// Handle notification received while app is in foreground
export const addNotificationReceivedListener = (
  listener: (notification: Notifications.Notification) => void
) => {
  return Notifications.addNotificationReceivedListener(listener);
};