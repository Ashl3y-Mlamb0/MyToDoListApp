import React, { useState } from 'react';
import { View, StyleSheet, ToastAndroid, Platform, Alert, SafeAreaView, StatusBar, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Text, TextInput, Button, HelperText, IconButton, useTheme } from 'react-native-paper';
import * as expoRouter from 'expo-router';
import { addTodo } from '../services/storage';

// Custom theme colors
const customColors = {
  primary: '#4A8FE7', // Main blue
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
};

// Create a router instance that we can type-cast when needed
const router = expoRouter.router;

const AddTodoScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [titleError, setTitleError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [priority, setPriority] = useState('medium'); // 'high', 'medium', 'low'
  const theme = useTheme();

  const validateForm = (): boolean => {
    if (!title.trim()) {
      setTitleError('Title is required');
      return false;
    }
    setTitleError('');
    return true;
  };

  const handleGoBack = () => {
    (router as any).back();
  };

  const showToast = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('Success', message);
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await addTodo({
        title: title.trim(),
        description: description.trim(),
        isCompleted: false,
      });

      showToast('Todo added successfully');
      
      // Clear fields
      setTitle('');
      setDescription('');
      
      // Return to the previous screen
      handleGoBack();
    } catch (error) {
      console.error('Error saving todo:', error);
      showToast('Error adding todo');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to get color based on priority
  const getPriorityColor = (selectedPriority: string): string => {
    switch(selectedPriority) {
      case 'high':
        return customColors.priorityHigh;
      case 'medium':
        return customColors.priorityMedium;
      case 'low':
        return customColors.priorityLow;
      default:
        return customColors.priorityMedium;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: customColors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={customColors.background} />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <IconButton
              icon="arrow-left"
              size={24}
              iconColor={customColors.textPrimary}
              onPress={handleGoBack}
              style={styles.backButton}
            />
            <Text style={styles.headerTitle}>New Task</Text>
          </View>

          <View style={styles.form}>
            {/* Title Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                value={title}
                onChangeText={(text) => {
                  setTitle(text);
                  if (text.trim()) setTitleError('');
                }}
                mode="outlined"
                outlineColor={customColors.inputBorder}
                activeOutlineColor={customColors.primary}
                style={[styles.input, { backgroundColor: customColors.inputBackground }]}
                error={!!titleError}
                placeholder="What do you need to do?"
                placeholderTextColor={customColors.disabled}
              />
              {!!titleError && (
                <HelperText type="error" visible={!!titleError}>
                  {titleError}
                </HelperText>
              )}
            </View>

            {/* Description Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                mode="outlined"
                outlineColor={customColors.inputBorder}
                activeOutlineColor={customColors.primary}
                style={[
                  styles.input, 
                  styles.textArea, 
                  { backgroundColor: customColors.inputBackground }
                ]}
                multiline
                numberOfLines={4}
                placeholder="Add details about your task..."
                placeholderTextColor={customColors.disabled}
              />
            </View>

            {/* Priority Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Priority</Text>
              <View style={styles.priorityContainer}>
                <TouchablePriority 
                  label="High" 
                  color={customColors.priorityHigh}
                  isSelected={priority === 'high'}
                  onPress={() => setPriority('high')}
                />
                <TouchablePriority 
                  label="Medium" 
                  color={customColors.priorityMedium}
                  isSelected={priority === 'medium'}
                  onPress={() => setPriority('medium')}
                />
                <TouchablePriority 
                  label="Low" 
                  color={customColors.priorityLow}
                  isSelected={priority === 'low'}
                  onPress={() => setPriority('low')}
                />
              </View>
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <Button 
                mode="outlined" 
                onPress={handleGoBack} 
                style={[styles.button, styles.cancelButton]}
                labelStyle={{ color: customColors.textPrimary }}
                contentStyle={styles.buttonContent}
              >
                Cancel
              </Button>
              <Button 
                mode="contained" 
                onPress={handleSave} 
                style={[
                  styles.button, 
                  styles.saveButton, 
                  { backgroundColor: customColors.primary }
                ]}
                labelStyle={{ color: '#FFFFFF' }}
                contentStyle={styles.buttonContent}
                disabled={isSubmitting || !title.trim()}
                loading={isSubmitting}
              >
                Save
              </Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Priority selection component
interface TouchablePriorityProps {
  label: string;
  color: string;
  isSelected: boolean;
  onPress: () => void;
}

const TouchablePriority = ({ label, color, isSelected, onPress }: TouchablePriorityProps) => (
  <Button
    mode={isSelected ? 'contained' : 'outlined'}
    onPress={onPress}
    style={[
      styles.priorityButton,
      isSelected && { backgroundColor: color }
    ]}
    labelStyle={{
      color: isSelected ? '#FFFFFF' : color,
      fontSize: 14,
    }}
    contentStyle={{ height: 36 }}
  >
    {label}
  </Button>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    margin: 0,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: customColors.textPrimary,
    marginLeft: 8,
  },
  form: {
    padding: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: customColors.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: customColors.inputBackground,
    fontSize: 16,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityButton: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
  },
  button: {
    width: '48%',
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  cancelButton: {
    borderColor: customColors.inputBorder,
  },
  saveButton: {
    elevation: 2,
  },
});

export default AddTodoScreen; 