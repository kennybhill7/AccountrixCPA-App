'use client';

import React, { useEffect, useState } from 'react';
import { Badge } from '@/types/achievements';
import { getRarityColor } from '@/lib/achievements';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface BadgeUnlockedNotificationProps {
  badge: Badge;
  onClose: () => void;
  playSound?: boolean;
  showConfetti?: boolean;
}

export default function BadgeUnlockedNotification({
  badge,
  onClose,
  playSound = false,
  showConfetti = true,
}: BadgeUnlockedNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const rarityColor = getRarityColor(badge.rarity);

  useEffect(() => {
    // Play confetti effect
    if (showConfetti) {
      fireConfetti(badge.rarity);
    }

    // Play sound effect (optional)
    if (playSound) {
      playUnlockSound(badge.rarity);
    }

    // Auto-close after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for exit animation
    }, 5000);

    return () => clearTimeout(timer);
  }, [badge.rarity, playSound, showConfetti, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleClose}
          >
            {/* Notification Card */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 20,
              }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-md w-full"
            >
              {/* Glow effect */}
              <div
                className="absolute inset-0 blur-3xl opacity-50 rounded-3xl"
                style={{
                  background: `radial-gradient(circle, ${rarityColor}, transparent)`,
                }}
              />

              {/* Card content */}
              <div
                className="relative bg-card dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden"
                style={{
                  border: `3px solid ${rarityColor}`,
                }}
              >
                {/* Header */}
                <div
                  className="relative p-6 text-center"
                  style={{
                    background: `linear-gradient(135deg, ${rarityColor}20, ${rarityColor}10)`,
                  }}
                >
                  {/* Close button */}
                  <button
                    onClick={handleClose}
                    aria-label="Dismiss notification"
                    className="absolute top-2 right-2 text-muted-foreground hover:text-muted-foreground dark:hover:text-foreground transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>

                  <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3 className="text-2xl font-bold text-foreground dark:text-white mb-1">
                      Achievement Unlocked!
                    </h3>
                    <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                      You've earned a new badge
                    </p>
                  </motion.div>
                </div>

                {/* Badge Icon */}
                <div className="flex justify-center py-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: 360 }}
                    transition={{
                      type: 'spring',
                      stiffness: 200,
                      damping: 15,
                      delay: 0.3,
                    }}
                    className="relative"
                  >
                    <div className="text-8xl">{badge.icon}</div>
                    {/* Animated rings */}
                    <motion.div
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 0, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className="absolute inset-0 rounded-full"
                      style={{
                        border: `3px solid ${rarityColor}`,
                      }}
                    />
                  </motion.div>
                </div>

                {/* Badge Details */}
                <div className="px-6 pb-6 text-center space-y-4">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h2
                      className="text-3xl font-bold mb-2"
                      style={{ color: rarityColor }}
                    >
                      {badge.name}
                    </h2>
                    <p className="text-muted-foreground dark:text-muted-foreground mb-4">
                      {badge.description}
                    </p>
                  </motion.div>

                  {/* Rarity badge */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex justify-center"
                  >
                    <span
                      className="inline-block px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide"
                      style={{
                        backgroundColor: `${rarityColor}20`,
                        color: rarityColor,
                        border: `2px solid ${rarityColor}`,
                      }}
                    >
                      {badge.rarity} Badge
                    </span>
                  </motion.div>

                  {/* XP Reward */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl"
                  >
                    <div className="flex items-center justify-center gap-2 text-2xl font-bold text-yellow-600 dark:text-yellow-500">
                      <span className="text-3xl">âœ¨</span>
                      <span>+{badge.xpReward} XP</span>
                    </div>
                    <p className="text-sm text-muted-foreground dark:text-muted-foreground mt-1">
                      Experience Points Earned
                    </p>
                  </motion.div>

                  {/* Call to action */}
                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    onClick={handleClose}
                    className="w-full py-3 px-6 rounded-xl font-bold text-white transition-all hover:scale-105 hover:shadow-lg"
                    style={{
                      backgroundColor: rarityColor,
                    }}
                  >
                    Awesome!
                  </motion.button>
                </div>

                {/* Sparkle effects */}
                <div className="absolute top-10 left-10 text-2xl animate-bounce">
                  âœ¨
                </div>
                <div
                  className="absolute top-20 right-10 text-xl animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                >
                  â­
                </div>
                <div
                  className="absolute bottom-20 left-14 text-lg animate-bounce"
                  style={{ animationDelay: '0.4s' }}
                >
                  ðŸ’«
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * Fire confetti based on badge rarity
 */
function fireConfetti(rarity: string) {
  const colors = {
    common: ['#10b981', '#34d399', '#6ee7b7'],
    uncommon: ['#3b82f6', '#60a5fa', '#93c5fd'],
    rare: ['#a855f7', '#c084fc', '#e9d5ff'],
    epic: ['#f97316', '#fb923c', '#fdba74'],
    legendary: ['#fbbf24', '#fcd34d', '#fde68a'],
  };

  const particleCount = {
    common: 50,
    uncommon: 75,
    rare: 100,
    epic: 150,
    legendary: 200,
  };

  const color = colors[rarity as keyof typeof colors] || colors.common;
  const count = particleCount[rarity as keyof typeof particleCount] || 50;

  // Fire confetti from multiple angles
  const duration = rarity === 'legendary' || rarity === 'epic' ? 3000 : 2000;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: color,
    });
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: color,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  // Initial burst
  confetti({
    particleCount: count,
    spread: 120,
    origin: { y: 0.6 },
    colors: color,
  });

  // Continuous for rare badges
  if (rarity === 'epic' || rarity === 'legendary') {
    frame();
  }
}

/**
 * Play unlock sound based on badge rarity
 * Note: You'll need to add actual sound files to your public/sounds directory
 */
function playUnlockSound(rarity: string) {
  try {
    const audio = new Audio(`/sounds/badge-unlock-${rarity}.mp3`);
    audio.volume = 0.3;
    audio.play().catch(() => {
      // Ignore errors if sound file doesn't exist
    });
  } catch (error) {
    // Ignore errors
  }
}
