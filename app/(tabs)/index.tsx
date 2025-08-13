import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet,
  SafeAreaView,
  Alert
} from 'react-native';
import { useState } from 'react';
import { Plus } from 'lucide-react-native';
import { TodoItem } from '@/components/TodoItem';
import { useTodos } from '@/hooks/useTodos';

export default function TodosScreen() {
  const [newTaskText, setNewTaskText] = useState('');
  const { todos, loading, addTodo, toggleTodo, deleteTodo, canAddTask, taskCount } = useTodos();

  const handleAddTask = () => {
    if (!newTaskText.trim()) return;
    
    const success = addTodo(newTaskText.trim());
    if (success) {
      setNewTaskText('');
    } else {
      Alert.alert(
        'Daily Limit Reached',
        'You can only create 5 tasks per day. Complete some tasks first!',
        [{ text: 'OK' }]
      );
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading tasks...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Today's Tasks</Text>
        <Text style={styles.subtitle}>
          {taskCount}/5 tasks created
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, !canAddTask && styles.inputDisabled]}
          placeholder={canAddTask ? "Add a new task..." : "Daily limit reached (5/5)"}
          value={newTaskText}
          onChangeText={setNewTaskText}
          editable={canAddTask}
          returnKeyType="done"
          onSubmitEditing={handleAddTask}
        />
        <TouchableOpacity
          style={[styles.addButton, !canAddTask && styles.addButtonDisabled]}
          onPress={handleAddTask}
          disabled={!canAddTask || !newTaskText.trim()}
        >
          <Plus size={24} color={canAddTask && newTaskText.trim() ? "#ffffff" : "#9ca3af"} />
        </TouchableOpacity>
      </View>

      {!canAddTask && (
        <View style={styles.warningContainer}>
          <Text style={styles.warningText}>
            You've reached your daily limit of 5 tasks. Complete some tasks to stay focused!
          </Text>
        </View>
      )}

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {todos.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No tasks for today</Text>
            <Text style={styles.emptyStateSubtext}>
              {canAddTask ? "Add your first task to get started!" : "Great job! You've completed all your tasks."}
            </Text>
          </View>
        ) : (
          todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
  },
  header: {
    padding: 24,
    paddingBottom: 16,
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
  inputContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginBottom: 16,
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  inputDisabled: {
    backgroundColor: '#f3f4f6',
    color: '#9ca3af',
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 12,
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
  addButtonDisabled: {
    backgroundColor: '#e5e7eb',
    shadowOpacity: 0,
    elevation: 0,
  },
  warningContainer: {
    marginHorizontal: 24,
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  warningText: {
    fontSize: 14,
    color: '#92400e',
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
    textAlign: 'center',
  },
});