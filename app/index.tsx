import React, { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useAuth } from './contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

// Custom theme colors
const customColors = {
  primary: '#4A8FE7', // Main blue
  accent: '#5D9CEC', // Slightly lighter blue
  gradientStart: '#4A8FE7',
  gradientEnd: '#3B7DD8',
};

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    console.log('Index: Authentication state -', isLoading ? 'loading' : isAuthenticated ? 'authenticated' : 'not authenticated');
  }, [isAuthenticated, isLoading]);

  // If still loading, show a loader with the app title
  if (isLoading) {
    return (
      <LinearGradient
        colors={[customColors.gradientStart, customColors.gradientEnd]}
        style={styles.loadingContainer}
      >
        <Text style={styles.appTitle}>MyToDoList</Text>
        <ActivityIndicator size="large" color="#FFFFFF" style={styles.loader} />
        <Text style={styles.loadingText}>Loading...</Text>
      </LinearGradient>
    );
  }

  // Redirect based on authentication status
  return isAuthenticated ? <Redirect href="/home" /> : <Redirect href="/login" />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: customColors.primary,
  },
  loader: {
    marginVertical: 20,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
}); 