import React, { useEffect } from 'react';
import { Stack, useSegments, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Define the custom theme
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200ee',
    accent: '#03dac4',
  },
};

// Route guard component to handle auth protection
function RouteGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // Create a more explicit check for public routes
    const publicRoutes = ['login', '(app)'];
    const isPublicRoute = !segments[0] || publicRoutes.includes(segments[0]);

    // If the user is not signed in and the initial segment is not a public route
    if (!isAuthenticated && !isPublicRoute) {
      // Redirect to the login page
      router.replace('/login');
    } else if (isAuthenticated && segments[0] === 'login') {
      // If the user is signed in and tries to access the login page
      // Redirect to the home page
      router.replace('/home');
    }
  }, [isAuthenticated, segments, isLoading]);

  // Show nothing until the route guard completes its check
  if (isLoading) return null;

  return <>{children}</>;
}

// Root layout component with AuthProvider
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <StatusBar style="auto" />
        <AuthProvider>
          <RootLayoutWithRouteGuard />
        </AuthProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

// Inner layout component with route guard
function RootLayoutWithRouteGuard() {
  return (
    <RouteGuard>
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
        <Stack.Screen
          name="login"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </RouteGuard>
  );
} 