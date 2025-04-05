import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, SafeAreaView, StatusBar, AppState } from 'react-native';
import { Appbar, FAB, Snackbar, Surface, useTheme, Avatar } from 'react-native-paper';
import * as expoRouter from 'expo-router';
import { useFocusEffect } from 'expo-router';
import TodoList from '../components/TodoList';
import { getTodos, deleteTodo, toggleTodoStatus, Todo } from '../services/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create a router instance that we can type-cast when needed
const router = expoRouter.router;

// Storage keys 
const TODOS_STORAGE_KEY = '@MyTodoList:todos';

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

  // Load todos on initial mount and app resume
  useEffect(() => {
    loadTodos();

    // Add app state listeners to reload todos when app comes back to foreground
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        console.log('App has come to the foreground, reloading todos');
        loadTodos();
      }
    });

    // Cleanup
    return () => {
      subscription.remove();
    };
  }, []);

  // Refresh todos whenever the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log('Home screen focused, reloading todos');
      loadTodos();
    }, [])
  );

  // Verify and fix completed status in localStorage if it doesn't match local state
  const verifyCompletedStatus = async (loadedTodos: Todo[]) => {
    console.log('[VERIFY DEBUG] Checking completed task status consistency');
    
    try {
      // Get raw data from AsyncStorage directly
      const rawStorageData = await AsyncStorage.getItem(TODOS_STORAGE_KEY);
      if (!rawStorageData) {
        console.log('[VERIFY DEBUG] No todos in AsyncStorage, nothing to verify');
        return loadedTodos;
      }
      
      // Parse stored todos
      const storedTodos = JSON.parse(rawStorageData);
      if (!Array.isArray(storedTodos)) {
        console.error('[VERIFY DEBUG] Invalid storage data format, cannot verify');
        return loadedTodos;
      }
      
      // Check for completion status inconsistencies
      let inconsistenciesFound = false;
      const fixedTodos = loadedTodos.map(todo => {
        const storedVersion = storedTodos.find((t: any) => t.id === todo.id);
        if (storedVersion && storedVersion.isCompleted !== todo.isCompleted) {
          console.warn(`[VERIFY DEBUG] Inconsistency found for todo "${todo.title}": local=${todo.isCompleted}, stored=${storedVersion.isCompleted}`);
          inconsistenciesFound = true;
          // Use the stored version's completion status
          return { ...todo, isCompleted: storedVersion.isCompleted };
        }
        return todo;
      });
      
      if (inconsistenciesFound) {
        console.log('[VERIFY DEBUG] Fixed inconsistencies, saving corrected state');
        setTodos(fixedTodos);
        return fixedTodos;
      } else {
        console.log('[VERIFY DEBUG] No inconsistencies found');
        return loadedTodos;
      }
    } catch (error) {
      console.error('[VERIFY DEBUG] Error verifying todo status:', error);
      return loadedTodos;
    }
  };

  const loadTodos = async () => {
    setLoading(true);
    try {
      const loadedTodos = await getTodos();
      
      // Verify and fix any completion status inconsistencies
      const verifiedTodos = await verifyCompletedStatus(loadedTodos);
      
      setTodos(verifiedTodos);
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

  const handleOpenSettings = () => {
    // Use any type as a workaround for TypeScript issues
    (router as any).push('/settings');
  };

  const handleToggleComplete = async (id: string) => {
    try {
      // Find the todo to update
      const todoToUpdate = todos.find(todo => todo.id === id);
      
      if (!todoToUpdate) {
        console.error(`[TOGGLE DEBUG] Todo with id ${id} not found in local state`);
        return;
      }
      
      // Log current status
      console.log(`[TOGGLE DEBUG] Toggling todo "${todoToUpdate.title}" from ${todoToUpdate.isCompleted} to ${!todoToUpdate.isCompleted}`);
      
      // Create a deep copy of the todos array to avoid unexpected mutations
      const updatedTodos = todos.map(todo => 
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
      );
      
      // Update the local state immediately for better UX
      setTodos(updatedTodos);
      
      try {
        // Attempt to update AsyncStorage directly with the complete updated list
        const todosJson = JSON.stringify(updatedTodos);
        await AsyncStorage.setItem(TODOS_STORAGE_KEY, todosJson);
        console.log('[TOGGLE DEBUG] Successfully saved updated todos to AsyncStorage');
        
        // Double-check our save worked by reading it back
        const savedJson = await AsyncStorage.getItem(TODOS_STORAGE_KEY);
        const savedTodos = savedJson ? JSON.parse(savedJson) : [];
        
        const savedCompletedCount = savedTodos.filter((t: Todo) => t.isCompleted).length;
        const expectedCompletedCount = updatedTodos.filter(t => t.isCompleted).length;
        
        console.log(`[TOGGLE DEBUG] Verification: expected ${expectedCompletedCount} completed, found ${savedCompletedCount} completed`);
        
        if (savedCompletedCount !== expectedCompletedCount) {
          console.warn('[TOGGLE DEBUG] Saved completed count does not match expected!');
          
          // Try once more with toggleTodoStatus
          await toggleTodoStatus(id);
        }
      } catch (storageError) {
        console.error('[TOGGLE DEBUG] Error saving to AsyncStorage:', storageError);
        
        // Fall back to the original method
        try {
          await toggleTodoStatus(id);
        } catch (fallbackError) {
          console.error('[TOGGLE DEBUG] Fallback also failed:', fallbackError);
          
          // Revert local state since both save attempts failed
          setTodos(todos);
        }
      }
    } catch (error) {
      console.error('[TOGGLE DEBUG] Error in handleToggleComplete:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTodo(id);
      
      // Update the local state
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
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
            onTouchEnd={handleOpenSettings}
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