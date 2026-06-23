'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  Trophy,
  Star,
  Heart,
  TrendingUp,
  Target,
  Award,
  Calendar,
  Clock,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Download,
  Filter,
  Eye,
} from 'lucide-react';
import { useUserProgress as useUserProgressStore } from '@/lib/store';

// ============================================================================
// Types
// ============================================================================

type ViewMode = 'overview' | 'detailed' | 'charts' | 'timeline';

// ============================================================================
// Main Component
// ============================================================================

export default function EnhancedProgressDashboard() {
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const progressStore = useUserProgressStore();

  return (
    <div className="w-full max-w-[1600px] mx-auto p-6 space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header */}
      <DashboardHeader viewMode={viewMode} setViewMode={setViewMode} />

      {/* View Mode Content */}
      {viewMode === 'overview' && <OverviewMode />}
      {viewMode === 'detailed' && <DetailedMode />}
      {viewMode === 'charts' && <ChartsMode />}
      {viewMode === 'timeline' && <TimelineMode />}
    </div>
  );
}

// ============================================================================
// Dashboard Header
// ============================================================================

interface DashboardHeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

function DashboardHeader({ viewMode, setViewMode }: DashboardHeaderProps) {
  const { xp, level, streak } = useUserProgressStore();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          ACCOUNTRIX PROGRESS DASHBOARD
        </h1>
        <p className="text-gray-600">Track your journey to accounting mastery</p>
      </div>
      <div className="flex gap-3">
        <Button
          variant={viewMode === 'overview' ? 'default' : 'outline'}
          onClick={() => setViewMode('overview')}
        >
          <Eye className="w-4 h-4 mr-2" />
          Overview
        </Button>
        <Button
          variant={viewMode === 'detailed' ? 'default' : 'outline'}
          onClick={() => setViewMode('detailed')}
        >
          <Filter className="w-4 h-4 mr-2" />
          Detailed
        </Button>
        <Button
          variant={viewMode === 'charts' ? 'default' : 'outline'}
          onClick={() => setViewMode('charts')}
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Charts
        </Button>
        <Button
          variant={viewMode === 'timeline' ? 'default' : 'outline'}
          onClick={() => setViewMode('timeline')}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Timeline
        </Button>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export PDF
        </Button>
      </div>
    </div>
  );
}

// ============================================================================
// Overview Mode
// ============================================================================

function OverviewMode() {
  return (
    <div className="space-y-6">
      <OverallProgressCard />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CompetencyRadarCard />
        <TopicMasteryCard />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivityCard />
        <RecommendedNextStepsCard />
      </div>
    </div>
  );
}

// ============================================================================
// Detailed Mode
// ============================================================================

function DetailedMode() {
  return (
    <div className="space-y-6">
      <StatisticsGrid />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GoalProgressCard />
        <CertificateProgressCard />
      </div>
      <WeakAreasAnalysisCard />
      <BadgesShowcaseCard />
    </div>
  );
}

// ============================================================================
// Charts Mode
// ============================================================================

function ChartsMode() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <XPOverTimeChart />
        <QuizScoresTrendChart />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TimeSpentChart />
        <CompetencyRadarCard />
      </div>
    </div>
  );
}

// ============================================================================
// Timeline Mode
// ============================================================================

function TimelineMode() {
  return (
    <div className="space-y-6">
      <MilestoneTimelineCard />
      <RecentActivityCard showAll />
    </div>
  );
}

// ============================================================================
// Overall Progress Card
// ============================================================================

