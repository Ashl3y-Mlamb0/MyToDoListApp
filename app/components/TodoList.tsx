import React from 'react';
import { FlatList, StyleSheet, View, Text } from 'react-native';
import TodoItem from './TodoItem';
import { Todo } from '../services/storage';

interface TodoListProps {
  todos: Todo[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoList = ({ todos, onToggleComplete, onDelete }: TodoListProps) => {
  if (todos.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No todos yet. Add a new todo to get started!</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.list}
      data={todos}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TodoItem 
          todo={item} 
          onToggleComplete={onToggleComplete} 
          onDelete={onDelete}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    width: '100%',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
  }
});

export default TodoList; 