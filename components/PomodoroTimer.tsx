import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react-native';
import { usePomodoro } from '@/hooks/usePomodoro';

interface PomodoroTimerProps {
  onSettingsPress: () => void;
}

export function PomodoroTimer({ onSettingsPress }: PomodoroTimerProps) {
  const {
    isActive,
    isPaused,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    getTimeRemaining,
    getProgress,
    formatTime,
    isCompleted,
  } = usePomodoro();

  const timeRemaining = getTimeRemaining();
  const progress = getProgress();

  const handlePlayPause = () => {
    if (!isActive) {
      startTimer();
    } else if (isPaused) {
      resumeTimer();
    } else {
      pauseTimer();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.timerContainer}>
        <View style={styles.progressRing}>
          <View style={[styles.progressBar, { 
            transform: [{ rotateZ: `${progress * 360}deg` }] 
          }]} />
          <View style={styles.progressInner}>
            <Text style={styles.timeText}>
              {formatTime(timeRemaining)}
            </Text>
            <Text style={styles.statusText}>
              {isCompleted ? 'Complete!' : isActive ? (isPaused ? 'Paused' : 'Focus Time') : 'Ready'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={resetTimer}
        >
          <RotateCcw size={24} color="#6b7280" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.playButton, isActive && !isPaused && styles.playButtonActive]}
          onPress={handlePlayPause}
        >
          {!isActive || isPaused ? (
            <Play size={32} color="#ffffff" />
          ) : (
            <Pause size={32} color="#ffffff" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={onSettingsPress}
        >
          <Settings size={24} color="#6b7280" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  timerContainer: {
    marginBottom: 48,
  },
  progressRing: {
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  progressBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: 140,
    backgroundColor: '#3b82f6',
    transformOrigin: 'center',
  },
  progressInner: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  timeText: {
    fontSize: 48,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 32,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f9fafb',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  playButtonActive: {
    backgroundColor: '#f97316',
    shadowColor: '#f97316',
  },
});