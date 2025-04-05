# My Todo List App

A cross-platform mobile todo list application built with React Native, Expo, TypeScript, Supabase, and DeepSeek AI.

## Features

### Milestone 1
- Display todos in a list
- Beautiful UI with React Native Paper
- "Add New Todo" button (FAB)

### Milestone 2
- Navigation between screens
- Form for adding new todos
- Cancel and Save functionality

### Milestone 3
- Data persistence using AsyncStorage
- Todo status tracking (complete/incomplete)
- Delete functionality
- Expand/collapse todo details

### Milestone 4 (Extra Features)
- User authentication with Supabase
- Theme customization (dark/light mode, accent colors)
- AI integration with DeepSeek
- Settings screen with preferences management
- Cloud data synchronization

## Running the Application

1. Install dependencies:
```bash
npm install
```

2. Start the app:
```bash
npx expo start
```

3. Use Expo Go on your device or an emulator to run the app

## Project Structure

```
/my-todo-list-app
├── App.tsx
├── app.json
├── babel.config.js
├── tsconfig.json
├── /app
│   ├── /components
│   │   ├── TodoItem.tsx
│   │   ├── TodoList.tsx
│   │   └── other components...
│   ├── /contexts
│   │   ├── AuthContext.tsx
│   │   ├── AIContext.tsx
│   │   └── ThemeContext.tsx
│   ├── /screens
│   │   ├── HomeScreen.tsx
│   │   ├── AddTodoScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   └── LoginScreen.tsx
│   ├── /services
│   │   ├── storage.ts
│   │   ├── deepseek.ts
│   │   └── supabase.ts
│   └── _layout.tsx
├── /assets
│   ├── /images
│   └── /icons
├── /Docs
│   ├── CONTEXT.md
│   └── DEVELOPMENT_PLAN.md
└── README.md
```

## Documentation

The project includes detailed documentation in the [Docs](./Docs) folder:
- **CONTEXT.md**: Contains the project overview, tech stack, database schema, and feature set
- **DEVELOPMENT_PLAN.md**: Outlines the development milestones and implementation steps

## Development Milestones

- ✅ Milestone 1: Basic UI and layout
- ✅ Milestone 2: Navigation and form functionality
- ✅ Milestone 3: Data persistence and complete functionality
- ✅ Milestone 4: Extra features (Authentication, AI integration, Theme customization)

## Tech Stack

- **Frontend**: React Native, Expo, TypeScript
- **State Management**: React Context API
- **Backend**: Supabase (PostgreSQL + Auth)
- **AI Features**: DeepSeek AI
- **UI Library**: React Native Paper
- **Storage**: AsyncStorage (local) + Supabase (cloud)
- **Navigation**: Expo Router

## License

MIT 
