# Learning Mode System Integration Guide

## Overview

The Learning Mode System provides two distinct learning experiences:
- **Student Mode**: Designed for beginners learning accounting fundamentals
- **CPA Review Mode**: Intensive exam preparation for experienced learners

## Architecture

### Core Files

1. **`types/learning-mode.ts`** - TypeScript type definitions
2. **`lib/learning-mode.ts`** - Utility functions and mode logic
3. **`lib/store.ts`** - Zustand store integration
4. **`components/LearningModeToggle.tsx`** - UI component for mode switching
5. **`components/ui/alert-dialog.tsx`** - Confirmation dialog component

### Key Concepts

#### Learning Modes

```typescript
type LearningMode = 'student' | 'cpa';
```

Each mode has a comprehensive configuration that controls:
- Feature availability (hints, time limits, retakes, etc.)
- UI behavior (tooltips, guidance, celebrations)
- Content presentation (full vs summary)
- Pacing recommendations

#### Mode Configuration

```typescript
interface LearningModeConfig {
  mode: LearningMode;
  label: string;
  icon: string;
  description: string;
  bestFor: string;
  features: LearningModeFeatures;
  pacing: LearningModePacing;
  ui: LearningModeUI;
  content: LearningModeContent;
}
```

## Using the Learning Mode System

### 1. Accessing Current Mode

```typescript
import { useUserProgress } from '@/lib/store';

function MyComponent() {
  const { learningMode, modeConfig } = useUserProgress();

  // Current mode: 'student' or 'cpa'
  console.log(learningMode);

  // Full configuration
  console.log(modeConfig);
}
```

### 2. Checking Feature Availability

```typescript
import { useUserProgress } from '@/lib/store';

function QuizComponent() {
  const { isFeatureEnabled } = useUserProgress();

  // Check if hints should be shown
  const showHints = isFeatureEnabled('hintsEnabled');

  // Check if skip is allowed
  const canSkip = isFeatureEnabled('skipAllowed');

  return (
    <div>
      {showHints && <HintButton />}
      {canSkip && <SkipButton />}
    </div>
  );
}
```

### 3. Switching Modes

```typescript
import { useUserProgress } from '@/lib/store';

function ModeSwitcher() {
  const { switchLearningMode } = useUserProgress();

  const handleSwitch = () => {
    switchLearningMode('cpa', 'User wants faster pace');
  };

  return <button onClick={handleSwitch}>Switch to CPA Mode</button>;
}
```

### 4. Using Helper Functions

```typescript
import {
  getModeConfig,
  isFeatureEnabled,
  shouldShowUIElement,
  getContentSetting,
} from '@/lib/learning-mode';

// Get config for any mode
const studentConfig = getModeConfig('student');
const cpaConfig = getModeConfig('cpa');

// Check features without store access
const hintsEnabled = isFeatureEnabled('student', 'hintsEnabled');

// Check UI elements
const showTooltips = shouldShowUIElement('student', 'showTooltips');

// Get content settings
const lessonLength = getContentSetting('student', 'lessonWordCountTarget');
```

## Component Integration Examples

### Quiz Engine Adaptation

Update `components/QuizEngine.tsx` to adapt based on learning mode:

```typescript
import { useUserProgress } from '@/lib/store';
import { adaptQuizConfigForMode } from '@/lib/learning-mode';

export function QuizEngine({ monthId, weekId, questions }: QuizEngineProps) {
  const { learningMode, isFeatureEnabled } = useUserProgress();

  // Adapt quiz config based on mode
  const quizConfig = adaptQuizConfigForMode(learningMode, {
    id: `${monthId}-${weekId}`,
    title: 'Weekly Quiz',
  });

  // Mode-specific behavior
  const showHints = isFeatureEnabled('hintsEnabled');
  const allowSkip = isFeatureEnabled('skipAllowed');
  const enforceTimeLimit = isFeatureEnabled('timeLimitsRequired');

  return (
    <div>
      {/* Student Mode: Show hints */}
      {showHints && currentQuestion.hints && (
        <HintSection hints={currentQuestion.hints} />
      )}

      {/* Student Mode: Allow skip */}
      {allowSkip && (
        <Button onClick={handleSkip}>Skip Question</Button>
      )}

      {/* CPA Mode: Show timer */}
      {enforceTimeLimit && (
        <Timer
          duration={getQuestionTimeLimit(learningMode, question.difficulty)}
          onExpire={handleTimeExpire}
        />
      )}

      {/* Mode indicator */}
      <Badge>{learningMode === 'student' ? '🎓 Student' : '📚 CPA Review'}</Badge>
    </div>
  );
}
```

