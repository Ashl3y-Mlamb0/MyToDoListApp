import React from 'react';
import { Stack } from 'expo-router';
import NestedStack from './screens/NestedStack';

export default function NestedStackScreen() {
  return (
    <>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          title: 'Nested Navigation Example'
        }} 
      />
      <NestedStack />
    </>
  );
} 