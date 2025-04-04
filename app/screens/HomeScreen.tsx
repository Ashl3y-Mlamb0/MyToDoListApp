import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar, FAB, Button } from 'react-native-paper';
import * as expoRouter from 'expo-router';
import TodoList, { Todo } from '../components/TodoList';

// Create a router instance that we can type-cast when needed
const router = expoRouter.router;

const HomeScreen = () => {
  // Dummy data for the todos
  const dummyTodos: Todo[] = [
    {
      id: '1',
      title: 'Complete React Native assignment',
      description: 'Finish the Todo List app for Mobile App Development course',
      isCompleted: false,
    },
    {
      id: '2',
      title: 'Study for exams',
      description: 'Review materials for upcoming midterm exams',
      isCompleted: false,
    },
    {
      id: '3',
      title: 'Go grocery shopping',
      description: 'Buy ingredients for dinner',
      isCompleted: true,
    },
  ];

  const handleAddTodo = () => {
    // Use any type as a workaround for TypeScript issues
    (router as any).push('/add');
  };

  const handleOpenNestedExample = () => {
    // Use any type as a workaround for TypeScript issues
    (router as any).push('/nested-stack');
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="My Todo List" />
        <Appbar.Action 
          icon="cog" 
          onPress={handleOpenNestedExample} 
        />
      </Appbar.Header>
      <View style={styles.content}>
        {dummyTodos.length > 0 ? (
          <TodoList todos={dummyTodos} />
        ) : (
          <View style={styles.emptyState}>
            <Appbar.Content title="No todos yet. Add a new todo to get started!" />
          </View>
        )}
      </View>
      <FAB
        style={styles.fab}
        icon="plus"
        label="Add Todo"
        onPress={handleAddTodo}
      />
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