### Lesson Content Adaptation

Update lesson pages to show appropriate content:

```typescript
import { useUserProgress } from '@/lib/store';
import { getLessonContentForMode } from '@/lib/learning-mode';

export function LessonPage({ lesson }: LessonPageProps) {
  const { learningMode } = useUserProgress();

  // Get appropriate content based on mode
  const content = getLessonContentForMode(
    learningMode,
    lesson.fullContent,
    lesson.summaryContent
  );

  return (
    <div>
      {learningMode === 'cpa' && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            You are viewing condensed content. Switch to Student Mode for full details.
          </AlertDescription>
        </Alert>
      )}

      <LessonBody content={content} />
    </div>
  );
}
```

### Navigation Lock/Unlock Logic

Update navigation to handle sequential vs all-unlocked:

```typescript
import { useUserProgress } from '@/lib/store';
import { isContentUnlocked } from '@/lib/learning-mode';

export function CurriculumNav({ months }: CurriculumNavProps) {
  const { learningMode, completedQuizzes } = useUserProgress();

  return (
    <div>
      {months.map((month) => (
        <MonthSection key={month.id}>
          {month.weeks.map((week) => {
            const weekId = `${month.id}:${week.id}`;
            const unlocked = isContentUnlocked(
              learningMode,
              weekId,
              completedQuizzes
            );

            return (
              <WeekCard
                key={week.id}
                week={week}
                locked={!unlocked}
                showLockIcon={learningMode === 'student' && !unlocked}
              />
            );
          })}
        </MonthSection>
      ))}
    </div>
  );
}
```

### Mode-Specific UI Elements

Show different UI elements based on mode:

```typescript
import { useUserProgress } from '@/lib/store';

export function StudyInterface() {
  const { learningMode, modeConfig } = useUserProgress();

  return (
    <div>
      {/* Student Mode: Show mascot and tooltips */}
      {modeConfig.ui.showMascot && <Mascot message="Keep it up!" />}

      {modeConfig.ui.showTooltips && (
        <Tooltip content="This helps you understand debits and credits">
          <InfoIcon />
        </Tooltip>
      )}

      {/* CPA Mode: Show performance graphs */}
      {modeConfig.ui.showPerformanceGraphs && (
        <PerformanceGraph data={performanceData} />
      )}

      {/* CPA Mode: Show weak areas */}
      {modeConfig.ui.showWeakAreas && (
        <WeakAreasPanel topics={weakTopics} />
      )}

      {/* Student Mode: Progress celebrations */}
      {modeConfig.ui.showProgressCelebrations && completedLesson && (
        <Confetti />
      )}
    </div>
  );
}
```

### Daily Goals Adaptation

Adjust daily goals based on mode:

```typescript
import { useUserProgress } from '@/lib/store';
import { getDailyGoalsForMode } from '@/lib/learning-mode';

export function DailyGoalsPanel() {
  const { learningMode } = useUserProgress();
  const goals = getDailyGoalsForMode(learningMode);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Goals</CardTitle>
        <CardDescription>
          {learningMode === 'student'
            ? 'Take your time and learn thoroughly'
            : 'Intensive review - push yourself!'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div>XP Goal: {goals.xpGoal}</div>
        <div>Lessons: {goals.lessonsGoal}</div>
        <div>Quizzes: {goals.quizzesGoal}</div>
      </CardContent>
    </Card>
  );
}
```

