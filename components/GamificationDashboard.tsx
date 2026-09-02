"use client";

import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useUserProgress } from '@/lib/store';
import { Trophy, Target, Flame, Star, Calendar, Award } from 'lucide-react';

export function GamificationDashboard() {
  const {
    xp,
    streak,
    longestStreak,
    achievements,
    getTodayGoals,
    getXPLevel,
    getXPProgress,
    getStreakBonus,
    getUnlockedAchievements,
    initializeAchievements,
    checkDailyGoals
  } = useUserProgress();

  useEffect(() => {
    initializeAchievements();
    checkDailyGoals();
  }, [initializeAchievements, checkDailyGoals]);

  const todayGoals = getTodayGoals();
  const level = getXPLevel();
  const xpProgress = getXPProgress();
  const streakBonus = getStreakBonus();
  const unlockedAchievements = getUnlockedAchievements();

  return (
    <div className="space-y-6">
      {/* Level & XP Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-600" />
            Level Progress
          </CardTitle>
          <CardDescription>
            Level {level} • {xp} total XP
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progress to Level {level + 1}</span>
              <span>{xpProgress}/100 XP</span>
            </div>
            <Progress value={xpProgress} className="w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Daily Goals */}
      {todayGoals && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Today's Goals
              {todayGoals.completed && (
                <Badge className="bg-green-600">Complete!</Badge>
              )}
            </CardTitle>
            <CardDescription>
              Complete your daily goals to maintain your streak
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* XP Goal */}
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Earn XP</span>
                  <span>{todayGoals.xpEarned}/{todayGoals.xpGoal} XP</span>
                </div>
                <Progress value={(todayGoals.xpEarned / todayGoals.xpGoal) * 100} />
              </div>

              {/* Lessons Goal */}
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Complete Lessons</span>
                  <span>{todayGoals.lessonsCompleted}/{todayGoals.lessonsGoal}</span>
                </div>
                <Progress value={(todayGoals.lessonsCompleted / todayGoals.lessonsGoal) * 100} />
              </div>

              {/* Quizzes Goal */}
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Take Quizzes</span>
                  <span>{todayGoals.quizzesCompleted}/{todayGoals.quizzesGoal}</span>
                </div>
                <Progress value={(todayGoals.quizzesCompleted / todayGoals.quizzesGoal) * 100} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Streak Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-600" />
            Study Streak
            {streakBonus > 1 && (
              <Badge variant="secondary">
                {streakBonus}x XP Bonus!
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Keep studying daily to build your streak
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-orange-600">{streak}</p>
              <p className="text-sm text-muted-foreground">Current Streak</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">{longestStreak}</p>
              <p className="text-sm text-muted-foreground">Longest Streak</p>
            </div>
          </div>
          
          {streak >= 7 && (
            <div className="mt-4 p-3 bg-orange-50 rounded-lg">
              <p className="text-sm text-orange-800 font-medium">
                🔥 You're on fire! Your {streak}-day streak gives you {streakBonus}x XP bonus!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-600" />
            Achievements
            <Badge variant="outline">
              {unlockedAchievements.length}/{achievements.length}
            </Badge>
          </CardTitle>
          <CardDescription>
            Unlock achievements by reaching study milestones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => {
              const isUnlocked = achievement.unlockedAt;
              const progressPercent = (achievement.progress / achievement.maxProgress) * 100;
              
              return (
                <div
                  key={achievement.id}
                  className={`p-4 border rounded-lg ${
                    isUnlocked ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-border'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h4 className={`font-medium ${isUnlocked ? 'text-purple-900' : 'text-foreground'}`}>
                        {achievement.title}
                        {isUnlocked && <span className="ml-2 text-xs">✨</span>}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                      
                      {!isUnlocked && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span>Progress</span>
                            <span>{achievement.progress}/{achievement.maxProgress}</span>
                          </div>
                          <Progress value={progressPercent} className="h-2" />
                        </div>
                      )}
                      
                      {isUnlocked && (
                        <Badge variant="default" className="bg-purple-600 text-xs">
                          Unlocked {new Date(achievement.unlockedAt!).toLocaleDateString()}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default GamificationDashboard;