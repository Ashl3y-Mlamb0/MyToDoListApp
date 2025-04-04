# My Todo List App - Project Flow and Feature Overview

## Overview
**My Todo List** is a cross-platform mobile application developed using React Native, TypeScript, Expo, and Supabase for backend services. The app enables users to efficiently manage their personal tasks through an intuitive UI and intelligent AI support via DeepSeek.

## 📱 Tech Stack
| Layer        | Technology                      |
|--------------|----------------------------------|
| Frontend     | React Native + Expo + TypeScript |
| State Mgmt   | React Context API / useState     |
| Backend      | Supabase (PostgreSQL + Auth)     |
| AI Features  | DeepSeek AI                      |
| UI Library   | React Native Paper               |
| Storage      | AsyncStorage (local)             |
| Navigation   | Expo Router (React Navigation)   |

## 🗄️ Database Schema (Supabase)
```sql
-- Users table (handled by Supabase Auth)
-- auth.users (built-in)

-- Todos table
CREATE TABLE todos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    due_date TIMESTAMP WITH TIME ZONE,
    priority INTEGER DEFAULT 0,
    tags TEXT[],
    -- AI-related fields
    is_ai_generated BOOLEAN DEFAULT FALSE,
    ai_context TEXT, -- Stores the original AI prompt/context
    last_ai_interaction TIMESTAMP WITH TIME ZONE
);

-- AI Interactions table (to track AI assistant usage)
CREATE TABLE ai_interactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    todo_id UUID REFERENCES todos(id) ON DELETE CASCADE,
    interaction_type VARCHAR(50) NOT NULL, -- 'create', 'edit', 'delete', 'suggest'
    prompt TEXT NOT NULL, -- The user's original prompt
    ai_response TEXT, -- The AI's response/action taken
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB -- Additional context about the interaction
);

-- Create indexes for better query performance
CREATE INDEX idx_todos_user_id ON todos(user_id);
CREATE INDEX idx_todos_created_at ON todos(created_at);
CREATE INDEX idx_todos_is_completed ON todos(is_completed);
CREATE INDEX idx_todos_is_ai_generated ON todos(is_ai_generated);
CREATE INDEX idx_ai_interactions_user_id ON ai_interactions(user_id);
CREATE INDEX idx_ai_interactions_todo_id ON ai_interactions(todo_id);

-- Enable Row Level Security (RLS)
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_interactions ENABLE ROW LEVEL SECURITY;

-- Create policies for todos table
CREATE POLICY "Users can view their own todos"
    ON todos FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own todos"
    ON todos FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own todos"
    ON todos FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own todos"
    ON todos FOR DELETE
    USING (auth.uid() = user_id);

-- Create policies for ai_interactions table
CREATE POLICY "Users can view their own AI interactions"
    ON ai_interactions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own AI interactions"
    ON ai_interactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI interactions"
    ON ai_interactions FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own AI interactions"
    ON ai_interactions FOR DELETE
    USING (auth.uid() = user_id);
```

## 📁 Project Structure
```
/my-todo-list-app
├── App.tsx
├── app.json
├── babel.config.js
├── tsconfig.json
├── /src
│   ├── /components
│   │   ├── /common
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Card.tsx
│   │   ├── /todos
│   │   │   ├── TodoItem.tsx
│   │   │   ├── TodoList.tsx
│   │   │   └── TodoForm.tsx
│   │   └── /layout
│   │       ├── Header.tsx
│   │       └── Footer.tsx
│   ├── /screens
│   │   ├── /auth
│   │   │   ├── LoginScreen.tsx
│   │   │   └── SignupScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── AddTodoScreen.tsx
│   │   └── EditTodoScreen.tsx
│   ├── /navigation
│   │   ├── AppNavigator.tsx
│   │   └── AuthNavigator.tsx
│   ├── /services
│   │   ├── supabase
│   │   │   ├── client.ts
│   │   │   └── types.ts
│   │   ├── storage.ts
│   │   └── ai.ts
│   ├── /context
│   │   ├── AuthContext.tsx
│   │   └── TodoContext.tsx
│   ├── /hooks
│   │   ├── useAuth.ts
│   │   └── useTodos.ts
│   ├── /utils
│   │   ├── validation.ts
│   │   ├── helpers.ts
│   │   └── constants.ts
│   ├── /types
│   │   └── index.ts
│   ├── /assets
│   │   ├── /images
│   │   ├── /icons
│   │   └── /fonts
│   └── /theme
│       ├── colors.ts
│       └── typography.ts
├── /tests
│   ├── /components
│   ├── /screens
│   └── /utils
├── .env.example
├── .gitignore
└── README.md
```

