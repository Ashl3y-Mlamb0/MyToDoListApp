import React, { createContext, useContext, useState } from 'react';
import { AIResponse } from '../services/supabase';
import { 
  getAISuggestions, 
  categorizeTask, 
  suggestPriority, 
  suggestDueDate 
} from '../services/deepseek';

// Interface for AI context
interface AIContextType {
  isEnabled: boolean;
  toggleAI: () => void;
  setAiEnabled: (enabled: boolean) => void;
  isLoading: boolean;
  lastSuggestion: AIResponse | null;
  getSuggestions: (prompt: string) => Promise<AIResponse>;
  getCategoryForTask: (title: string, description?: string) => Promise<string>;
  getPriorityForTask: (title: string, description?: string) => Promise<string>;
  getDueDateForTask: (title: string, description?: string) => Promise<string>;
}

// Create context with default values
const AIContext = createContext<AIContextType>({
  isEnabled: true,
  toggleAI: () => {},
  setAiEnabled: () => {},
  isLoading: false,
  lastSuggestion: null,
  getSuggestions: async () => ({ id: '', content: '', timestamp: 0 }),
  getCategoryForTask: async () => 'General',
  getPriorityForTask: async () => 'low',
  getDueDateForTask: async () => '',
});

// Custom hook to use the AI context
export const useAI = () => useContext(AIContext);

// Provider component
export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isEnabled, setIsEnabled] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastSuggestion, setLastSuggestion] = useState<AIResponse | null>(null);

  // Toggle AI features on/off
  const toggleAI = () => {
    setIsEnabled(prev => !prev);
  };

  // Directly set AI enabled state
  const setAiEnabled = (enabled: boolean) => {
    setIsEnabled(enabled);
  };

  // Get AI suggestions based on prompt
  const getSuggestions = async (prompt: string): Promise<AIResponse> => {
    if (!isEnabled) {
      return { id: '', content: 'AI suggestions are currently disabled.', timestamp: Date.now() };
    }

    setIsLoading(true);
    try {
      const response = await getAISuggestions(prompt);
      setLastSuggestion(response);
      return response;
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      const errorResponse = { 
        id: `error_${Date.now()}`, 
        content: 'Failed to get AI suggestions. Please try again later.', 
        timestamp: Date.now() 
      };
      setLastSuggestion(errorResponse);
      return errorResponse;
    } finally {
      setIsLoading(false);
    }
  };

  // Get category suggestion for a task
  const getCategoryForTask = async (title: string, description?: string): Promise<string> => {
    if (!isEnabled) {
      return 'General';
    }

    try {
      return await categorizeTask(title, description);
    } catch (error) {
      console.error('Error getting category suggestion:', error);
      return 'General';
    }
  };

  // Get priority suggestion for a task
  const getPriorityForTask = async (title: string, description?: string): Promise<string> => {
    if (!isEnabled) {
      return 'medium';
    }

    try {
      return await suggestPriority(title, description);
    } catch (error) {
      console.error('Error getting priority suggestion:', error);
      return 'medium';
    }
  };

  // Get due date suggestion for a task
  const getDueDateForTask = async (title: string, description?: string): Promise<string> => {
    if (!isEnabled) {
      // Default to 3 days from now
      const threeDays = new Date();
      threeDays.setDate(threeDays.getDate() + 3);
      return threeDays.toISOString().split('T')[0];
    }

    try {
      return await suggestDueDate(title, description);
    } catch (error) {
      console.error('Error getting due date suggestion:', error);
      // Default to 3 days from now on error
      const threeDays = new Date();
      threeDays.setDate(threeDays.getDate() + 3);
      return threeDays.toISOString().split('T')[0];
    }
  };

  return (
    <AIContext.Provider
      value={{
        isEnabled,
        toggleAI,
        setAiEnabled,
        isLoading,
        lastSuggestion,
        getSuggestions,
        getCategoryForTask,
        getPriorityForTask,
        getDueDateForTask
      }}
    >
      {children}
    </AIContext.Provider>
  );
};

// Add a default export to satisfy expo-router's expectations
export default {}; 