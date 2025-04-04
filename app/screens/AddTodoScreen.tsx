import React, { useState } from 'react';
import { View, StyleSheet, ToastAndroid, Platform, Alert } from 'react-native';
import { Appbar, TextInput, Button, HelperText } from 'react-native-paper';
import * as expoRouter from 'expo-router';
import { addTodo } from '../services/storage';

// Create a router instance that we can type-cast when needed
const router = expoRouter.router;

const AddTodoScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [titleError, setTitleError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={handleGoBack} />
        <Appbar.Content title="Add New Todo" />
      </Appbar.Header>

      <View style={styles.form}>
        <TextInput
          label="Title"
          value={title}
          onChangeText={(text) => {
            setTitle(text);
            if (text.trim()) setTitleError('');
          }}
          mode="outlined"
          style={styles.input}
          error={!!titleError}
        />
        {!!titleError && (
          <HelperText type="error" visible={!!titleError}>
            {titleError}
          </HelperText>
        )}

        <TextInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          multiline
          numberOfLines={4}
          style={styles.input}
        />

        <View style={styles.buttonContainer}>
          <Button 
            mode="outlined" 
            onPress={handleGoBack} 
            style={styles.button}
          >
            Cancel
          </Button>
          <Button 
            mode="contained" 
            onPress={handleSave} 
            style={styles.button}
            disabled={isSubmitting || !title.trim()}
            loading={isSubmitting}
          >
            Save
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  input: {
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    width: '48%',
  },
});

export default AddTodoScreen; 