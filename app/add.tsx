import React from 'react';
import { Stack } from 'expo-router';
import AddTodoScreen from './screens/AddTodoScreen';

export default function Add() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <AddTodoScreen />
    </>
  );
} 