## Analytics Integration

Track mode usage and performance:

```typescript
import { useUserProgress } from '@/lib/store';

export function useTrackModePerformance() {
  const { updateModeAnalytics } = useUserProgress();

  const trackLessonComplete = (timeSpent: number) => {
    updateModeAnalytics('lesson', { timeSpent });
  };

  const trackQuizComplete = (score: number, timeSpent: number, xpEarned: number) => {
    updateModeAnalytics('quiz', { score, timeSpent, xpEarned });
  };

  return { trackLessonComplete, trackQuizComplete };
}

// Usage in component
function LessonPage() {
  const { trackLessonComplete } = useTrackModePerformance();
  const [startTime] = useState(Date.now());

  const handleComplete = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    trackLessonComplete(timeSpent);
  };
}
```

## Mode Recommendations

Automatically recommend mode switches:

```typescript
import { useUserProgress } from '@/lib/store';
import { getRecommendedMode, shouldPromptModeSwitch } from '@/lib/learning-mode';
import { useState, useEffect } from 'react';

export function ModeRecommendationPrompt() {
  const {
    learningMode,
    totalLessonsCompleted,
    totalQuizzesCompleted,
    completedQuizzes,
    xp,
    modeAnalytics,
    lastModeRecommendationDate,
  } = useUserProgress();

  const [showPrompt, setShowPrompt] = useState(false);
  const [recommendation, setRecommendation] = useState<any>(null);

  useEffect(() => {
    const rec = getRecommendedMode(
      learningMode,
      { totalLessonsCompleted, totalQuizzesCompleted, completedQuizzes, xp },
      modeAnalytics
    );

    if (shouldPromptModeSwitch(rec, lastModeRecommendationDate)) {
      setRecommendation(rec);
      setShowPrompt(true);
    }
  }, [totalLessonsCompleted, totalQuizzesCompleted]);

  if (!showPrompt || !recommendation) return null;

  return (
    <Alert>
      <AlertTitle>Ready for a New Challenge?</AlertTitle>
      <AlertDescription>
        <p>Based on your progress, we recommend switching to {recommendation.recommendedMode} mode.</p>
        <ul>
          {recommendation.reasons.map((reason: string, i: number) => (
            <li key={i}>{reason}</li>
          ))}
        </ul>
      </AlertDescription>
      <AlertActions>
        <Button onClick={handleSwitch}>Switch Now</Button>
        <Button variant="ghost" onClick={() => setShowPrompt(false)}>
          Maybe Later
        </Button>
      </AlertActions>
    </Alert>
  );
}
```

## Complete Example: Quiz Engine Integration

Here's a complete example of integrating learning mode into the quiz engine:

