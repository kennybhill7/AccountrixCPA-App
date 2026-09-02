'use client';

import React from 'react';
import { Badge, BadgeProgress } from '@/types/achievements';
import { getRarityColor, getCategoryLabel } from '@/lib/achievements';
import { motion, AnimatePresence } from 'framer-motion';

interface BadgeDetailsModalProps {
  badge: Badge;
  isOpen: boolean;
  onClose: () => void;
  isLocked: boolean;
  progress?: BadgeProgress;
}

export default function BadgeDetailsModal({
  badge,
  isOpen,
  onClose,
  isLocked,
  progress,
}: BadgeDetailsModalProps) {
  const rarityColor = getRarityColor(badge.rarity);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-card dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              style={{
                borderTop: `4px solid ${rarityColor}`,
              }}
            >
              {/* Header */}
              <div className="relative p-8 pb-6">
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-muted-foreground hover:text-muted-foreground dark:hover:text-foreground transition-colors"
                >
                  <svg
                    className="w-6 h-6"
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

                {/* Icon with glow */}
                <div className="flex justify-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.5 }}
                    className={`
                      text-8xl
                      ${isLocked ? 'filter blur-sm' : ''}
                      relative
                    `}
                  >
                    {isLocked ? 'ðŸ”’' : badge.icon}
                    {!isLocked && (
                      <div
                        className="absolute inset-0 blur-2xl opacity-50"
                        style={{
                          background: `radial-gradient(circle, ${rarityColor}, transparent)`,
                        }}
                      />
                    )}
                  </motion.div>
                </div>

                {/* Badge name */}
                <motion.h2
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl font-bold text-center mb-2"
                  style={{ color: isLocked ? undefined : rarityColor }}
                >
                  {isLocked ? '??? Mystery Badge ???' : badge.name}
                </motion.h2>

                {/* Category and Rarity */}
                <div className="flex justify-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full bg-muted dark:bg-gray-700 text-sm font-medium text-foreground dark:text-gray-300">
                    {getCategoryLabel(badge.category)}
                  </span>
                  <span
                    className="px-3 py-1 rounded-full text-sm font-bold uppercase"
                    style={{
                      backgroundColor: `${rarityColor}20`,
                      color: rarityColor,
                    }}
                  >
                    {badge.rarity}
                  </span>
                </div>

                {/* Description */}
                <p className="text-center text-muted-foreground dark:text-muted-foreground text-lg">
                  {badge.description}
                </p>
              </div>

              {/* Divider */}
              <div className="border-t border-border dark:border-gray-700" />

              {/* Details */}
              <div className="p-8 space-y-6">
                {/* XP Reward */}
                <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <span className="text-foreground dark:text-gray-300 font-medium">
                    XP Reward
                  </span>
                  <span className="flex items-center gap-2 text-xl font-bold text-yellow-600 dark:text-yellow-500">
                    <span>âœ¨</span>
                    +{badge.xpReward} XP
                  </span>
                </div>

                {/* Progress */}
                {progress && !badge.unlockedAt && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-foreground dark:text-gray-300 font-medium">
                        Your Progress
                      </span>
                      <span className="text-muted-foreground dark:text-muted-foreground font-medium">
                        {progress.current} / {progress.required}
                      </span>
                    </div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: rarityColor }}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress.percentage}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                      />
                    </div>
                    <div className="text-center mt-2 text-sm text-muted-foreground dark:text-muted-foreground">
                      {progress.percentage}% Complete
                    </div>
                    {progress.percentage > 0 && progress.percentage < 100 && (
                      <div className="mt-3 p-3 bg-accent dark:bg-accent/20 rounded-lg text-center">
                        <p className="text-sm text-primary dark:text-primary font-medium">
                          Keep going! Only {progress.required - progress.current} more to unlock!
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Earned date */}
                {badge.unlockedAt && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-foreground dark:text-gray-300 font-medium">
                        Earned On
                      </span>
                      <span className="text-green-700 dark:text-green-400 font-bold">
                        {new Date(badge.unlockedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                )}

                {/* Criteria information */}
                <div className="p-4 bg-gray-50 dark:bg-card/50 rounded-lg">
                  <h3 className="text-sm font-semibold text-foreground dark:text-gray-300 uppercase tracking-wide mb-2">
                    How to Unlock
                  </h3>
                  <p className="text-muted-foreground dark:text-muted-foreground">
                    {getCriteriaDescription(badge)}
                  </p>
                </div>

                {/* Locked message */}
                {isLocked && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">ðŸ”’</span>
                      <div>
                        <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-1">
                          Badge Locked
                        </h4>
                        <p className="text-sm text-purple-700 dark:text-purple-300">
                          Complete the requirements above to unlock this badge and earn{' '}
                          {badge.xpReward} XP!
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Unlocked celebration */}
                {badge.unlockedAt && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">ðŸŽ‰</span>
                      <div>
                        <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                          Achievement Unlocked!
                        </h4>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                          Congratulations! You've earned this {badge.rarity} badge and{' '}
                          {badge.xpReward} XP.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-border dark:border-gray-700 p-6">
                <button
                  onClick={onClose}
                  className="w-full px-6 py-3 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function getCriteriaDescription(badge: Badge): string {
  const { criteria } = badge;
  const { type, metric, operator, value } = criteria;

  // Custom descriptions for specific badges
  const customDescriptions: Record<string, string> = {
    'first-steps': 'Complete your very first lesson in the curriculum',
    'journal-master': 'Successfully complete 10 journal entry exercises',
    'trial-balance-pro': 'Balance 5 trial balances correctly',
    'bank-rec-expert': 'Complete 5 bank reconciliation exercises',
    'wip-wizard': 'Calculate 10 work-in-progress schedules',
    'coa-architect': 'Design and create your own custom chart of accounts',
    'quick-learner': 'Finish all lessons in week 1',
    'month-warrior': 'Complete all content in your first month',
    'streak-starter': 'Study for 3 consecutive days',
    'dedicated-student': 'Study for 7 consecutive days',
    'debit-credit-ninja': 'Score a perfect 100% on the Debit/Credit quiz',
    'asc-606-expert': 'Complete all ASC 606 revenue recognition modules',
    'consolidation-master': 'Successfully complete 3 consolidation exercises',
    'month-end-closer': 'Complete the comprehensive month-end close simulation',
    'perfect-score': 'Achieve 100% on any quiz or assessment',
    'speed-demon': 'Complete a task in less than half the expected time',
    'no-hints-needed': 'Complete a challenging task without using any hints',
    'error-detector': 'Find all errors in complex accounting scenarios',
    'formula-wizard': 'View formulas 10 times to understand calculations',
    'export-king': 'Export 20 documents from the platform',
    'cpa-ready': 'Pass the final exam with a score of 80% or higher',
    'honor-roll': 'Maintain an average of 90% or higher across all quizzes',
    'perfect-month': 'Complete an entire month with 100% average score',
    'triple-threat': 'Master journal entries, trial balances, and bank reconciliations',
    'construction-pro': 'Complete all 5+ construction accounting modules',
    'multi-entity-maven': 'Successfully complete 5 consolidation exercises',
    'xp-millionaire': 'Earn a total of 10,000 experience points',
    'overachiever': 'Complete every optional lesson and bonus challenge',
    'helper': 'Maintain an average of less than 3 hints used per task',
    'perfectionist': 'Complete 10 tasks with zero errors',
    'week-warrior': 'Study consistently for 7 days in a row',
    'monthly-dedication': 'Study consistently for 30 days in a row',
    'unstoppable': 'Study consistently for 50 days in a row',
    'legendary': 'Study consistently for 100 days in a row',
    'eternal-student': 'Study consistently for 365 days in a row',
    'early-bird': 'Complete a lesson before 8:00 AM',
    'night-owl': 'Complete a lesson after 10:00 PM',
    'weekend-warrior': 'Study on both Saturday and Sunday in the same weekend',
    'speed-runner': 'Complete an entire month of curriculum in just 2 weeks',
    'accountrix-certified': 'Pass the final exam and receive your certificate',
  };

  return customDescriptions[badge.id] || badge.description;
}