## 🧭 App Navigation Flow
```
WelcomeScreen
    ↓
LoginScreen / SignupScreen (email/password auth via Supabase)
    ↓
HomeScreen (Main Dashboard)
    ├── View Tasks (FlatList)
    ├── Add Todo (FAB / AI Chat)
    └── Expand/Collapse Todo Items
        ├── Mark as Finished ✅
        └── Delete Todo 🗑️
```

## 🧱 Development Milestones

### Milestone 1 - Main Page Display
- Display title: **"My Todo List"** at the top
- Hardcoded task list in center (using FlatList or View)
- "Add New Todo" button (not functional yet)
- Use React Native Paper's `Appbar`, `Button`, `Card`, and `Text` components

### Milestone 2 - Functionality & Navigation
- Add New Todo button with **+ icon**
- Navigation to `AddTodoScreen`
- AddTodoScreen with:
  - Title Input (single line)
  - Description Input (multiline)
  - Cancel (Back) and Save buttons

### Final Submission - Full Functionality
- **Home Screen**
  - Loads on launch
  - Displays todos using `FlatList`
  - Each item:
    - Title in collapsed view
    - Caret-down (↓) icon toggles expand/collapse

- **Add Todo Screen**
  - Validation for both Title and Description (non-empty)
  - On successful Save:
    - Show Toast: "Todo Added Successfully"
    - Clear fields, remain on same screen
  - Save button disabled if validation fails
  - Back button navigates to Home

- **Expanded Todo View**
  - Title
  - Description
  - Control panel:
    - ✅ Green tick icon → mark as finished (removes tick)
    - 🗑️ Red delete icon → remove from list

- **Data Persistence**
  - Use `AsyncStorage` to store todos:
    - On app launch, load from AsyncStorage
    - Save any additions, deletions, or updates

## 🧠 AI Feature Integration
- **User Authentication**
  - Login screen with email/password authentication via Supabase
  - Signup screen for new users with email verification
  - Password reset functionality
  - Persistent sessions for logged-in users
  - Protected routes accessible only to authenticated users
  - User profile management

- **Cloud Data Sync**
  - Todos synced to Supabase database
  - Real-time updates across devices
  - User-specific data isolation and security
  - Offline support with sync on reconnection

- **DeepSeek AI Integration**
  - AI chat interface for natural task creation
  - Chat-based task entry (e.g., "Remind me to call mom tomorrow")
  - AI auto-fills Title and Description fields
  - Smart suggestions for task management
  - Track AI interactions and generated content
  - Maintain context for AI-generated tasks

## 🧪 Testing Checklist
- [ ] App opens to Welcome/Login Screen
- [ ] User authentication works correctly
- [ ] Navigation to AddTodoScreen works
- [ ] Validation works and shows error alerts
- [ ] Todos added successfully with feedback
- [ ] Todos persist after app close/reopen and sync across devices
- [ ] Expand/collapse works
- [ ] Finish/delete actions reflect in storage
- [ ] UI is styled using Paper components
- [ ] AI integration works correctly
- [ ] AI-generated tasks are properly tracked

## 📌 Notes
- Ensure clean and semantic code using TypeScript
- Comment using JSDoc format for maintainability
- Use environment-safe handling of Supabase keys
- Follow secure coding practices, especially for auth & storage

## 📄 Future Improvements
- Calendar integration
- Due date notifications
- DeepSeek AI priority sorting
- Tagging & filtering todos
- Multi-user support (team tasks)
- Social sharing of tasks

## 💬 Resources
- [Expo Docs](https://docs.expo.dev)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [DeepSeek API](https://platform.deepseek.com)
- [Supabase Docs](https://supabase.com/docs)

