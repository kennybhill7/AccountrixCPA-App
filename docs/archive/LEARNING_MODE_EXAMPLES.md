# Learning Mode - Component Adaptation Examples

This document provides copy-paste ready examples for adapting existing components to support Learning Mode.

## Table of Contents
1. [Quiz Component](#quiz-component)
2. [Lesson Component](#lesson-component)
3. [Navigation Component](#navigation-component)
4. [Dashboard Component](#dashboard-component)
5. [Flashcard Component](#flashcard-component)

---

## Quiz Component

### Before (No Mode Support)
```typescript
export function QuizEngine({ questions }: QuizEngineProps) {
  const [showHints, setShowHints] = useState(false);
  const canSkip = true;
  const hasHearts = true;

  return (
    <div>
      {/* Hardcoded features */}
      <Button onClick={() => setShowHints(true)}>Show Hint</Button>
      {canSkip && <Button>Skip</Button>}
      {hasHearts && <HeartsDisplay />}
    </div>
  );
}
```

### After (With Mode Support)
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
  const quizConfig = adaptQuizConfigForMode(learningMode, {
    id: `${monthId}-${weekId}`,
    title: 'Weekly Quiz',
  });

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
    }
  };

  const handleRevealHint = () => {
    // Only in Student Mode
    if (!isFeatureEnabled('hintsEnabled')) return;

    if (hintsRevealed < currentQuestion.hints.length) {
      setHintsRevealed((prev) => prev + 1);
    }
  };

  const handleSkipQuestion = () => {
    // Only in Student Mode
    if (!isFeatureEnabled('skipAllowed')) return;
    skipQuestion();
  };

  return (
    <div className="space-y-4">
      {/* Mode Indicator Badge */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Quiz</h2>
        <Badge variant={learningMode === 'student' ? 'default' : 'secondary'}>
          {learningMode === 'student' ? '🎓 Student Mode' : '📚 CPA Review'}
        </Badge>
      </div>

      {/* CPA Mode: Timer */}
      {isFeatureEnabled('timeLimitsRequired') && timeRemaining !== null && (
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertTitle>Time Limit</AlertTitle>
          <AlertDescription>
            You have {Math.floor(timeRemaining / 60)} minutes for this question
          </AlertDescription>
        </Alert>
      )}

      {/* Question Display */}
      <Card>
        <CardHeader>
          <CardTitle>{currentQuestion.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Options */}
          <div className="space-y-2">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => setCurrentAnswer(option)}
                className={cn(
                  'w-full p-4 text-left border-2 rounded-lg',
                  currentAnswer === option && 'border-primary bg-primary/5'
                )}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Student Mode: Hints */}
          {isFeatureEnabled('hintsEnabled') &&
            currentQuestion.hints &&
            currentQuestion.hints.length > 0 && (
              <div className="space-y-2">
                {/* Show revealed hints */}
                {currentQuestion.hints.slice(0, hintsRevealed).map((hint, i) => (
                  <Alert key={i} className="bg-yellow-50">
                    <Lightbulb className="h-4 w-4" />
                    <AlertDescription>{hint}</AlertDescription>
                  </Alert>
                ))}

                {/* Show hint button */}
                {hintsRevealed < currentQuestion.hints.length && (
                  <Button onClick={handleRevealHint} variant="outline" size="sm">
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Show Hint ({hintsRevealed + 1}/{currentQuestion.hints.length})
                  </Button>
                )}
              </div>
            )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
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
            <div className="flex items-center gap-2 pt-2">
              <Heart className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">
                {hearts} / 5 Hearts
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mode-Specific Help Text */}
      {!isFeatureEnabled('hintsEnabled') && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Hints are not available in CPA Review Mode to simulate exam conditions.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
```

---

## Lesson Component

### Before (No Mode Support)
```typescript
export function LessonPage({ lesson }: LessonPageProps) {
  return (
    <div>
      <h1>{lesson.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
    </div>
  );
}
```

### After (With Mode Support)
```typescript
import { useUserProgress } from '@/lib/store';
import { getLessonContentForMode } from '@/lib/learning-mode';

export function LessonPage({ lesson }: LessonPageProps) {
  const { learningMode, modeConfig } = useUserProgress();

  // Get appropriate content based on mode
  const content = getLessonContentForMode(
    learningMode,
    lesson.fullContent,
    lesson.summaryContent
  );

  const wordCount = content.split(/\s+/).length;
  const estimatedReadTime = Math.ceil(wordCount / 200); // ~200 words per minute

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header with Mode Indicator */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{lesson.title}</h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <span>{estimatedReadTime} min read</span>
            <span>{wordCount} words</span>
            <Badge variant={learningMode === 'student' ? 'default' : 'secondary'}>
              {learningMode === 'student' ? '🎓 Full Lesson' : '📚 Summary'}
            </Badge>
          </div>
        </div>
      </div>

      {/* CPA Mode: Content Notice */}
      {learningMode === 'cpa' && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Condensed Content</AlertTitle>
          <AlertDescription>
            You are viewing a condensed version focused on key points.
            <Button
              variant="link"
              className="p-0 h-auto ml-1"
              onClick={() => switchLearningMode('student')}
            >
              Switch to Student Mode
            </Button>
            {' '}for full details and examples.
          </AlertDescription>
        </Alert>
      )}

      {/* Lesson Content */}
      <Card>
        <CardContent className="pt-6 prose prose-slate dark:prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </CardContent>
      </Card>

      {/* Student Mode: Additional Resources */}
      {modeConfig.content.showResourceLinks && lesson.resources && (
        <Card>
          <CardHeader>
            <CardTitle>Additional Resources</CardTitle>
            <CardDescription>Dive deeper into this topic</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {lesson.resources.map((resource, index) => (
                <li key={index}>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {resource.title}
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Student Mode: Practice Tips */}
      {modeConfig.ui.showGuidance && (
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100">
              💡 Study Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <li>• Take notes as you read through the lesson</li>
              <li>• Review the flashcards after completing the lesson</li>
              <li>• Try the quiz to test your understanding</li>
              <li>• Revisit difficult sections before moving forward</li>
            </ul>
          </CardContent>
        </Card>
      )}

      {/* CPA Mode: Quick Review Checklist */}
      {learningMode === 'cpa' && (
        <Card>
          <CardHeader>
            <CardTitle>Key Takeaways</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {lesson.keyPoints?.map((point, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```

---

## Navigation Component

### Before (No Mode Support)
```typescript
export function WeekStepper({ weeks, currentWeekId }: WeekStepperProps) {
  const isLocked = (weekId: string) => {
    // Hardcoded sequential logic
    return !completedWeeks.includes(getPreviousWeekId(weekId));
  };

  return (
    <div className="flex gap-2">
      {weeks.map((week) => (
        <WeekButton
          key={week.id}
          week={week}
          locked={isLocked(week.id)}
          current={week.id === currentWeekId}
        />
      ))}
    </div>
  );
}
```

### After (With Mode Support)
```typescript
import { useUserProgress } from '@/lib/store';
import { isContentUnlocked } from '@/lib/learning-mode';

export function WeekStepper({ monthId, weeks, currentWeekId }: WeekStepperProps) {
  const { learningMode, completedQuizzes } = useUserProgress();

  const checkUnlocked = (weekId: string) => {
    const contentId = `${monthId}:${weekId}`;
    return isContentUnlocked(learningMode, contentId, completedQuizzes);
  };

  return (
    <div className="space-y-4">
      {/* Mode-Specific Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Week Progress</h3>
        {learningMode === 'cpa' && (
          <Badge variant="secondary" className="text-xs">
            All Unlocked
          </Badge>
        )}
      </div>

      {/* Week Buttons */}
      <div className="grid grid-cols-4 gap-3">
        {weeks.map((week) => {
          const weekId = `${monthId}:${week.id}`;
          const unlocked = checkUnlocked(week.id);
          const completed = completedQuizzes.includes(weekId);
          const current = week.id === currentWeekId;

          return (
            <button
              key={week.id}
              disabled={!unlocked}
              className={cn(
                'relative p-4 rounded-lg border-2 transition-all',
                'flex flex-col items-center gap-2',
                current && 'border-primary bg-primary/5',
                !current && unlocked && 'hover:border-primary/50',
                !unlocked && 'opacity-50 cursor-not-allowed bg-muted'
              )}
            >
              {/* Lock Icon - Only in Student Mode */}
              {!unlocked && learningMode === 'student' && (
                <Lock className="h-6 w-6 text-muted-foreground" />
              )}

              {/* Completion Check */}
              {completed && (
                <div className="absolute top-2 right-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
              )}

              {/* Week Info */}
              <span className="text-sm font-medium">Week {week.order}</span>
              <span className="text-xs text-muted-foreground text-center line-clamp-2">
                {week.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Student Mode: Next Lesson Guidance */}
      {learningMode === 'student' && (
        <Alert>
          <Target className="h-4 w-4" />
          <AlertDescription>
            Complete lessons in order to unlock the next week. Keep up the great work!
          </AlertDescription>
        </Alert>
      )}

      {/* CPA Mode: Jump to Week */}
      {learningMode === 'cpa' && (
        <Alert>
          <Zap className="h-4 w-4" />
          <AlertDescription>
            All content is unlocked. Jump to any week to focus on your weak areas.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
```

---

## Dashboard Component

### Before (No Mode Support)
```typescript
export function Dashboard() {
  const { xp, hearts, streak } = useUserProgress();

  return (
    <div className="grid grid-cols-3 gap-4">
      <StatsCard title="XP" value={xp} icon={<Star />} />
      <StatsCard title="Hearts" value={hearts} icon={<Heart />} />
      <StatsCard title="Streak" value={streak} icon={<Flame />} />
    </div>
  );
}
```

### After (With Mode Support)
```typescript
import { useUserProgress } from '@/lib/store';
import { getDailyGoalsForMode } from '@/lib/learning-mode';

export function Dashboard() {
  const {
    learningMode,
    modeConfig,
    modeAnalytics,
    xp,
    hearts,
    streak,
    totalLessonsCompleted,
    totalQuizzesCompleted,
  } = useUserProgress();

  const dailyGoals = getDailyGoalsForMode(learningMode);
  const currentModeStats = learningMode === 'student'
    ? modeAnalytics.studentMode
    : modeAnalytics.cpaMode;

  return (
    <div className="space-y-6">
      {/* Mode Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <p className="text-muted-foreground">
            {learningMode === 'student'
              ? 'Track your learning progress'
              : 'Monitor your exam preparation'}
          </p>
        </div>
        <Badge variant={learningMode === 'student' ? 'default' : 'secondary'}>
          {modeConfig.icon} {modeConfig.label}
        </Badge>
      </div>

      {/* Universal Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="Total XP"
          value={xp}
          icon={<Star className="h-5 w-5" />}
          description={`Level ${Math.floor(xp / 100) + 1}`}
        />

        {/* Student Mode: Hearts */}
        {modeConfig.features.heartsSystem && (
          <StatsCard
            title="Hearts"
            value={`${hearts} / 5`}
            icon={<Heart className="h-5 w-5" />}
            description="Lives remaining"
          />
        )}

        <StatsCard
          title="Streak"
          value={`${streak} days`}
          icon={<Flame className="h-5 w-5" />}
          description="Keep it going!"
        />
      </div>

      {/* Mode-Specific Stats */}
      <Card>
        <CardHeader>
          <CardTitle>
            {learningMode === 'student' ? 'Learning Progress' : 'Exam Preparation'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-2xl font-bold">{currentModeStats.lessonsCompleted}</div>
              <div className="text-sm text-muted-foreground">Lessons Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{currentModeStats.quizzesCompleted}</div>
              <div className="text-sm text-muted-foreground">Quizzes Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {Math.round(currentModeStats.avgQuizScore)}%
              </div>
              <div className="text-sm text-muted-foreground">Average Score</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{currentModeStats.totalXPEarned}</div>
              <div className="text-sm text-muted-foreground">XP in Mode</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Goals - Mode Adjusted */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Goals</CardTitle>
          <CardDescription>
            {learningMode === 'student'
              ? 'Take your time and learn thoroughly'
              : 'Intensive review - push yourself!'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm">XP Goal</span>
              <span className="text-sm font-medium">{xp} / {dailyGoals.xpGoal}</span>
            </div>
            <Progress value={(xp / dailyGoals.xpGoal) * 100} />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm">Lessons Goal</span>
              <span className="text-sm font-medium">
                {totalLessonsCompleted} / {dailyGoals.lessonsGoal}
              </span>
            </div>
            <Progress value={(totalLessonsCompleted / dailyGoals.lessonsGoal) * 100} />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm">Quizzes Goal</span>
              <span className="text-sm font-medium">
                {totalQuizzesCompleted} / {dailyGoals.quizzesGoal}
              </span>
            </div>
            <Progress value={(totalQuizzesCompleted / dailyGoals.quizzesGoal) * 100} />
          </div>
        </CardContent>
      </Card>

      {/* CPA Mode: Performance Graphs */}
      {modeConfig.ui.showPerformanceGraphs && (
        <Card>
          <CardHeader>
            <CardTitle>Performance Analysis</CardTitle>
            <CardDescription>Track your progress over time</CardDescription>
          </CardHeader>
          <CardContent>
            <PerformanceChart data={performanceData} />
          </CardContent>
        </Card>
      )}

      {/* CPA Mode: Weak Areas */}
      {modeConfig.ui.showWeakAreas && weakAreas.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
          <CardHeader>
            <CardTitle className="text-yellow-900 dark:text-yellow-100">
              Areas to Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {weakAreas.map((area) => (
                <li key={area.topic} className="flex items-center justify-between">
                  <span>{area.topic}</span>
                  <Badge variant="outline">{area.percentage}% mastery</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Student Mode: Mascot Encouragement */}
      {modeConfig.ui.showMascot && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="text-6xl">🦉</div>
              <div>
                <h4 className="font-semibold mb-2">Great job!</h4>
                <p className="text-sm text-muted-foreground">
                  You're making excellent progress. Keep learning at your own pace!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```

---

## Flashcard Component

### Before (No Mode Support)
```typescript
export function FlashcardDeck({ cards }: FlashcardDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div>
      <Flashcard
        front={cards[currentIndex].front}
        back={cards[currentIndex].back}
        isFlipped={isFlipped}
        onFlip={() => setIsFlipped(!isFlipped)}
      />
    </div>
  );
}
```

### After (With Mode Support)
```typescript
import { useUserProgress } from '@/lib/store';

export function FlashcardDeck({ cards }: FlashcardDeckProps) {
  const { learningMode, modeConfig } = useUserProgress();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCards, setMasteredCards] = useState<Set<number>>(new Set());
  const [needsReview, setNeedsReview] = useState<Set<number>>(new Set());
  const [timer, setTimer] = useState<number | null>(null);

  // CPA Mode: Start timer
  useEffect(() => {
    if (learningMode === 'cpa' && !isFlipped) {
      setTimer(Date.now());
    }
  }, [currentIndex, isFlipped, learningMode]);

  const handleMarkMastered = () => {
    setMasteredCards((prev) => new Set([...prev, currentIndex]));
    handleNext();
  };

  const handleMarkNeedsReview = () => {
    setNeedsReview((prev) => new Set([...prev, currentIndex]));
    handleNext();
  };

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const timeSpent = timer ? Math.floor((Date.now() - timer) / 1000) : 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header with Mode */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Flashcards</h2>
          <p className="text-muted-foreground">
            Card {currentIndex + 1} of {cards.length}
          </p>
        </div>
        <Badge variant={learningMode === 'student' ? 'default' : 'secondary'}>
          {modeConfig.icon} {learningMode === 'student' ? 'Study Mode' : 'Quick Review'}
        </Badge>
      </div>

      {/* CPA Mode: Timer */}
      {learningMode === 'cpa' && !isFlipped && (
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertDescription>
            Time on this card: {timeSpent}s
          </AlertDescription>
        </Alert>
      )}

      {/* Flashcard */}
      <Card className="h-64">
        <CardContent className="p-8 h-full flex items-center justify-center">
          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full h-full text-center transition-all"
          >
            {!isFlipped ? (
              <div className="space-y-4">
                <div className="text-xl font-semibold">{cards[currentIndex].front}</div>
                <div className="text-sm text-muted-foreground">Click to reveal answer</div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-lg">{cards[currentIndex].back}</div>
                {/* Student Mode: Additional Help */}
                {modeConfig.content.showWhyExplanations && cards[currentIndex].explanation && (
                  <div className="text-sm text-muted-foreground italic pt-4 border-t">
                    {cards[currentIndex].explanation}
                  </div>
                )}
              </div>
            )}
          </button>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <Button onClick={handlePrevious} disabled={currentIndex === 0} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        {isFlipped && (
          <div className="flex gap-2">
            {/* Student Mode: Detailed feedback */}
            {learningMode === 'student' && (
              <>
                <Button onClick={handleMarkNeedsReview} variant="outline" size="sm">
                  <XCircle className="mr-2 h-4 w-4" />
                  Need to Review
                </Button>
                <Button onClick={handleMarkMastered} variant="default" size="sm">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mastered
                </Button>
              </>
            )}

            {/* CPA Mode: Quick next */}
            {learningMode === 'cpa' && (
              <Button onClick={handleNext} size="sm">
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        )}

        <Button
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
          variant="outline"
        >
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <Progress value={((currentIndex + 1) / cards.length) * 100} />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{masteredCards.size} mastered</span>
          <span>{needsReview.size} to review</span>
        </div>
      </div>

      {/* Student Mode: Study Tips */}
      {modeConfig.ui.showGuidance && (
        <Alert>
          <Lightbulb className="h-4 w-4" />
          <AlertTitle>Study Tip</AlertTitle>
          <AlertDescription>
            Review cards multiple times for better retention. Mark cards that need review and
            focus on them later.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
```

---

## Common Patterns Summary

### 1. Always Import and Use Store
```typescript
import { useUserProgress } from '@/lib/store';

const { learningMode, modeConfig, isFeatureEnabled } = useUserProgress();
```

### 2. Check Features Before Rendering
```typescript
{isFeatureEnabled('hintsEnabled') && <HintComponent />}
{modeConfig.features.heartsSystem && <HeartsDisplay />}
```

### 3. Show Mode Indicator
```typescript
<Badge variant={learningMode === 'student' ? 'default' : 'secondary'}>
  {modeConfig.icon} {modeConfig.label}
</Badge>
```

### 4. Provide Context
```typescript
{!isFeatureEnabled('skipAllowed') && (
  <Alert>
    <AlertDescription>
      Skipping is not available in CPA Mode to simulate exam conditions.
    </AlertDescription>
  </Alert>
)}
```

### 5. Use Helper Functions
```typescript
import { adaptQuizConfigForMode, getLessonContentForMode } from '@/lib/learning-mode';

const quizConfig = adaptQuizConfigForMode(learningMode);
const content = getLessonContentForMode(learningMode, full, summary);
```

---

These examples should provide a solid foundation for adapting any component in your application to support the Learning Mode system. Copy and modify as needed for your specific use cases.
