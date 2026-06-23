'use client';

/**
 * Enhanced Progress Dashboard - Integration Examples
 *
 * This file demonstrates various ways to integrate and use the Progress Dashboard
 * in your Accountrix application.
 */

import React from 'react';
import { useUserProgress as useUserProgressStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import EnhancedProgressDashboard from './EnhancedProgressDashboard';

// ============================================================================
// Example 1: Standalone Dashboard Page
// ============================================================================

/**
 * Use this in your Next.js app/dashboard/page.tsx
 */
export function StandaloneDashboard() {
  return (
    <main className="min-h-screen">
      <EnhancedProgressDashboard />
    </main>
  );
}

// ============================================================================
// Example 2: Dashboard with Custom Header
// ============================================================================

export function DashboardWithCustomHeader() {
  const { xp, level, streak } = useUserProgressStore();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Custom Navigation */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Accountrix</h1>
          <div className="flex items-center gap-4">
            <Badge variant="outline">Level {level}</Badge>
            <Badge variant="outline">{xp} XP</Badge>
            <Badge variant="outline">{streak} Day Streak</Badge>
          </div>
        </div>
      </nav>

      {/* Dashboard */}
      <EnhancedProgressDashboard />
    </div>
  );
}

// ============================================================================
// Example 3: Progress Widget (Compact View)
// ============================================================================

/**
 * Use this as a sidebar widget or in a smaller space
 */
export function ProgressWidget() {
  const { overallCompletion, xp, level, streak, hearts, maxHearts } =
    useUserProgressStore();

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Your Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Completion */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Course Progress</span>
            <span className="font-bold">{overallCompletion}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${overallCompletion}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-yellow-50 rounded">
            <p className="text-2xl font-bold text-yellow-600">{level}</p>
            <p className="text-xs text-gray-600">Level</p>
          </div>
          <div className="p-2 bg-orange-50 rounded">
            <p className="text-2xl font-bold text-orange-600">{streak}</p>
            <p className="text-xs text-gray-600">Streak</p>
          </div>
          <div className="p-2 bg-red-50 rounded">
            <p className="text-2xl font-bold text-red-600">
              {hearts}/{maxHearts}
            </p>
            <p className="text-xs text-gray-600">Hearts</p>
          </div>
        </div>

        <Button className="w-full" size="sm">
          View Full Dashboard
        </Button>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Example 4: Lesson Completion Handler
// ============================================================================

/**
 * Use this in your lesson components to track completion
 */
export function LessonCompletionExample() {
  const { completeLesson, addXP } = useUserProgressStore();

  const handleLessonComplete = () => {
    // Mark lesson as completed
    completeLesson('week-5-lesson-2', 'Job Costing');

    // Show success message
    alert('Lesson completed! +50 XP');

    // Optionally add bonus XP
    addXP(25); // Bonus for fast completion
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Job Costing Fundamentals</h2>
      <p className="mb-4">Lesson content goes here...</p>
      <Button onClick={handleLessonComplete}>Complete Lesson</Button>
    </div>
  );
}

// ============================================================================
// Example 5: Quiz Integration
// ============================================================================

/**
 * Use this in your quiz components to track scores
 */
export function QuizIntegrationExample() {
  const { completeQuiz, updateCompetency } = useUserProgressStore();
  const [quizScore, setQuizScore] = React.useState(0);

  const handleQuizSubmit = () => {
    // Calculate score (example: 85%)
    const score = 85;
    setQuizScore(score);

    // Track quiz completion
    completeQuiz('WIP Calculations Quiz', score, 'Job Costing');

    // Update related competency
    updateCompetency('WIP Calculations', score);

    // Show result
    alert(`Quiz completed! Score: ${score}%`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">WIP Calculations Quiz</h2>
      <p className="mb-4">Quiz questions go here...</p>
      <Button onClick={handleQuizSubmit}>Submit Quiz</Button>
    </div>
  );
}

// ============================================================================
// Example 6: Badge Unlock System
// ============================================================================

/**
 * Use this to implement badge unlock logic
 */
export function BadgeUnlockExample() {
  const { unlockBadge, lessonsCompleted, quizzesPassed } = useUserProgressStore();

  // Check for badge criteria
  React.useEffect(() => {
    // Unlock "Quiz Master" after 10 quizzes with 90%+
    if (quizzesPassed >= 10) {
      unlockBadge('quiz-master');
    }

    // Add more badge unlock logic here
  }, [lessonsCompleted, quizzesPassed, unlockBadge]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Badge System</h2>
      <p>Complete challenges to unlock badges!</p>
    </div>
  );
}

// ============================================================================
// Example 7: Progress Sync with API
// ============================================================================

/**
 * Use this to sync progress with backend API
 */
export function ProgressSyncExample() {
  const progressStore = useUserProgressStore();

  // Sync progress to API
  const syncProgress = async () => {
    try {
      const response = await fetch('/api/user/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          xp: progressStore.xp,
          level: progressStore.level,
          lessonsCompleted: progressStore.lessonsCompleted,
          quizzesPassed: progressStore.quizzesPassed,
          competencies: progressStore.competencies,
        }),
      });

      if (response.ok) {
        console.log('Progress synced successfully');
      }
    } catch (error) {
      console.error('Failed to sync progress:', error);
    }
  };

  // Load progress from API
  const loadProgress = async () => {
    try {
      const response = await fetch('/api/user/progress');
      const data = await response.json();

      // Update store with API data
      // progressStore.setState(data);
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Progress Sync</h2>
      <div className="flex gap-2">
        <Button onClick={syncProgress}>Sync to Server</Button>
        <Button onClick={loadProgress} variant="outline">
          Load from Server
        </Button>
      </div>
    </div>
  );
}

