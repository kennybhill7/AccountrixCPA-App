"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Lock, Star, PlayCircle, CheckCircle, Trophy } from "lucide-react";
import { Month } from "@/types/content";
import { useQuizResults } from "@/lib/store";
import { useHydratedStore } from "@/lib/hooks";

interface PathMapProps {
  months: Month[];
}

interface UnitBubbleProps {
  month: Month;
  week: any;
  weekIndex: number;
  isLocked: boolean;
  isCompleted: boolean;
  stars: number;
  progress: number;
  onClick: () => void;
}

function UnitBubble({ month, week, weekIndex, isLocked, isCompleted, stars, progress, onClick }: UnitBubbleProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        disabled={isLocked}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "relative w-16 h-16 rounded-full border-4 transition-all duration-300 transform",
          "focus:outline-none focus:ring-4 focus:ring-primary/30",
          isLocked
            ? "bg-gray-200 border-border cursor-not-allowed"
            : isCompleted
            ? "bg-success border-success-light hover:scale-110 animate-bubble-pulse"
            : progress > 0
            ? "bg-primary border-primary-light hover:scale-110"
            : "bg-card border-primary hover:scale-110 shadow-md",
          isHovered && !isLocked && "shadow-lg"
        )}
      >
        {/* Progress ring */}
        {progress > 0 && !isCompleted && (
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 64 64">
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              className="text-primary-light"
              strokeDasharray={`${progress * 1.76} 176`}
              strokeLinecap="round"
            />
          </svg>
        )}
        
        {/* Content */}
        <div className="flex items-center justify-center h-full">
          {isLocked ? (
            <Lock className="w-6 h-6 text-muted-foreground" />
          ) : isCompleted ? (
            <CheckCircle className="w-6 h-6 text-white" />
          ) : (
            <span className="text-sm font-heading font-bold text-text">
              {weekIndex + 1}
            </span>
          )}
        </div>
        
        {/* Stars */}
        {stars > 0 && (
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-0.5">
            {Array.from({ length: 3 }, (_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-3 h-3",
                  i < stars ? "text-warning fill-current" : "text-gray-300"
                )}
              />
            ))}
          </div>
        )}
      </button>
      
      {/* Tooltip */}
      {isHovered && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10">
          <div className="bg-text text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg">
            <div className="font-medium">{week.title}</div>
            {progress > 0 && (
              <div className="text-xs opacity-90">{Math.round(progress)}% complete</div>
            )}
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-text"></div>
        </div>
      )}
    </div>
  );
}

