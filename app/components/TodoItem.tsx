import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, IconButton, useTheme } from 'react-native-paper';
import { Todo } from '../services/storage';

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoItem = ({ todo, onToggleComplete, onDelete }: TodoItemProps) => {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <Card style={styles.card}>
      <TouchableOpacity onPress={toggleExpanded}>
        <Card.Content style={styles.headerContainer}>
          <View style={styles.titleContainer}>
            <Title style={[
              styles.title,
              todo.isCompleted && styles.completedTitle
            ]}>
              {todo.title}
            </Title>
            <IconButton
              icon={expanded ? 'chevron-up' : 'chevron-down'}
              size={24}
              onPress={toggleExpanded}
            />
          </View>
        </Card.Content>
      </TouchableOpacity>

      {expanded && (
        <View>
          {todo.description && (
            <Card.Content>
              <Paragraph style={[
                styles.description,
                todo.isCompleted && styles.completedDescription
              ]}>
                {todo.description}
              </Paragraph>
            </Card.Content>
          )}
          
          <Card.Actions style={styles.actions}>
            <IconButton
              icon={todo.isCompleted ? 'check-circle' : 'check-circle-outline'}
              iconColor={todo.isCompleted ? theme.colors.primary : theme.colors.onSurfaceVariant}
              size={24}
              onPress={() => onToggleComplete(todo.id)}
            />
            <IconButton
              icon="delete"
              iconColor={theme.colors.error}
              size={24}
              onPress={() => onDelete(todo.id)}
            />
          </Card.Actions>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    elevation: 2,
  },
  headerContainer: {
    paddingVertical: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    flex: 1,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  description: {
    marginTop: 8,
  },
  completedDescription: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  actions: {
    justifyContent: 'flex-end',
    paddingHorizontal: 8,
  },
});

export default TodoItem; 