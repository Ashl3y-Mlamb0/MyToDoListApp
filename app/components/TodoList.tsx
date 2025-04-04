import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import TodoItem from './TodoItem';

// Define the Todo type
export interface Todo {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
}

interface TodoListProps {
  todos: Todo[];
}

const TodoList = ({ todos }: TodoListProps) => {
  return (
    <FlatList
      style={styles.list}
      data={todos}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TodoItem 
          title={item.title} 
          description={item.description} 
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    width: '100%',
  },
});

export default TodoList; 