function OverallProgressCard() {
  const { overallCompletion, lessonsCompleted, level, xp, streak, hearts, maxHearts } =
    useUserProgressStore();

  const totalWeeks = 24;
  const weeksCompleted = Math.floor((overallCompletion / 100) * totalWeeks);

  return (
    <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl">OVERALL PROGRESS</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-semibold">Course Completion</span>
            <span className="text-2xl font-bold">{overallCompletion}% Complete</span>
          </div>
          <div className="h-4 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${overallCompletion}%` }}
            />
          </div>
          <p className="text-sm text-white/80 mt-2">
            {weeksCompleted}/{totalWeeks} Weeks Completed
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <Star className="w-6 h-6" />
              <span className="text-xs text-white/80">LEVEL</span>
            </div>
            <p className="text-3xl font-bold">{level}</p>
            <p className="text-sm text-white/80">{xp.toLocaleString()} XP</p>
          </div>

          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <Trophy className="w-6 h-6 text-yellow-300" />
              <span className="text-xs text-white/80">STREAK</span>
            </div>
            <p className="text-3xl font-bold">{streak}</p>
            <p className="text-sm text-white/80">Days</p>
          </div>

          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <Heart className="w-6 h-6 text-red-300" />
              <span className="text-xs text-white/80">HEARTS</span>
            </div>
            <p className="text-3xl font-bold">
              {hearts}/{maxHearts}
            </p>
            <div className="flex gap-1 mt-1">
              {Array.from({ length: maxHearts }).map((_, i) => (
                <Heart
                  key={i}
                  className={`w-4 h-4 ${i < hearts ? 'fill-red-300 text-red-300' : 'text-white/30'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Competency Radar Card
// ============================================================================

function CompetencyRadarCard() {
  const { competencies } = useUserProgressStore();

  const data = competencies.map((comp) => ({
    subject: comp.name,
    score: comp.score,
    fullMark: 100,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-500" />
          Competency Radar Chart
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={data}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickLine={false}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: '#6b7280', fontSize: 10 }}
            />
            <Radar
              name="Your Skills"
              dataKey="score"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.6}
            />
            <Radar
              name="Target"
              dataKey="fullMark"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.1}
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>

        {/* Competency List */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {competencies.slice(0, 6).map((comp) => (
            <div key={comp.name} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: comp.color }}
              />
              <span className="text-sm text-gray-700">{comp.name}</span>
              <span className="text-sm font-semibold text-gray-900 ml-auto">
                {comp.score}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Topic Mastery Card
// ============================================================================

function TopicMasteryCard() {
  const { topicMastery } = useUserProgressStore();

  const calculateMasteryPercent = (topic: typeof topicMastery[0]) => {
    return Math.round(
      (topic.weeksCompleted / topic.weeksTotal) * 0.5 * 100 +
        (topic.avgQuizScore / 100) * 0.3 * 100 +
        Math.min(topic.practiceTasksCompleted / 10, 1) * 0.2 * 100
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-green-500" />
          Topic Mastery
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topicMastery.map((topic) => {
            const masteryPercent = calculateMasteryPercent(topic);
            return (
              <div key={topic.topic}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {topic.topic}
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {masteryPercent}%
                  </span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      masteryPercent >= 80
                        ? 'bg-green-500'
                        : masteryPercent >= 60
                          ? 'bg-yellow-500'
                          : 'bg-blue-500'
                    }`}
                    style={{ width: `${masteryPercent}%` }}
                  />
                </div>
                <div className="flex gap-4 mt-1 text-xs text-gray-500">
                  <span>
                    {topic.weeksCompleted}/{topic.weeksTotal} weeks
                  </span>
                  <span>Avg: {topic.avgQuizScore}%</span>
                  <span>{topic.practiceTasksCompleted} tasks</span>
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
// Recent Activity Card
// ============================================================================

interface RecentActivityCardProps {
  showAll?: boolean;
}

function RecentActivityCard({ showAll = false }: RecentActivityCardProps) {
  const { activities } = useUserProgressStore();
  const displayActivities = showAll ? activities : activities.slice(0, 10);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'lesson':
        return '📚';
      case 'quiz':
        return '🎯';
      case 'practice':
        return '💪';
      case 'badge':
        return '🏆';
      case 'export':
        return '📄';
      default:
        return '✅';
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-purple-500" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="text-2xl">{getActivityIcon(activity.type)}</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-xs text-gray-500">{activity.details}</p>
              </div>
              <span className="text-xs text-gray-400">
                {formatTime(activity.timestamp)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Recommended Next Steps Card
// ============================================================================

function RecommendedNextStepsCard() {
  const { topicMastery, weakAreas, overallCompletion } = useUserProgressStore();

  const nextTopic = topicMastery.find((t) => t.weeksCompleted < t.weeksTotal);

  return (
    <Card className="border-2 border-blue-200 bg-blue-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600" />
          Recommended Next Steps
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {nextTopic && (
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">
                  Complete Week {nextTopic.weeksCompleted + 1}: {nextTopic.topic}
                </p>
                <p className="text-sm text-gray-600">
                  Continue your learning journey in {nextTopic.topic}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Practice: WIP Calculations</p>
              <p className="text-sm text-gray-600">
                Complete the Consolidation Worksheet simulator
              </p>
            </div>
          </div>

          {weakAreas[0] && (
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">
                  Review: {weakAreas[0].topic}
                </p>
                <p className="text-sm text-gray-600">
                  Strengthen your weak areas (Current score: {weakAreas[0].score}%)
                </p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <Trophy className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Earn Your Next Badge</p>
              <p className="text-sm text-gray-600">
                Complete 5 more WIP calculations to unlock "WIP Wizard"
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Statistics Grid
// ============================================================================

function StatisticsGrid() {
  const {
    xp,
    lessonsCompleted,
    quizzesPassed,
    practiceTasksCompleted,
    documentsExported,
    avgQuizScore,
    streak,
    badges,
    totalHoursStudied,
    overallCompletion,
  } = useUserProgressStore();

  const unlockedBadges = badges.filter((b) => b.unlockedAt !== null).length;

  const stats = [
    { label: 'Total XP', value: xp.toLocaleString(), icon: Star, color: 'text-yellow-600' },
    {
      label: 'Lessons Completed',
      value: lessonsCompleted,
      icon: BookOpen,
      color: 'text-blue-600',
    },
    {
      label: 'Quizzes Passed',
      value: quizzesPassed,
      icon: CheckCircle2,
      color: 'text-green-600',
    },
    {
      label: 'Practice Tasks',
      value: practiceTasksCompleted,
      icon: Target,
      color: 'text-purple-600',
    },
    {
      label: 'Documents Exported',
      value: documentsExported,
      icon: Download,
      color: 'text-gray-600',
    },
    {
      label: 'Average Quiz Score',
      value: `${avgQuizScore}%`,
      icon: TrendingUp,
      color: 'text-green-600',
    },
    {
      label: 'Study Streak',
      value: `${streak} days`,
      icon: Trophy,
      color: 'text-orange-600',
    },
    {
      label: 'Badges Unlocked',
      value: `${unlockedBadges}/40`,
      icon: Award,
      color: 'text-yellow-600',
    },
    {
      label: 'Hours Studied',
      value: totalHoursStudied,
      icon: Clock,
      color: 'text-indigo-600',
    },
    {
      label: 'Completion',
      value: `${overallCompletion}%`,
      icon: CheckCircle2,
      color: 'text-blue-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className="text-xs text-gray-600">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ============================================================================
// XP Over Time Chart
// ============================================================================

function XPOverTimeChart() {
  const { xpHistory } = useUserProgressStore();

  const data = xpHistory.slice(-30).map((point) => ({
    date: new Date(point.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    xp: point.xp,
    dailyGain: point.dailyGain,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-500" />
          XP Growth Over Time
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="xp"
              stroke="#3b82f6"
              strokeWidth={3}
              name="Total XP"
              dot={{ fill: '#3b82f6', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Quiz Scores Trend Chart
// ============================================================================

function QuizScoresTrendChart() {
  const { quizScores } = useUserProgressStore();

  const data = quizScores.slice(-10).map((quiz, index) => ({
    quiz: `Quiz ${index + 1}`,
    score: quiz.score,
    name: quiz.quizName,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-500" />
          Quiz Scores Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="quiz" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#10b981"
              strokeWidth={3}
              name="Score %"
              dot={{ fill: '#10b981', r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Time Spent Chart
// ============================================================================

function TimeSpentChart() {
  const { timeSpent } = useUserProgressStore();

  const data = [...timeSpent].sort((a, b) => b.hours - a.hours);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-purple-500" />
          Time Spent Per Topic
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis type="category" dataKey="topic" tick={{ fontSize: 12 }} width={150} />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="hours" fill="#8b5cf6" name="Hours" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Weak Areas Analysis Card
// ============================================================================

function WeakAreasAnalysisCard() {
  const { weakAreas } = useUserProgressStore();

  return (
    <Card className="border-2 border-yellow-200 bg-yellow-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          Weak Areas Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        {weakAreas.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-900">
              Great job! No weak areas detected
            </p>
            <p className="text-sm text-gray-600">
              Keep up the excellent work and maintain your scores above 75%
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {weakAreas.map((area) => (
              <div key={area.topic} className="bg-white p-4 rounded-lg border border-yellow-200">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{area.topic}</h4>
                    <p className="text-sm text-gray-600">
                      Average Score: {area.score}% • {area.attempts} attempts
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                    Needs Review
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Recommendations:</p>
                  <ul className="space-y-1">
                    {area.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Badges Showcase Card
// ============================================================================

function BadgesShowcaseCard() {
  const { badges } = useUserProgressStore();

  const unlockedBadges = badges.filter((b) => b.unlockedAt !== null);
  const lockedBadges = badges.filter((b) => b.unlockedAt === null);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-600" />
          Badges Collection ({unlockedBadges.length}/{badges.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="unlocked">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="unlocked">Unlocked ({unlockedBadges.length})</TabsTrigger>
            <TabsTrigger value="locked">Locked ({lockedBadges.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="unlocked" className="space-y-3">
            {unlockedBadges.map((badge) => (
              <div
                key={badge.id}
                className="flex items-start gap-4 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200"
              >
                <div className="text-4xl">{badge.icon}</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{badge.name}</h4>
                  <p className="text-sm text-gray-600">{badge.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Unlocked: {badge.unlockedAt?.toLocaleDateString()}
                  </p>
                </div>
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              </div>
            ))}
          </TabsContent>

          <TabsContent value="locked" className="space-y-3">
            {lockedBadges.map((badge) => (
              <div
                key={badge.id}
                className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 opacity-60"
              >
                <div className="text-4xl grayscale">{badge.icon}</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-700">{badge.name}</h4>
                  <p className="text-sm text-gray-600">{badge.description}</p>
                  <p className="text-xs text-gray-500 mt-1">Criteria: {badge.criteria}</p>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Goal Progress Card
// ============================================================================

function GoalProgressCard() {
  const { goals } = useUserProgressStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-500" />
          Your Goals
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {goals.map((goal) => {
            const progress = (goal.current / goal.target) * 100;
            return (
              <div key={goal.id}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{goal.title}</span>
                  <span className="text-sm font-bold text-gray-900">
                    {goal.current}/{goal.target}
                  </span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      progress >= 100
                        ? 'bg-green-500'
                        : progress >= 75
                          ? 'bg-blue-500'
                          : 'bg-yellow-500'
                    }`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                {goal.deadline && (
                  <p className="text-xs text-gray-500 mt-1">
                    Due: {goal.deadline.toLocaleDateString()}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Certificate Progress Card
// ============================================================================

function CertificateProgressCard() {
  const { certificateRequirements } = useUserProgressStore();

  const completedCount = certificateRequirements.filter((r) => r.completed).length;
  const totalCount = certificateRequirements.length;
  const overallProgress =
    certificateRequirements.reduce((sum, r) => sum + r.progress, 0) / totalCount;

  return (
    <Card className="border-2 border-purple-200 bg-purple-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5 text-purple-600" />
          Certificate Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Overall Eligibility
            </span>
            <span className="text-2xl font-bold text-purple-600">
              {Math.round(overallProgress)}%
            </span>
          </div>
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {completedCount}/{totalCount} Requirements Completed
          </p>
        </div>

        <div className="space-y-3">
          {certificateRequirements.map((req, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-white rounded-lg border"
            >
              {req.completed ? (
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${req.completed ? 'text-gray-900' : 'text-gray-600'}`}
                >
                  {req.task}
                </p>
                {!req.completed && (
                  <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: `${req.progress}%` }}
                    />
                  </div>
                )}
              </div>
              {req.completed && (
                <Badge className="bg-green-100 text-green-800">Completed</Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Milestone Timeline Card
// ============================================================================

function MilestoneTimelineCard() {
  const { milestones } = useUserProgressStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-500" />
          Achievement Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />

          {/* Milestones */}
          <div className="space-y-6">
            {milestones.map((milestone) => (
              <div key={milestone.id} className="relative flex gap-4">
                {/* Timeline Dot */}
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-2xl shadow-lg">
                    {milestone.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{milestone.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {milestone.description}
                      </p>
                    </div>
                    <Badge variant="outline">{milestone.type}</Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(milestone.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
