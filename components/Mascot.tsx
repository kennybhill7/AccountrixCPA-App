"use client";

import { cn } from "@/lib/utils";

interface MascotProps {
  variant?: 'default' | 'success' | 'thinking' | 'excited' | 'small';
  className?: string;
  animate?: boolean;
}

export function Mascot({ variant = 'default', className, animate = false }: MascotProps) {
  const size = variant === 'small' ? 32 : 64;
  
  // Ledger - friendly blue paper airplane with glasses
  return (
    <div className={cn(
      "inline-flex items-center justify-center",
      animate && "animate-mascot-bounce",
      className
    )}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm"
      >
        {/* Paper airplane body */}
        <path
          d="M10 32L54 18L42 32L54 46L10 32Z"
          fill="#0EA5E9"
          fillOpacity="0.9"
        />
        <path
          d="M10 32L30 28L42 32L30 36L10 32Z"
          fill="#7DD3FC"
          fillOpacity="0.8"
        />
        
        {/* Airplane wing detail */}
        <path
          d="M30 28L42 32L30 36V28Z"
          fill="#0284C7"
          fillOpacity="0.9"
        />
        
        {/* Glasses frame */}
        <circle
          cx="24"
          cy="30"
          r="4"
          fill="none"
          stroke="#1E293B"
          strokeWidth="1.5"
          opacity="0.8"
        />
        <circle
          cx="32"
          cy="30"
          r="4"
          fill="none"
          stroke="#1E293B"
          strokeWidth="1.5"
          opacity="0.8"
        />
        
        {/* Bridge of glasses */}
        <line
          x1="28"
          y1="30"
          x2="28"
          y2="30"
          stroke="#1E293B"
          strokeWidth="1.5"
          opacity="0.8"
        />
        
        {/* Eyes based on variant */}
        {variant === 'success' ? (
          <>
            {/* Happy eyes (crescents) */}
            <path d="M22 29C22.5 28.5 23.5 28.5 24 29" stroke="#1E293B" strokeWidth="1.5" fill="none" />
            <path d="M30 29C30.5 28.5 31.5 28.5 32 29" stroke="#1E293B" strokeWidth="1.5" fill="none" />
          </>
        ) : variant === 'thinking' ? (
          <>
            {/* Concentrated eyes */}
            <circle cx="23" cy="30" r="1" fill="#1E293B" />
            <circle cx="31" cy="30" r="1" fill="#1E293B" />
            <path d="M21 28L25 28" stroke="#1E293B" strokeWidth="1" />
            <path d="M29 28L33 28" stroke="#1E293B" strokeWidth="1" />
          </>
        ) : variant === 'excited' ? (
          <>
            {/* Wide excited eyes */}
            <circle cx="23" cy="30" r="1.5" fill="#1E293B" />
            <circle cx="31" cy="30" r="1.5" fill="#1E293B" />
          </>
        ) : (
          <>
            {/* Default friendly eyes */}
            <circle cx="23" cy="30" r="1" fill="#1E293B" />
            <circle cx="31" cy="30" r="1" fill="#1E293B" />
          </>
        )}
        
        {/* Smile based on variant */}
        {variant === 'success' && (
          <path 
            d="M20 36C22 38 26 38 28 36" 
            stroke="#1E293B" 
            strokeWidth="1.5" 
            fill="none"
            strokeLinecap="round"
          />
        )}
        
        {variant === 'excited' && (
          <ellipse cx="24" cy="36" rx="2" ry="1" fill="#1E293B" opacity="0.6" />
        )}
        
        {/* Thought bubble for thinking variant */}
        {variant === 'thinking' && (
          <>
            <circle cx="38" cy="20" r="2" fill="#E2E8F0" opacity="0.8" />
            <circle cx="42" cy="16" r="3" fill="#E2E8F0" opacity="0.8" />
            <circle cx="48" cy="12" r="4" fill="#E2E8F0" opacity="0.8" />
            <text x="46" y="15" fontSize="8" fill="#475569">💡</text>
          </>
        )}
        
        {/* Sparkles for excited variant */}
        {variant === 'excited' && (
          <>
            <text x="16" y="20" fontSize="6" fill="#F59E0B">✨</text>
            <text x="38" y="24" fontSize="6" fill="#F59E0B">✨</text>
            <text x="18" y="44" fontSize="6" fill="#F59E0B">✨</text>
          </>
        )}
        
        {/* Success checkmark */}
        {variant === 'success' && (
          <path
            d="M46 22L50 26L56 18"
            stroke="#10B981"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </div>
  );
}

// Specialized mascot components for common use cases
export function MascotSuccess({ className, ...props }: Omit<MascotProps, 'variant'>) {
  return <Mascot variant="success" animate className={className} {...props} />;
}

export function MascotThinking({ className, ...props }: Omit<MascotProps, 'variant'>) {
  return <Mascot variant="thinking" className={className} {...props} />;
}

export function MascotExcited({ className, ...props }: Omit<MascotProps, 'variant'>) {
  return <Mascot variant="excited" animate className={className} {...props} />;
}

export function MascotSmall({ className, ...props }: Omit<MascotProps, 'variant'>) {
  return <Mascot variant="small" className={className} {...props} />;
}