# Notes & Reminders App

A beautiful and functional Android mobile app for taking notes and setting reminders, built with React Native and Expo.

## Features

### 📝 Notes
- Create, edit, and delete notes
- Rich text support with title and content
- Search functionality across all notes
- Share notes with other apps
- Copy notes to clipboard
- Local storage for offline access

### ⏰ Reminders
- Set reminders with date and time
- Push notifications for alerts
- Mark reminders as complete
- Automatic notification scheduling
- Delete past or completed reminders
- Local storage persistence

### ⚙️ Settings
- Dark/Light theme toggle (coming soon)
- Notification preferences
- Data export functionality
- Clear all data option
- Privacy policy and app information

## Technical Stack

- **Framework**: React Native with Expo SDK 53
- **Navigation**: Expo Router with tab-based navigation
- **Storage**: AsyncStorage for local data persistence
- **Notifications**: Expo Notifications for reminders
- **Icons**: Lucide React Native icons
- **TypeScript**: Full TypeScript support
- **Platform**: Optimized for Android

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Expo CLI
- Android Studio (for Android development)
- Physical Android device or emulator

### Installation

1. **Clone or download the project**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Run on Android**
   - Install the Expo Go app on your Android device
   - Scan the QR code from the terminal
   - Or use `a` in the terminal to open Android emulator

### Building for Production

1. **Install EAS CLI**
   ```bash
   npm install -g @expo/eas-cli
   ```

2. **Login to Expo**
   ```bash
   eas login
   ```

3. **Configure your project**
   - Update `app.json` with your bundle identifier
   - Modify `eas.json` if needed

4. **Build APK for testing**
   ```bash
   eas build --platform android --profile preview
   ```

5. **Build AAB for Play Store**
   ```bash
   eas build --platform android --profile production
   ```

## Project Structure

```
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx      # Tab navigation layout
│   │   ├── index.tsx        # Notes screen
│   │   ├── reminders.tsx    # Reminders screen
│   │   └── settings.tsx     # Settings screen
│   ├── _layout.tsx          # Root layout
│   └── +not-found.tsx       # 404 screen
├── types/
│   └── storage.ts           # TypeScript interfaces
├── utils/
│   ├── storage.ts           # Storage utilities
│   └── notifications.ts     # Notification utilities
├── eas.json                 # EAS Build configuration
├── app.json                 # Expo configuration
└── package.json             # Dependencies
```

## Key Features Implementation

### Local Storage
- Uses AsyncStorage for persistent data storage
- Automatic data serialization/deserialization
- Error handling and fallbacks

### Push Notifications
- Expo Notifications for reminder alerts
- Automatic permission requests
- Notification scheduling and cancellation
- Android notification channels

### Modern UI/UX
- Material Design principles
- Smooth animations and transitions
- Responsive design for various screen sizes
- Intuitive navigation with bottom tabs

## Configuration Files

### EAS Build Configuration (`eas.json`)
- Development builds with Expo Dev Client
- Preview builds generating APK files
- Production builds generating AAB files for Play Store

### App Configuration (`app.json`)
- Android-specific settings
- Notification permissions
- Bundle identifiers and app metadata

## Data Export/Import
- Export all notes and reminders as JSON
- Share exported data via system share sheet
- Import functionality through settings

## Privacy & Security
- All data stored locally on device
- No cloud storage or external services
- No personal data collection
- Transparent privacy policy

## Development Notes

### Dependencies
- `@react-native-async-storage/async-storage` - Local storage
- `expo-notifications` - Push notifications  
- `@react-native-community/datetimepicker` - Date/time selection
- `expo-sharing` - System sharing capabilities
- `expo-clipboard` - Clipboard access
- `react-native-uuid` - UUID generation
- `lucide-react-native` - Modern icons

### Platform Support
- Primary target: Android
- Web support available for development
- iOS support possible with minimal changes

## License

This project is open source and available under the MIT License."# SauvonsTonExam-new" 
"# SauvonsTonExam-new" 
"# SauvonsTonExam-new" 
"# SauvonsTonExam-new" 
