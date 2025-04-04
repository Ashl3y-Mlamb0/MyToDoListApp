import React from 'react';
import { Stack } from 'expo-router';
import SettingsScreen from './screens/SettingsScreen';

export default function SettingsStackScreen() {
  return (
    <>
      <Stack.Screen 
        options={{ 
          headerShown: false,
          title: 'Settings'
        }} 
      />
      <SettingsScreen />
    </>
  );
} 