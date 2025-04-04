import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, StatusBar, SafeAreaView } from 'react-native';
import { Text, Divider, Switch, Button, List, Avatar, Surface, IconButton, useTheme } from 'react-native-paper';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

// Custom theme colors - match with the rest of the app
const customColors = {
  primary: '#4A8FE7', // Main blue
  primaryDark: '#3A7FD7', // Darker blue
  accent: '#5D9CEC', // Slightly lighter blue
  background: '#F5F7FA', // Light background
  surface: '#FFFFFF', // Card surface
  error: '#FF5252', // Error red
  priorityHigh: '#FF7676', // Red for high priority
  priorityMedium: '#FFBB54', // Orange for medium priority
  priorityLow: '#58C9B9', // Teal for low priority
  textPrimary: '#2C384A', // Dark text
  textSecondary: '#7D8FA9', // Lighter text
  disabled: '#BEC4CD', // Disabled state
  inputBackground: '#FFFFFF',
  inputBorder: '#E5E9F2',
  gradientStart: '#4A8FE7',
  gradientEnd: '#5D9CEC',
};

const SettingsScreen = () => {
  const theme = useTheme();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState(true);
  const [betaFeatures, setBetaFeatures] = useState(false);
  const [hour24Format, setHour24Format] = useState(false);

  const handleGoBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={customColors.primary} />
      
      {/* Header with gradient */}
      <LinearGradient
        colors={[customColors.gradientStart, customColors.gradientEnd]}
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
        <Surface style={styles.profileCard}>
          <View style={styles.profileContent}>
            <Avatar.Text 
              size={64} 
              label="AM" 
              style={{backgroundColor: customColors.primary}} 
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Ashley Mlambo</Text>
              <Text style={styles.profileEmail}>ashley.mlambo@example.com</Text>
            </View>
          </View>
          <Button 
            mode="contained" 
            icon="account-edit" 
            style={{backgroundColor: customColors.primary}}
            onPress={() => {}}>
            Edit Profile
          </Button>
        </Surface>

        {/* Theme & UI Preferences */}
        <List.Section style={styles.settingSection}>
          <List.Subheader style={styles.sectionHeader}>
            <IconButton
              icon="palette-outline"
              size={24}
              iconColor={customColors.primary}
              style={styles.sectionIcon}
            />
            <Text style={styles.sectionTitle}>Theme & UI Preferences</Text>
          </List.Subheader>
          <List.Item
            title="Dark Mode"
            description="Switch between light and dark themes"
            left={props => <List.Icon {...props} icon="theme-light-dark" />}
            right={props => <Switch value={darkMode} onValueChange={setDarkMode} color={customColors.primary} />}
          />
          <List.Item
            title="Accent Color"
            description="Personalize app highlight color"
            left={props => <List.Icon {...props} icon="palette" />}
            right={props => (
              <View style={styles.colorCirclesContainer}>
                <View style={[styles.colorCircle, {backgroundColor: '#4A8FE7'}]} />
                <View style={[styles.colorCircle, {backgroundColor: '#58C9B9'}]} />
                <View style={[styles.colorCircle, {backgroundColor: '#FFBB54'}]} />
              </View>
            )}
          />
          <List.Item
            title="Font Size"
            description="Adjust text size for better readability"
            left={props => <List.Icon {...props} icon="format-size" />}
            right={props => (
              <View style={styles.fontSizeContainer}>
                <Text style={{fontSize: 12}}>A</Text>
                <View style={styles.fontSizeSlider}>
                  <View style={styles.fontSizeTrack}>
                    <View style={styles.fontSizeThumb} />
                  </View>
                </View>
                <Text style={{fontSize: 18}}>A</Text>
              </View>
            )}
          />
        </List.Section>

        <Divider style={styles.divider} />

        {/* Account Management */}
        <List.Section style={styles.settingSection}>
          <List.Subheader style={styles.sectionHeader}>
            <IconButton
              icon="account-cog-outline"
              size={24}
              iconColor={customColors.primary}
              style={styles.sectionIcon}
            />
            <Text style={styles.sectionTitle}>Account Management</Text>
          </List.Subheader>
          <List.Item
            title="Change Password"
            description="Update your account credentials"
            left={props => <List.Icon {...props} icon="lock-reset" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
          <List.Item
            title="Edit Email Address"
            description="Modify your registered email"
            left={props => <List.Icon {...props} icon="email-edit" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
          <List.Item
            title="Two-Factor Authentication"
            description="Add extra security to your account"
            left={props => <List.Icon {...props} icon="two-factor-authentication" />}
            right={props => <Switch value={false} onValueChange={() => {}} color={customColors.primary} />}
          />
          <List.Item
            title="Delete Account"
            description="Permanently remove your account"
            left={props => <List.Icon {...props} icon="account-remove" color={customColors.error} />}
            right={props => <List.Icon {...props} icon="chevron-right" color={customColors.error} />}
            titleStyle={{color: customColors.error}}
            descriptionStyle={{color: customColors.error}}
            onPress={() => {}}
          />
        </List.Section>

        <Divider style={styles.divider} />

        {/* App Behavior */}
        <List.Section style={styles.settingSection}>
          <List.Subheader style={styles.sectionHeader}>
            <IconButton
              icon="cellphone-cog"
              size={24}
              iconColor={customColors.primary}
              style={styles.sectionIcon}
            />
            <Text style={styles.sectionTitle}>App Behavior</Text>
          </List.Subheader>
          <List.Item
            title="Notifications"
            description="Manage task reminders and updates"
            left={props => <List.Icon {...props} icon="bell-outline" />}
            right={props => <Switch value={notifications} onValueChange={setNotifications} color={customColors.primary} />}
          />
          <List.Item
            title="Default Sort Method"
            description="Choose how tasks are sorted"
            left={props => <List.Icon {...props} icon="sort" />}
            right={props => <Text>Priority</Text>}
            onPress={() => {}}
          />
          <List.Item
            title="Task View Mode"
            description="Toggle between list and grid views"
            left={props => <List.Icon {...props} icon="view-list" />}
            right={props => <Text>List View</Text>}
            onPress={() => {}}
          />
        </List.Section>

        <Divider style={styles.divider} />

        {/* AI Settings */}
        <List.Section style={styles.settingSection}>
          <List.Subheader style={styles.sectionHeader}>
            <IconButton
              icon="robot-outline"
              size={24}
              iconColor={customColors.primary}
              style={styles.sectionIcon}
            />
            <Text style={styles.sectionTitle}>AI Settings</Text>
          </List.Subheader>
          <List.Item
            title="AI Suggestions"
            description="Enable or disable AI-generated task suggestions"
            left={props => <List.Icon {...props} icon="lightbulb-outline" />}
            right={props => <Switch value={aiSuggestions} onValueChange={setAiSuggestions} color={customColors.primary} />}
          />
          <List.Item
            title="Clear AI History"
            description="Remove stored AI chat history"
            left={props => <List.Icon {...props} icon="history" />}
            right={props => <Button mode="text" onPress={() => {}}>Clear</Button>}
          />
          <List.Item
            title="AI Priority Sorting"
            description="Control whether AI affects task order"
            left={props => <List.Icon {...props} icon="sort-numeric" />}
            right={props => <Switch value={false} onValueChange={() => {}} color={customColors.primary} />}
          />
        </List.Section>

        <Divider style={styles.divider} />

        {/* Language & Region */}
        <List.Section style={styles.settingSection}>
          <List.Subheader style={styles.sectionHeader}>
            <IconButton
              icon="translate"
              size={24}
              iconColor={customColors.primary}
              style={styles.sectionIcon}
            />
            <Text style={styles.sectionTitle}>Language & Region</Text>
          </List.Subheader>
          <List.Item
            title="Language"
            description="Choose your preferred language"
            left={props => <List.Icon {...props} icon="web" />}
            right={props => <Text>English</Text>}
            onPress={() => {}}
          />
          <List.Item
            title="Time Format"
            description="Set preferred time display (12h/24h)"
            left={props => <List.Icon {...props} icon="clock-outline" />}
            right={props => <Switch value={hour24Format} onValueChange={setHour24Format} color={customColors.primary} />}
          />
        </List.Section>

        <Divider style={styles.divider} />

        {/* Developer / Experimental Options */}
        <List.Section style={styles.settingSection}>
          <List.Subheader style={styles.sectionHeader}>
            <IconButton
              icon="code-tags"
              size={24}
              iconColor={customColors.primary}
              style={styles.sectionIcon}
            />
            <Text style={styles.sectionTitle}>Developer Options</Text>
          </List.Subheader>
          <List.Item
            title="Beta Features"
            description="Try out experimental features"
            left={props => <List.Icon {...props} icon="flask-outline" />}
            right={props => <Switch value={betaFeatures} onValueChange={setBetaFeatures} color={customColors.primary} />}
          />
          <List.Item
            title="Reset App Data"
            description="Clear all local app data (debug only)"
            left={props => <List.Icon {...props} icon="database-refresh" />}
            right={props => <Button mode="text" onPress={() => {}} color={customColors.error}>Reset</Button>}
          />
        </List.Section>

        <Divider style={styles.divider} />

        {/* Legal and Information */}
        <List.Section style={styles.settingSection}>
          <List.Subheader style={styles.sectionHeader}>
            <IconButton
              icon="information-outline"
              size={24}
              iconColor={customColors.primary}
              style={styles.sectionIcon}
            />
            <Text style={styles.sectionTitle}>Legal & Information</Text>
          </List.Subheader>
          <List.Item
            title="Privacy Policy"
            description="View the app's privacy policy"
            left={props => <List.Icon {...props} icon="shield-account" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
          <List.Item
            title="Terms of Service"
            description="Review the terms of use"
            left={props => <List.Icon {...props} icon="file-document-outline" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
          <List.Item
            title="Contact Support"
            description="Report issues or provide feedback"
            left={props => <List.Icon {...props} icon="help-circle-outline" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
          <List.Item
            title="App Version"
            description="v1.0.0 (Build 2023.09.01)"
            left={props => <List.Icon {...props} icon="cellphone-information" />}
          />
        </List.Section>

        <View style={styles.footer}>
          <Button 
            mode="outlined" 
            icon="logout" 
            onPress={() => {}}
            style={styles.logoutButton}
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
    backgroundColor: customColors.background,
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
    color: customColors.textPrimary,
  },
  profileEmail: {
    color: customColors.textSecondary,
    fontSize: 14,
  },
  settingSection: {
    backgroundColor: customColors.surface,
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
    color: customColors.primary,
  },
  divider: {
    marginVertical: 4,
    marginHorizontal: 16,
    backgroundColor: customColors.inputBorder,
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
    borderColor: customColors.inputBorder,
  },
  fontSizeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 120,
  },
  fontSizeSlider: {
    flex: 1,
    height: 20,
    marginHorizontal: 8,
    justifyContent: 'center',
  },
  fontSizeTrack: {
    height: 4,
    backgroundColor: customColors.inputBorder,
    borderRadius: 2,
  },
  fontSizeThumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: customColors.primary,
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
    borderColor: customColors.error,
    borderWidth: 1,
  },
});

export default SettingsScreen; 