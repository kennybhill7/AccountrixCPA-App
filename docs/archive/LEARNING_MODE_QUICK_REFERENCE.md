# Learning Mode Quick Reference

## Quick Access

### Get Current Mode
```typescript
const { learningMode, modeConfig } = useUserProgress();
```

### Check Features
```typescript
const { isFeatureEnabled } = useUserProgress();

isFeatureEnabled('hintsEnabled')        // Boolean
isFeatureEnabled('skipAllowed')         // Boolean
isFeatureEnabled('timeLimitsRequired')  // Boolean
isFeatureEnabled('heartsSystem')        // Boolean
```

### Switch Mode
```typescript
const { switchLearningMode } = useUserProgress();

switchLearningMode('cpa', 'User wants exam prep');
```

## Feature Matrix

| Feature | Student Mode | CPA Mode |
|---------|--------------|----------|
| Content Unlock | Sequential | All Unlocked |
| Lesson Length | Full (2000+ words) | Summary (500 words) |
| Hints | Available | Not Available |
| Time Limits | Optional | Required |
| Quiz Retakes | Unlimited | Limited (3 max) |
| Explanations | Detailed | Brief |
| Hearts System | Enabled | Disabled |
| Skip Questions | Allowed | Not Allowed |
| Progress Pace | 6 months | 2-3 months |
| Tooltips | Extensive | None |
| Mascot | Shown | Hidden |

## Common Patterns

### Conditional Rendering
```typescript
// Show only in Student Mode
{modeConfig.features.heartsSystem && <HeartsDisplay />}

// Show only in CPA Mode
{learningMode === 'cpa' && <PerformanceGraph />}

// Different content per mode
{learningMode === 'student' ? (
  <DetailedExplanation />
) : (
  <BriefSummary />
)}
```

### Quiz Adaptation
```typescript
const quizConfig = adaptQuizConfigForMode(learningMode, {
  id: 'quiz-1',
  title: 'Week 1 Quiz',
});

// Result:
// Student: { mode: 'practice', showHints: true, timeLimit: undefined }
// CPA: { mode: 'cpa-exam', showHints: false, timeLimit: 3600 }
```

### Lesson Content
```typescript
const content = getLessonContentForMode(
  learningMode,
  lesson.fullContent,
  lesson.summaryContent
);

// Returns summary in CPA mode, full in Student mode
```

### Time Limits
```typescript
const timeLimit = getQuestionTimeLimit(learningMode, 'hard');

// Student: undefined (no limit)
// CPA: 120 seconds (2 minutes for hard questions)
```

## Component Examples

### Simple Mode Badge
```typescript
<LearningModeToggle compact />
```

### Full Mode Toggle
```typescript
<LearningModeToggle showComparison />
```

### Mode-Aware Button
```typescript
<Button disabled={!isFeatureEnabled('skipAllowed')}>
  Skip Question
</Button>
```

### Conditional Help Text
```typescript
{shouldShowUIElement(learningMode, 'showTooltips') && (
  <Tooltip content="This is a debit account">
    <InfoIcon />
  </Tooltip>
)}
```

## Store Methods

```typescript
const {
  // State
  learningMode,              // 'student' | 'cpa'
  modeConfig,                // Full configuration object
  modeSwitchHistory,         // Array of past switches
  modeAnalytics,             // Performance by mode

  // Actions
  switchLearningMode,        // (newMode, reason?) => void
  getLearningMode,           // () => LearningMode
  getModeConfig,             // () => LearningModeConfig
  isFeatureEnabled,          // (feature) => boolean
  updateModeAnalytics,       // (type, data) => void
} = useUserProgress();
```

## Helper Functions

```typescript
import {
  getModeConfig,
  getOppositeMode,
  isFeatureEnabled,
  shouldShowUIElement,
  getContentSetting,
  adaptQuizConfigForMode,
  getQuestionTimeLimit,
  getLessonContentForMode,
  isContentUnlocked,
  getDailyGoalsForMode,
  getModeColorScheme,
  getModeSwitchConfirmationMessage,
  getRecommendedMode,
  shouldPromptModeSwitch,
} from '@/lib/learning-mode';
```

## Default Configurations

### Student Mode (Default)
- Icon: 🎓
- Sequential unlock: ✅
- Hints enabled: ✅
- Time limits: ❌
- Unlimited retakes: ✅
- Hearts system: ✅
- Skip allowed: ✅
- Estimated completion: 6 months

### CPA Review Mode
- Icon: 📚
- All unlocked: ✅
- Hints enabled: ❌
- Time limits: ✅
- Limited retakes: 3 max
- Hearts system: ❌
- Skip allowed: ❌
- Estimated completion: 2-3 months

## Migration Checklist

When adding mode support to a component:

- [ ] Import `useUserProgress` from `@/lib/store`
- [ ] Get `learningMode` and `modeConfig` from store
- [ ] Replace hardcoded feature flags with `isFeatureEnabled()`
- [ ] Add mode-specific UI elements
- [ ] Test both Student and CPA modes
- [ ] Add loading state check with `useHydratedStore()`
- [ ] Update analytics tracking
- [ ] Add mode indicator badge
- [ ] Document mode-specific behavior

## Common Issues

### 1. Mode doesn't persist
✅ Check zustand persist configuration

### 2. Wrong mode after switch
✅ Use `modeConfig` from store, not `getModeConfig(learningMode)`

### 3. Features not updating
✅ Use `isFeatureEnabled()` method from store

### 4. Hydration errors
✅ Always check `useHydratedStore()` before rendering

## Performance Tips

1. **Memoize mode-dependent calculations**
```typescript
const quizConfig = useMemo(
  () => adaptQuizConfigForMode(learningMode),
  [learningMode]
);
```

2. **Avoid unnecessary re-renders**
```typescript
// Only subscribe to what you need
const isFeatureEnabled = useUserProgress((state) => state.isFeatureEnabled);
```

3. **Lazy load mode-specific components**
```typescript
const PerformanceGraph = lazy(() => import('./PerformanceGraph'));

{learningMode === 'cpa' && (
  <Suspense fallback={<Skeleton />}>
    <PerformanceGraph />
  </Suspense>
)}
```

## Testing Shortcuts

```typescript
// Override mode in tests
const { rerender } = render(<Component />, {
  wrapper: ({ children }) => (
    <StoreProvider initialState={{ learningMode: 'cpa' }}>
      {children}
    </StoreProvider>
  ),
});

// Switch mode during test
act(() => {
  store.getState().switchLearningMode('student');
});

// Assert mode-specific behavior
expect(screen.queryByText('Hint')).not.toBeInTheDocument(); // CPA mode
expect(screen.getByText('Hint')).toBeInTheDocument(); // Student mode
```

## Useful Links

- Full Integration Guide: [LEARNING_MODE_INTEGRATION.md](./LEARNING_MODE_INTEGRATION.md)
- Type Definitions: `types/learning-mode.ts`
- Utility Functions: `lib/learning-mode.ts`
- Store Implementation: `lib/store.ts`
- UI Component: `components/LearningModeToggle.tsx`
