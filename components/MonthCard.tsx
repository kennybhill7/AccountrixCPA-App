"use client";

import Link from "next/link";
import { Month } from "@/types/content";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, PlayCircle } from "lucide-react";
import { useQuizResults } from "@/lib/store";

interface MonthCardProps {
  month: Month;
}

export function MonthCard({ month }: MonthCardProps) {
  const quizResults = useQuizResults();

  const allResults = quizResults.getAllResults();
  const completedWeeksForMonth = allResults.filter(q => q.monthId === month.id);
  const totalWeeks = month.weeks.length;
  const progressPercentage = totalWeeks > 0 ? Math.round((completedWeeksForMonth.length / totalWeeks) * 100) : 0;
  const isCompleted = progressPercentage === 100;
  const isStarted = progressPercentage > 0;

  return (
    <Card className={`transition-all hover:shadow-md ${isCompleted ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800" : ""}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2 mb-2">
            <div className="bg-primary/20 p-2 rounded-lg">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground font-medium">
              Month {month.id}
            </span>
          </div>
          {isCompleted && (
            <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded text-xs font-medium">
              Completed
            </span>
          )}
        </div>
        
        <CardTitle className="text-lg leading-tight">{month.title}</CardTitle>
        {month.subtitle && (
          <CardDescription className="text-sm">
            {month.subtitle}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="text-xs text-muted-foreground">
            {completedWeeksForMonth.length} of {totalWeeks} weeks completed
          </div>
        </div>

        {/* Weeks Overview */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Weeks</div>
          <div className="grid grid-cols-4 gap-1">
            {month.weeks.map((week, index) => {
              const weekResults = quizResults.getResultsForWeek(month.id, week.id);
              const isWeekCompleted = weekResults.length > 0;
              return (
                <div
                  key={week.id}
                  className={`h-2 rounded-full ${
                    isWeekCompleted 
                      ? "bg-green-500" 
                      : "bg-muted"
                  }`}
                  title={`Week ${index + 1}: ${week.title}`}
                />
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <Button asChild className="w-full">
          <Link href={`/learn/${month.id}`}>
            <PlayCircle className="h-4 w-4 mr-2" />
            {isStarted ? "Continue" : "Start"} Learning
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}