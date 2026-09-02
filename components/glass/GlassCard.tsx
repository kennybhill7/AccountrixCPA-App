import * as React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Use the more-opaque, tighter-blur nav/sidebar recipe. */
  strong?: boolean;
  /** Add the spring hover-lift (for clickable cards). */
  hover?: boolean;
}

/** Frosted translucent surface — the base of the Aurora glass language. */
export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ strong, hover, className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(strong ? "glass-strong" : "glass", hover && "glass-hover", className)}
      {...props}
    >
      {children}
    </div>
  )
);
GlassCard.displayName = "GlassCard";
