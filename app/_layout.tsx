import React, { useEffect } from 'react';
import { Stack, useSegments, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider, DefaultTheme, MD3DarkTheme } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AIProvider } from './contexts/AIContext';
import { ThemeProvider, useThemeContext } from './contexts/ThemeContext';

// Define the custom theme
const createTheme = (isDark: boolean, colors: any) => {
  const baseTheme = isDark ? MD3DarkTheme : DefaultTheme;
  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: colors.primary,
      accent: colors.accent,
      background: colors.background,
      surface: colors.surface,
      error: colors.error,
    },
  };
};

// Route guard component to handle auth protection
function RouteGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      console.log("Auth: Loading authentication state...");
      return;
    }

    // Create a more explicit check for public routes
    const publicRoutes = ['login', '(app)'];
    const isPublicRoute = !segments[0] || publicRoutes.includes(segments[0]);

    console.log(`Auth: User is ${isAuthenticated ? 'authenticated' : 'not authenticated'}`);
    console.log(`Auth: Current route ${segments[0]} is ${isPublicRoute ? 'public' : 'protected'}`);

    // If the user is not signed in and the initial segment is not a public route
    if (!isAuthenticated && !isPublicRoute) {
      // Redirect to the login page
      console.log("Auth: Redirecting to login page");
      router.replace('/login');
    } else if (isAuthenticated && segments[0] === 'login') {
      // If the user is signed in and tries to access the login page
      // Redirect to the home page
      console.log("Auth: User is already authenticated, redirecting to home");
      router.replace('/home');
    }
  }, [isAuthenticated, segments, isLoading]);

  // Show nothing until the route guard completes its check
  if (isLoading) return null;

  return <>{children}</>;
}

// Root layout component with providers
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <AIProvider>
          <ThemeProvider>
            <ThemedApp />
          </ThemeProvider>
        </AIProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

// Component that uses the theme context
function ThemedApp() {
  const { isDarkMode, colors } = useThemeContext();
  const theme = createTheme(isDarkMode, colors);
  
  return (
    <PaperProvider theme={theme}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <RootLayoutWithRouteGuard />
    </PaperProvider>
  );
}

// Inner layout component with route guard
function RootLayoutWithRouteGuard() {
  const { colors } = useThemeContext();
  
  return (
    <RouteGuard>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
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