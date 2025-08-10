import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note, Reminder, Settings, AppData } from '@/types/storage';

const STORAGE_KEYS = {
  NOTES: 'notes',
  REMINDERS: 'reminders', 
  SETTINGS: 'settings',
  LAST_BACKUP: 'lastBackup',
} as const;

// Notes Storage
export const saveNotes = async (notes: Note[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  } catch (error) {
    console.error('Error saving notes:', error);
    throw error;
  }
};

export const loadNotes = async (): Promise<Note[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.NOTES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading notes:', error);
    return [];
  }
};

// Reminders Storage
export const saveReminders = async (reminders: Reminder[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
  } catch (error) {
    console.error('Error saving reminders:', error);
    throw error;
  }
};

export const loadReminders = async (): Promise<Reminder[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.REMINDERS);
    if (data) {
      const parsed = JSON.parse(data);
      // Convert datetime strings back to Date objects
      return parsed.map((reminder: any) => ({
        ...reminder,
        datetime: new Date(reminder.datetime),
      }));
    }
    return [];
  } catch (error) {
    console.error('Error loading reminders:', error);
    return [];
  }
};

// Settings Storage
export const saveSettings = async (settings: Settings): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
    throw error;
  }
};

export const loadSettings = async (): Promise<Settings> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : {
      darkMode: false,
      notifications: true,
      autoBackup: false,
      defaultCategory: 'General',
      reminderSound: 'default',
    };
  } catch (error) {
    console.error('Error loading settings:', error);
    return {
      darkMode: false,
      notifications: true,
      autoBackup: false,
      defaultCategory: 'General',
      reminderSound: 'default',
    };
  }
};

// Backup and Restore
export const exportData = async (): Promise<AppData> => {
  try {
    const [notes, reminders, settings] = await Promise.all([
      loadNotes(),
      loadReminders(),
      loadSettings(),
    ]);

    return {
      notes,
      reminders,
      settings,
      lastBackup: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error exporting data:', error);
    throw error;
  }
};

export const importData = async (data: AppData): Promise<void> => {
  try {
    await Promise.all([
      saveNotes(data.notes || []),
      saveReminders(data.reminders || []),
      saveSettings(data.settings || {
        darkMode: false,
        notifications: true,
        autoBackup: false,
        defaultCategory: 'General',
        reminderSound: 'default',
      }),
    ]);

    if (data.lastBackup) {
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_BACKUP, data.lastBackup);
    }
  } catch (error) {
    console.error('Error importing data:', error);
    throw error;
  }
};

// Clear all data
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.NOTES,
      STORAGE_KEYS.REMINDERS,
      STORAGE_KEYS.SETTINGS,
      STORAGE_KEYS.LAST_BACKUP,
    ]);
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
};