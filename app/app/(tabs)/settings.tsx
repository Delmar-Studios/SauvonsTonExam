import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  Moon, 
  Sun, 
  Download, 
  Upload, 
  Trash2, 
  Info, 
  Shield,
  Bell
} from 'lucide-react-native';
import * as Notifications from 'expo-notifications';
import * as Sharing from 'expo-sharing';

interface Settings {
  darkMode: boolean;
  notifications: boolean;
  autoBackup: boolean;
}

export default function SettingsScreen() {
  const [settings, setSettings] = useState<Settings>({
    darkMode: false,
    notifications: true,
    autoBackup: false,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const storedSettings = await AsyncStorage.getItem('settings');
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (updatedSettings: Settings) => {
    try {
      await AsyncStorage.setItem('settings', JSON.stringify(updatedSettings));
      setSettings(updatedSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const toggleSetting = (key: keyof Settings) => {
    const updatedSettings = {
      ...settings,
      [key]: !settings[key],
    };
    saveSettings(updatedSettings);

    if (key === 'notifications' && !updatedSettings.notifications) {
      Notifications.cancelAllScheduledNotificationsAsync();
    }
  };

  const exportData = async () => {
    try {
      const notes = await AsyncStorage.getItem('notes');
      const reminders = await AsyncStorage.getItem('reminders');
      
      const exportData = {
        notes: notes ? JSON.parse(notes) : [],
        reminders: reminders ? JSON.parse(reminders) : [],
        exportDate: new Date().toISOString(),
        version: '1.0',
      };

      const dataString = JSON.stringify(exportData, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataString)}`;
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(dataUri, {
          mimeType: 'application/json',
          dialogTitle: 'Export Notes & Reminders',
        });
      } else {
        Alert.alert('Export Complete', 'Data has been prepared for export');
      }
    } catch (error) {
      Alert.alert('Export Error', 'Failed to export data');
    }
  };

  const clearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your notes and reminders. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove(['notes', 'reminders']);
              await Notifications.cancelAllScheduledNotificationsAsync();
              Alert.alert('Success', 'All data has been cleared');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data');
            }
          },
        },
      ]
    );
  };

  const showAbout = () => {
    Alert.alert(
      'About Notes App',
      'Version 1.0\n\nA simple and elegant notes and reminders app built with React Native and Expo.\n\nFeatures:\n• Create and organize notes\n• Set reminders with notifications\n• Search and categorize\n• Export your data\n\nBuilt with ❤️',
      [{ text: 'OK' }]
    );
  };

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    rightComponent 
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightComponent?: React.ReactNode;
  }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress && !rightComponent}
    >
      <View style={styles.settingLeft}>
        <View style={styles.iconContainer}>
          {icon}
        </View>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && (
            <Text style={styles.settingSubtitle}>{subtitle}</Text>
          )}
        </View>
      </View>
      {rightComponent}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <SettingItem
            icon={settings.darkMode ? <Moon size={24} color="#666" /> : <Sun size={24} color="#666" />}
            title="Dark Mode"
            subtitle="Switch between light and dark themes"
            rightComponent={
              <Switch
                value={settings.darkMode}
                onValueChange={() => toggleSetting('darkMode')}
                trackColor={{ false: '#ccc', true: '#2196F3' }}
                thumbColor="#ffffff"
              />
            }
          />

          <SettingItem
            icon={<Bell size={24} color="#666" />}
            title="Notifications"
            subtitle="Receive reminder notifications"
            rightComponent={
              <Switch
                value={settings.notifications}
                onValueChange={() => toggleSetting('notifications')}
                trackColor={{ false: '#ccc', true: '#2196F3' }}
                thumbColor="#ffffff"
              />
            }
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <SettingItem
            icon={<Download size={24} color="#666" />}
            title="Export Data"
            subtitle="Save your notes and reminders"
            onPress={exportData}
          />

          <SettingItem
            icon={<Trash2 size={24} color="#f44336" />}
            title="Clear All Data"
            subtitle="Delete all notes and reminders"
            onPress={clearAllData}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <SettingItem
            icon={<Shield size={24} color="#666" />}
            title="Privacy Policy"
            subtitle="How we handle your data"
            onPress={() => Alert.alert('Privacy Policy', 'All your data is stored locally on your device. We do not collect or share any personal information.')}
          />

          <SettingItem
            icon={<Info size={24} color="#666" />}
            title="About"
            subtitle="App version and information"
            onPress={showAbout}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    paddingTop: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    marginHorizontal: 20,
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
  },
});