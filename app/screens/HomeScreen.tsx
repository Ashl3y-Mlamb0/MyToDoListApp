import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Appbar, FAB, Snackbar } from 'react-native-paper';
import * as expoRouter from 'expo-router';
import { useFocusEffect } from 'expo-router';
import TodoList from '../components/TodoList';
import { getTodos, deleteTodo, toggleTodoCompletion, Todo } from '../services/storage';

// Create a router instance that we can type-cast when needed
const router = expoRouter.router;

const HomeScreen = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Load todos on initial mount
  useEffect(() => {
    loadTodos();
  }, []);

  // Refresh todos whenever the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadTodos();
    }, [])
  );

  const loadTodos = async () => {
    setLoading(true);
    try {
      const loadedTodos = await getTodos();
      setTodos(loadedTodos);
    } catch (error) {
      console.error('Error loading todos:', error);
      showSnackbar('Failed to load todos');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = () => {
    // Use any type as a workaround for TypeScript issues
    (router as any).push('/add');
  };

  const handleOpenNestedExample = () => {
    // Use any type as a workaround for TypeScript issues
    (router as any).push('/nested-stack');
  };

  const handleToggleComplete = async (id: string) => {
    try {
      await toggleTodoCompletion(id);
      
      // Update the local state
      setTodos(prevTodos => 
        prevTodos.map(todo => 
          todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
        )
      );
      
      showSnackbar('Todo status updated');
    } catch (error) {
      console.error('Error toggling todo completion:', error);
      showSnackbar('Failed to update todo');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTodo(id);
      
      // Update the local state
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      
      showSnackbar('Todo deleted');
    } catch (error) {
      console.error('Error deleting todo:', error);
      showSnackbar('Failed to delete todo');
    }
  };

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const onDismissSnackbar = () => {
    setSnackbarVisible(false);
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="My Todo List" />
        <Appbar.Action 
          icon="refresh" 
          onPress={loadTodos} 
        />
        <Appbar.Action 
          icon="cog" 
          onPress={handleOpenNestedExample} 
        />
      </Appbar.Header>
      
      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <TodoList 
            todos={todos} 
            onToggleComplete={handleToggleComplete} 
            onDelete={handleDelete} 
          />
        )}
      </View>
      
      <FAB
        style={styles.fab}
        icon="plus"
        label="Add Todo"
        onPress={handleAddTodo}
      />
      
      <Snackbar
        visible={snackbarVisible}
        onDismiss={onDismissSnackbar}
        duration={3000}
        action={{
          label: 'Dismiss',
          onPress: onDismissSnackbar,
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen; 