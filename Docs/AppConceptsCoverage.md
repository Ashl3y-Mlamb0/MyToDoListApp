# 📚 App Concepts Coverage

This document provides expanded educational context and resources for the core technologies and concepts used in the My Todo List application, as outlined in the [`myToDoListBreakdown.md`](./myToDoListBreakdown.md) file. Its goal is to offer a deeper understanding of *why* certain technologies were chosen and *how* they function within the app's architecture.

**Table of Contents**

- [📱 Frontend Development](#-frontend-development)
  - [Core Framework & Language](#core-framework--language)
    - [React Native](#react-native)
    - [Expo](#expo)
    - [TypeScript](#typescript)
  - [Navigation & Routing](#navigation--routing)
    - [Expo Router](#expo-router)
    - [Stack & Tab Navigation](#stack--tab-navigation)
    - [React Native Gesture Handler](#react-native-gesture-handler)
  - [State Management](#state-management)
    - [React Context API](#react-context-api)
  - [Platform APIs & Utilities](#platform-apis--utilities)
    - [Safe Area Context (`react-native-safe-area-context`)](#safe-area-context-react-native-safe-area-context)
    - [Status Bar (`expo-status-bar`)](#status-bar-expo-status-bar)
- [✨ Styling & UI Components](#-styling--ui-components)
  - [React Native Paper](#react-native-paper)
  - [React Native StyleSheet](#react-native-stylesheet)
  - [Material Design](#material-design)
  - [Linear Gradients (`expo-linear-gradient`)](#linear-gradients-expo-linear-gradient)
  - [Dark/Light Mode (Theming)](#darklight-mode-theming)
  - [DateTimePicker (`@react-native-community/datetimepicker`)](#datetimepicker-react-native-communitydatetimepicker)
- [☁️ Backend & Data Management](#️-backend--data-management)
  - [Supabase](#supabase)
  - [PostgreSQL](#postgresql)
  - [Row-Level Security (RLS)](#row-level-security-rls)
  - [Real-time Subscriptions](#real-time-subscriptions)
  - [Authentication (Email/Password, JWT)](#authentication-emailpassword-jwt)
  - [AsyncStorage (`@react-native-async-storage/async-storage`)](#asyncstorage-react-native-async-storageasync-storage)
  - [Expo Secure Store](#expo-secure-store)
  - [Offline Support & Data Synchronization](#offline-support--data-synchronization)
  - [Optimistic UI Updates](#optimistic-ui-updates)
- [🤖 AI Integration](#-ai-integration)
  - [DeepSeek API / LLM Integration](#deepseek-api--llm-integration)
  - [Natural Language Processing (NLP)](#natural-language-processing-nlp)
- [🧪 Testing Concepts](#-testing-concepts)
  - [Unit Testing](#unit-testing)
  - [Component Testing](#component-testing)
  - [Integration Testing](#integration-testing)
  - [End-to-End (E2E) Testing](#end-to-end-e2e-testing)
  - [Manual Testing](#manual-testing)
- [🛠️ DevOps & Deployment](#️-devops--deployment)
  - [CLI Tools (Expo, Supabase, npm)](#cli-tools-expo-supabase-npm)
  - [Environment Variables](#environment-variables)
  - [API Keys](#api-keys)
  - [Monitoring & Logging](#monitoring--logging)
  - [Git & GitHub](#git--github)
  - [Expo EAS Build](#expo-eas-build)
  - [CI/CD (Continuous Integration / Continuous Deployment)](#cicd-continuous-integration--continuous-deployment)

---

## 📱 Frontend Development

This section delves into the technologies used to build the interactive user interface (UI) and manage the user experience (UX) of the mobile application.

### Core Framework & Language

*   **React Native:**
    *   **What:** A JavaScript framework developed and maintained by Meta (formerly Facebook) for building *native* mobile applications using React. Unlike web-based frameworks that might use web views, React Native translates React components into actual native iOS and Android UI elements.
    *   **Key Details:**
        *   **Cross-Platform:** Write code primarily in JavaScript (or TypeScript) and target both iOS and Android platforms, significantly reducing development time and effort compared to writing separate native apps.
        *   **Native Performance:** Renders UI using native platform widgets, leading to performance closer to fully native apps than hybrid approaches.
        *   **React Paradigm:** Leverages the popular React library's component-based architecture, state management, and lifecycle methods, making it familiar to web developers.
        *   **Hot Reloading:** Allows developers to see changes instantly without recompiling the entire app, speeding up the development iteration cycle.
        *   **Large Ecosystem:** Benefits from both the React and native mobile development communities, offering a vast array of libraries and tools.
        *   **JavaScript Bridge:** Historically, communication between the JavaScript code and native modules happened over an asynchronous "bridge." Newer architectures (like the one being rolled out with Fabric) aim to improve this communication for better performance.
    *   **Learn More:**
        *   [React Native Official Documentation](https://reactnative.dev/docs/getting-started)
        *   [Introduction to React Native (MDN)](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/React_Native_getting_started)
        *   [React Native Architecture Overview](https://reactnative.dev/docs/architecture-overview)

*   **Expo:**
    *   **What:** An open-source platform and set of tools/services built *on top of* React Native. Expo aims to simplify the entire mobile app development lifecycle, from project setup and development to building and deployment.
    *   **Key Details:**
        *   **Managed Workflow:** Handles much of the native project configuration complexity, allowing developers to focus on JavaScript/TypeScript code. You don't necessarily need Xcode or Android Studio installed initially.
        *   **Expo SDK:** Provides a curated set of native APIs (camera, filesystem, location, sensors, authentication, etc.) accessible via JavaScript, saving developers from needing to integrate native modules manually.
        *   **Expo Go App:** A client app for iOS and Android that lets you instantly run and test your projects during development without needing a full native build.
        *   **EAS (Expo Application Services):** Cloud services for building (`eas build`), updating (`eas update` for OTA updates), and submitting (`eas submit`) your app to the app stores.
        *   **Over-the-Air (OTA) Updates:** Push JavaScript/asset updates directly to users' installed apps without requiring a full app store review process (within certain limits).
        *   **Limitations:** While powerful, the Managed Workflow can sometimes limit access to specific native APIs not included in the Expo SDK. Expo now offers a "Bare Workflow" that provides more flexibility but requires managing the native projects yourself.
    *   **Learn More:**
        *   [Expo Official Documentation](https://docs.expo.dev/)
        *   [Expo SDK API Reference](https://docs.expo.dev/versions/latest/)
        *   [Expo Application Services (EAS)](https://expo.dev/eas)
        *   [Managed vs Bare Workflow](https://docs.expo.dev/workflow/managed-vs-bare/)

*   **TypeScript:**
    *   **What:** An open-source language developed by Microsoft that builds on JavaScript by adding static type definitions. It doesn't run directly in browsers or Node.js; it needs to be compiled into plain JavaScript first.
    *   **Key Details:**
        *   **Static Typing:** Define types for variables, function parameters, and return values. The TypeScript compiler checks for type errors *before* runtime, catching bugs early (e.g., trying to use a number as a string).
        *   **Improved Readability & Maintainability:** Types make code easier to understand and refactor, especially in larger projects or teams.
        *   **Enhanced Developer Tools:** Enables features like intelligent code completion, refactoring tools, and type checking within code editors (like VS Code).
        *   **Gradual Adoption:** Can be introduced incrementally into existing JavaScript projects.
        *   **Superset of JavaScript:** All valid JavaScript code is also valid TypeScript code.
    *   **Learn More:**
        *   [TypeScript Official Documentation](https://www.typescriptlang.org/docs/)
        *   [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
        *   [TypeScript Playground (Experiment Online)](https://www.typescriptlang.org/play)

### Navigation & Routing

This defines how users move between different screens within the application.

*   **Expo Router:**
    *   **What:** A modern routing solution specifically designed for Expo and React Native apps, leveraging a file-system-based approach similar to web frameworks like Next.js.
    *   **Key Details:**
        *   **File-System Based:** Routes are defined by creating files and directories within the `/app` folder. For example, `app/settings.tsx` automatically creates a `/settings` route. Dynamic routes (e.g., `app/users/[id].tsx`) are also supported.
        *   **Platform Agnostic:** Designed to work seamlessly across iOS, Android, and Web targets.
        *   **Typed Routes:** Generates TypeScript types based on your file structure, ensuring type safety when navigating.
        *   **Layout Routes:** Special files (`_layout.tsx`) define shared UI elements (like headers, tab bars) for a set of routes within a directory.
        *   **Navigation Primitives:** Built on top of React Navigation, providing access to common navigation patterns (Stack, Tabs, Drawer).
    *   **Learn More:**
        *   [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
        *   [Expo Router File Conventions](https://docs.expo.dev/router/file-conventions/)

*   **Stack & Tab Navigation:**
    *   **What:** Fundamental mobile navigation patterns.
        *   **Stack Navigator:** Manages screens like a stack of cards. New screens are pushed onto the stack, and the back button pops them off. Used for sequential flows (e.g., list -> details -> edit).
        *   **Tab Navigator:** Displays a row of tabs (usually at the bottom) allowing users to switch between different top-level sections of the app (e.g., Home, Settings, Profile).
    *   **Key Details:** Expo Router implements these using Layout Routes. A `_layout.tsx` file in a directory can export a `Stack` or `Tabs` component to apply that navigation pattern to all routes within that directory.
    *   **Learn More:**
        *   [Expo Router - Layouts](https://docs.expo.dev/router/layouts/)
        *   [Expo Router - Stack Navigator](https://docs.expo.dev/router/navigating/stack/)
        *   [Expo Router - Tabs Navigator](https://docs.expo.dev/router/navigating/tabs/)

*   **React Native Gesture Handler:**
    *   **What:** A library providing declarative APIs for handling touch gestures (like swipes, taps, pans) in a performant way, running gesture recognition on the native UI thread.
    *   **Key Details:**
        *   **Performance:** Avoids performance bottlenecks associated with the React Native JavaScript bridge for gesture handling, resulting in smoother animations and interactions.
        *   **Reliability:** Offers more consistent gesture recognition across platforms compared to the basic Responder system built into React Native.
        *   **Dependency:** Often a required dependency for navigation libraries (like React Navigation, used by Expo Router) to enable native-like swipe gestures (e.g., swipe back on iOS).
    *   **Learn More:**
        *   [React Native Gesture Handler Documentation](https://docs.swmansion.com/react-native-gesture-handler/docs/)
        *   [The Case for react-native-gesture-handler (Blog)](https://blog.swmansion.com/the-case-for-react-native-gesture-handler-a-z-part-1-a62f87a61a9)

### State Management

How data that changes over time is managed and shared across components.

*   **React Context API:**
    *   **What:** A mechanism built into React itself for sharing state down the component tree without explicitly passing props through every intermediate component ("prop drilling").
    *   **Key Details:**
        *   **Provider/Consumer Model:** A `Provider` component makes state available, and `Consumer` components (or the `useContext` hook) subscribe to changes in that state.
        *   **Use Cases:** Ideal for global state like theme information (dark/light mode), user authentication status, or locale settings.
        *   **Performance Considerations:** When the context value changes, *all* components consuming that context will re-render. This can be a performance issue for frequently changing, complex state. For such cases, dedicated state management libraries (like Redux, Zustand, Jotai) might be more suitable, although Context is sufficient for many use cases in this app (Theme, Auth, AI state).
    *   **Learn More:**
        *   [React Context Documentation](https://react.dev/learn/passing-data-deeply-with-context)
        *   [useContext Hook Documentation](https://react.dev/reference/react/useContext)

### Platform APIs & Utilities

Interacting with device features and ensuring proper layout.

*   **Safe Area Context (`react-native-safe-area-context`):**
    *   **What:** A library that provides a reliable way to determine the "safe" viewable area of the screen, accounting for physical limitations like rounded corners, camera notches (iPhone), or navigation bars.
    *   **Key Details:** Essential for ensuring that interactive elements and content are not hidden behind device-specific hardware features. It provides hooks (`useSafeAreaInsets`) to get padding values needed for top, bottom, left, and right edges.
    *   **Learn More:**
        *   [react-native-safe-area-context GitHub](https://github.com/th3rdwave/react-native-safe-area-context)

*   **Status Bar (`expo-status-bar`):**
    *   **What:** The area at the very top of the screen displaying system information. This library allows control over its appearance.
    *   **Key Details:** Can set the style (light/dark content), background color, visibility, and translucency. Configuration can be dynamic based on the current screen or theme.
    *   **Learn More:**
        *   [Expo Status Bar Documentation](https://docs.expo.dev/versions/latest/sdk/status-bar/)

---

## ✨ Styling & UI Components

Defining the visual appearance and using pre-built UI elements.

*   **React Native Paper:**
    *   **What:** A comprehensive library of UI components for React Native that follows Google's Material Design specifications.
    *   **Key Details:**
        *   **Component Library:** Offers a wide range of ready-to-use components (Buttons, Cards, Dialogs, Inputs, Lists, Menus, Snackbars, etc.).
        *   **Material Design:** Adheres to Material Design principles for consistency and familiar UX patterns.
        *   **Theming:** Highly customizable theming system, including built-in support for switching between light and dark modes. The `ThemeContext.tsx` in this app likely leverages this.
        *   **Accessibility:** Components are built with accessibility in mind.
    *   **Learn More:**
        *   [React Native Paper Documentation](https://callstack.github.io/react-native-paper/)
        *   [React Native Paper Theming Guide](https://callstack.github.io/react-native-paper/docs/guides/theming)

*   **React Native StyleSheet:**
    *   **What:** The standard way to define styles in React Native. It uses JavaScript objects with CSS-like properties (converted to camelCase, e.g., `backgroundColor`).
    *   **Key Details:**
        *   **Performance:** Styles defined with `StyleSheet.create` are optimized; they are created once and referenced by ID, reducing overhead.
        *   **No Cascading:** Unlike CSS on the web, styles do not cascade down the component tree. Styles are applied directly to components.
        *   **Layout:** Uses Flexbox for layout by default, similar to web CSS Flexbox.
    *   **Learn More:**
        *   [React Native StyleSheet Documentation](https://reactnative.dev/docs/stylesheet)
        *   [React Native Style Guide](https://reactnative.dev/docs/style)
        *   [React Native Layout with Flexbox](https://reactnative.dev/docs/flexbox)

*   **Material Design:**
    *   **What:** A comprehensive design system developed by Google, providing guidelines and principles for creating consistent and intuitive user interfaces across different platforms.
    *   **Key Details:** Focuses on principles like Material Theming (color, typography, shape), motion, interaction patterns, and usability. React Native Paper is one implementation of this system for React Native.
    *   **Learn More:**
        *   [Material Design 3 Official Website](https://m3.material.io/)
        *   [Material Design Guidelines](https://m3.material.io/guidelines)

*   **Linear Gradients (`expo-linear-gradient`):**
    *   **What:** A visual effect creating a smooth transition between two or more colors along a defined direction (e.g., top-to-bottom, left-to-right).
    *   **Key Details:** Provided by the `expo-linear-gradient` Expo SDK module. Used in this app likely for headers or backgrounds to add visual depth and appeal. Requires specifying colors, start/end points, and optionally locations.
    *   **Learn More:**
        *   [Expo Linear Gradient Documentation](https://docs.expo.dev/versions/latest/sdk/linear-gradient/)

*   **Dark/Light Mode (Theming):**
    *   **What:** A common UI feature allowing users to toggle between a predominantly light or dark interface.
    *   **Key Details:** In this app, likely managed by `ThemeContext.tsx`. This context probably holds the current theme state (light/dark) and provides functions to toggle it. React Native Paper components consume this theme context to adjust their appearance automatically. Custom styles also need to adapt based on the current theme.
    *   **Learn More:**
        *   [React Native Paper Theming](https://callstack.github.io/react-native-paper/docs/guides/theming)
        *   [React Context API](https://react.dev/learn/passing-data-deeply-with-context) (as used for theme management)

*   **DateTimePicker (`@react-native-community/datetimepicker`):**
    *   **What:** A cross-platform component that exposes the native date and time pickers for iOS and Android.
    *   **Key Details:** Provides a consistent API but renders the platform-specific native UI (e.g., the spinning wheels on iOS, the calendar/clock dialog on Android). Used for selecting task deadlines.
    *   **Learn More:**
        *   [React Native Community DateTimePicker GitHub](https://github.com/react-native-datetimepicker/datetimepicker)

---

## ☁️ Backend & Data Management

Handling data storage, retrieval, synchronization, and user authentication.

*   **Supabase:**
    *   **What:** A Backend-as-a-Service (BaaS) platform providing developers with core backend functionalities through APIs and client libraries, abstracting away much of the server infrastructure management.
    *   **Key Details:**
        *   **Postgres Database:** Provides a full-featured, managed PostgreSQL database.
        *   **Authentication:** Built-in user management (email/pass, OAuth, magic links).
        *   **Realtime:** Allows listening to database changes via WebSockets.
        *   **Storage:** File storage for user uploads (not heavily used in this specific app, but available).
        *   **Edge Functions:** Serverless functions for custom backend logic.
        *   **Open Source:** Core components are open source.
    *   **Learn More:**
        *   [Supabase Official Documentation](https://supabase.com/docs)
        *   [Supabase Features Overview](https://supabase.com/docs/features)

*   **PostgreSQL:**
    *   **What:** A powerful, open-source object-relational database system (ORDBMS). Supabase provisions and manages a PostgreSQL database for each project.
    *   **Key Details:**
        *   **Relational:** Stores data in tables with defined schemas (columns, data types, relationships).
        *   **SQL:** Uses Structured Query Language (SQL) for data manipulation and definition.
        *   **Extensibility:** Supports custom functions, data types, and indexing.
        *   **Reliability:** Known for ACID compliance (Atomicity, Consistency, Isolation, Durability), ensuring data integrity.
    *   **Learn More:**
        *   [PostgreSQL Official Documentation](https://www.postgresql.org/docs/)
        *   [SQL Tutorial (W3Schools)](https://www.w3schools.com/sql/)

*   **Row-Level Security (RLS):**
    *   **What:** A crucial security feature in PostgreSQL (and thus Supabase) that allows defining access control policies *directly on database tables*. These policies dictate which rows users are allowed to view, insert, update, or delete based on their identity or other conditions.
    *   **Key Details:** Ensures that users can only access their *own* data in a multi-tenant application. Policies are written in SQL and leverage user session information (like `auth.uid()`). This is fundamental to securing user data in Supabase.
    *   **Learn More:**
        *   [Supabase Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
        *   [Supabase Policy Examples](https://supabase.com/docs/guides/database/postgres/row-level-security)

*   **Real-time Subscriptions:**
    *   **What:** Supabase's feature enabling client applications to subscribe to changes (inserts, updates, deletes) in database tables in real-time.
    *   **Key Details:** When a change occurs matching the subscription criteria, Supabase pushes the update to connected clients via WebSockets. This allows the app UI to reflect database changes instantly without manual polling, crucial for features like live data synchronization across devices.
    *   **Learn More:**
        *   [Supabase Realtime Documentation](https://supabase.com/docs/guides/realtime)
        *   [Supabase Realtime Deep Dive (Blog)](https://supabase.com/blog/supabase-realtime-deep-dive)

*   **Authentication (Email/Password, JWT):**
    *   **What:** Verifying user identity. Supabase Auth handles user sign-up, login, password resets, etc. It uses JWTs for managing sessions securely.
    *   **Key Details:**
        *   **Flow:** User logs in -> Supabase verifies credentials -> Supabase issues a JWT -> App stores JWT securely (e.g., using Expo Secure Store) -> App includes JWT in subsequent requests to Supabase -> Supabase validates JWT to authorize requests.
        *   **JWT (JSON Web Token):** A standard (RFC 7519) for creating compact, self-contained tokens that securely transmit information between parties as a JSON object. They are digitally signed to ensure integrity.
    *   **Learn More:**
        *   [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
        *   [Introduction to JSON Web Tokens (JWT.io)](https://jwt.io/introduction)

*   **AsyncStorage (`@react-native-async-storage/async-storage`):**
    *   **What:** A basic key-value storage mechanism provided for React Native apps. It's asynchronous (operations return Promises) and persistent (data survives app restarts).
    *   **Key Details:**
        *   **Unencrypted:** Data stored is typically not encrypted by default, making it unsuitable for sensitive information like passwords or tokens.
        *   **Use Cases:** Good for caching non-sensitive data, storing user preferences (like theme choice before login), or temporary offline data.
        *   **Limited Size:** Storage capacity can be limited (especially on iOS).
    *   **Learn More:**
        *   [@react-native-async-storage/async-storage Docs](https://react-native-async-storage.github.io/async-storage/)

*   **Expo Secure Store:**
    *   **What:** An Expo SDK module for storing key-value data securely and persistently on the device.
    *   **Key Details:** Encrypts data using the underlying platform's security mechanisms (Keychain on iOS, EncryptedSharedPreferences/Keystore on Android). Ideal for storing sensitive items like JWTs or API keys that need to persist across app sessions.
    *   **Learn More:**
        *   [Expo Secure Store Documentation](https://docs.expo.dev/versions/latest/sdk/secure-store/)

*   **Offline Support & Data Synchronization:**
    *   **What:** Designing the app to remain usable even without an internet connection and to synchronize data with the backend when connectivity returns.
    *   **Key Details:**
        *   **Caching:** Store data fetched from Supabase locally (e.g., in AsyncStorage or potentially a local DB like SQLite via Expo's module).
        *   **Detection:** Detect network status changes.
        *   **Queueing:** Queue local changes (creates, updates, deletes) made while offline.
        *   **Synchronization:** When online, send queued changes to Supabase and fetch latest updates from Supabase.
        *   **Conflict Resolution:** Implement strategies to handle cases where data was changed both locally and on the server while offline (e.g., "last write wins," manual resolution).
    *   **Learn More:**
        *   [Building Offline-First React Native Apps (Blog)](https://www.mongodb.com/developer/products/realm/building-offline-first-react-native-apps-realm/) (Realm specific, but concepts apply)

*   **Optimistic UI Updates:**
    *   **What:** Improving perceived performance by updating the UI immediately after a user action (e.g., marking a task complete) *before* receiving confirmation from the backend (Supabase).
    *   **Key Details:** Assumes the backend operation will succeed. If it fails, the UI change must be reverted. Makes the app feel instant but requires careful handling of potential errors and rollbacks.
    *   **Learn More:**
        *   [Optimistic UI Updates (UX Collective)](https://uxdesign.cc/optimistic-ui-updates-400d539a3f1b)
        *   [Handling Optimistic UI in React (Blog)](https://blog.logrocket.com/handling-optimistic-ui-updates-react/)

---

## 🤖 AI Integration

Leveraging Artificial Intelligence for enhanced features.

*   **DeepSeek API / LLM Integration:**
    *   **What:** Connecting to a Large Language Model (LLM) service like DeepSeek Coder via its API. APIs allow different software systems to communicate.
    *   **Key Details:**
        *   **HTTP Requests:** The app sends user input or context (like task details, user goals) as a "prompt" in an HTTP request to the AI service's endpoint.
        *   **API Key:** Authentication is usually handled via a secret API key included in the request headers. This key must be stored securely (e.g., via environment variables or secure backend proxy, *not* hardcoded in the app).
        *   **Response Handling:** The app receives the AI's generated text response and integrates it into the UI (e.g., displaying suggestions).
        *   **Prompt Engineering:** Crafting effective prompts is crucial to get useful and relevant responses from the AI.
    *   **Learn More:**
        *   [DeepSeek Platform](https://platform.deepseek.com/)
        *   [Introduction to APIs (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) (Using Fetch for HTTP requests)
        *   [Prompt Engineering Guide](https://www.promptingguide.ai/)

*   **Natural Language Processing (NLP):**
    *   **What:** A subfield of AI focused on the interaction between computers and human language. It involves enabling machines to read, understand, interpret, and generate text and speech.
    *   **Key Details:** The external AI service (DeepSeek) performs the complex NLP tasks. The app utilizes NLP capabilities for:
        *   **Intent Recognition:** Understanding what the user wants to do (e.g., "remind me to call mom tomorrow").
        *   **Entity Extraction:** Identifying key pieces of information (e.g., "call mom" = task, "tomorrow" = deadline).
        *   **Text Generation:** Creating suggestions, summaries, or reformatted task descriptions.
    *   **Learn More:**
        *   [Natural Language Processing (Wikipedia)](https://en.wikipedia.org/wiki/Natural_language_processing)
        *   [Stanford NLP Course (YouTube Playlist)](https://www.youtube.com/playlist?list=PLoROMvodv4rOhcuXMZkNm7j3fVwBBY42z)

---

## 🧪 Testing Concepts

Strategies for verifying the application's correctness and stability.

*   **Unit Testing:**
    *   **Focus:** Testing the smallest possible units of code (individual functions, methods, sometimes components) in isolation from the rest of the application.
    *   **Goal:** Verify that each unit works correctly according to its specification. Mocking dependencies (like Supabase calls or AsyncStorage) is common.
    *   **Tools:** Jest (a popular JavaScript testing framework often used with React Native).
*   **Component Testing:**
    *   **Focus:** Testing individual React Native components' rendering and behavior without running the entire app.
    *   **Goal:** Verify that a component displays correctly given certain props and responds appropriately to user interactions (simulated taps, text input).
    *   **Tools:** React Native Testing Library (encourages testing based on user interaction rather than implementation details), Jest.
*   **Integration Testing:**
    *   **Focus:** Testing the interaction *between* multiple units or components.
    *   **Goal:** Verify that different parts of the app work together as expected (e.g., clicking "Save" in `EditTodoScreen` successfully calls the `updateTodo` service which interacts with Supabase). Can involve partial mocking or real services.
    *   **Tools:** Jest, React Native Testing Library.
*   **End-to-End (E2E) Testing:**
    *   **Focus:** Testing complete user workflows across the entire application, running on a real device or simulator.
    *   **Goal:** Simulate real user scenarios (e.g., logging in, adding a task, marking it complete, logging out) to verify the application works correctly from the user's perspective.
    *   **Tools:** Detox, Maestro UI (popular E2E frameworks for React Native).
*   **Manual Testing:**
    *   **Focus:** Human testers interacting with the application to identify bugs, usability issues, and edge cases not covered by automated tests.
    *   **Goal:** Provide qualitative feedback and catch issues that automated tests might miss.

*   **Learn More:**
    *   [Testing React Native Apps (Official Docs)](https://reactnative.dev/docs/testing-overview)
    *   [React Native Testing Library Docs](https://callstack.github.io/react-native-testing-library/)
    *   [Jest Documentation](https://jestjs.io/docs/getting-started)
    *   [Detox E2E Framework](https://wix.github.io/Detox/)
    *   [Maestro UI E2E Framework](https://maestro.mobile.dev/)

---

## 🛠️ DevOps & Deployment

Infrastructure, processes, and tools supporting development, building, and releasing the app.

*   **CLI Tools (Expo, Supabase, npm):**
    *   **What:** Command-Line Interfaces are text-based tools for interacting with services or managing projects.
        *   `npm` (Node Package Manager): Manages project dependencies (installing, updating libraries listed in `package.json`).
        *   `expo`: The Expo CLI tool for initializing projects, starting the development server (`expo start`), running builds (`eas build`), etc.
        *   `supabase`: The Supabase CLI for managing your Supabase project (database migrations, local development setup, deploying functions).
    *   **Learn More:** Links provided in the previous section.

*   **Environment Variables:**
    *   **What:** Configuration values (API keys, URLs) that are kept separate from the source code and injected into the application at build time or runtime depending on the environment (e.g., development vs. production).
    *   **Key Details:** Essential for security (avoids committing secrets) and flexibility (different database URLs for dev/prod). Expo uses `.env` files and build profiles via `eas.json` to manage these.
    *   **Learn More:**
        *   [Expo Environment Variables Guide](https://docs.expo.dev/guides/environment-variables/)
        *   [Expo EAS Build Profiles](https://docs.expo.dev/build-reference/eas-json/)

*   **API Keys:**
    *   **What:** Unique secret strings used to authenticate the application when it makes requests to third-party services (Supabase, DeepSeek).
    *   **Key Details:** Proof that the request is coming from an authorized source. Must be protected; typically loaded from environment variables. Supabase uses distinct keys for different levels of access (e.g., `anon` key for public access, `service_role` key for bypassing RLS - *never* use the service role key in the client app).

*   **Monitoring & Logging:**
    *   **What:** Practices for understanding application health and diagnosing issues. Monitoring involves tracking performance metrics, uptime, and resource usage. Logging involves recording events, errors, and diagnostic information.
    *   **Key Details:** Supabase provides built-in logs and usage metrics. Custom logging within the React Native app (`console.log`, `console.warn`, `console.error`) is crucial during development. For production, dedicated services like Sentry, Datadog, or LogRocket offer more robust error tracking, performance monitoring, and log aggregation.

*   **Git & GitHub:**
    *   **What:** Git is the standard for version control, tracking changes to files over time. GitHub is a web platform providing hosting for Git repositories, plus features for collaboration (pull requests, issues).
    *   **Key Details:** Allows multiple developers to work on the same codebase, revert changes, manage different features in parallel (branches), and maintain a history of the project. Essential for any software project.
    *   **Learn More:** Links provided in the previous section.

*   **Expo EAS Build:**
    *   **What:** Expo's cloud build service that compiles the native iOS and Android app binaries from your project's JavaScript/TypeScript code and native dependencies.
    *   **Key Details:** Necessary because building native apps requires specific SDKs (Xcode for iOS, Android SDK for Android) and configurations, which EAS Build handles in a cloud environment. Produces `.ipa` (iOS) and `.apk` / `.aab` (Android) files ready for distribution or submission to stores.
    *   **Learn More:**
        *   [Expo EAS Build Documentation](https://docs.expo.dev/build/introduction/)

*   **CI/CD (Continuous Integration / Continuous Deployment):**
    *   **What:** Automation practices to streamline development and release cycles.
        *   **CI:** Automatically running builds and tests whenever code is pushed to a repository (e.g., on every push to a `develop` branch). Ensures new code integrates correctly.
        *   **CD:** Automatically deploying the application (e.g., to internal testers via EAS Submit, or even to production) after CI passes.
    *   **Key Details:** Reduces manual effort, improves consistency, and enables faster releases. Can be implemented using platforms like GitHub Actions, GitLab CI, CircleCI, often integrating with EAS CLI commands.
    *   **Learn More:** Links provided in the previous section.

---

*This document provides a starting point. The world of mobile and web development is vast; use the linked resources to explore these concepts in greater detail.* 