```typescript
import { useUserProgress } from '@/lib/store';
import { adaptQuizConfigForMode, getQuestionTimeLimit } from '@/lib/learning-mode';

export function QuizEngine({ monthId, weekId, questions }: QuizEngineProps) {
  const {
    learningMode,
    modeConfig,
    isFeatureEnabled,
    loseHeart,
    hearts,
  } = useUserProgress();

  // Adapt quiz configuration based on mode
  const quizConfig = adaptQuizConfigForMode(learningMode);

  // Mode-specific state
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  // Initialize time limit for CPA mode
  useEffect(() => {
    if (isFeatureEnabled('timeLimitsRequired')) {
      const timeLimit = getQuestionTimeLimit(learningMode, currentQuestion.difficulty);
      setTimeRemaining(timeLimit || null);
    }
  }, [currentQuestion, learningMode]);

  const handleSubmitAnswer = () => {
    const isCorrect = checkAnswer(currentAnswer);

    if (!isCorrect) {
      // Student Mode: Lose heart
      if (modeConfig.features.heartsSystem && hearts > 0) {
        loseHeart();
      }

      // Show detailed explanation in Student Mode
      if (modeConfig.features.detailedExplanations) {
        setShowDetailedExplanation(true);
      }
    }

    // Track analytics
    updateModeAnalytics('quiz', {
      score: isCorrect ? 1 : 0,
      timeSpent: questionTimeSpent,
      xpEarned: calculateXP(isCorrect),
    });
  };

  const handleRevealHint = () => {
    // Only in Student Mode
    if (!isFeatureEnabled('hintsEnabled')) return;

    if (hintsRevealed < currentQuestion.hints.length) {
      setHintsRevealed((prev) => prev + 1);
      // Small XP penalty for using hint
      addXP(-5);
    }
  };

  const handleSkipQuestion = () => {
    // Only in Student Mode
    if (!isFeatureEnabled('skipAllowed')) return;

    skipQuestion();
  };

  return (
    <div>
      {/* Mode Indicator */}
      <ModeBadge mode={learningMode} />

      {/* CPA Mode: Timer */}
      {isFeatureEnabled('timeLimitsRequired') && timeRemaining !== null && (
        <Timer
          seconds={timeRemaining}
          onExpire={() => {
            // Auto-submit or mark as skipped
            handleTimeExpire();
          }}
        />
      )}

      {/* Question */}
      <QuestionDisplay question={currentQuestion} />

      {/* Student Mode: Hints */}
      {isFeatureEnabled('hintsEnabled') &&
        currentQuestion.hints &&
        currentQuestion.hints.length > 0 && (
          <div>
            {/* Show revealed hints */}
            {currentQuestion.hints.slice(0, hintsRevealed).map((hint, i) => (
              <HintDisplay key={i} hint={hint} number={i + 1} />
            ))}

            {/* Show hint button if more available */}
            {hintsRevealed < currentQuestion.hints.length && (
              <Button onClick={handleRevealHint} variant="outline">
                <Lightbulb className="mr-2" />
                Show Hint ({hintsRevealed + 1}/{currentQuestion.hints.length})
              </Button>
            )}
          </div>
        )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button onClick={handleSubmitAnswer} disabled={!currentAnswer}>
          Submit Answer
        </Button>

        {/* Student Mode: Skip Button */}
        {isFeatureEnabled('skipAllowed') && (
          <Button onClick={handleSkipQuestion} variant="ghost">
            Skip Question
          </Button>
        )}
      </div>

      {/* Student Mode: Hearts Display */}
      {modeConfig.features.heartsSystem && (
        <HeartsDisplay hearts={hearts} maxHearts={5} />
      )}

      {/* Mode-Specific Explanation */}
      {showExplanation && (
        <ExplanationPanel
          explanation={currentQuestion.explanation}
          detailed={modeConfig.features.detailedExplanations}
        />
      )}
    </div>
  );
}
```

## Best Practices

### 1. Always Check Hydration

```typescript
import { useHydratedStore } from '@/lib/hooks';

function MyComponent() {
  const hydrated = useHydratedStore();
  const { learningMode } = useUserProgress();

  if (!hydrated) {
    return <Skeleton />; // Or null
  }

  // Safe to use learningMode now
}
```

### 2. Provide Mode Context

Always let users know which mode they're in and why certain features are available or not:

```typescript
{!isFeatureEnabled('hintsEnabled') && (
  <Alert>
    <Info className="h-4 w-4" />
    <AlertDescription>
      Hints are not available in CPA Review Mode to simulate exam conditions.
      Switch to Student Mode if you need more support.
    </AlertDescription>
  </Alert>
)}
```

### 3. Graceful Degradation

Always provide fallbacks:

```typescript
const lessonContent = getLessonContentForMode(
  learningMode,
  lesson.fullContent,
  lesson.summaryContent
);

// If no summary is available, show full content with a warning
if (learningMode === 'cpa' && !lesson.summaryContent) {
  return (
    <>
      <Alert>
        <AlertDescription>
          Summary not available. Showing full content.
        </AlertDescription>
      </Alert>
      <LessonBody content={lesson.fullContent} />
    </>
  );
}
```

