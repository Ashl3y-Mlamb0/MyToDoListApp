import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  isAuthenticated, 
  getCurrentUser, 
  loginUser, 
  logoutUser, 
  registerUser, 
  updateUserProfile,
  User,
  AuthState
} from '../services/auth';

// Create an interface for the context
interface AuthContextType extends AuthState {
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Omit<User, 'id' | 'createdAt'>>) => Promise<void>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authStatus = await isAuthenticated();
        
        if (authStatus) {
          const user = await getCurrentUser();
          setState({
            isAuthenticated: true,
            user,
            isLoading: false,
          });
        } else {
          setState({
            isAuthenticated: false,
            user: null,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        });
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (usernameOrEmail: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const user = await loginUser(usernameOrEmail, password);
      
      setState({
        isAuthenticated: true,
        user,
        isLoading: false,
      });
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  // Register function
  const register = async (username: string, email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const user = await registerUser(username, email, password);
      
      setState({
        isAuthenticated: true,
        user,
        isLoading: false,
      });
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      await logoutUser();
      
      setState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  // Update profile function
  const updateProfile = async (updates: Partial<Omit<User, 'id' | 'createdAt'>>) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const updatedUser = await updateUserProfile(updates);
      
      setState({
        isAuthenticated: true,
        user: updatedUser,
        isLoading: false,
      });
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 