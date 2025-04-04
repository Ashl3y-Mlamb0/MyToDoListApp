import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';

interface TodoItemProps {
  title: string;
  description?: string;
}

const TodoItem = ({ title, description }: TodoItemProps) => {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{title}</Title>
        {description && <Paragraph>{description}</Paragraph>}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    width: '100%',
  },
});

export default TodoItem; 