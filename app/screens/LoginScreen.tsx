import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  ScrollView, 
  SafeAreaView, 
  StatusBar,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Dimensions
} from 'react-native';
import { 
  TextInput, 
  Button, 
  Snackbar, 
  ActivityIndicator 
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../contexts/AuthContext';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../services/supabase';

// Custom theme colors
const customColors = {
  primary: '#4A8FE7', // Main blue
  accent: '#5D9CEC', // Slightly lighter blue
  background: '#F5F7FA', // Light background
  surface: '#FFFFFF', // Card surface
  error: '#FF5252', // Error red
  textPrimary: '#2C384A', // Dark text
  textSecondary: '#7D8FA9', // Lighter text
  disabled: '#BEC4CD', // Disabled state
  gradientStart: '#4A8FE7',
  gradientEnd: '#3B7DD8',
};

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(true); // Toggle between login and register
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  
  const { login, register, isLoading } = useAuth();

  const handleAuth = async () => {
    try {
      setError('');
      
      if (isLoggingIn) {
        // Login flow
        if (!email || !password) {
          setError('Please fill in all fields');
          setSnackbarVisible(true);
          return;
        }
        
        // Use Supabase auth for login
        const { data, error: supabaseError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (supabaseError) {
          throw new Error(supabaseError.message);
        }
        
        if (data?.user) {
          // Set user in auth context
          await login(email, password);
          router.replace('/home');
        }
      } else {
        // Registration flow
        if (!username || !email || !password) {
          setError('Please fill in all fields');
          setSnackbarVisible(true);
          return;
        }
        
        if (!validateEmail(email)) {
          setError('Please enter a valid email address');
          setSnackbarVisible(true);
          return;
        }
        
        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          setSnackbarVisible(true);
          return;
        }
        
        // Use Supabase auth for registration
        const { data, error: supabaseError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username
            }
          }
        });
        
        if (supabaseError) {
          throw new Error(supabaseError.message);
        }
        
        if (data?.user) {
          // Set user in auth context
          await register(username, email, password);
          router.replace('/home');
        }
      }
    } catch (err: any) {
      setError(err.message);
      setSnackbarVisible(true);
    }
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const toggleAuthMode = () => {
    setIsLoggingIn(!isLoggingIn);
    setError('');
    setEmail('');
    setPassword('');
    setUsername('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={customColors.primary} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <LinearGradient
            colors={[customColors.gradientStart, customColors.gradientEnd]}
            style={styles.header}
          >
            <View style={styles.logoContainer}>
              <MaterialCommunityIcons 
                name="check-circle-outline" 
                size={50} 
                color="#FFFFFF" 
              />
            </View>
            <Text style={styles.title}>MyToDoList</Text>
            <Text style={styles.subtitle}>
              {isLoggingIn ? 'Welcome back!' : 'Create your account'}
            </Text>
          </LinearGradient>

          <View style={styles.formContainer}>
            {!isLoggingIn && (
              <TextInput
                label="Username"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
                mode="outlined"
                autoCapitalize="none"
              />
            )}
            
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              mode="outlined"
              secureTextEntry
            />
            
            <Button
              mode="contained"
              onPress={handleAuth}
              style={styles.button}
              labelStyle={styles.buttonLabel}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={customColors.surface} size={20} />
              ) : (
                isLoggingIn ? 'Login' : 'Register'
              )}
            </Button>
            
            <TouchableOpacity onPress={toggleAuthMode} style={styles.toggleButton}>
              <Text style={styles.toggleText}>
                {isLoggingIn 
                  ? "Don't have an account? Register" 
                  : "Already have an account? Login"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={styles.snackbar}
        action={{
          label: 'Dismiss',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {error}
      </Snackbar>
    </SafeAreaView>
  );
};

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: customColors.background,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    width: '100%',
    paddingVertical: height * 0.06,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 50,
    height: 50,
    tintColor: '#FFFFFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: customColors.surface,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  formContainer: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 16,
  },
  input: {
    marginBottom: 16,
    backgroundColor: customColors.surface,
  },
  button: {
    marginTop: 8,
    paddingVertical: 8,
    backgroundColor: customColors.primary,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  toggleText: {
    color: customColors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  snackbar: {
    backgroundColor: customColors.textPrimary,
  },
});

export default LoginScreen; 