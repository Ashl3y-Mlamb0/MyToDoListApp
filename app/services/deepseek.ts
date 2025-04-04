import { AIResponse } from './supabase';

// DeepSeek API configuration
const DEEPSEEK_API_KEY = 'sk-8c527c8ce9a3489e8e7ae7fe806bc2b0';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// Flag to control whether to attempt API calls or use simulation only
// Setting to false to avoid "Insufficient Balance" errors
const USE_ACTUAL_API = false;

/**
 * Interface for DeepSeek API request
 */
interface DeepseekRequest {
  model: string;
  messages: {
    role: 'system' | 'user' | 'assistant';
    content: string;
  }[];
  max_tokens?: number;
  temperature?: number;
}

/**
 * Interface for DeepSeek API response
 */
interface DeepseekResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Make a request to the DeepSeek API
 */
const callDeepseekAPI = async (prompt: string, systemPrompt: string = '', model: string = 'deepseek-chat'): Promise<string> => {
  // Skip actual API call if USE_ACTUAL_API is false
  if (!USE_ACTUAL_API) {
    throw new Error('Simulated mode enabled');
  }
  
  try {
    const messages = [
      ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
      { role: 'user' as const, content: prompt }
    ];

    const requestBody = {
      model,
      messages,
      max_tokens: 1000,
      temperature: 0.7,
    };

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`DeepSeek API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling DeepSeek API:', error);
    throw error;
  }
};

/**
 * Get AI suggestions (using simulation as fallback)
 */
export const getAISuggestions = async (prompt: string): Promise<AIResponse> => {
  try {
    if (USE_ACTUAL_API) {
      const systemPrompt = 'You are a helpful AI assistant for a todo app called TaskMaster. Your role is to provide productivity advice, task management tips, and help users organize their tasks. Keep your responses concise, practical, and actionable. Focus on providing specific advice that helps users be more productive.';
      
      const content = await callDeepseekAPI(prompt, systemPrompt);
      
      return {
        id: `deepseek_${Date.now()}`,
        content,
        timestamp: Date.now()
      };
    } else {
      // Use simulation instead
      return simulateAIResponse(prompt);
    }
  } catch (error) {
    console.error('Error getting AI suggestions:', error);
    // Fallback to simulation
    return simulateAIResponse(prompt);
  }
};

/**
 * Categorize a task (using simulation as fallback)
 */
export const categorizeTask = async (taskTitle: string, taskDescription?: string): Promise<string> => {
  try {
    if (USE_ACTUAL_API) {
      const taskContent = `Title: ${taskTitle}\n${taskDescription ? `Description: ${taskDescription}` : ''}`;
      const systemPrompt = 'You are an AI assistant for a todo app. Your task is to categorize the provided task into ONE of these categories: Work, Personal, Shopping, Home, Health, Finance, Learning, Social, Travel, Creative, Meetings, Communication, Documentation, or General. Respond with ONLY the category name, nothing else.';
      
      const category = await callDeepseekAPI(taskContent, systemPrompt);
      
      // Clean up the response to ensure it's just a category name
      return category.trim();
    } else {
      // Use simulation instead
      return simulateTaskCategory(taskTitle, taskDescription);
    }
  } catch (error) {
    console.error('Error categorizing task:', error);
    // Fallback to simulation
    return simulateTaskCategory(taskTitle, taskDescription);
  }
};

/**
 * Suggest priority for a task (using simulation as fallback)
 */
export const suggestPriority = async (taskTitle: string, taskDescription?: string): Promise<string> => {
  try {
    if (USE_ACTUAL_API) {
      const taskContent = `Title: ${taskTitle}\n${taskDescription ? `Description: ${taskDescription}` : ''}`;
      const systemPrompt = 'You are an AI assistant for a todo app. Based on the task provided, suggest a priority level. Respond with ONLY one of these three options: "high", "medium", or "low". Nothing else.';
      
      const priority = await callDeepseekAPI(taskContent, systemPrompt);
      
      // Clean up and validate the response
      const cleanPriority = priority.trim().toLowerCase();
      if (['high', 'medium', 'low'].includes(cleanPriority)) {
        return cleanPriority;
      }
      
      // Default to medium if the API response isn't valid
      return 'medium';
    } else {
      // Use simulation instead
      return simulatePrioritySuggestion(taskTitle, taskDescription);
    }
  } catch (error) {
    console.error('Error suggesting priority:', error);
    // Fallback to simulation
    return simulatePrioritySuggestion(taskTitle, taskDescription);
  }
};

/**
 * Suggest due date for a task (using simulation as fallback)
 */
export const suggestDueDate = async (taskTitle: string, taskDescription?: string): Promise<string> => {
  try {
    if (USE_ACTUAL_API) {
      const today = new Date();
      const taskContent = `Title: ${taskTitle}\n${taskDescription ? `Description: ${taskDescription}` : ''}`;
      const systemPrompt = `You are an AI assistant for a todo app. Based on the task provided, suggest a reasonable due date. Today's date is ${today.toISOString().split('T')[0]}. Respond with ONLY a date in YYYY-MM-DD format, nothing else.`;
      
      const dueDateResponse = await callDeepseekAPI(taskContent, systemPrompt);
      
      // Extract and validate the date format (YYYY-MM-DD)
      const dateRegex = /\d{4}-\d{2}-\d{2}/;
      const match = dueDateResponse.match(dateRegex);
      
      if (match && match[0]) {
        // Validate the date is not in the past
        const suggestedDate = new Date(match[0]);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (suggestedDate > yesterday) {
          return match[0];
        }
      }
      
      // Default to 3 days from now if the API response isn't valid
      const threeDays = new Date(today);
      threeDays.setDate(threeDays.getDate() + 3);
      return threeDays.toISOString().split('T')[0];
    } else {
      // Use simulation instead
      return simulateDueDateSuggestion(taskTitle, taskDescription);
    }
  } catch (error) {
    console.error('Error suggesting due date:', error);
    // Fallback to simulation
    return simulateDueDateSuggestion(taskTitle, taskDescription);
  }
};

