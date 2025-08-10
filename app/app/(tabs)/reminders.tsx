import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import { Plus, Calendar, Clock, Trash2, CircleCheck as CheckCircle } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { v4 as uuidv4 } from 'react-native-uuid';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

interface Reminder {
  id: string;
  title: string;
  description: string;
  datetime: Date;
  completed: boolean;
  notificationId?: string;
}

export default function RemindersScreen() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    loadReminders();
    registerForPushNotificationsAsync();
  }, []);

  const registerForPushNotificationsAsync = async () => {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#2196F3',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        Alert.alert('Permission required', 'Please enable notifications to receive reminders');
        return;
      }
    }
  };

  const loadReminders = async () => {
    try {
      const storedReminders = await AsyncStorage.getItem('reminders');
      if (storedReminders) {
        const parsedReminders = JSON.parse(storedReminders).map((reminder: any) => ({
          ...reminder,
          datetime: new Date(reminder.datetime),
        }));
        setReminders(parsedReminders);
      }
    } catch (error) {
      console.error('Error loading reminders:', error);
    }
  };

  const saveReminders = async (updatedReminders: Reminder[]) => {
    try {
      await AsyncStorage.setItem('reminders', JSON.stringify(updatedReminders));
      setReminders(updatedReminders);
    } catch (error) {
      console.error('Error saving reminders:', error);
    }
  };

  const scheduleNotification = async (reminder: Reminder): Promise<string | null> => {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: reminder.title,
          body: reminder.description,
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.HIGH,
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

  const createReminder = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for your reminder');
      return;
    }

    if (selectedDate <= new Date()) {
      Alert.alert('Error', 'Please select a future date and time');
      return;
    }

    const newReminder: Reminder = {
      id: uuidv4() as string,
      title,
      description,
      datetime: selectedDate,
      completed: false,
    };

    const notificationId = await scheduleNotification(newReminder);
    if (notificationId) {
      newReminder.notificationId = notificationId;
    }

    const updatedReminders = [newReminder, ...reminders].sort(
      (a, b) => a.datetime.getTime() - b.datetime.getTime()
    );
    
    saveReminders(updatedReminders);
    resetForm();
  };

  const toggleComplete = async (reminderId: string) => {
    const updatedReminders = reminders.map((reminder) => {
      if (reminder.id === reminderId) {
        const updated = { ...reminder, completed: !reminder.completed };
        
        if (updated.completed && updated.notificationId) {
          Notifications.cancelScheduledNotificationAsync(updated.notificationId);
        } else if (!updated.completed && !updated.notificationId) {
          scheduleNotification(updated).then((notificationId) => {
            if (notificationId) {
              updated.notificationId = notificationId;
            }
          });
        }
        
        return updated;
      }
      return reminder;
    });

    saveReminders(updatedReminders);
  };

  const deleteReminder = (reminderId: string) => {
    const reminder = reminders.find(r => r.id === reminderId);
    if (reminder?.notificationId) {
      Notifications.cancelScheduledNotificationAsync(reminder.notificationId);
    }

    Alert.alert(
      'Delete Reminder',
      'Are you sure you want to delete this reminder?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedReminders = reminders.filter((reminder) => reminder.id !== reminderId);
            saveReminders(updatedReminders);
          },
        },
      ]
    );
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSelectedDate(new Date());
    setIsCreating(false);
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const onDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      const newDate = new Date(selectedDate);
      newDate.setFullYear(date.getFullYear());
      newDate.setMonth(date.getMonth());
      newDate.setDate(date.getDate());
      setSelectedDate(newDate);
    }
  };

  const onTimeChange = (event: any, time?: Date) => {
    setShowTimePicker(false);
    if (time) {
      const newDate = new Date(selectedDate);
      newDate.setHours(time.getHours());
      newDate.setMinutes(time.getMinutes());
      setSelectedDate(newDate);
    }
  };

  const renderReminder = ({ item }: { item: Reminder }) => {
    const isPast = item.datetime < new Date() && !item.completed;
    
    return (
      <View style={[styles.reminderCard, item.completed && styles.completedCard]}>
        <View style={styles.reminderHeader}>
          <TouchableOpacity
            style={styles.checkButton}
            onPress={() => toggleComplete(item.id)}>
            <CheckCircle 
              size={24} 
              color={item.completed ? '#4CAF50' : '#ccc'} 
              fill={item.completed ? '#4CAF50' : 'none'}
            />
          </TouchableOpacity>
          
          <View style={styles.reminderContent}>
            <Text style={[
              styles.reminderTitle,
              item.completed && styles.completedText
            ]}>
              {item.title}
            </Text>
            {item.description ? (
              <Text style={[
                styles.reminderDescription,
                item.completed && styles.completedText
              ]}>
                {item.description}
              </Text>
            ) : null}
            <Text style={[
              styles.reminderDateTime,
              isPast && styles.pastDateTime,
              item.completed && styles.completedText
            ]}>
              {formatDateTime(item.datetime)}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteReminder(item.id)}>
            <Trash2 size={20} color="#f44336" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (isCreating) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <View style={styles.header}>
          <TouchableOpacity onPress={resetForm} style={styles.headerButton}>
            <Text style={styles.headerButtonText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Reminder</Text>
          <TouchableOpacity onPress={createReminder} style={styles.headerButton}>
            <Text style={[styles.headerButtonText, styles.saveButton]}>Save</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.createContainer}>
          <TextInput
            style={styles.titleInput}
            placeholder="Reminder title"
            value={title}
            onChangeText={setTitle}
          />
          
          <TextInput
            style={styles.descriptionInput}
            placeholder="Description (optional)"
            value={description}
            onChangeText={setDescription}
            multiline={true}
          />

          <View style={styles.dateTimeContainer}>
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => setShowDatePicker(true)}>
              <Calendar size={20} color="#2196F3" />
              <Text style={styles.dateTimeText}>
                {selectedDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => setShowTimePicker(true)}>
              <Clock size={20} color="#2196F3" />
              <Text style={styles.dateTimeText}>
                {selectedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              minimumDate={new Date()}
              onChange={onDateChange}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="time"
              display="default"
              onChange={onTimeChange}
            />
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reminders</Text>
      </View>

      <FlatList
        data={reminders}
        renderItem={renderReminder}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.remindersList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Bell size={64} color="#ccc" />
            <Text style={styles.emptyStateText}>No reminders set</Text>
            <Text style={styles.emptyStateSubtext}>
              Tap the + button to create your first reminder
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setIsCreating(true)}>
        <Plus size={24} color="#ffffff" />
      </TouchableOpacity>
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
  headerButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerButtonText: {
    fontSize: 16,
    color: '#2196F3',
  },
  saveButton: {
    fontWeight: 'bold',
  },
  remindersList: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  reminderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  completedCard: {
    opacity: 0.6,
  },
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkButton: {
    marginRight: 12,
    marginTop: 2,
  },
  reminderContent: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  reminderDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  reminderDateTime: {
    fontSize: 12,
    color: '#999',
  },
  pastDateTime: {
    color: '#f44336',
    fontWeight: '600',
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  deleteButton: {
    padding: 4,
  },
  createContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  titleInput: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 16,
  },
  descriptionInput: {
    fontSize: 16,
    color: '#333',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 24,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  dateTimeContainer: {
    gap: 12,
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  dateTimeText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    backgroundColor: '#FF9800',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 8,
    textAlign: 'center',
  },
});