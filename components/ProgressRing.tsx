"use client";

import { cn } from "@/lib/utils";

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  className?: string;
  showText?: boolean;
  children?: React.ReactNode;
}

export function ProgressRing({ 
  progress, 
  size = 64, 
  strokeWidth = 4, 
  className,
  showText = false,
  children 
}: ProgressRingProps) {
  const normalizedProgress = Math.min(Math.max(progress, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${(normalizedProgress / 100) * circumference} ${circumference}`;
  const center = size / 2;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-border"
        />
        
        {/* Progress circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          className={cn(
            "text-primary transition-all duration-1000 ease-out",
            "animate-progress-ring"
          )}
          style={{
            strokeDashoffset: 0,
          }}
        />
      </svg>
      
      {/* Content overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        {showText ? (
          <span className="text-sm font-medium text-text">
            {Math.round(normalizedProgress)}%
          </span>
        ) : (
          children
        )}
      </div>
    </div>
  );
}