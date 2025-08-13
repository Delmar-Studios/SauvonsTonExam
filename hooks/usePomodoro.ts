import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

export function usePomodoro() {
  const [duration, setDuration] = useState(25 * 60); // 25 minutes in seconds
  const [elapsed, setElapsed] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setElapsed(prev => {
          const newElapsed = prev + 1;
          if (newElapsed >= duration) {
            handleSessionComplete();
            return duration;
          }
          return newElapsed;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isPaused, duration]);

  const handleSessionComplete = async () => {
    setIsActive(false);
    setIsPaused(false);
    
    // Play completion sound and vibration
    if (Platform.OS !== 'web') {
      try {
        // Haptic feedback
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        
        // Play sound
        const { sound } = await Audio.Sound.createAsync(
          { uri: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' },
          { shouldPlay: true }
        );
        await sound.playAsync();
      } catch (error) {
        console.log('Audio/Haptics error:', error);
      }
    }
  };

  const startTimer = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsPaused(true);
  };

  const resumeTimer = () => {
    setIsPaused(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setElapsed(0);
  };

  const changeDuration = (newDuration: number) => {
    setDuration(newDuration * 60); // Convert minutes to seconds
    resetTimer();
  };

  const getTimeRemaining = () => {
    return Math.max(0, duration - elapsed);
  };

  const getProgress = () => {
    return duration > 0 ? elapsed / duration : 0;
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return {
    duration,
    elapsed,
    isActive,
    isPaused,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    changeDuration,
    getTimeRemaining,
    getProgress,
    formatTime,
    isCompleted: elapsed >= duration && isActive,
  };
}