### 4. Track Mode Switches

Log mode switches for analytics:

```typescript
const handleModeSwitch = (newMode: LearningMode) => {
  switchLearningMode(newMode, reason);

  // Analytics tracking
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'mode_switch', {
      from_mode: learningMode,
      to_mode: newMode,
      reason: reason,
    });
  }
};
```

## Testing

### Unit Tests

```typescript
import { getModeConfig, isFeatureEnabled } from '@/lib/learning-mode';

describe('Learning Mode Utils', () => {
  it('should get correct config for student mode', () => {
    const config = getModeConfig('student');
    expect(config.features.hintsEnabled).toBe(true);
    expect(config.features.timeLimitsRequired).toBe(false);
  });

  it('should check features correctly', () => {
    expect(isFeatureEnabled('student', 'hintsEnabled')).toBe(true);
    expect(isFeatureEnabled('cpa', 'hintsEnabled')).toBe(false);
  });
});
```

### Integration Tests

```typescript
import { renderWithProviders } from '@/test-utils';
import { QuizEngine } from '@/components/QuizEngine';

describe('QuizEngine with Learning Modes', () => {
  it('shows hints in student mode', () => {
    const { getByText } = renderWithProviders(<QuizEngine {...props} />, {
      initialState: {
        userProgress: {
          learningMode: 'student',
        },
      },
    });

    expect(getByText(/Show Hint/)).toBeInTheDocument();
  });

  it('hides hints in CPA mode', () => {
    const { queryByText } = renderWithProviders(<QuizEngine {...props} />, {
      initialState: {
        userProgress: {
          learningMode: 'cpa',
        },
      },
    });

    expect(queryByText(/Show Hint/)).not.toBeInTheDocument();
  });
});
```

## Troubleshooting

### Issue: Mode doesn't persist after refresh

**Solution**: Ensure zustand persist middleware is configured correctly:

```typescript
export const useUserProgress = create<UserProgressStore>()(
  persist(
    (set, get) => ({ /* state */ }),
    {
      name: 'user-progress',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

### Issue: UI shows wrong mode after switch

**Solution**: Make sure to use the store's `learningMode` and `modeConfig` directly:

```typescript
// ❌ Don't do this
const config = getModeConfig(learningMode);

// ✅ Do this
const { modeConfig } = useUserProgress();
```

### Issue: Mode comparison not showing

**Solution**: Import and pass the correct prop:

```typescript
<LearningModeToggle showComparison={true} />
```

## Migration Guide

If you have existing components, here's how to migrate them:

### Before (Hardcoded Student Mode)

```typescript
function QuizEngine() {
  const showHints = true;
  const allowSkip = true;
  const showHearts = true;

  return (
    <div>
      {showHints && <HintButton />}
      {allowSkip && <SkipButton />}
      {showHearts && <HeartsDisplay />}
    </div>
  );
}
```

### After (Dynamic Learning Mode)

```typescript
function QuizEngine() {
  const { isFeatureEnabled, modeConfig } = useUserProgress();

  return (
    <div>
      {isFeatureEnabled('hintsEnabled') && <HintButton />}
      {isFeatureEnabled('skipAllowed') && <SkipButton />}
      {modeConfig.features.heartsSystem && <HeartsDisplay />}
    </div>
  );
}
```

## Next Steps

1. **Add mode-specific content**: Create summary versions of lessons for CPA mode
2. **Implement weak area tracking**: For CPA mode performance analysis
3. **Add exam simulation mode**: Full CPA exam experience with official timing
4. **Create mode-specific achievements**: Different badges for each mode
5. **Build recommendation engine**: ML-based mode recommendations

## Support

For questions or issues:
- Check existing components for examples
- Review type definitions in `types/learning-mode.ts`
- Test mode switching in development environment
- Consult the comparison table for feature differences
