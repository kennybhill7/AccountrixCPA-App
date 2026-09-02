"use client";

import { Week } from "@/types/content";
import { useQuizResults } from "@/lib/store";
import { CheckCircle, Circle, Play } from "lucide-react";

interface WeekStepperProps {
  monthId: string;
  weeks: Week[];
}

export function WeekStepper({ monthId, weeks }: WeekStepperProps) {
  const quizResults = useQuizResults();

  return (
    <div className="flex items-center justify-center overflow-x-auto pb-4">
      <div className="flex items-center space-x-4 min-w-max">
        {weeks.map((week, index) => {
          const weekResults = quizResults.getResultsForWeek(monthId, week.id);
          const isCompleted = weekResults.length > 0;
          const prevWeekResults = index > 0 ? quizResults.getResultsForWeek(monthId, weeks[index - 1].id) : [];
          const isNext = !isCompleted && index === 0 ||
                        (!isCompleted && index > 0 && prevWeekResults.length > 0);

          return (
            <div key={week.id} className="flex items-center">
              {/* Week Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors
                    ${
                      isCompleted
                        ? "bg-green-500 border-green-500 text-white"
                        : isNext
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-muted-foreground/30 text-muted-foreground"
                    }
                  `}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : isNext ? (
                    <Play className="h-5 w-5" />
                  ) : (
                    <span className="font-medium text-sm">{index + 1}</span>
                  )}
                </div>
                
                <div className="text-center mt-2 max-w-20">
                  <div className="text-xs font-medium">Week {index + 1}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {week.title.split(' ').slice(0, 2).join(' ')}
                  </div>
                </div>
              </div>

              {/* Connection Line */}
              {index < weeks.length - 1 && (
                <div
                  className={`
                    w-16 h-0.5 mx-4 transition-colors
                    ${
                      isCompleted
                        ? "bg-green-500"
                        : "bg-muted-foreground/30"
                    }
                  `}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}