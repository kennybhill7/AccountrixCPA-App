"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface CTAButtonProps {
  children: React.ReactNode;
  icon?: LucideIcon;
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  onClick?: () => void;
}

export function CTAButton({
  children,
  icon: Icon,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className,
  onClick,
}: CTAButtonProps) {
  const baseClasses = cn(
    "btn-primary font-medium transition-all duration-200 active:scale-95",
    "focus:ring-4 focus:ring-primary/30 focus:outline-none",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
    className
  );

  const variantClasses = {
    primary: "bg-primary hover:bg-primary-hover text-white",
    secondary: "bg-surface border-2 border-primary text-primary hover:bg-primary hover:text-white",
    success: "bg-success hover:bg-success text-white",
    warning: "bg-warning hover:bg-warning text-white",
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <Button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size]
      )}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          {Icon && <Icon className="w-4 h-4" />}
          <span>{children}</span>
        </div>
      )}
    </Button>
  );
}