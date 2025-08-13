import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import Display from './Display';
import CalculatorButton from './CalculatorButton';

const { width: screenWidth } = Dimensions.get('window');
const BUTTON_SIZE = (screenWidth - 60) / 4;

type Operation = '+' | '-' | '×' | '÷';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<Operation | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      if (display === '0') {
        setDisplay(num);
      } else {
        setDisplay(display + num);
      }
    }
  };

  const inputDecimal = () => {
    if (waitingForNewValue) {
      setDisplay('0.');
      setWaitingForNewValue(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  const performOperation = (nextOperation: Operation) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      if (newValue === null) return;

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForNewValue(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: Operation): number | null => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        if (secondValue === 0) {
          setDisplay('Error');
          return null;
        }
        return firstValue / secondValue;
      default:
        return secondValue;
    }
  };

  const handleEquals = () => {
    if (operation && previousValue !== null) {
      const inputValue = parseFloat(display);
      const newValue = calculate(previousValue, inputValue, operation);
      
      if (newValue !== null) {
        setDisplay(String(newValue));
        setPreviousValue(null);
        setOperation(null);
        setWaitingForNewValue(true);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Display value={display} />
      
      <View style={styles.buttonContainer}>
        <View style={styles.row}>
          <CalculatorButton
            text="C"
            onPress={clear}
            type="function"
            size={BUTTON_SIZE}
          />
          <CalculatorButton
            text="±"
            onPress={() => {
              if (display !== '0') {
                setDisplay(display.startsWith('-') ? display.slice(1) : '-' + display);
              }
            }}
            type="function"
            size={BUTTON_SIZE}
          />
          <CalculatorButton
            text="%"
            onPress={() => {
              const value = parseFloat(display) / 100;
              setDisplay(String(value));
            }}
            type="function"
            size={BUTTON_SIZE}
          />
          <CalculatorButton
            text="÷"
            onPress={() => performOperation('÷')}
            type="operation"
            isActive={operation === '÷'}
            size={BUTTON_SIZE}
          />
        </View>

        <View style={styles.row}>
          <CalculatorButton
            text="7"
            onPress={() => inputNumber('7')}
            type="number"
            size={BUTTON_SIZE}
          />
          <CalculatorButton
            text="8"
            onPress={() => inputNumber('8')}
            type="number"
            size={BUTTON_SIZE}
          />
          <CalculatorButton
            text="9"
            onPress={() => inputNumber('9')}
            type="number"
            size={BUTTON_SIZE}
          />
          <CalculatorButton
            text="×"
            onPress={() => performOperation('×')}
            type="operation"
            isActive={operation === '×'}
            size={BUTTON_SIZE}
          />
        </View>

        <View style={styles.row}>
          <CalculatorButton
            text="4"
            onPress={() => inputNumber('4')}
            type="number"
            size={BUTTON_SIZE}
          />
          <CalculatorButton
            text="5"
            onPress={() => inputNumber('5')}
            type="number"
            size={BUTTON_SIZE}
          />
          <CalculatorButton
            text="6"
            onPress={() => inputNumber('6')}
            type="number"
            size={BUTTON_SIZE}
          />
          <CalculatorButton
            text="−"
            onPress={() => performOperation('-')}
            type="operation"
            isActive={operation === '-'}
            size={BUTTON_SIZE}
          />
        </View>

        <View style={styles.row}>
          <CalculatorButton
            text="1"
            onPress={() => inputNumber('1')}
            type="number"
            size={BUTTON_SIZE}
          />
          <CalculatorButton
            text="2"
            onPress={() => inputNumber('2')}
            type="number"
            size={BUTTON_SIZE}
          />
          <CalculatorButton
            text="3"
            onPress={() => inputNumber('3')}
            type="number"
            size={BUTTON_SIZE}
          />
          <CalculatorButton
            text="+"
            onPress={() => performOperation('+')}
            type="operation"
            isActive={operation === '+'}
            size={BUTTON_SIZE}
          />
        </View>

        <View style={styles.row}>
          <CalculatorButton
            text="0"
            onPress={() => inputNumber('0')}
            type="number"
            size={BUTTON_SIZE * 2 + 10}
            isWide
          />
          <CalculatorButton
            text="."
            onPress={inputDecimal}
            type="number"
            size={BUTTON_SIZE}
          />
          <CalculatorButton
            text="="
            onPress={handleEquals}
            type="operation"
            size={BUTTON_SIZE}
          />
        </View>
      </View>

      <View style={styles.branding}>
        <Text style={styles.brandingText}>A product of Delmar Studios, Inc.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingTop: 50,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  branding: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  brandingText: {
    color: '#666666',
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    opacity: 0.8,
  },
});