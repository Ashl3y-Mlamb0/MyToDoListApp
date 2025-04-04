# My Todo List Development Plan

This document outlines the step-by-step development plan for our Todo List app. Each milestone is broken down into manageable tasks with clear git practices to follow.

## Project Setup
1. Initialize React Native project with Expo and TypeScript
   ```bash
   npx create-expo-app -t expo-template-blank-typescript
   ```
2. Set up project structure
   ```
   /app
     /components
     /context
     /hooks
     /screens
     /services
     /utils
   ```
3. Initialize git repository
   ```bash
   git init
   git add .
   git commit -m "Initial project setup"
   git remote add origin https://github.com/Ashl3y-Mlamb0/MyToDoList.git
   git push -u origin main
   ```

## Milestone 1 - Main Page Display
1. Create basic app layout
   - Create HomeScreen component with title "My Todo List"
   - Set up React Native Paper theme
   ```bash
   git add .
   git commit -m "Create basic app layout with title"
   ```

2. Add hardcoded task list
   - Implement FlatList with dummy data
   - Create basic TodoItem component
   ```bash
   git add .
   git commit -m "Add hardcoded task list with dummy data"
   ```

3. Style the UI with React Native Paper
   - Add Appbar component
   - Style Cards for todo items
   - Add basic Text styling
   ```bash
   git add .
   git commit -m "Style UI with React Native Paper components"
   ```

4. Add placeholder "Add New Todo" button
   - Add FAB component (non-functional at this stage)
   ```bash
   git add .
   git commit -m "Add placeholder Add New Todo button"
   ```

5. Milestone 1 Completion
   ```bash
   git add .
   git commit -m "Complete Milestone 1 - Main page display"
   git tag -a v0.1.0 -m "Milestone 1 completed"
   git push origin main --tags
   # Create a branch to preserve this milestone version
   git branch milestone1
   git push origin milestone1
   ```

## Milestone 2 - Functionality & Navigation
1. Set up navigation
   - Install Expo Router
   - Create basic navigation structure
   ```bash
   git add .
   git commit -m "Set up navigation structure with Expo Router"
   ```

2. Implement "Add New Todo" button functionality
   - Connect FAB to AddTodoScreen navigation
   ```bash
   git add .
   git commit -m "Implement Add New Todo button with navigation"
   ```

3. Create AddTodoScreen
   - Add Title Input (single line)
   - Add Description Input (multiline)
   - Add Cancel and Save buttons
   ```bash
   git add .
   git commit -m "Create AddTodoScreen with form inputs"
   ```

4. Implement navigation between screens
   - Add back button functionality
   - Set up navigation state management
   ```bash
   git add .
   git commit -m "Implement navigation between screens"
   ```

5. Milestone 2 Completion
   ```bash
   git add .
   git commit -m "Complete Milestone 2 - Functionality & Navigation"
   git tag -a v0.2.0 -m "Milestone 2 completed"
   git push origin main --tags
   # Create a branch to preserve this milestone version
   git branch milestone2
   git push origin milestone2
   ```

## Milestone 3 - Full Functionality
1. Implement data persistence with AsyncStorage
   - Create storage service
   - Implement CRUD operations for todos
   ```bash
   git add .
   git commit -m "Implement data persistence with AsyncStorage"
   ```

2. Enhance Todo Item functionality
   - Add expand/collapse feature with caret-down icon
   - Implement title and description display
   ```bash
   git add .
   git commit -m "Enhance Todo Item with expand/collapse functionality"
   ```

3. Add todo control features
   - Implement "Mark as Finished" functionality
   - Implement "Delete Todo" functionality
   ```bash
   git add .
   git commit -m "Add todo control features (finish/delete)"
   ```

4. Implement form validation
   - Add validation for Title and Description
   - Disable Save button if validation fails
   ```bash
   git add .
   git commit -m "Implement form validation for AddTodoScreen"
   ```

5. Add user feedback
   - Show Toast on successful save
   - Clear fields after save
   ```bash
   git add .
   git commit -m "Add user feedback with Toast notifications"
   ```

6. Implement loading todos on app launch
   - Load from AsyncStorage on app start
   - Handle state management for todos
   ```bash
   git add .
   git commit -m "Implement loading todos on app launch"
   ```

7. Milestone 3 Completion
   ```bash
   git add .
   git commit -m "Complete Milestone 3 - Full Functionality"
   git tag -a v1.0.0 -m "Milestone 3 completed - MVP ready"
   git push origin main --tags
   # Create a branch to preserve this milestone version
   git branch milestone3
   git push origin milestone3
   ```

