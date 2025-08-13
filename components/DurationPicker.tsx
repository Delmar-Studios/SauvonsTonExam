import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { X } from 'lucide-react-native';

interface DurationPickerProps {
  visible: boolean;
  currentDuration: number;
  onSelect: (duration: number) => void;
  onClose: () => void;
}

const DURATION_OPTIONS = [15, 20, 25, 30, 45, 60]; // minutes

export function DurationPicker({ visible, currentDuration, onSelect, onClose }: DurationPickerProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Session Duration</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.options}>
            {DURATION_OPTIONS.map((duration) => (
              <TouchableOpacity
                key={duration}
                style={[
                  styles.option,
                  currentDuration === duration * 60 && styles.optionSelected
                ]}
                onPress={() => {
                  onSelect(duration);
                  onClose();
                }}
              >
                <Text style={[
                  styles.optionText,
                  currentDuration === duration * 60 && styles.optionTextSelected
                ]}>
                  {duration} min
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 320,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
  },
  options: {
    gap: 12,
  },
  option: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f9fafb',
    alignItems: 'center',
  },
  optionSelected: {
    backgroundColor: '#3b82f6',
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1f2937',
  },
  optionTextSelected: {
    color: '#ffffff',
  },
});