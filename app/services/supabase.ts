import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://uymsrpqpxudumkalhdnf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5bXNycHFweHVkdW1rYWxoZG5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3OTU3MjQsImV4cCI6MjA1OTM3MTcyNH0.3WLybWjBrpRkmF9H37wRUSzq_G50ZsqiuQJLLguDfWo';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Interface for AI suggestions
export interface AIResponse {
  id: string;
  content: string;
  timestamp: number;
}

/**
 * Get AI suggestions for task planning
 */
export const getAISuggestions = async (prompt: string): Promise<AIResponse> => {
  try {
    // In a production app, we would make a proper API call to an AI endpoint
    // Here we'll use a function that returns a simulated response
    const { data, error } = await supabase.functions.invoke('get-ai-suggestions', {
      body: { prompt },
    });

    if (error) {
      console.error('Error getting AI suggestions:', error);
      // Fallback to simulated response when Supabase function fails
      return simulateAIResponse(prompt);
    }

    return data;
  } catch (error) {
    console.error('Error invoking Supabase function:', error);
    // Fallback to simulated response
    return simulateAIResponse(prompt);
  }
};

/**
 * Get AI-based task categorization
 */
export const categorizeTask = async (taskTitle: string, taskDescription?: string): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('categorize-task', {
      body: { title: taskTitle, description: taskDescription },
    });

    if (error) {
      console.error('Error categorizing task:', error);
      // Fallback to simulated category when Supabase function fails
      return simulateTaskCategory(taskTitle);
    }

    return data.category;
  } catch (error) {
    console.error('Error invoking Supabase function:', error);
    // Fallback to simulated category
    return simulateTaskCategory(taskTitle);
  }
};

/**
 * Get AI-suggested priority for a task
 */
export const suggestPriority = async (taskTitle: string, taskDescription?: string): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('suggest-priority', {
      body: { title: taskTitle, description: taskDescription },
    });

    if (error) {
      console.error('Error suggesting priority:', error);
      // Fallback to simulated priority when Supabase function fails
      return simulatePrioritySuggestion(taskTitle);
    }

    return data.priority;
  } catch (error) {
    console.error('Error invoking Supabase function:', error);
    // Fallback to simulated priority
    return simulatePrioritySuggestion(taskTitle);
  }
};

/**
 * Get AI-suggested due date for a task
 */
export const suggestDueDate = async (taskTitle: string, taskDescription?: string): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('suggest-due-date', {
      body: { title: taskTitle, description: taskDescription },
    });

    if (error) {
      console.error('Error suggesting due date:', error);
      // Fallback to simulated due date when Supabase function fails
      return simulateDueDateSuggestion(taskTitle);
    }

    return data.dueDate;
  } catch (error) {
    console.error('Error invoking Supabase function:', error);
    // Fallback to simulated due date
    return simulateDueDateSuggestion(taskTitle);
  }
};

/**
 * Generate simulated AI response for development/fallback
 */
const simulateAIResponse = (prompt: string): AIResponse => {
  // Extract keywords from the prompt to make the response somewhat relevant
  const keywords = prompt.toLowerCase();
  let responseContent = '';

  if (keywords.includes('task') || keywords.includes('todo')) {
    responseContent = 'Here are some task management suggestions:\n\n' +
      '1. Break down large tasks into smaller, manageable steps\n' +
      '2. Set realistic deadlines for each task\n' +
      '3. Prioritize tasks based on urgency and importance\n' +
      '4. Schedule dedicated time blocks for focused work\n' +
      '5. Review your progress regularly and adjust as needed';
  } else if (keywords.includes('productiv') || keywords.includes('efficien')) {
    responseContent = 'To improve productivity:\n\n' +
      '1. Use the Pomodoro technique (25 min work, 5 min break)\n' +
      '2. Minimize distractions by silencing notifications\n' +
      '3. Batch similar tasks together to reduce context switching\n' +
      '4. Take short breaks to maintain energy and focus\n' +
      '5. End each day by planning the next day\'s priorities';
  } else if (keywords.includes('goal') || keywords.includes('achiev')) {
    responseContent = 'Goal-setting framework:\n\n' +
      '1. Set SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound)\n' +
      '2. Create a visual tracker to monitor your progress\n' +
      '3. Establish both short-term and long-term milestones\n' +
      '4. Find an accountability partner or system\n' +
      '5. Celebrate small wins along the way to stay motivated';
  } else {
    responseContent = 'Here are some general productivity tips:\n\n' +
      '1. Start your day with the most important task\n' +
      '2. Use a task manager to track your to-dos\n' +
      '3. Take short breaks to maintain focus and energy\n' +
      '4. Review your progress weekly and adjust your approach\n' +
      '5. Maintain work-life balance to avoid burnout';
  }

  return {
    id: `ai_${Date.now()}`,
    content: responseContent,
    timestamp: Date.now(),
  };
};

/**
 * Simulate task category suggestion
 */
const simulateTaskCategory = (taskTitle: string): string => {
  const title = taskTitle.toLowerCase();
  
  if (title.includes('meet') || title.includes('call') || title.includes('appointment')) {
    return 'Meetings';
  } else if (title.includes('email') || title.includes('message') || title.includes('reply')) {
    return 'Communication';
  } else if (title.includes('report') || title.includes('document') || title.includes('write')) {
    return 'Documentation';
  } else if (title.includes('learn') || title.includes('study') || title.includes('read')) {
    return 'Learning';
  } else if (title.includes('design') || title.includes('create') || title.includes('build')) {
    return 'Creative';
  } else if (title.includes('review') || title.includes('check') || title.includes('test')) {
    return 'Review';
  } else if (title.includes('buy') || title.includes('shop') || title.includes('purchase')) {
    return 'Shopping';
  } else if (title.includes('clean') || title.includes('organize') || title.includes('arrange')) {
    return 'Home';
  } else {
    return 'General';
  }
};

/**
 * Simulate priority suggestion
 */
const simulatePrioritySuggestion = (taskTitle: string): string => {
  const title = taskTitle.toLowerCase();
  
  if (title.includes('urgent') || title.includes('asap') || title.includes('immediately') || 
      title.includes('critical') || title.includes('deadline')) {
    return 'high';
  } else if (title.includes('soon') || title.includes('important') || title.includes('next')) {
    return 'medium';
  } else {
    return 'low';
  }
};

/**
 * Simulate due date suggestion
 */
const simulateDueDateSuggestion = (taskTitle: string): string => {
  const title = taskTitle.toLowerCase();
  const today = new Date();
  
  if (title.includes('today') || title.includes('asap') || title.includes('now')) {
    return today.toISOString().split('T')[0];
  } else if (title.includes('tomorrow')) {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  } else if (title.includes('week') || title.includes('soon')) {
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek.toISOString().split('T')[0];
  } else if (title.includes('month')) {
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth.toISOString().split('T')[0];
  } else {
    // Default to 3 days from now
    const threeDays = new Date(today);
    threeDays.setDate(threeDays.getDate() + 3);
    return threeDays.toISOString().split('T')[0];
  }
};

// Add a default export to satisfy expo-router's expectations
export default {}; 