import AsyncStorage from '@react-native-async-storage/async-storage';

// User interface
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
 * Register a new user
 */
export const registerUser = async (
  username: string, 
  email: string, 
  password: string
): Promise<User> => {
  try {
    // In a real app, this would call an API endpoint
    // For this demo, we'll simulate a successful registration
    
    // Generate a random ID
    const userId = `user_${Math.random().toString(36).substring(2, 9)}`;
    
    // Create a new user object
    const newUser: User = {
      id: userId,
      username,
      email,
      createdAt: Date.now(),
    };
    
    // Store the user data
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(newUser));
    
    // Generate a fake token (in a real app, this would come from the server)
    const token = `token_${Math.random().toString(36).substring(2, 15)}`;
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    
    return newUser;
  } catch (error) {
    console.error('Error during registration:', error);
    throw new Error('Registration failed');
  }
};

/**
 * Login a user with username/email and password
 */
export const loginUser = async (
  usernameOrEmail: string, 
  password: string
): Promise<User> => {
  try {
    // In a real app, this would validate credentials against an API
    // For this demo, we'll just check if a user exists and simulate login
    
    const userData = await AsyncStorage.getItem(USER_DATA_KEY);
    
    if (!userData) {
      throw new Error('User not found. Please register first.');
    }
    
    const user: User = JSON.parse(userData);
    
    // Check if the provided username/email matches (simplified for demo)
    if (user.username !== usernameOrEmail && user.email !== usernameOrEmail) {
      throw new Error('Invalid credentials');
    }
    
    // In a real app, we would verify the password here
    // For this demo, we'll accept any password
    
    // Generate a fake token (in a real app, this would come from the server)
    const token = `token_${Math.random().toString(36).substring(2, 15)}`;
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    
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
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
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
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    return !!token;
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
    const userData = await AsyncStorage.getItem(USER_DATA_KEY);
    
    if (!userData) {
      return null;
    }
    
    return JSON.parse(userData);
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
    const userData = await AsyncStorage.getItem(USER_DATA_KEY);
    
    if (!userData) {
      throw new Error('User not found');
    }
    
    const currentUser: User = JSON.parse(userData);
    const updatedUser = { ...currentUser, ...updates };
    
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedUser));
    
    return updatedUser;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Profile update failed');
  }
}; 