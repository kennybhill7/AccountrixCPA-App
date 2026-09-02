"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatPillProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  variant?: 'default' | 'success' | 'warning' | 'primary';
  className?: string;
}

export function StatPill({ icon: Icon, label, value, variant = 'default', className }: StatPillProps) {
  const variantClasses = {
    default: "bg-surface text-text border-border",
    success: "bg-success-light text-success border-success",
    warning: "bg-warning-light text-warning border-warning",
    primary: "bg-surface-blue text-primary border-primary",
  };

  return (
    <Badge 
      variant="outline" 
      className={cn(
        "flex items-center space-x-2 px-3 py-1.5 text-sm font-medium",
        variantClasses[variant],
        className
      )}
    >
      <Icon className="w-4 h-4" />
      <span className="text-xs text-text-muted">{label}:</span>
      <span className="font-heading font-bold">{value}</span>
    </Badge>
  );
}

interface StatPillsProps {
  stats: Array<{
    icon: LucideIcon;
    label: string;
    value: string | number;
    variant?: 'default' | 'success' | 'warning' | 'primary';
  }>;
  className?: string;
}

export function StatPills({ stats, className }: StatPillsProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {stats.map((stat, index) => (
        <StatPill
          key={`${stat.label}-${index}`}
          icon={stat.icon}
          label={stat.label}
          value={stat.value}
          variant={stat.variant}
        />
      ))}
    </div>
  );
}