## Additional Features
**User Login**
1. Set up Supabase backend
   - Create Supabase project
   - Set up database tables
   ```bash
   git add .
   git commit -m "Set up Supabase project and database tables"
   ```

2. Implement user authentication with Supabase
   - Create login screen with email/password fields
   - Create signup screen for new users
   - Implement authentication logic with Supabase Auth
   - Add AuthContext for managing auth state
   - Create protected routes for authenticated users
   ```bash
   git add .
   git commit -m "Implement user authentication with Supabase"
   ```

3. Migrate from AsyncStorage to Supabase
   - Update CRUD operations
   - Implement user-specific data fetching
   - Sync todos with user accounts
   ```bash
   git add .
   git commit -m "Migrate from AsyncStorage to Supabase with user accounts"
   ```

4. Add user profile functionality
   - Create profile screen
   - Allow users to update profile information
   - Add logout functionality
   ```bash
   git add .
   git commit -m "Add user profile functionality"
   ```

**Settings Page**
1. Create settings screen structure
   - Implement main settings layout
   - Add section headers using List.Accordion
   - Set up navigation to settings screen
   ```bash
   git add .
   git commit -m "Create settings screen structure"
   ```

2. Implement theme & UI preferences
   - Add light/dark mode toggle
   - Create accent color picker
   - Add font size adjustment
   ```bash
   git add .
   git commit -m "Implement theme & UI preferences"
   ```

3. Add account management settings
   - Create account-related options
   - Implement logout functionality
   - Add password change and email update
   ```bash
   git add .
   git commit -m "Add account management settings"
   ```

4. Implement app behavior settings
   - Add notification toggles
   - Create default sort method selector
   - Implement task view mode toggle
   ```bash
   git add .
   git commit -m "Implement app behavior settings"
   ```

5. Add AI settings section
   - Create AI-related toggles and options
   - Implement clear AI history functionality
   ```bash
   git add .
   git commit -m "Add AI settings section"
   ```

6. Implement language & region settings
   - Add language selector
   - Create time format toggle
   ```bash
   git add .
   git commit -m "Implement language & region settings"
   ```

7. Add developer options & legal information
   - Create beta features toggle
   - Add reset app data functionality
   - Include privacy policy and terms links
   - Display app version information
   ```bash
   git add .
   git commit -m "Add developer options & legal information"
   ```

**AI Integration**
1. Implement DeepSeek AI integration
   - Set up API client
   - Create AI service
   ```bash
   git add .
   git commit -m "Implement DeepSeek AI integration"
   ```

2. Add chat-based task entry
   - Create AI chat interface
   - Implement natural language parsing for tasks
   ```bash
   git add .
   git commit -m "Add chat-based task entry with AI"
   ```

3. Implement AI task suggestions
   - Add AI suggestion feature
   - Track AI-generated content
   ```bash
   git add .
   git commit -m "Implement AI task suggestions"
   ```

4. Additional Features Completion
   ```bash
   git add .
   git commit -m "Complete Additional Features - AI Integration and User Authentication"
   git tag -a v2.0.0 -m "AI features and user authentication completed"
   git push origin main --tags
   # Create a branch to preserve this final version
   git branch final-version
   git push origin final-version
   ```

## Version Management Summary
The project will have 4 distinct versions on GitHub:
1. **v0.1.0 (milestone1 branch)**: Basic UI with static todo list
2. **v0.2.0 (milestone2 branch)**: Navigation and button functionality
3. **v1.0.0 (milestone3 branch)**: Full functionality with local storage
4. **v2.0.0 (final-version branch)**: Complete app with Supabase auth and AI integration

## Testing & Final Release
1. Comprehensive testing
   - Test all features across platforms
   - Fix any bugs discovered
   ```bash
   git add .
   git commit -m "Fix bugs discovered during testing"
   ```

2. Documentation
   - Update README.md
   - Document API usage
   ```bash
   git add .
   git commit -m "Update documentation"
   ```

3. Final release
   ```bash
   git add .
   git commit -m "Prepare for final release"
   git tag -a v2.1.0 -m "Final release"
   git push origin main --tags
   ```

## Git Best Practices
- Create a new branch for each feature or bug fix
  ```bash
  git checkout -b feature/feature-name
  ```
- Merge branches after completion
  ```bash
  git checkout main
  git merge feature/feature-name
  ```
- Use descriptive commit messages that explain WHY rather than WHAT
- Keep commits focused on single logical changes
- Pull before pushing to avoid conflicts
  ```bash
  git pull origin main
  git push origin main
  ```
- Use tags to mark significant versions
  ```bash
  git tag -a v1.0.0 -m "Version 1.0.0"
  git push origin --tags
  ``` 