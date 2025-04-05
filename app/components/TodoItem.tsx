import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { Card, Title, Paragraph, IconButton, useTheme, Surface, Text } from 'react-native-paper';
import { Todo, toggleTodoStatus, deleteTodo } from '../services/storage';
import { router } from 'expo-router';

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
  success: '#4CAF50', // Green for success/complete
};

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

// Function to determine priority color based on priority value
const getPriorityColor = (priority: string): string => {
  switch(priority.toLowerCase()) {
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

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggleComplete, onDelete }: TodoItemProps) => {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const handleToggleStatus = async () => {
    try {
      await toggleTodoStatus(todo.id);
      onToggleComplete(todo.id);
    } catch (error) {
      console.error('Error toggling todo status:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTodo(todo.id);
      onDelete(todo.id);
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleEdit = () => {
    router.push(`/edit?id=${todo.id}` as any);
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Check if date is today
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    // Check if date is tomorrow
    else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }
    // Otherwise show date
    else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const isOverdue = (dateString?: string): boolean => {
    if (!dateString) return false;
    const deadlineDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to beginning of today
    return deadlineDate < today && !todo.isCompleted;
  };

  return (
    <Surface style={styles.surface}>
      <TouchableOpacity onPress={toggleExpanded} activeOpacity={0.7}>
        <View style={styles.todoItem}>
          {/* Priority Circle - no longer toggles completion */}
          <View 
            style={[
              styles.priorityCircle, 
              { 
                backgroundColor: todo.isCompleted 
                  ? customColors.disabled 
                  : getPriorityColor(todo.priority || 'medium')
              }
            ]}
          >
            {todo.isCompleted && (
              <IconButton 
                icon="check" 
                size={16} 
                iconColor="#FFFFFF"
                style={styles.checkIcon}
              />
            )}
          </View>
          
          {/* Content */}
          <View style={styles.content}>
            <Text 
              style={[
                styles.title,
                todo.isCompleted && styles.completedTitle
              ]}
              numberOfLines={expanded ? undefined : 1}
              ellipsizeMode="tail"
            >
              {todo.title}
            </Text>
            
            {/* Description only shown when expanded */}
            {todo.description && expanded && (
              <Text 
                style={[
                  styles.description,
                  todo.isCompleted && styles.completedDescription
                ]}
              >
                {todo.description}
              </Text>
            )}

            {todo.deadline && (
              <View style={styles.deadlineContainer}>
                <IconButton
                  icon="clock-outline"
                  size={14}
                  iconColor={isOverdue(todo.deadline) ? customColors.priorityHigh : customColors.textSecondary}
                  style={styles.deadlineIcon}
                />
                <Text 
                  style={[
                    styles.deadlineText,
                    isOverdue(todo.deadline) && styles.overdueText,
                    todo.isCompleted && styles.completedDescription
                  ]}
                >
                  {formatDate(todo.deadline)}
                  {isOverdue(todo.deadline) && ' (Overdue)'}
                </Text>
              </View>
            )}
            
            {expanded && (
              <View style={styles.actions}>
                {!todo.isCompleted && (
                  <IconButton
                    icon="check-circle"
                    size={20}
                    iconColor={customColors.success}
                    onPress={handleToggleStatus}
                    style={styles.completeButton}
                  />
                )}
                <IconButton
                  icon="pencil"
                  size={20}
                  iconColor={customColors.textSecondary}
                  onPress={handleEdit}
                  style={styles.editButton}
                />
                <IconButton
                  icon="delete"
                  iconColor={customColors.error}
                  size={20}
                  onPress={handleDelete}
                  style={styles.deleteButton}
                />
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Surface>
  );
};

const styles = StyleSheet.create({
  surface: {
    elevation: 1,
    borderRadius: 12,
    marginVertical: 6,
    backgroundColor: customColors.surface,
    overflow: 'hidden',
  },
  todoItem: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  priorityCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 16,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIcon: {
    margin: 0,
    padding: 0,
  },
  content: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: customColors.textPrimary,
    marginBottom: 4,
    flexShrink: 1,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: customColors.textSecondary,
  },
  description: {
    fontSize: 14,
    color: customColors.textSecondary,
    lineHeight: 20,
    flexShrink: 1,
  },
  completedDescription: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  editButton: {
    margin: 0,
  },
  deleteButton: {
    margin: 0,
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  deadlineIcon: {
    margin: 0,
    padding: 0,
    marginRight: -4,
  },
  deadlineText: {
    fontSize: 12,
    color: customColors.textSecondary,
  },
  overdueText: {
    color: customColors.priorityHigh,
    fontWeight: '500',
  },
  completeButton: {
    margin: 0,
  },
});

export default TodoItem; 