import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useState } from 'react';
import { PomodoroTimer } from '@/components/PomodoroTimer';
import { DurationPicker } from '@/components/DurationPicker';
import { usePomodoro } from '@/hooks/usePomodoro';

export default function TimerScreen() {
  const [showDurationPicker, setShowDurationPicker] = useState(false);
  const { duration, changeDuration } = usePomodoro();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Focus Timer</Text>
        <Text style={styles.subtitle}>
          Stay focused with the Pomodoro technique
        </Text>
      </View>

      <View style={styles.content}>
        <PomodoroTimer onSettingsPress={() => setShowDurationPicker(true)} />
      </View>

      <DurationPicker
        visible={showDurationPicker}
        currentDuration={duration}
        onSelect={changeDuration}
        onClose={() => setShowDurationPicker(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 24,
    paddingBottom: 0,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
  },
  content: {
    flex: 1,
    padding: 24,
  },
});