# FitTrack - Advanced Fitness Tracking App

Advanced AI-powered fitness tracking application for iOS and Android with real-time workout logging, muscle heatmaps, and intelligent exercise suggestions.

## 🏋️ Features

- **Workout Logger**: Log exercises with sets, reps, and weight in real-time
- **Muscle Heatmap**: Visualize muscle engagement with interactive 3D/SVG heatmaps
- **Progress Tracker**: Track strength gains and volume over time with advanced analytics
- **AI Exercise Suggestions**: Get intelligent exercise variants based on equipment availability
- **Workout Templates**: Pre-built and customizable workout programs
- **Mood Tracking**: Monitor workout intensity and recovery state

## 🛠️ Tech Stack

- **Frontend**: React Native + Expo
- **UI Framework**: NativeWind (TailwindCSS)
- **State Management**: Zustand
- **Backend & Database**: Supabase
- **Charts**: React Native Chart Kit
- **AI Integration**: OpenAI API

## 📁 Project Structure

```
app_fitness/
├── app/                          # Expo Router screens
│   ├── _layout.tsx              # Root layout
│   └── index.tsx                # Home screen
├── src/
│   ├── screens/                 # Screen components
│   ├── components/              # Reusable UI components
│   ├── services/                # API and Supabase services
│   │   ├── config.ts            # Supabase & OpenAI config
│   │   ├── exercise.service.ts  # Exercise operations
│   │   ├── workout.service.ts   # Workout logging
│   │   └── progress.service.ts  # Progress tracking
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAsync.ts          # Async operations
│   │   ├── useExerciseSearch.ts # Exercise search
│   │   └── useWorkoutTimer.ts   # Workout timer
│   ├── context/                 # Zustand stores
│   │   ├── activeWorkout.store.ts
│   │   ├── user.store.ts
│   │   └── cache.store.ts
│   ├── types/                   # TypeScript interfaces
│   ├── constants/               # App constants
│   ├── utils/                   # Utility functions
│   │   ├── calculations.ts      # Volume & strain calculations
│   │   ├── formatting.ts        # Date & number formatting
│   │   └── ...
│   ├── assets/                  # Images, SVG, fonts
│   │   ├── images/
│   │   └── svg/
│   └── data/                    # Seed data and fixtures
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── babel.config.js
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI

### Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Add your Supabase credentials and OpenAI API key
```

### Running the App

```bash
# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web
```

## 📋 Development Phases

- ✅ **Phase 1**: Database schema and structure
- ✅ **Phase 2**: Project architecture and setup
- ⏳ **Phase 3**: Workout Logger implementation
- ⏳ **Phase 4**: Muscle heatmap and strain calculations
- ⏳ **Phase 5**: Analytics and progress tracking
- ⏳ **Phase 6**: AI-powered exercise suggestions

## 🗄️ Database Schema

See [DATABASE_SCHEMA.md](./docs/DATABASE_SCHEMA.md) for detailed schema information.

## 🔐 Environment Variables

Create a `.env` file with:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_key
```

## 📝 License

MIT

## 👨‍💻 Author

Your Name

---

**Status**: In active development 🚀
