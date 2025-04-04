import AsyncStorage from '@react-native-async-storage/async-storage';

// Define Todo type
export interface Todo {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  createdAt: string; // ISO string
  priority: string;  // 'high', 'medium', 'low'
}

// Storage keys
const TODOS_STORAGE_KEY = '@MyTodoList:todos';

// Get all todos
export const getTodos = async (): Promise<Todo[]> => {
  try {
    const todosJson = await AsyncStorage.getItem(TODOS_STORAGE_KEY);
    return todosJson ? JSON.parse(todosJson) : [];
  } catch (error) {
    console.error('Error getting todos from storage:', error);
    return [];
  }
};

// Save all todos
export const saveTodos = async (todos: Todo[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error('Error saving todos to storage:', error);
  }
};

// Add a new todo
export const addTodo = async (todo: Omit<Todo, 'id' | 'createdAt'>): Promise<Todo> => {
  const newTodo: Todo = {
    ...todo,
    id: Date.now().toString(), // Generate a unique ID
    createdAt: new Date().toISOString(),
    priority: todo.priority || 'medium', // Default to medium if not specified
  };

  try {
    const todos = await getTodos();
    const updatedTodos = [...todos, newTodo];
    await saveTodos(updatedTodos);
    return newTodo;
  } catch (error) {
    console.error('Error adding todo:', error);
    throw error;
  }
};

// Update a todo
export const updateTodo = async (updatedTodo: Todo): Promise<void> => {
  try {
    const todos = await getTodos();
    const index = todos.findIndex(todo => todo.id === updatedTodo.id);
    
    if (index !== -1) {
      // Preserve the original createdAt date
      const originalTodo = todos[index];
      updatedTodo.createdAt = originalTodo.createdAt;
      
      // Update the todo at the found index
      todos[index] = updatedTodo;
      
      // Save back to storage
      await saveTodos(todos);
    } else {
      throw new Error(`Todo with id ${updatedTodo.id} not found`);
    }
  } catch (error) {
    console.error('Error updating todo:', error);
    throw error;
  }
};

// Toggle todo completion status
export const toggleTodoStatus = async (todoId: string): Promise<void> => {
  try {
    const todos = await getTodos();
    const todoIndex = todos.findIndex(todo => todo.id === todoId);
    
    if (todoIndex !== -1) {
      // Toggle the isCompleted status
      todos[todoIndex].isCompleted = !todos[todoIndex].isCompleted;
      
      // Save back to storage
      await saveTodos(todos);
    } else {
      throw new Error(`Todo with id ${todoId} not found`);
    }
  } catch (error) {
    console.error('Error toggling todo status:', error);
    throw error;
  }
};

// Delete a todo
export const deleteTodo = async (todoId: string): Promise<void> => {
  try {
    const todos = await getTodos();
    const filteredTodos = todos.filter(todo => todo.id !== todoId);
    
    // Save back to storage
    await saveTodos(filteredTodos);
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
};

// Get a specific todo by ID
export const getTodoById = async (todoId: string): Promise<Todo | null> => {
  try {
    const todos = await getTodos();
    return todos.find(todo => todo.id === todoId) || null;
  } catch (error) {
    console.error('Error getting todo by id:', error);
    return null;
  }
}; 