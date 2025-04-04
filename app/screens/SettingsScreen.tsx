import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, StatusBar, SafeAreaView, Alert, TouchableOpacity } from 'react-native';
import { Text, Divider, Switch, Button, List, Avatar, Surface, IconButton, useTheme } from 'react-native-paper';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../contexts/AuthContext';
import { useAI } from '../contexts/AIContext';
import { useThemeContext, ColorTheme, FontSize } from '../contexts/ThemeContext';

const SettingsScreen = () => {
  const theme = useTheme();
  const { user, logout } = useAuth();
  const { isEnabled: aiEnabled, setAiEnabled } = useAI();
  const { 
    isDarkMode, 
    setDarkMode, 
    colorTheme, 
    setColorTheme, 
    fontSize, 
    setFontSize,
    colors
  } = useThemeContext();
  const [notifications, setNotifications] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState(true);
  const [betaFeatures, setBetaFeatures] = useState(false);
  const [hour24Format, setHour24Format] = useState(false);

  // Load settings from storage on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  // Update AI state from context on mount
  useEffect(() => {
    setAiSuggestions(aiEnabled);
  }, [aiEnabled]);

  // Load user settings from AsyncStorage
  const loadSettings = async () => {
    try {
      const storedSettings = await AsyncStorage.getItem('user_settings');
      if (storedSettings) {
        const settings = JSON.parse(storedSettings);
        setNotifications(settings.notifications !== false);
        setBetaFeatures(settings.betaFeatures || false);
        setHour24Format(settings.hour24Format || false);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  // Save settings to AsyncStorage
  const saveSettings = async (key: string, value: any) => {
    try {
      const storedSettings = await AsyncStorage.getItem('user_settings');
      const settings = storedSettings ? JSON.parse(storedSettings) : {};
      settings[key] = value;
      await AsyncStorage.setItem('user_settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  // Toggle dark mode
  const handleDarkModeToggle = (value: boolean) => {
    setDarkMode(value);
  };

  // Toggle AI suggestions
  const handleAiSuggestionsToggle = (value: boolean) => {
    setAiSuggestions(value);
    saveSettings('aiSuggestions', value);
    setAiEnabled(value);
  };

  // Toggle notifications
  const handleNotificationsToggle = (value: boolean) => {
    setNotifications(value);
    saveSettings('notifications', value);
  };

  // Toggle beta features
  const handleBetaFeaturesToggle = (value: boolean) => {
    setBetaFeatures(value);
    saveSettings('betaFeatures', value);
  };

  // Toggle 24-hour format
  const handleTimeFormatToggle = (value: boolean) => {
    setHour24Format(value);
    saveSettings('hour24Format', value);
  };

  // Set accent color (theme)
  const handleAccentColorChange = (color: ColorTheme) => {
    setColorTheme(color);
  };

  // Set font size
  const handleFontSizeChange = (size: FontSize) => {
    setFontSize(size);
  };

  // Handle logout
  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout", 
          onPress: async () => {
            try {
              await logout();
              // Router redirection is handled by RouteGuard
            } catch (error) {
              console.error('Error logging out:', error);
              Alert.alert("Error", "Failed to logout. Please try again.");
            }
          }
        }
      ]
    );
  };

  // Handle clearing AI history
  const handleClearAIHistory = () => {
    Alert.alert(
      "Clear AI History",
      "Are you sure you want to clear all AI history?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Clear", 
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('ai_history');
              Alert.alert("Success", "AI history has been cleared.");
            } catch (error) {
              console.error('Error clearing AI history:', error);
              Alert.alert("Error", "Failed to clear AI history.");
            }
          }
        }
      ]
    );
  };

  // Handle reset app data
  const handleResetAppData = () => {
    Alert.alert(
      "Reset App Data",
      "This will clear all your tasks and settings. This action cannot be undone!",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Reset", 
          onPress: async () => {
            try {
              // Clear all app data except auth
              const keys = await AsyncStorage.getAllKeys();
              const keysToRemove = keys.filter(key => 
                key !== 'auth_token' && key !== 'user_data'
              );
              await AsyncStorage.multiRemove(keysToRemove);
              
              // Reset state
              setDarkMode(false);
              setNotifications(true);
              setAiSuggestions(true);
              setBetaFeatures(false);
              setHour24Format(false);
              
              Alert.alert("Success", "App data has been reset.");
            } catch (error) {
              console.error('Error resetting app data:', error);
              Alert.alert("Error", "Failed to reset app data.");
            }
          }
        }
      ]
    );
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={colors.primary} />
      
      {/* Header with gradient */}
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.header}>
          <IconButton
            icon="arrow-left"
            size={24}
            iconColor="#FFFFFF"
            onPress={handleGoBack}
            style={styles.backButton}
          />
          <Text style={styles.headerTitle}>Settings</Text>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Surface style={[styles.profileCard, { backgroundColor: colors.surface }]}>
          <View style={styles.profileContent}>
            <Avatar.Text 
              size={64} 
              label={user?.username?.substring(0, 2).toUpperCase() || "AM"} 
              style={{backgroundColor: colors.primary}} 
            />
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: colors.textPrimary }]}>{user?.username || "User"}</Text>
              <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>{user?.email || "email@example.com"}</Text>
            </View>
          </View>
          <Button 
            mode="contained" 
            icon="account-edit" 
            style={{backgroundColor: colors.primary}}
            onPress={() => {
              Alert.alert("Feature Coming Soon", "Profile editing will be available in a future update.");
            }}>
            Edit Profile
          </Button>
        </Surface>

        {/* Theme & UI Preferences */}
        <List.Section style={[styles.settingSection, { backgroundColor: colors.surface }]}>
          <List.Subheader style={styles.sectionHeader}>
            <IconButton
              icon="palette-outline"
              size={24}
              iconColor={colors.primary}
              style={styles.sectionIcon}
            />
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>Theme & UI Preferences</Text>
          </List.Subheader>
          <List.Item
            title="Dark Mode"
            titleStyle={{ color: colors.textPrimary }}
            description="Switch between light and dark themes"
            descriptionStyle={{ color: colors.textSecondary }}
            left={props => <List.Icon {...props} icon="theme-light-dark" color={colors.primary} />}
            right={props => <Switch value={isDarkMode} onValueChange={handleDarkModeToggle} color={colors.primary} />}
          />
          <List.Item
            title="Accent Color"
            titleStyle={{ color: colors.textPrimary }}
            description="Personalize app highlight color"
            descriptionStyle={{ color: colors.textSecondary }}
            left={props => <List.Icon {...props} icon="palette" color={colors.primary} />}
            right={props => (
              <View style={styles.colorCirclesContainer}>
                <TouchableOpacity onPress={() => handleAccentColorChange('blue')}>
                  <View style={[
                    styles.colorCircle, 
                    {backgroundColor: '#4A8FE7', borderWidth: colorTheme === 'blue' ? 2 : 1}
                  ]} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleAccentColorChange('teal')}>
                  <View style={[
                    styles.colorCircle, 
                    {backgroundColor: '#26A69A', borderWidth: colorTheme === 'teal' ? 2 : 1}
                  ]} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleAccentColorChange('amber')}>
                  <View style={[
                    styles.colorCircle, 
                    {backgroundColor: '#FFA000', borderWidth: colorTheme === 'amber' ? 2 : 1}
                  ]} />
                </TouchableOpacity>
              </View>
            )}
          />
          <List.Item
            title="Font Size"
            titleStyle={{ color: colors.textPrimary }}
            description="Adjust text size for better readability"
            descriptionStyle={{ color: colors.textSecondary }}
            left={props => <List.Icon {...props} icon="format-size" color={colors.primary} />}
            right={props => (
              <View style={styles.fontSizeContainer}>
                <TouchableOpacity onPress={() => handleFontSizeChange('small')}>
                  <Text style={{fontSize: 12, fontWeight: fontSize === 'small' ? 'bold' : 'normal', color: colors.textPrimary}}>A</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleFontSizeChange('medium')}>
                  <Text style={{fontSize: 16, fontWeight: fontSize === 'medium' ? 'bold' : 'normal', color: colors.textPrimary}}>A</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleFontSizeChange('large')}>
                  <Text style={{fontSize: 20, fontWeight: fontSize === 'large' ? 'bold' : 'normal', color: colors.textPrimary}}>A</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </List.Section>

        <Divider style={[styles.divider, { backgroundColor: colors.inputBorder }]} />

        {/* Account Management */}
        <List.Section style={[styles.settingSection, { backgroundColor: colors.surface }]}>
          <List.Subheader style={styles.sectionHeader}>
            <IconButton
              icon="account-cog-outline"
              size={24}
              iconColor={colors.primary}
              style={styles.sectionIcon}
            />
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>Account Management</Text>
          </List.Subheader>
          <List.Item
            title="Change Password"
            titleStyle={{ color: colors.textPrimary }}
            description="Update your account credentials"
            descriptionStyle={{ color: colors.textSecondary }}
            left={props => <List.Icon {...props} icon="lock-reset" color={colors.textPrimary} />}
            right={props => <List.Icon {...props} icon="chevron-right" color={colors.textSecondary} />}
            onPress={() => {
              Alert.alert("Feature Coming Soon", "Password changing will be available in a future update.");
            }}
          />
          <List.Item
            title="Edit Email Address"
            titleStyle={{ color: colors.textPrimary }}
            description="Modify your registered email"
            descriptionStyle={{ color: colors.textSecondary }}
            left={props => <List.Icon {...props} icon="email-edit" color={colors.textPrimary} />}
            right={props => <List.Icon {...props} icon="chevron-right" color={colors.textSecondary} />}
            onPress={() => {
              Alert.alert("Feature Coming Soon", "Email editing will be available in a future update.");
            }}
          />
          <List.Item
            title="Two-Factor Authentication"
            titleStyle={{ color: colors.textPrimary }}
            description="Add extra security to your account"
            descriptionStyle={{ color: colors.textSecondary }}
            left={props => <List.Icon {...props} icon="two-factor-authentication" color={colors.textPrimary} />}
            right={props => <Switch value={false} onValueChange={() => {
              Alert.alert("Feature Coming Soon", "Two-factor authentication will be available in a future update.");
            }} color={colors.primary} />}
          />
          <List.Item
            title="Delete Account"
            description="Permanently remove your account"
            left={props => <List.Icon {...props} icon="account-remove" color={colors.error} />}
            right={props => <List.Icon {...props} icon="chevron-right" color={colors.error} />}
            titleStyle={{color: colors.error}}
            descriptionStyle={{color: colors.error}}
            onPress={() => {
              Alert.alert(
                "Delete Account",
                "Are you sure you want to permanently delete your account? This action cannot be undone.",
                [
                  { text: "Cancel", style: "cancel" },
                  { 
                    text: "Delete", 
                    style: "destructive",
                    onPress: () => {
                      Alert.alert("Feature Coming Soon", "Account deletion will be available in a future update.");
                    }
                  }
                ]
              );
            }}
          />
        </List.Section>

        <Divider style={[styles.divider, { backgroundColor: colors.inputBorder }]} />

        {/* App Behavior */}
        <List.Section style={[styles.settingSection, { backgroundColor: colors.surface }]}>
          <List.Subheader style={styles.sectionHeader}>
            <IconButton
              icon="cellphone-cog"
              size={24}
              iconColor={colors.primary}
              style={styles.sectionIcon}
            />
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>App Behavior</Text>
          </List.Subheader>
          <List.Item
            title="Notifications"
            titleStyle={{ color: colors.textPrimary }}
            description="Manage task reminders and updates"
            descriptionStyle={{ color: colors.textSecondary }}
            left={props => <List.Icon {...props} icon="bell-outline" color={colors.textPrimary} />}
            right={props => <Switch value={notifications} onValueChange={handleNotificationsToggle} color={colors.primary} />}
          />
          <List.Item
            title="Default Sort Method"
            titleStyle={{ color: colors.textPrimary }}
            description="Choose how tasks are sorted"
            descriptionStyle={{ color: colors.textSecondary }}
            left={props => <List.Icon {...props} icon="sort" color={colors.textPrimary} />}
            right={props => <Text style={{ color: colors.textPrimary }}>Priority</Text>}
            onPress={() => {
              Alert.alert("Sort Options", "Select your default sort method", [
                { text: "Priority", onPress: () => saveSettings('sortMethod', 'priority') },
                { text: "Date", onPress: () => saveSettings('sortMethod', 'date') },
                { text: "Alphabetical", onPress: () => saveSettings('sortMethod', 'alpha') },
                { text: "Cancel", style: "cancel" }
              ]);
            }}
          />
          <List.Item
            title="Task View Mode"
            titleStyle={{ color: colors.textPrimary }}
            description="Toggle between list and grid views"
            descriptionStyle={{ color: colors.textSecondary }}
            left={props => <List.Icon {...props} icon="view-list" color={colors.textPrimary} />}
            right={props => <Text style={{ color: colors.textPrimary }}>List View</Text>}
            onPress={() => {
              Alert.alert("View Options", "Select your preferred view", [
                { text: "List View", onPress: () => saveSettings('viewMode', 'list') },
                { text: "Grid View", onPress: () => saveSettings('viewMode', 'grid') },
                { text: "Cancel", style: "cancel" }
              ]);
            }}
          />
        </List.Section>

        <Divider style={[styles.divider, { backgroundColor: colors.inputBorder }]} />

        {/* AI Settings */}
        <List.Section style={[styles.settingSection, { backgroundColor: colors.surface }]}>
          <List.Subheader style={styles.sectionHeader}>
            <IconButton
              icon="robot-outline"
              size={24}
              iconColor={colors.primary}
              style={styles.sectionIcon}
            />
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>AI Settings</Text>
          </List.Subheader>
          <List.Item
            title="AI Suggestions"
            titleStyle={{ color: colors.textPrimary }}
            description="Enable or disable AI-generated task suggestions"
            descriptionStyle={{ color: colors.textSecondary }}
            left={props => <List.Icon {...props} icon="lightbulb-outline" color={colors.textPrimary} />}
            right={props => <Switch value={aiSuggestions} onValueChange={handleAiSuggestionsToggle} color={colors.primary} />}
          />
          <List.Item
            title="Clear AI History"
            titleStyle={{ color: colors.textPrimary }}
            description="Remove stored AI chat history"
            descriptionStyle={{ color: colors.textSecondary }}
            left={props => <List.Icon {...props} icon="history" color={colors.textPrimary} />}
            right={props => <Button mode="text" onPress={handleClearAIHistory} textColor={colors.primary}>Clear</Button>}
          />
          <List.Item
            title="AI Priority Sorting"
            titleStyle={{ color: colors.textPrimary }}
            description="Control whether AI affects task order"
            descriptionStyle={{ color: colors.textSecondary }}
            left={props => <List.Icon {...props} icon="sort-numeric-variant" color={colors.textPrimary} />}
            right={props => <Switch value={false} onValueChange={() => {
              Alert.alert("Feature Coming Soon", "AI priority sorting will be available in a future update.");
            }} color={colors.primary} />}
          />
        </List.Section>

        <Divider style={[styles.divider, { backgroundColor: colors.inputBorder }]} />

        {/* Language & Region */}
        <List.Section style={[styles.settingSection, { backgroundColor: colors.surface }]}>
          <List.Subheader style={styles.sectionHeader}>
            <IconButton
              icon="translate"
              size={24}
              iconColor={colors.primary}
              style={styles.sectionIcon}
            />
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>Language & Region</Text>
          </List.Subheader>
          <List.Item
            title="Language"
            titleStyle={{ color: colors.textPrimary }}
            description="Choose your preferred language"
            descriptionStyle={{ color: colors.textSecondary }}
            left={props => <List.Icon {...props} icon="web" color={colors.textPrimary} />}
            right={props => <Text style={{ color: colors.textPrimary }}>English</Text>}
            onPress={() => {
              Alert.alert("Language Options", "Select your preferred language", [
                { text: "English", onPress: () => saveSettings('language', 'en') },
                { text: "Spanish", onPress: () => saveSettings('language', 'es') },
                { text: "French", onPress: () => saveSettings('language', 'fr') },
                { text: "Cancel", style: "cancel" }
              ]);
            }}
          />
          <List.Item
            title="Time Format"
            titleStyle={{ color: colors.textPrimary }}
            description="Set preferred time display (12h/24h)"
            descriptionStyle={{ color: colors.textSecondary }}
            left={props => <List.Icon {...props} icon="clock-outline" color={colors.textPrimary} />}
            right={props => <Switch value={hour24Format} onValueChange={handleTimeFormatToggle} color={colors.primary} />}
          />
        </List.Section>

        <Divider style={[styles.divider, { backgroundColor: colors.inputBorder }]} />

        {/* Developer / Experimental Options */}
        <List.Section style={[styles.settingSection, { backgroundColor: colors.surface }]}>
          <List.Subheader style={styles.sectionHeader}>
            <IconButton
              icon="code-tags"
              size={24}
              iconColor={colors.primary}
              style={styles.sectionIcon}
            />
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>Developer Options</Text>
          </List.Subheader>
          <List.Item
            title="Beta Features"
            titleStyle={{ color: colors.textPrimary }}
            description="Try out experimental features"
            descriptionStyle={{ color: colors.textSecondary }}
            left={props => <List.Icon {...props} icon="flask-outline" color={colors.textPrimary} />}
            right={props => <Switch value={betaFeatures} onValueChange={handleBetaFeaturesToggle} color={colors.primary} />}
          />
          <List.Item
            title="Reset App Data"
            titleStyle={{ color: colors.textPrimary }}
            description="Clear all local app data (debug only)"
            descriptionStyle={{ color: colors.textSecondary }}
            left={props => <List.Icon {...props} icon="database-refresh" color={colors.textPrimary} />}
            right={props => <Button mode="text" onPress={handleResetAppData} textColor={colors.error}>Reset</Button>}
          />
        </List.Section>

        <Divider style={[styles.divider, { backgroundColor: colors.inputBorder }]} />

        {/* Legal and Information */}
        <List.Section style={[styles.settingSection, { backgroundColor: colors.surface }]}>
          <List.Subheader style={styles.sectionHeader}>
            <IconButton
              icon="information-outline"
              size={24}
              iconColor={colors.primary}
              style={styles.sectionIcon}
            />
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>Legal & Information</Text>
          </List.Subheader>
          <List.Item
            title="Privacy Policy"
            titleStyle={{ color: colors.textPrimary }}
            description="View the app's privacy policy"
            descriptionStyle={{ color: colors.textSecondary }}
            left={props => <List.Icon {...props} icon="shield-account" color={colors.textPrimary} />}
            right={props => <List.Icon {...props} icon="chevron-right" color={colors.textSecondary} />}
            onPress={() => {
              Alert.alert("Privacy Policy", "Our app respects your privacy and ensures your data is secured. The full privacy policy will be available in a future update.");
            }}
          />
          <List.Item
            title="Terms of Service"
            titleStyle={{ color: colors.textPrimary }}
            description="Review the terms of use"
            descriptionStyle={{ color: colors.textSecondary }}
            left={props => <List.Icon {...props} icon="file-document-outline" color={colors.textPrimary} />}
            right={props => <List.Icon {...props} icon="chevron-right" color={colors.textSecondary} />}
            onPress={() => {
              Alert.alert("Terms of Service", "By using this app, you agree to abide by our terms and conditions. The full terms will be available in a future update.");
            }}
          />
          <List.Item
            title="Contact Support"
            titleStyle={{ color: colors.textPrimary }}
            description="Report issues or provide feedback"
            descriptionStyle={{ color: colors.textSecondary }}
            left={props => <List.Icon {...props} icon="help-circle-outline" color={colors.textPrimary} />}
            right={props => <List.Icon {...props} icon="chevron-right" color={colors.textSecondary} />}
            onPress={() => {
              Alert.alert("Contact Support", "For support, please contact us at support@mytodolist.com");
            }}
          />
          <List.Item
            title="App Version"
            titleStyle={{ color: colors.textPrimary }}
            description="v1.0.0 (Build 2023.09.01)"
            descriptionStyle={{ color: colors.textSecondary }}
            left={props => <List.Icon {...props} icon="cellphone-information" color={colors.textPrimary} />}
          />
        </List.Section>

        <View style={styles.footer}>
          <Button 
            mode="outlined" 
            icon="logout" 
            onPress={handleLogout}
            style={[styles.logoutButton, { borderColor: colors.error }]}
            textColor={colors.error}
          >
            Logout
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: 40,
    paddingBottom: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backButton: {
    margin: 0,
    padding: 8,
    marginRight: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  profileCard: {
    margin: 16,
    marginTop: -20,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileEmail: {
    fontSize: 14,
  },
  settingSection: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 1,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 0,
  },
  sectionIcon: {
    margin: 0,
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 4,
    marginHorizontal: 16,
  },
  colorCirclesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginHorizontal: 4,
    borderWidth: 1,
  },
  fontSizeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 120,
    justifyContent: 'space-between',
  },
  fontSizeSlider: {
    flex: 1,
    height: 20,
    marginHorizontal: 8,
    justifyContent: 'center',
  },
  fontSizeTrack: {
    height: 4,
    borderRadius: 2,
  },
  fontSizeThumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    position: 'absolute',
    top: -6,
    left: '50%',
    marginLeft: -8,
  },
  footer: {
    alignItems: 'center',
    padding: 16,
    marginTop: 16,
  },
  logoutButton: {
    width: '100%',
    borderWidth: 1,
  },
});

export default SettingsScreen; 