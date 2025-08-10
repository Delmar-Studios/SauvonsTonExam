export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  category: string;
  tags?: string[];
}

export interface Reminder {
  id: string;
  title: string;
  description: string;
  datetime: Date;
  completed: boolean;
  notificationId?: string;
  recurring?: {
    type: 'daily' | 'weekly' | 'monthly';
    interval: number;
  };
}

export interface Settings {
  darkMode: boolean;
  notifications: boolean;
  autoBackup: boolean;
  defaultCategory: string;
  reminderSound: string;
}

export interface AppData {
  notes: Note[];
  reminders: Reminder[];
  settings: Settings;
  lastBackup?: string;
}