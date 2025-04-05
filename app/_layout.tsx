import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider, DefaultTheme, ActivityIndicator } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the custom theme
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200ee',
    accent: '#03dac4',
  },
};

// Test key for AsyncStorage
const TEST_KEY = '@MyTodoList:storage_test';

export default function Layout() {
  const [isStorageReady, setIsStorageReady] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);

  useEffect(() => {
    const testAsyncStorage = async () => {
      try {
        console.log('[STORAGE TEST] Testing AsyncStorage...');
        
        // Test writing to storage
        const testValue = 'test_' + new Date().toISOString();
        await AsyncStorage.setItem(TEST_KEY, testValue);
        console.log('[STORAGE TEST] Write test successful');
        
        // Test reading from storage
        const readValue = await AsyncStorage.getItem(TEST_KEY);
        if (readValue !== testValue) {
          throw new Error(`Read test failed: expected "${testValue}" but got "${readValue}"`);
        }
        console.log('[STORAGE TEST] Read test successful');
        
        // Test clearing the test item
        await AsyncStorage.removeItem(TEST_KEY);
        console.log('[STORAGE TEST] AsyncStorage tests passed');
        
        setIsStorageReady(true);
      } catch (error) {
        console.error('[STORAGE TEST] AsyncStorage test failed:', error);
        setStorageError(`Storage error: ${error instanceof Error ? error.message : String(error)}`);
      }
    };

    testAsyncStorage();
  }, []);

  if (!isStorageReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>
          {storageError || 'Initializing app...'}
        </Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <StatusBar style="auto" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: 'white' },
            animation: 'slide_from_right',
            presentation: 'card',
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="add"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="edit"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
}); 