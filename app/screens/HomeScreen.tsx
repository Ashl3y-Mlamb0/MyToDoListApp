import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, SafeAreaView, StatusBar } from 'react-native';
import { Appbar, FAB, Snackbar, Surface, useTheme, Avatar } from 'react-native-paper';
import * as expoRouter from 'expo-router';
import { useFocusEffect } from 'expo-router';
import TodoList from '../components/TodoList';
import { getTodos, deleteTodo, toggleTodoStatus, Todo } from '../services/storage';

// Create a router instance that we can type-cast when needed
const router = expoRouter.router;

// Custom theme
const customColors = {
  primary: '#4A8FE7', // Main blue
  accent: '#5D9CEC', // Slightly lighter blue
  background: '#F5F7FA', // Light background
  surface: '#FFFFFF', // Card surface
  error: '#FF5252', // Error red
  priorityHigh: '#FF7676', // Red for high priority
  priorityMedium: '#FFBB54', // Orange for medium priority
  priorityLow: '#58C9B9', // Teal for low priority
  textPrimary: '#2C384A', // Dark text
  textSecondary: '#7D8FA9', // Lighter text
  disabled: '#BEC4CD', // Disabled state
};

const getDayName = () => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date().getDay()];
};

const getMonthName = () => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return months[new Date().getMonth()];
};

const getDate = () => {
  return new Date().getDate();
};

const HomeScreen = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const theme = useTheme();

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
      await toggleTodoStatus(id);
      
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
    <SafeAreaView style={[styles.container, { backgroundColor: customColors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={customColors.background} />
      
      {/* Header with date */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Today</Text>
          <Text style={styles.headerSubtitle}>
            {getMonthName()} {getDate()} • {getDayName()}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <Avatar.Icon 
            size={40} 
            icon="refresh" 
            style={styles.headerIcon} 
            color={customColors.textPrimary}
            onTouchEnd={loadTodos}
          />
          <Avatar.Icon 
            size={40} 
            icon="cog" 
            style={styles.headerIcon} 
            color={customColors.textPrimary}
            onTouchEnd={handleOpenNestedExample}
          />
        </View>
      </View>
      
      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={customColors.primary} />
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
        style={[styles.fab, { backgroundColor: customColors.primary }]}
        icon="plus"
        color="#FFFFFF"
        onPress={handleAddTodo}
      />
      
      <Snackbar
        visible={snackbarVisible}
        onDismiss={onDismissSnackbar}
        duration={3000}
        style={styles.snackbar}
        action={{
          label: 'Dismiss',
          onPress: onDismissSnackbar,
          color: customColors.primary,
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 40, 
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: customColors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: customColors.textSecondary,
    marginTop: 4,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerIcon: {
    backgroundColor: 'transparent',
    marginLeft: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 20,
    right: 0,
    bottom: 0,
    borderRadius: 30,
    elevation: 4,
  },
  snackbar: {
    backgroundColor: customColors.surface,
    color: customColors.textPrimary,
    marginBottom: 16,
  },
});

export default HomeScreen; 