// ============================================================================
// Example 8: Activity Tracker Component
// ============================================================================

/**
 * Use this to show recent activities in a sidebar
 */
export function ActivityTrackerWidget() {
  const { activities } = useUserProgressStore();
  const recentActivities = activities.slice(0, 5);

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-2 p-2 rounded bg-gray-50"
            >
              <span className="text-lg">{activity.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.action}</p>
                <p className="text-xs text-gray-500">{activity.details}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Example 9: Competency Progress Bar
// ============================================================================

/**
 * Use this to show individual competency progress
 */
export function CompetencyProgressBar({ competencyName }: { competencyName: string }) {
  const { competencies } = useUserProgressStore();
  const competency = competencies.find((c) => c.name === competencyName);

  if (!competency) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{competency.name}</span>
        <span className="text-sm font-bold">{competency.score}%</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${competency.score}%`,
            backgroundColor: competency.color,
          }}
        />
      </div>
      <p className="text-xs text-gray-500">{competency.description}</p>
    </div>
  );
}

// ============================================================================
// Example 10: Goal Tracker Component
// ============================================================================

/**
 * Use this to show daily/weekly goals
 */
export function GoalTrackerWidget() {
  const { goals, updateGoal } = useUserProgressStore();

  const handleGoalProgress = (goalId: string, progress: number) => {
    updateGoal(goalId, progress);
  };

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Today's Goals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {goals.map((goal) => {
            const progress = (goal.current / goal.target) * 100;
            return (
              <div key={goal.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{goal.title}</span>
                  <span className="font-bold">
                    {goal.current}/{goal.target}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      progress >= 100
                        ? 'bg-green-500'
                        : progress >= 75
                          ? 'bg-blue-500'
                          : 'bg-yellow-500'
                    }`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Example 11: Export Progress Report
// ============================================================================

/**
 * Use this to export progress as JSON/CSV
 */
export function ExportProgressExample() {
  const progressStore = useUserProgressStore();

  const exportAsJSON = () => {
    const data = {
      xp: progressStore.xp,
      level: progressStore.level,
      lessonsCompleted: progressStore.lessonsCompleted,
      quizzesPassed: progressStore.quizzesPassed,
      avgQuizScore: progressStore.avgQuizScore,
      competencies: progressStore.competencies,
      topicMastery: progressStore.topicMastery,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'accountrix-progress.json';
    a.click();
  };

  const exportAsCSV = () => {
    const { competencies, topicMastery } = progressStore;

    let csv = 'Category,Name,Score/Progress\n';

    // Add competencies
    competencies.forEach((comp) => {
      csv += `Competency,${comp.name},${comp.score}%\n`;
    });

    // Add topics
    topicMastery.forEach((topic) => {
      const progress = Math.round(
        (topic.weeksCompleted / topic.weeksTotal) * 100
      );
      csv += `Topic,${topic.topic},${progress}%\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'accountrix-progress.csv';
    a.click();
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Export Progress</h2>
      <div className="flex gap-2">
        <Button onClick={exportAsJSON}>Export as JSON</Button>
        <Button onClick={exportAsCSV} variant="outline">
          Export as CSV
        </Button>
      </div>
    </div>
  );
}

// ============================================================================
// Example 12: Notification System
// ============================================================================

/**
 * Use this to show notifications for progress milestones
 */
export function ProgressNotifications() {
  const { xp, level, streak, badges } = useUserProgressStore();
  const [notifications, setNotifications] = React.useState<string[]>([]);

  React.useEffect(() => {
    const newNotifications: string[] = [];

    // Check for level up
    const currentLevelXP = (level - 1) * 200;
    if (xp >= currentLevelXP + 200) {
      newNotifications.push(`Level up! You're now level ${level + 1}`);
    }

    // Check for streak milestone
    if (streak === 7) {
      newNotifications.push('Amazing! 7-day streak achieved!');
    }

    // Check for new badges
    const recentlyUnlocked = badges.filter((b) => {
      if (!b.unlockedAt) return false;
      const hoursSince =
        (Date.now() - new Date(b.unlockedAt).getTime()) / (1000 * 60 * 60);
      return hoursSince < 1;
    });

    recentlyUnlocked.forEach((badge) => {
      newNotifications.push(`New badge unlocked: ${badge.name}`);
    });

    if (newNotifications.length > 0) {
      setNotifications(newNotifications);
    }
  }, [xp, level, streak, badges]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {notifications.map((notification, index) => (
        <Card
          key={index}
          className="p-4 bg-green-50 border-green-200 shadow-lg animate-slide-up"
        >
          <p className="text-sm font-medium text-green-900">{notification}</p>
        </Card>
      ))}
    </div>
  );
}

// ============================================================================
// Example Usage in App
// ============================================================================

/**
 * Example of complete app integration
 */
export function CompleteAppExample() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <DashboardWithCustomHeader />

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-80 p-4 space-y-4 bg-white border-r">
          <ProgressWidget />
          <ActivityTrackerWidget />
          <GoalTrackerWidget />
        </aside>

        {/* Main Dashboard */}
        <main className="flex-1">
          <EnhancedProgressDashboard />
        </main>
      </div>

      {/* Notifications */}
      <ProgressNotifications />
    </div>
  );
}

export default {
  StandaloneDashboard,
  DashboardWithCustomHeader,
  ProgressWidget,
  LessonCompletionExample,
  QuizIntegrationExample,
  BadgeUnlockExample,
  ProgressSyncExample,
  ActivityTrackerWidget,
  CompetencyProgressBar,
  GoalTrackerWidget,
  ExportProgressExample,
  ProgressNotifications,
  CompleteAppExample,
};
