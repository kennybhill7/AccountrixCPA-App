'use client';

import React from 'react';
import { Badge } from '@/types/achievements';
import { getRarityColor } from '@/lib/achievements';
import { motion } from 'framer-motion';

interface BadgeCardProps {
  badge: Badge;
  isLocked: boolean;
  showProgress?: boolean;
  onClick?: (badge: Badge) => void;
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
}

export default function BadgeCard({
  badge,
  isLocked,
  showProgress = true,
  onClick,
  size = 'medium',
  animated = true,
}: BadgeCardProps) {
  const rarityColor = getRarityColor(badge.rarity);

  const sizeClasses = {
    small: 'w-32 h-36 text-xs',
    medium: 'w-48 h-56 text-sm',
    large: 'w-64 h-72 text-base',
  };

  const iconSizes = {
    small: 'text-3xl',
    medium: 'text-5xl',
    large: 'text-6xl',
  };

  const progress = badge.progress || { current: 0, required: 1, percentage: 0 };
  const progressPercentage = progress.percentage;

  const cardContent = (
    <div
      className={`
        ${sizeClasses[size]}
        relative
        rounded-xl
        overflow-hidden
        cursor-pointer
        transition-all duration-300
        ${isLocked ? 'opacity-50 grayscale' : 'hover:scale-105 hover:shadow-2xl'}
        ${animated ? 'hover:-translate-y-2' : ''}
        bg-card dark:bg-gray-800
        shadow-lg
        border-2
        ${isLocked ? 'border-border dark:border-gray-600' : ''}
        group
      `}
      style={{
        borderColor: isLocked ? undefined : rarityColor,
        boxShadow: isLocked
          ? undefined
          : `0 0 20px ${rarityColor}33, 0 4px 6px -1px rgba(0, 0, 0, 0.1)`,
      }}
      onClick={() => onClick?.(badge)}
    >
      {/* Rarity glow effect */}
      {!isLocked && (
        <div
          className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${rarityColor}, transparent 70%)`,
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 p-4 flex flex-col items-center justify-between h-full">
        {/* Icon */}
        <div
          className={`
            ${iconSizes[size]}
            mb-2
            ${isLocked ? 'filter blur-sm' : ''}
            ${!isLocked ? 'animate-pulse-slow' : ''}
          `}
        >
          {isLocked ? 'ðŸ”’' : badge.icon}
        </div>

        {/* Name */}
        <h3
          className={`
            font-bold
            text-center
            mb-1
            ${isLocked ? 'text-muted-foreground dark:text-muted-foreground' : 'text-foreground dark:text-white'}
          `}
          style={{
            color: isLocked ? undefined : rarityColor,
          }}
        >
          {isLocked ? '???' : badge.name}
        </h3>

        {/* Description */}
        <p
          className={`
            text-center
            mb-2
            flex-grow
            ${size === 'small' ? 'line-clamp-2' : 'line-clamp-3'}
            ${isLocked ? 'text-muted-foreground dark:text-muted-foreground' : 'text-muted-foreground dark:text-gray-300'}
          `}
        >
          {badge.description}
        </p>

        {/* Progress bar */}
        {showProgress && !badge.unlockedAt && (
          <div className="w-full mb-2">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground dark:text-muted-foreground">Progress</span>
              <span className="text-foreground dark:text-gray-300 font-medium">
                {progress.current}/{progress.required}
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: rarityColor }}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
        )}

        {/* XP and Rarity */}
        <div className="flex justify-between items-center w-full pt-2 border-t border-border dark:border-gray-700">
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">âœ¨</span>
            <span className="font-bold text-foreground dark:text-gray-300">
              +{badge.xpReward} XP
            </span>
          </div>
          <span
            className="text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded"
            style={{
              backgroundColor: `${rarityColor}20`,
              color: rarityColor,
            }}
          >
            {badge.rarity}
          </span>
        </div>

        {/* Earned date */}
        {badge.unlockedAt && (
          <div className="mt-2 text-xs text-muted-foreground dark:text-muted-foreground text-center">
            Earned: {new Date(badge.unlockedAt).toLocaleDateString()}
          </div>
        )}
      </div>

      {/* Shimmer effect for unlocked badges */}
      {!isLocked && animated && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div
            className="absolute inset-0 animate-shimmer"
            style={{
              background: `linear-gradient(90deg, transparent, ${rarityColor}20, transparent)`,
              transform: 'translateX(-100%)',
            }}
          />
        </div>
      )}
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: isLocked ? 1 : 1.05 }}
      >
        {cardContent}
      </motion.div>
    );
  }

  return cardContent;
}
