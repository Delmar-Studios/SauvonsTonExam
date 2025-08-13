import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import Calculator from '@/components/Calculator';

export default function CalculatorApp() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <Calculator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});