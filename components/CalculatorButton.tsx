import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';

interface CalculatorButtonProps {
  text: string;
  onPress: () => void;
  type: 'number' | 'operation' | 'function';
  size: number;
  isActive?: boolean;
  isWide?: boolean;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function CalculatorButton({ 
  text, 
  onPress, 
  type, 
  size, 
  isActive = false,
  isWide = false 
}: CalculatorButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { duration: 100 });
    if (Platform.OS !== 'web') {
      runOnJS(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light))();
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { duration: 100 });
  };

  const getButtonStyle = () => {
    const baseStyle = {
      width: size,
      height: size,
    };

    switch (type) {
      case 'number':
        return [styles.button, styles.numberButton, baseStyle, isWide && styles.wideButton];
      case 'operation':
        return [
          styles.button, 
          isActive ? styles.activeOperationButton : styles.operationButton, 
          baseStyle
        ];
      case 'function':
        return [styles.button, styles.functionButton, baseStyle];
      default:
        return [styles.button, baseStyle];
    }
  };

  const getTextStyle = () => {
    switch (type) {
      case 'number':
        return styles.numberText;
      case 'operation':
        return isActive ? styles.activeOperationText : styles.operationText;
      case 'function':
        return styles.functionText;
      default:
        return styles.numberText;
    }
  };

  return (
    <AnimatedTouchableOpacity
      style={[getButtonStyle(), animatedStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={getTextStyle()}>{text}</Text>
    </AnimatedTouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  numberButton: {
    backgroundColor: '#333333',
  },
  operationButton: {
    backgroundColor: '#FF9500',
  },
  activeOperationButton: {
    backgroundColor: '#FFFFFF',
  },
  functionButton: {
    backgroundColor: '#A6A6A6',
  },
  wideButton: {
    borderRadius: 40,
    alignItems: 'flex-start',
    paddingLeft: 35,
  },
  numberText: {
    color: '#FFFFFF',
    fontSize: 36,
    fontFamily: 'Inter-Regular',
    fontWeight: '400',
  },
  operationText: {
    color: '#FFFFFF',
    fontSize: 40,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
  },
  activeOperationText: {
    color: '#FF9500',
    fontSize: 40,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
  },
  functionText: {
    color: '#000000',
    fontSize: 32,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
  },
});