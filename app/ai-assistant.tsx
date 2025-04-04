import React from 'react';
import { Stack } from 'expo-router';
import AIAssistantScreen from './screens/AIAssistantScreen';

export default function AIAssistant() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <AIAssistantScreen />
    </>
  );
} 