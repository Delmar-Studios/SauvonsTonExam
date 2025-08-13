import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface DisplayProps {
  value: string;
}

export default function Display({ value }: DisplayProps) {
  const getFontSize = () => {
    const length = value.length;
    if (length > 9) return 40;
    if (length > 7) return 50;
    if (length > 5) return 60;
    return 70;
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { fontSize: getFontSize() }]} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingHorizontal: 30,
    paddingBottom: 30,
    minHeight: 200,
  },
  text: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Regular',
    textAlign: 'right',
    fontWeight: '300',
  },
});