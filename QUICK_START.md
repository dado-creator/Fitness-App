# FitTrack Quick Start Guide

## 🚀 Installation & Setup

### 1. Prerequisites
Assicurati di avere installato:
- Node.js 18+ ([download](https://nodejs.org/))
- npm o yarn
- Expo CLI: `npm install -g expo-cli`

### 2. Clone & Install
```bash
cd /Users/user/Desktop/app_fitness
npm install
```

### 3. Configure Environment
```bash
# Copia il file di esempio
cp .env.example .env

# Aggiungi le tue credenziali:
# - EXPO_PUBLIC_SUPABASE_URL
# - EXPO_PUBLIC_SUPABASE_ANON_KEY
# - EXPO_PUBLIC_OPENAI_API_KEY
```

### 4. Setup Supabase
1. Vai a https://supabase.com
2. Crea un nuovo progetto
3. Esegui le query SQL dal file `docs/DATABASE_SCHEMA.md` nella console di Supabase
4. Copia l'URL e la Anon Key nel tuo `.env`

### 5. Start Development
```bash
# Avvia il dev server
npm start

# Scegli la piattaforma:
# - Premi 'i' per iOS
# - Premi 'a' per Android
# - Premi 'w' per Web
```

## 📂 Project Structure Summary

```
app_fitness/
├── app/                          ← Expo Router pages
├── src/
│   ├── screens/                 ← Full screen components
│   ├── components/              ← Reusable UI components
│   ├── services/                ← API & Supabase logic
│   │   ├── config.ts
│   │   ├── exercise.service.ts
│   │   ├── workout.service.ts
│   │   └── progress.service.ts
│   ├── hooks/                   ← Custom React hooks
│   ├── context/                 ← Zustand stores (state management)
│   ├── types/                   ← TypeScript interfaces
│   ├── constants/               ← App constants
│   ├── utils/                   ← Helper functions
│   ├── assets/                  ← Images, SVG, fonts
│   └── data/                    ← Seed data
├── docs/                         ← Documentation
└── package.json
```

## 🔑 Key Files

### Services Layer
All Supabase interactions go through services:

```typescript
// src/services/exercise.service.ts
import { exerciseService } from '@services/exercise.service';
const exercises = await exerciseService.searchExercises(query);

// src/services/workout.service.ts
import { workoutService } from '@services/workout.service';
const session = await workoutService.createWorkoutSession(...);

// src/services/progress.service.ts
import { progressService } from '@services/progress.service';
const progress = await progressService.getUserAllProgress(userId);
```

### State Management
Usa Zustand stores per stato globale:

```typescript
// src/context/activeWorkout.store.ts
import { useActiveWorkoutStore } from '@context/activeWorkout.store';
const { activeSession, addLog } = useActiveWorkoutStore();

// src/context/user.store.ts
import { useUserStore } from '@context/user.store';
const { user, setUser } = useUserStore();
```

### Custom Hooks
Logica riutilizzabile in hook:

```typescript
// src/hooks/useExerciseSearch.ts
import { useExerciseSearch } from '@hooks/useExerciseSearch';
const { results, isLoading } = useExerciseSearch(query);

// src/hooks/useWorkoutTimer.ts
import { useWorkoutTimer } from '@hooks/useWorkoutTimer';
const { formatTime, start, pause } = useWorkoutTimer();
```

### Types
Tutti i tipi TypeScript centralizzati:

```typescript
// src/types/index.ts
import { Exercise, WorkoutSession, MuscleGroup } from '@types/index';
```

## 📝 Development Workflow

### 1. Creating a New Screen
```typescript
// src/screens/NewScreen.tsx
import React from 'react';
import { View, Text } from 'react-native';

export const NewScreen = () => {
  return (
    <View className="flex-1 bg-dark p-md">
      <Text className="text-white text-xl font-bold">New Screen</Text>
    </View>
  );
};

export default NewScreen;
```

### 2. Creating a Component
```typescript
// src/components/MyComponent.tsx
import React from 'react';
import { View, Text, Pressable } from 'react-native';

interface MyComponentProps {
  title: string;
  onPress: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({ 
  title, 
  onPress 
}) => {
  return (
    <Pressable 
      onPress={onPress}
      className="bg-primary p-md rounded-lg"
    >
      <Text className="text-white font-bold">{title}</Text>
    </Pressable>
  );
};
```

### 3. Using Services
```typescript
// In a component or screen
import { exerciseService } from '@services/exercise.service';
import { useAsync } from '@hooks/useAsync';

const { data: exercises, isLoading } = useAsync(
  () => exerciseService.getAllExercises()
);
```

## 🎨 Styling with NativeWind

```typescript
// Usa Tailwind classes come al web!
<View className="flex-1 bg-dark p-md">
  <Text className="text-white text-lg font-bold">Hello</Text>
  <Pressable className="bg-primary py-lg px-xl rounded-lg">
    <Text className="text-white">Press me</Text>
  </Pressable>
</View>
```

### Available Colors
- `bg-primary` (#FF6B35)
- `bg-secondary` (#004E89)
- `bg-accent` (#F77F00)
- `bg-dark` (#0B1929)
- `bg-light` (#F5F5F5)
- `text-white`, `text-dark`, `text-light`

## 🔍 Debugging

### React Native Debugger
```bash
# Install React Native Debugger
# https://github.com/jhen0409/react-native-debugger

# Then in Expo:
# Premi Shift+M per aprire il menu
# Seleziona "Launch Remote Debugger"
```

### Console Logs
```typescript
import { Alert } from 'react-native';

Alert.alert('Debug', JSON.stringify(data));
```

## ✅ Next Steps

1. **Phase 3**: Implement Workout Logger interface
2. **Phase 4**: Build muscle heatmap visualization
3. **Phase 5**: Create analytics dashboard
4. **Phase 6**: Add AI exercise suggestions

---

**Last Updated**: 2 Giugno 2026
