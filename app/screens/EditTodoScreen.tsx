import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ToastAndroid, Platform, Alert, SafeAreaView, StatusBar, KeyboardAvoidingView, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Text, TextInput, Button, HelperText, IconButton, useTheme, Surface, Divider } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { getTodoById, updateTodo } from '../services/storage';

// Custom theme colors
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

const EditTodoScreen = () => {
  const params = useLocalSearchParams();
  const [todoId, setTodoId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [titleError, setTitleError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [priority, setPriority] = useState('medium'); // 'high', 'medium', 'low'
  const [isCompleted, setIsCompleted] = useState(false);
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(true);
  // Custom alert state
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const theme = useTheme();

  // Custom alert function
  const showCustomAlert = (message: string) => {
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const hideCustomAlert = () => {
    setAlertVisible(false);
  };

  // Extract todoId from URL params
  useEffect(() => {
    try {
      // Get ID from useLocalSearchParams
      const id = params.id as string;
      
      // If we have a valid ID, use it
      if (id) {
        setTodoId(id);
        loadTodo(id);
      } else {
        // No ID provided, go back
        showToast('No task ID provided');
        handleGoBack();
      }
    } catch (error) {
      console.error('Error parsing URL params:', error);
      showToast('Error loading task');
      handleGoBack();
    }
    // Only run once on mount, not when params changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadTodo = async (id: string) => {
    setLoading(true);
    try {
      const todo = await getTodoById(id);
      if (todo) {
        setTitle(todo.title);
        setDescription(todo.description || '');
        setPriority(todo.priority || 'medium');
        setIsCompleted(todo.isCompleted);
        if (todo.deadline) {
          setDeadline(new Date(todo.deadline));
        }
      } else {
        showToast('Todo not found');
        handleGoBack();
      }
    } catch (error) {
      console.error('Error loading todo:', error);
      showToast('Error loading todo');
      handleGoBack();
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    let isValid = true;
    
    if (!title.trim()) {
      setTitleError('Title is required');
      showCustomAlert('Task title cannot be empty');
      isValid = false;
    } else {
      setTitleError('');
    }

    if (!description.trim()) {
      setDescriptionError('Description is required');
      if (isValid) { // Only show this alert if title is valid
        showCustomAlert('Task description cannot be empty');
      }
      isValid = false;
    } else {
      setDescriptionError('');
    }
    
    return isValid;
  };

  const handleGoBack = () => {
    router.back();
  };

  const showToast = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      showCustomAlert(message);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDeadline(selectedDate);
    }
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const clearDeadline = () => {
    setDeadline(null);
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return 'No deadline set';
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleSave = async () => {
    if (!validateForm() || !todoId) {
      return;
    }

    setIsSubmitting(true);
    try {
      await updateTodo({
        id: todoId,
        title: title.trim(),
        description: description.trim(),
        isCompleted,
        createdAt: new Date().toISOString(), // This will be overwritten by the existing one
        priority,
        deadline: deadline ? deadline.toISOString() : undefined,
      });

      showToast('Todo updated successfully');
      
      // Return to the previous screen
      handleGoBack();
    } catch (error) {
      console.error('Error updating todo:', error);
      showToast('Error updating todo');
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

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={customColors.primary} />
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
            <Text style={styles.headerTitle}>Edit Task</Text>
          </View>
        </LinearGradient>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading task details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={customColors.primary} />
      
      {/* Custom Alert Modal */}
      <Modal
        transparent={true}
        visible={alertVisible}
        animationType="fade"
        onRequestClose={hideCustomAlert}
      >
        <View style={styles.modalOverlay}>
          <Surface style={styles.alertContainer}>
            <LinearGradient
              colors={[customColors.gradientStart, customColors.gradientEnd]}
              style={styles.alertHeader}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.alertTitle}>
                {alertMessage.includes('empty') ? 'Required Field' : 'Success'}
              </Text>
            </LinearGradient>
            <View style={styles.alertContent}>
              <Text style={styles.alertMessage}>{alertMessage}</Text>
              <Button 
                mode="contained" 
                onPress={hideCustomAlert} 
                style={[styles.alertButton, { backgroundColor: customColors.primary }]}
                labelStyle={{ color: '#FFFFFF' }}
              >
                OK
              </Button>
            </View>
          </Surface>
        </View>
      </Modal>
      
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
          <Text style={styles.headerTitle}>Edit Task</Text>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.keyboardAvoid}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Surface style={styles.formContainer}>
            {/* Title Input */}
            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <IconButton
                  icon="format-title"
                  size={20}
                  iconColor={customColors.primary}
                  style={styles.inputIcon}
                />
                <Text style={styles.label}>Task Title</Text>
              </View>
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
              <View style={styles.labelContainer}>
                <IconButton
                  icon="text-box-outline"
                  size={20}
                  iconColor={customColors.primary}
                  style={styles.inputIcon}
                />
                <Text style={styles.label}>Description</Text>
              </View>
              <TextInput
                value={description}
                onChangeText={(text) => {
                  setDescription(text);
                  if (text.trim()) setDescriptionError('');
                }}
                mode="outlined"
                outlineColor={customColors.inputBorder}
                activeOutlineColor={customColors.primary}
                style={[
                  styles.input, 
                  styles.textArea, 
                  { backgroundColor: customColors.inputBackground }
                ]}
                error={!!descriptionError}
                multiline
                numberOfLines={4}
                placeholder="Add details about your task..."
                placeholderTextColor={customColors.disabled}
              />
              {!!descriptionError && (
                <HelperText type="error" visible={!!descriptionError}>
                  {descriptionError}
                </HelperText>
              )}
            </View>

            <Divider style={styles.divider} />

            {/* Deadline Date Picker */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <View style={styles.labelContainer}>
                  <IconButton
                    icon="calendar-clock"
                    size={20}
                    iconColor={customColors.primary}
                    style={styles.inputIcon}
                  />
                  <Text style={styles.label}>Deadline</Text>
                </View>
                {deadline && (
                  <Button 
                    mode="text" 
                    onPress={clearDeadline}
                    compact
                    icon="close-circle-outline"
                    style={styles.clearButton}
                    labelStyle={{ color: customColors.textSecondary, fontSize: 12 }}
                  >
                    Clear
                  </Button>
                )}
              </View>
              <TouchableOpacity 
                onPress={showDatepicker}
                style={styles.datePickerButton}
              >
                <Text style={[
                  styles.dateText, 
                  !deadline && styles.dateTextPlaceholder
                ]}>
                  {formatDate(deadline)}
                </Text>
                <IconButton
                  icon="calendar"
                  size={24}
                  iconColor={customColors.primary}
                  style={styles.calendarIcon}
                />
              </TouchableOpacity>
              {showDatePicker && (Platform.OS === 'android' ? (
                <DateTimePicker
                  value={deadline || new Date()}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                  minimumDate={new Date()}
                />
              ) : (
                <DateTimePicker
                  value={deadline || new Date()}
                  mode="date"
                  display="spinner"
                  onChange={onDateChange}
                  minimumDate={new Date()}
                />
              ))}
            </View>

            {/* Completion Status */}
            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <IconButton
                  icon="checkbox-marked-circle-outline"
                  size={20}
                  iconColor={customColors.primary}
                  style={styles.inputIcon}
                />
                <Text style={styles.label}>Status</Text>
              </View>
              <View style={styles.statusContainer}>
                <Button
                  mode={isCompleted ? 'contained' : 'outlined'}
                  onPress={() => setIsCompleted(true)}
                  icon={isCompleted ? "check-circle" : "check-circle-outline"}
                  style={[
                    styles.statusButton,
                    isCompleted && { backgroundColor: customColors.primary }
                  ]}
                  labelStyle={{
                    color: isCompleted ? '#FFFFFF' : customColors.primary,
                    fontSize: 14,
                  }}
                >
                  Completed
                </Button>
                <Button
                  mode={!isCompleted ? 'contained' : 'outlined'}
                  onPress={() => setIsCompleted(false)}
                  icon={!isCompleted ? "circle-outline" : "circle-outline"}
                  style={[
                    styles.statusButton,
                    !isCompleted && { backgroundColor: customColors.primary }
                  ]}
                  labelStyle={{
                    color: !isCompleted ? '#FFFFFF' : customColors.primary,
                    fontSize: 14,
                  }}
                >
                  Active
                </Button>
              </View>
            </View>

            {/* Priority Selection */}
            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <IconButton
                  icon="flag-outline"
                  size={20}
                  iconColor={customColors.primary}
                  style={styles.inputIcon}
                />
                <Text style={styles.label}>Priority Level</Text>
              </View>
              <View style={styles.priorityContainer}>
                <TouchablePriority 
                  label="High" 
                  icon="flag"
                  color={customColors.priorityHigh}
                  isSelected={priority === 'high'}
                  onPress={() => setPriority('high')}
                />
                <TouchablePriority 
                  label="Medium" 
                  icon="flag"
                  color={customColors.priorityMedium}
                  isSelected={priority === 'medium'}
                  onPress={() => setPriority('medium')}
                />
                <TouchablePriority 
                  label="Low" 
                  icon="flag"
                  color={customColors.priorityLow}
                  isSelected={priority === 'low'}
                  onPress={() => setPriority('low')}
                />
              </View>
            </View>

            <Divider style={styles.divider} />

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <Button 
                mode="outlined" 
                onPress={handleGoBack} 
                style={[styles.button, styles.cancelButton]}
                labelStyle={{ color: customColors.textPrimary }}
                contentStyle={styles.buttonContent}
                icon="close"
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
                icon="content-save"
                labelStyle={{ color: '#FFFFFF' }}
                contentStyle={styles.buttonContent}
                disabled={isSubmitting}
                loading={isSubmitting}
              >
                Save Task
              </Button>
            </View>
          </Surface>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Priority selection component
interface TouchablePriorityProps {
  label: string;
  icon?: string;
  color: string;
  isSelected: boolean;
  onPress: () => void;
}

const TouchablePriority = ({ label, icon, color, isSelected, onPress }: TouchablePriorityProps) => (
  <Button
    mode={isSelected ? 'contained' : 'outlined'}
    onPress={onPress}
    icon={icon}
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
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    fontSize: 16,
    color: customColors.textPrimary,
    marginTop: 12,
  },
  formContainer: {
    marginHorizontal: 16,
    marginTop: -16,
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  inputGroup: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  inputIcon: {
    margin: 0,
    padding: 0,
    backgroundColor: 'transparent',
    marginRight: -6,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: customColors.textPrimary,
  },
  input: {
    backgroundColor: customColors.inputBackground,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusButton: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 8,
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
    marginTop: 28,
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
    elevation: 4,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  clearButton: {
    marginTop: -4,
    marginRight: -8,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: customColors.inputBorder,
    borderRadius: 4,
    height: 56,
    paddingHorizontal: 12,
    backgroundColor: customColors.inputBackground,
  },
  dateText: {
    fontSize: 16,
    color: customColors.textPrimary,
  },
  dateTextPlaceholder: {
    color: customColors.disabled,
  },
  calendarIcon: {
    margin: 0,
  },
  divider: {
    height: 1,
    backgroundColor: customColors.inputBorder,
    marginVertical: 16,
    marginHorizontal: 8,
  },
  // Custom Alert Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  alertContainer: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
  },
  alertHeader: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  alertContent: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  alertMessage: {
    fontSize: 16,
    color: customColors.textPrimary,
    marginBottom: 20,
    textAlign: 'center',
  },
  alertButton: {
    minWidth: 100,
    borderRadius: 8,
    elevation: 2,
  },
});

export default EditTodoScreen; 