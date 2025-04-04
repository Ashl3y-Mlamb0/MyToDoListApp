import React from 'react';
import { FlatList, StyleSheet, View, Text } from 'react-native';
import { IconButton } from 'react-native-paper';
import TodoItem from './TodoItem';
import { Todo } from '../services/storage';

// Custom theme colors
const customColors = {
  primary: '#4A8FE7', // Main blue
  accent: '#5D9CEC', // Slightly lighter blue
  background: '#F5F7FA', // Light background
  surface: '#FFFFFF', // Card surface
  textPrimary: '#2C384A', // Dark text
  textSecondary: '#7D8FA9', // Lighter text
};

interface TodoListProps {
  todos: Todo[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoList = ({ todos, onToggleComplete, onDelete }: TodoListProps) => {
  if (todos.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <IconButton
          icon="clipboard-text-outline"
          size={64}
          iconColor={customColors.accent}
          style={styles.emptyIcon}
        />
        <Text style={styles.emptyTitle}>No tasks yet</Text>
        <Text style={styles.emptyText}>
          Add a new task by clicking the "+" button below
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.listContent}
      data={todos}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TodoItem 
          todo={item} 
          onToggleComplete={onToggleComplete} 
          onDelete={onDelete}
        />
      )}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    width: '100%',
  },
  listContent: {
    paddingBottom: 80, // Space for FAB button
    paddingTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: -60, // Center it better
  },
  emptyIcon: {
    backgroundColor: 'rgba(93, 156, 236, 0.1)',
    borderRadius: 50,
    padding: 16,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: customColors.textPrimary,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: customColors.textSecondary,
    textAlign: 'center',
    maxWidth: 250,
    lineHeight: 22,
  }
});

export default TodoList; 