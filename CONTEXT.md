## 🧩 Additional Features

The Settings page in **My Todo List** app provides users with control over their preferences, account, and app behavior. Below are the planned components for this screen:

### 🔧 Settings Page Components

#### 🌗 Theme & UI Preferences
- **Light/Dark Mode Toggle** – Switch between light and dark themes.
- **Accent Color Picker** – Allow users to personalize the app's highlight color.
- **Font Size Adjustment** – Choose from predefined sizes or use a slider for accessibility.

#### 🔐 Account Management
- **Logout** – Sign out of the current session.
- **Change Password** – Update user credentials securely.
- **Edit Email Address** – Modify the registered email.
- **Two-Factor Authentication Toggle** *(optional)* – Add extra account security.
- **Delete Account** – Permanently remove account with confirmation dialog.

#### 📱 App Behavior
- **Enable/Disable Notifications** – Manage task reminders or updates.
- **Default Sort Method for Todos** – Choose how tasks are sorted (e.g., priority, creation date).
- **Task View Mode** – Toggle between list and grid views.

#### 🤖 AI Settings
- **AI Suggestions Toggle** – Enable or disable AI-generated task suggestions.
- **Clear AI History** – Remove stored AI chat history.
- **AI Priority Sorting Toggle** – Control whether AI affects task order.

#### 🌍 Language & Region
- **Language Selector** – Choose a preferred language (support for internationalization).
- **Time Format (12h / 24h)** – Set preferred time display.

#### 🧪 Developer / Experimental Options
- **Beta Features Toggle** – Try out experimental features.
- **Reset App Data** – Clear all local app data (useful for troubleshooting and development).

#### 📄 Legal and Information
- **Privacy Policy** – View the app's privacy policy.
- **Terms of Service** – Review the terms of use.
- **App Version** – Display current version and build number.
- **Contact Support / Feedback** – Provide a way to report issues or suggestions.

### 🧱 Suggested UI Components (React Native Paper)
- `Switch` – For toggles like theme, notifications, and AI features.
- `Button` – For actions such as logout, save, and delete.
- `List.Accordion` – Organize settings in collapsible sections.
- `Dialog` or `Modal` – For confirmations and pop-up messages.
- `TextInput` – For editable fields like email or password.
- `Divider` – Visually separate settings sections for clarity. 