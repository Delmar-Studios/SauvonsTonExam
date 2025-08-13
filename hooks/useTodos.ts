import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Todo } from '@/types';

const TODOS_STORAGE_KEY = 'todos';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  // Load todos from storage on mount
  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const storedTodos = await AsyncStorage.getItem(TODOS_STORAGE_KEY);
      if (storedTodos) {
        setTodos(JSON.parse(storedTodos));
      }
    } catch (error) {
      console.error('Error loading todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveTodos = async (newTodos: Todo[]) => {
    try {
      await AsyncStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(newTodos));
      setTodos(newTodos);
    } catch (error) {
      console.error('Error saving todos:', error);
    }
  };

  const getTodaysTodos = () => {
    const today = new Date().toDateString();
    return todos.filter(todo => 
      new Date(todo.createdAt).toDateString() === today
    );
  };

  const addTodo = (text: string) => {
    const todaysTodos = getTodaysTodos();
    if (todaysTodos.length >= 5) {
      return false; // Cannot add more than 5 tasks per day
    }

    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    saveTodos([...todos, newTodo]);
    return true;
  };

  const toggleTodo = (id: string) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodos(updatedTodos);
  };

  const deleteTodo = (id: string) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    saveTodos(updatedTodos);
  };

  const todaysTodos = getTodaysTodos();
  const canAddTask = todaysTodos.length < 5;

  return {
    todos: todaysTodos,
    loading,
    addTodo,
    toggleTodo,
    deleteTodo,
    canAddTask,
    taskCount: todaysTodos.length,
  };
}