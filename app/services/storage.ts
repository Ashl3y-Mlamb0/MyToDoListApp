import AsyncStorage from '@react-native-async-storage/async-storage';

// Define Todo type
export interface Todo {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  createdAt: string; // ISO string
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
    const updatedTodos = todos.map(todo => 
      todo.id === updatedTodo.id ? updatedTodo : todo
    );
    await saveTodos(updatedTodos);
  } catch (error) {
    console.error('Error updating todo:', error);
    throw error;
  }
};

// Delete a todo
export const deleteTodo = async (todoId: string): Promise<void> => {
  try {
    const todos = await getTodos();
    const filteredTodos = todos.filter(todo => todo.id !== todoId);
    await saveTodos(filteredTodos);
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
};

// Toggle todo completion status
export const toggleTodoCompletion = async (todoId: string): Promise<void> => {
  try {
    const todos = await getTodos();
    const updatedTodos = todos.map(todo => 
      todo.id === todoId ? { ...todo, isCompleted: !todo.isCompleted } : todo
    );
    await saveTodos(updatedTodos);
  } catch (error) {
    console.error('Error toggling todo completion:', error);
    throw error;
  }
}; 