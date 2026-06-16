# FitTrack Project Structure

## Directory Organization

### `/app` - Expo Router Pages
Contains all the screen/page files using Expo Router navigation system.

### `/src/screens` - Screen Components
Full-page components that represent distinct screens in the app:
- `HomeScreen.tsx` - Dashboard with quick stats
- `WorkoutLoggerScreen.tsx` - Active workout interface
- `MuscleHeatmapScreen.tsx` - Visualize muscle engagement
- `ProgressScreen.tsx` - Analytics and progress tracking
- `TemplatesScreen.tsx` - Browse and select workout templates
- `SettingsScreen.tsx` - User preferences and configuration

### `/src/components` - Reusable Components
Smaller, reusable UI components:
- `ExerciseCard.tsx` - Display single exercise info
- `SetLogger.tsx` - Log individual set data
- `MuscleHeatmap.tsx` - Interactive SVG muscle visualization
- `ProgressChart.tsx` - Display workout progress graphs
- `WorkoutTimer.tsx` - Workout duration timer
- `MoodSelector.tsx` - RPE and mood selection
- `FAB.tsx` - Floating action buttons

### `/src/services` - Business Logic
API integration and data services:
- `config.ts` - Supabase and external API initialization
- `exercise.service.ts` - Exercise search and retrieval
- `workout.service.ts` - Workout session operations
- `progress.service.ts` - 1RM and volume calculations
- `ai.service.ts` - OpenAI integration for exercise suggestions
- `auth.service.ts` - User authentication

### `/src/hooks` - Custom React Hooks
Reusable logic hooks:
- `useAsync.ts` - Generic async data fetching
- `useExerciseSearch.ts` - Debounced exercise search
- `useWorkoutTimer.ts` - Workout session timer
- `useHeatmapData.ts` - Muscle strain calculations

### `/src/context` - State Management (Zustand)
Global state stores:
- `activeWorkout.store.ts` - Current workout session state
- `user.store.ts` - User profile and auth state
- `cache.store.ts` - Cached exercises and muscles

### `/src/types` - TypeScript Definitions
All TypeScript interfaces and types for type safety

### `/src/constants` - App Constants
Fixed values and enumerations used throughout the app

### `/src/utils` - Utility Functions
Helper functions:
- `calculations.ts` - Volume, 1RM, strain calculations
- `formatting.ts` - Date and number formatting
- `validation.ts` - Input validation functions

### `/src/assets` - Static Resources
- `images/` - App icons, splash screens, logos
- `svg/` - SVG heatmap and anatomical diagrams
- `fonts/` - Custom fonts (if any)

### `/src/data` - Seed Data and Fixtures
- `seedData.ts` - Initial database data
- `mockData.ts` - Testing fixtures

## File Naming Conventions

- **Components**: PascalCase (e.g., `WorkoutLogger.tsx`)
- **Services**: camelCase with `.service.ts` suffix (e.g., `workout.service.ts`)
- **Hooks**: camelCase with `use` prefix (e.g., `useExerciseSearch.ts`)
- **Utilities**: camelCase (e.g., `calculations.ts`)
- **Types**: PascalCase (e.g., `Exercise.ts`)
- **Stores**: camelCase with `.store.ts` suffix (e.g., `user.store.ts`)

## Import Path Aliases

```typescript
// Instead of: import from '../../../services/workout.service'
import { workoutService } from '@services/workout.service';

// Available aliases:
@/        -> src/
@screens/ -> src/screens/
@components/ -> src/components/
@services/ -> src/services/
@hooks/   -> src/hooks/
@utils/   -> src/utils/
@constants/ -> src/constants/
@types/   -> src/types/
@context/ -> src/context/
@assets/  -> src/assets/
@data/    -> src/data/
```

## Architecture Patterns

### Service Pattern
Services handle all API and data operations:
```typescript
// Usage
const exercises = await exerciseService.searchExercises(query);
const progress = await progressService.getUserAllProgress(userId);
```

### Hook Pattern
Hooks encapsulate complex logic:
```typescript
// Usage
const { results, isLoading, error } = useExerciseSearch(query);
const { elapsedSeconds, formatTime, start, pause } = useWorkoutTimer();
```

### Store Pattern (Zustand)
Global state for shared data:
```typescript
// Usage
const { activeSession, addLog, removeLog } = useActiveWorkoutStore();
const { user, setUser, clearUser } = useUserStore();
```

## Best Practices

1. **Separation of Concerns**: Keep UI, logic, and data services separate
2. **Type Safety**: Always use TypeScript types, avoid `any`
3. **Error Handling**: Use try-catch in services, handle errors in UI
4. **Performance**: Use hooks for data fetching, memoization for heavy components
5. **Naming**: Be descriptive and consistent with naming conventions
6. **Testing**: Write tests for services and complex utilities

## Dependencies Management

- **UI**: React Native, NativeWind (TailwindCSS)
- **Navigation**: Expo Router
- **State**: Zustand
- **Backend**: Supabase JS client
- **Charts**: React Native Chart Kit
- **Dates**: date-fns
- **HTTP**: Axios (for API calls)
- **Async Storage**: @react-native-async-storage

## Next Steps

Continue to Phase 3 for Workout Logger implementation.
