# ✨ My Todo List App ✨

🚀 **Level up your productivity with a smart, cross-platform mobile todo list application!** 🚀

Built with cutting-edge tech like **React Native, Expo, TypeScript, Supabase, and DeepSeek AI**, this isn't just another todo app. It's your personal productivity powerhouse, designed to keep you organized and focused, whether you're managing daily errands or complex projects. Experience seamless cloud synchronization, intelligent AI assistance, and a beautifully customizable interface – all in the palm of your hand!

## 🔥 Features 🔥

*   **✅ Core Task Management:**
    *   Create, read, update, and delete tasks effortlessly.
    *   Mark tasks as complete/incomplete with a satisfying tap.
    *   Expand tasks to view detailed descriptions.
    *   Prioritize like a pro with **High, Medium, Low** levels and clear visual indicators.
    *   Never miss a deadline! Set due dates with a native calendar and see overdue tasks highlighted.
*   **🔒 Secure User Authentication:**
    *   Robust user login and sign-up via email/password (powered by Supabase Auth).
    *   Persistent sessions keep you logged in securely.
    *   Your tasks belong to *you* – data is tied to individual user accounts.
*   **☁️ Seamless Cloud Synchronization:**
    *   Real-time updates! Your tasks sync instantly across all your devices using Supabase.
    *   Work offline? No problem! Changes are cached locally and synced automatically when you reconnect.
*   **🤖 AI-Powered Task Assistant:**
    *   Get intelligent task suggestions powered by DeepSeek AI.
    *   Let the AI help break down complex tasks or suggest next steps.
*   **🎨 Settings & Personalization:**
    *   Tailor the app to your liking in the comprehensive settings screen.
    *   Switch between **Dark & Light Mode** for optimal viewing comfort.
    *   Manage your account details securely.
    *   Customize app behavior (more options planned - see `CONTEXT.md`!).
*   **💅 Modern UI/UX:**
    *   Enjoy a clean, intuitive interface built with React Native Paper (Material Design).
    *   Eye-catching gradient headers and smooth transitions.
    *   Helpful input validation and beautifully styled custom alerts.

## 🚀 Getting Started

Ready to boost your productivity? Follow these steps:

1.  **📋 Prerequisites:**
    *   Node.js (LTS version is recommended)
    *   npm (usually comes with Node.js) or yarn
    *   [Expo Go](https://expo.dev/go) app on your iOS/Android device OR a configured mobile emulator/simulator.
    *   A [Supabase](https://supabase.com/) account and project (free tier available).
    *   (Optional) A [DeepSeek AI](https://platform.deepseek.com/) API key for the AI features.

2.  **💻 Clone the Magic:**
    ```bash
    git clone https://github.com/Ashl3y-Mlamb0/MyToDoListApp.git
    cd MyToDoListApp
    ```

3.  **📦 Install Dependencies:**
    ```bash
    npm install
    # OR
    # yarn install
    ```

4.  **🔑 Configure Environment Variables:**
    *   Create a file named `.env` in the project root.
    *   Add your Supabase credentials:
        ```env
        EXPO_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
        EXPO_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
        ```
    *   (Optional) Add your DeepSeek API Key:
        ```env
        EXPO_PUBLIC_DEEPSEEK_API_KEY=YOUR_DEEPSEEK_API_KEY
        ```
    *   **Important:** Make sure `.env` is added to your `.gitignore` file to keep your keys secret!

5.  **▶️ Launch the App:**
    ```bash
    npx expo start
    ```
    *   This command starts the Metro bundler and opens the Expo developer tools.

6.  **📱 Run on Your Device/Emulator:**
    *   **Expo Go:** Scan the QR code from the terminal or browser using the Expo Go app.
    *   **Emulator/Simulator:** Press `a` (Android) or `i` (iOS) in the terminal where Expo is running.

## 📁 Project Structure Overview

```
/MyToDoListApp
├── App.tsx                 # Root component
├── app.json                # Expo config
├── .env                    # Environment variables (Gitignored!)
├── /app                    # === Core App Code ===
│   ├── /components         # Reusable UI pieces (TodoItem, etc.)
│   ├── /contexts           # Global state managers (Auth, Theme, AI)
│   ├── /screens            # Feature screens (Home, Settings, Login...)
│   ├── /services           # Logic & API connectors (supabase, auth...)
│   ├── _layout.tsx         # Root navigator & context setup
│   └── ... (route files: index.tsx, home.tsx, etc.)
├── /assets                 # Images, fonts, icons
├── /Docs                   # Project Documentation
└── README.md               # You are here! :)
```
*(See `Docs/myToDoListBreakdown.md` for a more detailed structure)*

## 📚 Project Documentation

Dive deeper into the project specifics:

- **[🎯 Feature Context](./Docs/CONTEXT.md)**: Understand the *what* - features, goals, and planned scope.
- **[🗺️ Development Plan](./Docs/DEVELOPMENT_PLAN.md)**: See the *how* - milestones, tasks, and git strategy.
- **[🏗️ Technical Breakdown](./Docs/myToDoListBreakdown.md)**: Explore the *architecture* - technologies, structure, and tools used.
- **[💡 App Concepts Coverage](./Docs/AppConceptsCoverage.md)**: Learn the *concepts* - detailed explanations of the tech stack.

## 🏆 Development Milestones (Completed)

- ✅ **Milestone 1 (v0.1.0):** Basic UI & Static Layout
- ✅ **Milestone 2 (v0.2.0):** Navigation & Add Task Form
- ✅ **Milestone 3 (v1.0.0):** Full CRUD & Local Storage
- ✅ **Extra Features (Current - `extra-features` branch):** Authentication, Cloud Sync, AI Assistant, Theming, Settings!

## 🛠️ Technology Stack

| Category         | Technology                                           | Purpose                                     |
| ---------------- | ---------------------------------------------------- | ------------------------------------------- |
| **Core**         | React Native, Expo                                   | Cross-platform mobile development framework |
| **Language**     | TypeScript                                           | Type safety, improved developer experience  |
| **UI**           | React Native Paper, Material Design                  | Consistent & beautiful UI components        |
| **Styling**      | StyleSheet, Expo Linear Gradient                     | Component styling, visual effects           |
| **Navigation**   | Expo Router, React Native Gesture Handler            | File-based routing, smooth gestures         |
| **State**        | React Context API                                    | Global state (Theme, Auth, AI)              |
| **Backend**      | Supabase                                             | Database, Auth, Realtime API                |
| **Database**     | PostgreSQL (via Supabase)                            | Robust relational data storage              |
| **Auth**         | Supabase Auth                                        | User authentication & management            |
| **Realtime**     | Supabase Realtime Subscriptions                      | Instant data sync across devices            |
| **Local Cache**  | AsyncStorage                                         | Offline data caching                        |
| **Secure Store** | Expo Secure Store                                    | Encrypted storage for sensitive data (JWTs) |
| **AI**           | DeepSeek API                                         | Intelligent task suggestions                |
| **Utils**        | `@react-native-community/datetimepicker`, etc.       | Native date picker, other utilities         |

## 📫 Contact Me

Have questions, suggestions, or want to connect? Feel free to reach out:

- **Website:** [example.com](https://example.com/)
- **LinkedIn:** [Ashley RM](https://www.linkedin.com/in/ashley-rm/)

## 📜 License

Distributed under the MIT License. See `LICENSE` file for more information (if one exists - defaults to MIT). 
.