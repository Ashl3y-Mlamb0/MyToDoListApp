import AsyncStorage from '@react-native-async-storage/async-storage';

// Define Todo type
export interface Todo {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  createdAt: string; // ISO string
  priority: string;  // 'high', 'medium', 'low'
  deadline?: string; // Optional deadline date in ISO format
}

// Storage keys
const TODOS_STORAGE_KEY = '@MyTodoList:todos';

// Get all todos
export const getTodos = async (): Promise<Todo[]> => {
  try {
    console.log('[STORAGE DEBUG] Attempting to retrieve todos from storage');
    const todosJson = await AsyncStorage.getItem(TODOS_STORAGE_KEY);
    if (!todosJson) {
      console.log('[STORAGE DEBUG] No todos found in storage, returning empty array');
      return [];
    }
    
    console.log('[STORAGE DEBUG] Raw JSON data retrieved:', todosJson.substring(0, 100) + '...');
    
    try {
      // Safely parse the JSON
      const parsedTodos = JSON.parse(todosJson);
      
      // Validate it's an array
      if (!Array.isArray(parsedTodos)) {
        console.error('[STORAGE DEBUG] Retrieved todos is not an array, resetting to empty array');
        return [];
      }
      
      // Make sure all todos have the required fields
      const validTodos = parsedTodos.filter((todo: any) => 
        todo && 
        typeof todo === 'object' && 
        typeof todo.id === 'string' && 
        typeof todo.isCompleted === 'boolean'
      );
      
      console.log(`[STORAGE DEBUG] Retrieved ${validTodos.length} valid todos, completed count: ${validTodos.filter((t: Todo) => t.isCompleted).length}`);
      
      if (validTodos.length !== parsedTodos.length) {
        console.warn(`[STORAGE DEBUG] Filtered out ${parsedTodos.length - validTodos.length} invalid todo items`);
      }
      
      return validTodos;
    } catch (parseError) {
      console.error('[STORAGE DEBUG] Error parsing todos JSON:', parseError);
      return [];
    }
  } catch (error) {
    console.error('[STORAGE DEBUG] Error getting todos from storage:', error);
    return [];
  }
};

// Save all todos
export const saveTodos = async (todos: Todo[]): Promise<void> => {
  try {
    const todosJson = JSON.stringify(todos);
    console.log(`[STORAGE DEBUG] Saving ${todos.length} todos, completed count: ${todos.filter((t: Todo) => t.isCompleted).length}`);
    
    // Force flush any pending AsyncStorage operations
    await AsyncStorage.flushGetRequests();
    
    // Clear and set the new value
    await AsyncStorage.removeItem(TODOS_STORAGE_KEY);
    await AsyncStorage.setItem(TODOS_STORAGE_KEY, todosJson);
    
    // Verify data was saved correctly by reading it back
    const savedJson = await AsyncStorage.getItem(TODOS_STORAGE_KEY);
    if (savedJson) {
      const parsedTodos = JSON.parse(savedJson);
      console.log(`[STORAGE DEBUG] Verification: saved ${parsedTodos.length} todos, completed count: ${parsedTodos.filter((t: Todo) => t.isCompleted).length}`);
      
      if (savedJson !== todosJson) {
        console.error('[STORAGE DEBUG] Storage verification failed: data mismatch');
        // Try one more time with a delay
        setTimeout(async () => {
          await AsyncStorage.setItem(TODOS_STORAGE_KEY, todosJson);
        }, 100);
      }
    } else {
      console.error('[STORAGE DEBUG] Storage verification failed: no data retrieved');
    }
  } catch (error) {
    console.error('[STORAGE DEBUG] Error saving todos to storage:', error);
    throw error; // Propagate the error
  }
};

// Add a new todo
export const addTodo = async (todo: Omit<Todo, 'id' | 'createdAt'>): Promise<Todo> => {
  try {
    const todos = await getTodos();
    
    const newTodo: Todo = {
      id: Date.now().toString(), // simple ID generation
      createdAt: new Date().toISOString(),
      ...todo
    };
    
    // Add the new todo to the array
    todos.push(newTodo);
    
    // Save back to storage
    await saveTodos(todos);
    
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
      
      // Verify the todo was actually updated
      const refreshedTodos = await getTodos();
      const refreshedTodo = refreshedTodos.find(todo => todo.id === updatedTodo.id);
      
      if (!refreshedTodo || refreshedTodo.isCompleted !== updatedTodo.isCompleted) {
        console.warn('Todo update verification failed, trying again');
        await saveTodos(todos); // Try again
      }
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
    console.log(`[STORAGE DEBUG] Toggling completion status for todo ID: ${todoId}`);
    
    // Get the latest todos directly from storage
    const todos = await getTodos();
    const todoIndex = todos.findIndex(todo => todo.id === todoId);
    
    if (todoIndex !== -1) {
      // Log the current state
      console.log(`[STORAGE DEBUG] Found todo at index ${todoIndex}, current completion status: ${todos[todoIndex].isCompleted}`);
      
      // Toggle the isCompleted status
      todos[todoIndex].isCompleted = !todos[todoIndex].isCompleted;
      console.log(`[STORAGE DEBUG] Changed completion status to: ${todos[todoIndex].isCompleted}`);
      
      // Save back to storage using direct AsyncStorage calls to ensure persistence
      console.log('[STORAGE DEBUG] Saving updated todos directly');
      const todosJson = JSON.stringify(todos);
      
      // Try multiple times if needed
      let saved = false;
      let attempts = 0;
      const maxAttempts = 3;
      
      while (!saved && attempts < maxAttempts) {
        attempts++;
        try {
          await AsyncStorage.setItem(TODOS_STORAGE_KEY, todosJson);
          
          // Verify the save
          const checkJson = await AsyncStorage.getItem(TODOS_STORAGE_KEY);
          if (checkJson === todosJson) {
            saved = true;
            console.log(`[STORAGE DEBUG] Successfully saved todos on attempt ${attempts}`);
          } else {
            console.warn(`[STORAGE DEBUG] Save verification failed on attempt ${attempts}`);
            // Wait a bit before trying again
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        } catch (saveError) {
          console.error(`[STORAGE DEBUG] Error saving on attempt ${attempts}:`, saveError);
          // Wait a bit before trying again
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      if (!saved) {
        console.error('[STORAGE DEBUG] All save attempts failed, throwing error');
        throw new Error('Failed to save todo status after multiple attempts');
      }
    } else {
      console.error(`[STORAGE DEBUG] Todo with id ${todoId} not found`);
      throw new Error(`Todo with id ${todoId} not found`);
    }
  } catch (error) {
    console.error('[STORAGE DEBUG] Error toggling todo status:', error);
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

// Add a default export to satisfy expo-router's expectations
// even though this is just a utility file, not a route component
export default {}; 