/**
 * Generate simulated AI response
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
const simulateTaskCategory = (taskTitle: string, taskDescription?: string): string => {
  const title = (taskTitle + ' ' + (taskDescription || '')).toLowerCase();
  
  if (title.includes('meet') || title.includes('call') || title.includes('appointment') || title.includes('conference')) {
    return 'Meetings';
  } else if (title.includes('email') || title.includes('message') || title.includes('reply') || title.includes('contact')) {
    return 'Communication';
  } else if (title.includes('report') || title.includes('document') || title.includes('write') || title.includes('draft')) {
    return 'Documentation';
  } else if (title.includes('learn') || title.includes('study') || title.includes('read') || title.includes('course')) {
    return 'Learning';
  } else if (title.includes('design') || title.includes('create') || title.includes('build') || title.includes('make')) {
    return 'Creative';
  } else if (title.includes('review') || title.includes('check') || title.includes('test') || title.includes('verify')) {
    return 'Review';
  } else if (title.includes('buy') || title.includes('shop') || title.includes('purchase') || title.includes('store')) {
    return 'Shopping';
  } else if (title.includes('clean') || title.includes('organize') || title.includes('arrange') || title.includes('house')) {
    return 'Home';
  } else if (title.includes('work') || title.includes('job') || title.includes('project') || title.includes('client')) {
    return 'Work';
  } else if (title.includes('personal') || title.includes('self') || title.includes('life') || title.includes('hobby')) {
    return 'Personal';
  } else if (title.includes('health') || title.includes('doctor') || title.includes('exercise') || title.includes('workout')) {
    return 'Health';
  } else if (title.includes('money') || title.includes('finance') || title.includes('pay') || title.includes('budget')) {
    return 'Finance';
  } else if (title.includes('friend') || title.includes('family') || title.includes('social') || title.includes('date')) {
    return 'Social';
  } else if (title.includes('travel') || title.includes('trip') || title.includes('vacation') || title.includes('flight')) {
    return 'Travel';
  } else {
    return 'General';
  }
};

/**
 * Simulate priority suggestion
 */
const simulatePrioritySuggestion = (taskTitle: string, taskDescription?: string): string => {
  const title = (taskTitle + ' ' + (taskDescription || '')).toLowerCase();
  
  if (title.includes('urgent') || title.includes('asap') || title.includes('immediately') || 
      title.includes('critical') || title.includes('deadline') || title.includes('today') || 
      title.includes('important') || title.includes('due') || title.includes('emergency')) {
    return 'high';
  } else if (title.includes('soon') || title.includes('next') || title.includes('this week') || 
             title.includes('priority') || title.includes('significant') || title.includes('schedule')) {
    return 'medium';
  } else {
    return 'low';
  }
};

/**
 * Simulate due date suggestion
 */
const simulateDueDateSuggestion = (taskTitle: string, taskDescription?: string): string => {
  const title = (taskTitle + ' ' + (taskDescription || '')).toLowerCase();
  const today = new Date();
  
  if (title.includes('today') || title.includes('asap') || title.includes('now') || title.includes('urgent')) {
    return today.toISOString().split('T')[0];
  } else if (title.includes('tomorrow')) {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  } else if (title.includes('next week') || title.includes('in a week')) {
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek.toISOString().split('T')[0];
  } else if (title.includes('weekend')) {
    // Find the next Saturday
    const nextWeekend = new Date(today);
    const currentDay = today.getDay(); // 0 is Sunday, 6 is Saturday
    const daysToWeekend = (6 - currentDay + 7) % 7 || 7; // Distance to next Saturday
    nextWeekend.setDate(nextWeekend.getDate() + daysToWeekend);
    return nextWeekend.toISOString().split('T')[0];
  } else if (title.includes('month') || title.includes('long term')) {
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth.toISOString().split('T')[0];
  } else if (title.includes('week') || title.includes('soon')) {
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek.toISOString().split('T')[0];
  } else {
    // Default to 3 days from now for most tasks
    const threeDays = new Date(today);
    threeDays.setDate(threeDays.getDate() + 3);
    return threeDays.toISOString().split('T')[0];
  }
};

// Add a default export to satisfy expo-router's expectations
export default {}; 