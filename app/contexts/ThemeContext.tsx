import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

// Define the custom theme colors
export const customColors = {
  // Blue theme (default)
  blue: {
    primary: '#4A8FE7',
    primaryDark: '#3A7FD7',
    accent: '#5D9CEC',
    background: '#F5F7FA',
    surface: '#FFFFFF',
    error: '#FF5252',
    priorityHigh: '#FF7676',
    priorityMedium: '#FFBB54',
    priorityLow: '#58C9B9',
    textPrimary: '#2C384A',
    textSecondary: '#7D8FA9',
    disabled: '#BEC4CD',
    inputBackground: '#FFFFFF',
    inputBorder: '#E5E9F2',
    gradientStart: '#4A8FE7',
    gradientEnd: '#5D9CEC',
  },
  // Teal theme
  teal: {
    primary: '#26A69A',
    primaryDark: '#00897B',
    accent: '#4DB6AC',
    background: '#F5F7FA',
    surface: '#FFFFFF',
    error: '#FF5252',
    priorityHigh: '#FF7676',
    priorityMedium: '#FFBB54',
    priorityLow: '#58C9B9',
    textPrimary: '#2C384A',
    textSecondary: '#7D8FA9',
    disabled: '#BEC4CD',
    inputBackground: '#FFFFFF',
    inputBorder: '#E5E9F2',
    gradientStart: '#26A69A',
    gradientEnd: '#4DB6AC',
  },
  // Amber theme
  amber: {
    primary: '#FFA000',
    primaryDark: '#FF8F00',
    accent: '#FFB74D',
    background: '#F5F7FA',
    surface: '#FFFFFF',
    error: '#FF5252',
    priorityHigh: '#FF7676',
    priorityMedium: '#FFBB54',
    priorityLow: '#58C9B9',
    textPrimary: '#2C384A',
    textSecondary: '#7D8FA9',
    disabled: '#BEC4CD',
    inputBackground: '#FFFFFF',
    inputBorder: '#E5E9F2',
    gradientStart: '#FFA000',
    gradientEnd: '#FFB74D',
  },
  // Dark theme
  dark: {
    primary: '#5D9CEC',
    primaryDark: '#4A8FE7',
    accent: '#7FB1F5',
    background: '#121212',
    surface: '#1E1E1E',
    error: '#CF6679',
    priorityHigh: '#FF7676',
    priorityMedium: '#FFBB54',
    priorityLow: '#58C9B9',
    textPrimary: '#E1E1E1',
    textSecondary: '#B4B4B4',
    disabled: '#6B6B6B',
    inputBackground: '#2C2C2C',
    inputBorder: '#3E3E3E',
    gradientStart: '#383838',
    gradientEnd: '#272727',
  }
};

export type ColorTheme = 'blue' | 'teal' | 'amber';
export type FontSize = 'small' | 'medium' | 'large';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  fontSizeMultiplier: number;
  colors: typeof customColors.blue;
}

// Create context with default values
const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleDarkMode: () => {},
  setDarkMode: () => {},
  colorTheme: 'blue',
  setColorTheme: () => {},
  fontSize: 'medium',
  setFontSize: () => {},
  fontSizeMultiplier: 1,
  colors: customColors.blue,
});

// Custom hook to use the theme context
export const useThemeContext = () => useContext(ThemeContext);

// Provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const deviceColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(deviceColorScheme === 'dark');
  const [colorTheme, setColorTheme] = useState<ColorTheme>('blue');
  const [fontSize, setFontSize] = useState<FontSize>('medium');

  // Load theme settings from storage on component mount
  useEffect(() => {
    loadThemeSettings();
  }, []);

  // Save theme settings when they change
  useEffect(() => {
    saveThemeSettings();
  }, [isDarkMode, colorTheme, fontSize]);

  // Load theme settings from AsyncStorage
  const loadThemeSettings = async () => {
    try {
      const themeData = await AsyncStorage.getItem('theme_settings');
      if (themeData) {
        const settings = JSON.parse(themeData);
        setIsDarkMode(settings.isDarkMode ?? deviceColorScheme === 'dark');
        setColorTheme(settings.colorTheme || 'blue');
        setFontSize(settings.fontSize || 'medium');
      }
    } catch (error) {
      console.error('Error loading theme settings:', error);
    }
  };

  // Save theme settings to AsyncStorage
  const saveThemeSettings = async () => {
    try {
      const settings = {
        isDarkMode,
        colorTheme,
        fontSize,
      };
      await AsyncStorage.setItem('theme_settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving theme settings:', error);
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  // Get font size multiplier based on selected size
  const getFontSizeMultiplier = (): number => {
    switch (fontSize) {
      case 'small': return 0.85;
      case 'medium': return 1;
      case 'large': return 1.15;
      default: return 1;
    }
  };

  // Get current theme colors
  const getThemeColors = () => {
    // If dark mode is enabled, return dark theme
    if (isDarkMode) return customColors.dark;
    
    // Otherwise, return the selected color theme
    switch (colorTheme) {
      case 'blue': return customColors.blue;
      case 'teal': return customColors.teal;
      case 'amber': return customColors.amber;
      default: return customColors.blue;
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        setDarkMode: setIsDarkMode,
        colorTheme,
        setColorTheme,
        fontSize,
        setFontSize,
        fontSizeMultiplier: getFontSizeMultiplier(),
        colors: getThemeColors(),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Add a default export to satisfy expo-router's expectations
export default {}; 