function JumpModal({ month, onClose, onJump }: { month: Month; onClose: () => void; onJump: (weekId: string) => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-heading font-bold">Jump to Week</h3>
            <Button variant="ghost" size="sm" onClick={onClose}>Ã—</Button>
          </div>
          
          <p className="text-text-muted mb-4">
            Choose which week to start with in {month.title}:
          </p>
          
          <div className="space-y-2">
            {month.weeks.map((week, index) => (
              <Button
                key={week.id}
                variant="outline"
                className="w-full justify-start"
                onClick={() => onJump(week.id)}
              >
                <PlayCircle className="w-4 h-4 mr-2" />
                Week {index + 1}: {week.title}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function PathMap({ months }: PathMapProps) {
  const hydrated = useHydratedStore();
  const quizResults = useQuizResults();
  const [selectedMonth, setSelectedMonth] = useState<Month | null>(null);
  
  if (!hydrated) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getWeekStats = (monthId: string, weekId: string) => {
    const weekResults = quizResults.getResultsForWeek(monthId, weekId);

    if (weekResults.length === 0) {
      return { isCompleted: false, stars: 0, progress: 0 };
    }

    const latestResult = weekResults[weekResults.length - 1];
    const percentage = (latestResult.score / latestResult.totalQuestions) * 100;
    const stars = percentage >= 90 ? 3 : percentage >= 70 ? 2 : percentage >= 50 ? 1 : 0;

    return {
      isCompleted: true,
      stars,
      progress: 100
    };
  };

  const isMonthUnlocked = (monthIndex: number) => {
    if (monthIndex === 0) return true; // First month always unlocked
    
    // Check if previous month has at least one completed week
    const prevMonth = months[monthIndex - 1];
    if (!prevMonth) return false;
    
    return prevMonth.weeks.some(week => {
      const stats = getWeekStats(prevMonth.id, week.id);
      return stats.isCompleted;
    });
  };

  const getMonthProgress = (month: Month) => {
    const completedWeeks = month.weeks.filter(week => {
      const stats = getWeekStats(month.id, week.id);
      return stats.isCompleted;
    }).length;
    
    return (completedWeeks / month.weeks.length) * 100;
  };

  const handleUnitClick = (month: Month, week: any) => {
    // Check if week is locked (previous week not completed)
    const weekIndex = month.weeks.findIndex(w => w.id === week.id);
    if (weekIndex > 0) {
      const prevWeek = month.weeks[weekIndex - 1];
      const prevStats = getWeekStats(month.id, prevWeek.id);
      if (!prevStats.isCompleted) {
        setSelectedMonth(month);
        return;
      }
    }
    
    // Navigate directly to the week
    window.location.href = `/learn/${month.id}/${week.id}`;
  };

  const handleJumpToWeek = (weekId: string) => {
    if (selectedMonth) {
      window.location.href = `/learn/${selectedMonth.id}/${weekId}`;
    }
  };

  return (
    <>
      <div className="space-y-12">
        {months.map((month, monthIndex) => {
          const isUnlocked = isMonthUnlocked(monthIndex);
          const progress = getMonthProgress(month);
          const totalStars = month.weeks.reduce((acc, week) => {
            const stats = getWeekStats(month.id, week.id);
            return acc + stats.stars;
          }, 0);
          
          return (
            <div key={month.id} className="relative">
              {/* Month Section Header */}
              <div className="flex items-center space-x-4 mb-8">
                <div className={cn(
                  "flex items-center justify-center w-12 h-12 rounded-full border-2",
                  isUnlocked 
                    ? "bg-primary border-primary text-white" 
                    : "bg-gray-200 border-border text-muted-foreground"
                )}>
                  <span className="font-heading font-bold">{monthIndex + 1}</span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <h2 className="text-2xl font-heading font-bold text-text">
                      {month.title}
                    </h2>
                    
                    {totalStars > 0 && (
                      <Badge variant="secondary" className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-warning fill-current" />
                        <span>{totalStars}</span>
                      </Badge>
                    )}
                    
                    {progress === 100 && (
                      <Badge className="bg-success text-white">
                        <Trophy className="w-3 h-3 mr-1" />
                        Complete
                      </Badge>
                    )}
                  </div>
                  
                  {progress > 0 && (
                    <div className="mt-2 max-w-xs">
                      <Progress value={progress} className="h-2" />
                      <p className="text-sm text-text-muted mt-1">
                        {Math.round(progress)}% complete
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Week Bubbles Path */}
              <div className="relative">
                {/* Connecting line */}
                <div className="absolute top-8 left-8 right-8 h-0.5 bg-gradient-to-r from-primary/30 via-primary/50 to-primary/30"></div>
                
                {/* Week bubbles */}
                <div className="relative flex justify-between items-center">
                  {month.weeks.map((week, weekIndex) => {
                    const isWeekLocked = !isUnlocked || (weekIndex > 0 && !getWeekStats(month.id, month.weeks[weekIndex - 1].id).isCompleted);
                    const weekStats = getWeekStats(month.id, week.id);
                    
                    return (
                      <UnitBubble
                        key={week.id}
                        month={month}
                        week={week}
                        weekIndex={weekIndex}
                        isLocked={isWeekLocked}
                        isCompleted={weekStats.isCompleted}
                        stars={weekStats.stars}
                        progress={weekStats.progress}
                        onClick={() => handleUnitClick(month, week)}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Jump Modal */}
      {selectedMonth && (
        <JumpModal
          month={selectedMonth}
          onClose={() => setSelectedMonth(null)}
          onJump={handleJumpToWeek}
        />
      )}
    </>
  );
}