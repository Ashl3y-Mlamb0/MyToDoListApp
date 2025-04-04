import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';

// User interface - aligned with Supabase user structure
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  createdAt: number;
}

// Auth state type
export type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
};

// Storage keys
const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

/**
 * Register a new user using Supabase Auth
 */
export const registerUser = async (
  username: string, 
  email: string, 
  password: string
): Promise<User> => {
  try {
    // Register with Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        }
      }
    });

    if (error) {
      console.error('Error during registration:', error);
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('Registration failed: No user returned');
    }

    // Create a user object from Supabase response
    const newUser: User = {
      id: data.user.id,
      username,
      email: data.user.email || email,
      createdAt: new Date(data.user.created_at || Date.now()).getTime(),
    };
    
    // Store the user data locally
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(newUser));
    
    // Store the session token
    if (data.session?.access_token) {
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, data.session.access_token);
    }
    
    return newUser;
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};

/**
 * Login a user with email and password using Supabase Auth
 */
export const loginUser = async (
  email: string, 
  password: string
): Promise<User> => {
  try {
    // Login with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Error during login:', error);
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('Login failed: No user returned');
    }

    // Create a user object from Supabase response
    const user: User = {
      id: data.user.id,
      username: data.user.user_metadata.username || email.split('@')[0],
      email: data.user.email || email,
      createdAt: new Date(data.user.created_at || Date.now()).getTime(),
    };
    
    // Store the user data locally
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
    
    // Store the session token
    if (data.session?.access_token) {
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, data.session.access_token);
    }
    
    return user;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

/**
 * Logout the current user
 */
export const logoutUser = async (): Promise<void> => {
  try {
    // Sign out from Supabase
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Error during Supabase logout:', error);
    }
    
    // Clear local storage
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    await AsyncStorage.removeItem(USER_DATA_KEY);
  } catch (error) {
    console.error('Error during logout:', error);
    throw new Error('Logout failed');
  }
};

/**
 * Check if a user is authenticated
 */
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    // Check Supabase session
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error checking Supabase session:', error);
      return false;
    }
    
    return !!data.session;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

/**
 * Get the current user's data
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    // Get current Supabase user
    const { data, error } = await supabase.auth.getUser();
    
    if (error || !data.user) {
      console.error('Error getting Supabase user:', error);
      return null;
    }
    
    // Get local user data
    const userData = await AsyncStorage.getItem(USER_DATA_KEY);
    
    if (userData) {
      // Use locally stored data if available
      return JSON.parse(userData);
    }
    
    // Create user from Supabase data
    return {
      id: data.user.id,
      username: data.user.user_metadata.username || data.user.email?.split('@')[0] || 'User',
      email: data.user.email || '',
      createdAt: new Date(data.user.created_at || Date.now()).getTime(),
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Update user profile data
 */
export const updateUserProfile = async (
  updates: Partial<Omit<User, 'id' | 'createdAt'>>
): Promise<User> => {
  try {
    // Get current user data
    const userData = await AsyncStorage.getItem(USER_DATA_KEY);
    
    if (!userData) {
      throw new Error('User not found');
    }
    
    const currentUser: User = JSON.parse(userData);
    
    // Update Supabase user metadata
    const { error } = await supabase.auth.updateUser({
      data: {
        username: updates.username || currentUser.username,
        avatar: updates.avatar || currentUser.avatar,
      }
    });
    
    if (error) {
      console.error('Error updating Supabase user:', error);
      throw new Error(error.message);
    }
    
    // Update local user data
    const updatedUser = { ...currentUser, ...updates };
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedUser));
    
    return updatedUser;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Profile update failed');
  }
};

// Add a default export to satisfy expo-router's expectations
export default {}; 