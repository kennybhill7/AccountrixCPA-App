"use client";

import { useState } from "react";
import { useUserProgress } from "@/lib/store";
import { useHydratedStore } from "@/lib/hooks";
import {
  LearningMode,
  MODE_COMPARISON,
  MODE_SWITCH_REASONS,
} from "@/types/learning-mode";
import {
  getModeConfig,
  getOppositeMode,
  getModeSwitchConfirmationMessage,
  getModeBadgeConfig,
} from "@/lib/learning-mode";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  BookOpen,
  CheckCircle,
  XCircle,
  Info,
  ArrowRight,
  Zap,
  Target,
  Clock,
  Award,
  Lightbulb,
  Timer,
  Repeat,
  MessageSquare,
  Heart,
  SkipForward,
} from "lucide-react";

interface LearningModeToggleProps {
  /** Show detailed comparison table */
  showComparison?: boolean;
  /** Compact mode for header */
  compact?: boolean;
  /** Callback when mode is switched */
  onModeSwitch?: (newMode: LearningMode) => void;
}

/**
 * Learning Mode Toggle Component
 *
 * Allows users to switch between Study Mode and Exam Mode.
 * Includes confirmation dialog and detailed mode comparison.
 */
export function LearningModeToggle({
  showComparison = false,
  compact = false,
  onModeSwitch,
}: LearningModeToggleProps) {
  const hydrated = useHydratedStore();
  const { learningMode, switchLearningMode, modeConfig } = useUserProgress();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [targetMode, setTargetMode] = useState<LearningMode | null>(null);
  const [showComparisonTable, setShowComparisonTable] = useState(showComparison);

  if (!hydrated) {
    return null; // Or a skeleton loader
  }

  const currentConfig = modeConfig;
  const oppositeMode = getOppositeMode(learningMode);
  const oppositeConfig = getModeConfig(oppositeMode);

  const handleOpenDialog = (mode: LearningMode) => {
    setTargetMode(mode);
    setIsDialogOpen(true);
  };

  const handleConfirmSwitch = () => {
    if (targetMode) {
      switchLearningMode(targetMode);
      onModeSwitch?.(targetMode);
      setIsDialogOpen(false);
      setTargetMode(null);
    }
  };

  const confirmationMessage = targetMode
    ? getModeSwitchConfirmationMessage(learningMode, targetMode)
    : null;

  // Compact mode - just a badge with click to toggle
  if (compact) {
    const badgeConfig = getModeBadgeConfig(learningMode);

    return (
      <>
        <button
          onClick={() => handleOpenDialog(oppositeMode)}
          className="transition-all hover:opacity-80"
        >
          <Badge variant={badgeConfig.variant as any} className={badgeConfig.className}>
            {badgeConfig.icon} {badgeConfig.label}
          </Badge>
        </button>

        <ModeSwitchDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onConfirm={handleConfirmSwitch}
          confirmationMessage={confirmationMessage}
        />
      </>
    );
  }

  // Full mode toggle UI
  return (
    <div className="space-y-6">
      {/* Current Mode Display */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {currentConfig.icon} Learning Mode
              </CardTitle>
              <CardDescription>
                Current: <strong>{currentConfig.label}</strong>
              </CardDescription>
            </div>
            <Badge
              variant={learningMode === 'student' ? 'default' : 'secondary'}
              className="text-sm px-3 py-1"
            >
              {currentConfig.icon} {currentConfig.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mode Cards */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Study Mode Card */}
            <ModeCard
              mode="student"
              isActive={learningMode === 'student'}
              onSelect={() => handleOpenDialog('student')}
            />

            {/* Exam Mode Card */}
            <ModeCard
              mode="cpa"
              isActive={learningMode === 'cpa'}
              onSelect={() => handleOpenDialog('cpa')}
            />
          </div>

          {/* Current Mode Features */}
          <div className="pt-4 border-t">
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
              Current Mode Features
            </h4>
            <div className="grid md:grid-cols-2 gap-3">
              {Object.entries(currentConfig.features).map(([key, enabled]) => {
                const featureLabel = formatFeatureLabel(key);
                return (
                  <div
                    key={key}
                    className={`flex items-center gap-2 text-sm ${
                      enabled ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'
                    }`}
                  >
                    {enabled ? (
                      <CheckCircle className="h-4 w-4 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 flex-shrink-0" />
                    )}
                    <span>{featureLabel}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Switch to Opposite Mode Benefits */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-semibold mb-2 text-sm flex items-center gap-2">
              <Info className="h-4 w-4" />
              Switch to {oppositeConfig.label} for:
            </h4>
            <ul className="space-y-1 text-sm text-muted-foreground ml-6">
              {getSwitchBenefits(learningMode, oppositeMode).map((benefit, index) => (
                <li key={index} className="list-disc">
                  {benefit}
                </li>
              ))}
            </ul>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 w-full"
              onClick={() => handleOpenDialog(oppositeMode)}
            >
              Switch to {oppositeConfig.label}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {/* Comparison Table Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComparisonTable(!showComparisonTable)}
            className="w-full"
          >
            {showComparisonTable ? 'Hide' : 'Show'} Detailed Comparison
          </Button>
        </CardContent>
      </Card>

      {/* Comparison Table */}
      {showComparisonTable && <ModeComparisonTable />}

      {/* Mode Switch Dialog */}
      <ModeSwitchDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirmSwitch}
        confirmationMessage={confirmationMessage}
      />
    </div>
  );
}

/**
 * Individual Mode Card Component
 */
function ModeCard({
  mode,
  isActive,
  onSelect,
}: {
  mode: LearningMode;
  isActive: boolean;
  onSelect: () => void;
}) {
  const config = getModeConfig(mode);

  const getIcon = () => {
    return mode === 'student' ? (
      <GraduationCap className="h-12 w-12 mb-3" />
    ) : (
      <BookOpen className="h-12 w-12 mb-3" />
    );
  };

  return (
    <button
      onClick={onSelect}
      disabled={isActive}
      className={`relative p-6 rounded-lg border-2 transition-all text-left ${
        isActive
          ? 'border-primary bg-primary/5 cursor-default'
          : 'border-border hover:border-primary/50 hover:bg-accent/50'
      }`}
    >
      {isActive && (
        <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
          Active
        </Badge>
      )}

      <div className="flex flex-col items-center text-center">
        <div className={isActive ? 'text-primary' : 'text-muted-foreground'}>{getIcon()}</div>

        <h3 className="font-bold text-lg mb-1">
          {config.icon} {config.label}
        </h3>

        <p className="text-sm text-muted-foreground mb-3">{config.description}</p>

        <div className="text-xs text-muted-foreground">
          <strong>Best for:</strong> {config.bestFor}
        </div>

        {!isActive && (
          <div className="mt-4 text-sm font-medium text-primary">
            Switch to {config.label} <ArrowRight className="h-4 w-4 inline ml-1" />
          </div>
        )}
      </div>
    </button>
  );
}

/**
 * Mode Comparison Table Component
 */
function ModeComparisonTable() {
  const getIconForFeature = (icon?: string) => {
    const iconMap: Record<string, any> = {
      'ðŸ”“': <Target className="h-4 w-4" />,
      'ðŸ“„': <BookOpen className="h-4 w-4" />,
      'ðŸ’¡': <Lightbulb className="h-4 w-4" />,
      'â±ï¸': <Timer className="h-4 w-4" />,
      'ðŸ”„': <Repeat className="h-4 w-4" />,
      'ðŸ“': <MessageSquare className="h-4 w-4" />,
      'ðŸš€': <Zap className="h-4 w-4" />,
      'â¤ï¸': <Heart className="h-4 w-4" />,
      'â­ï¸': <SkipForward className="h-4 w-4" />,
      'ðŸŽ¯': <Target className="h-4 w-4" />,
    };
    return icon ? iconMap[icon] || null : null;
  };

  const groupedFeatures = MODE_COMPARISON.reduce((acc, feature) => {
    if (!acc[feature.category]) {
      acc[feature.category] = [];
    }
    acc[feature.category].push(feature);
    return acc;
  }, {} as Record<string, typeof MODE_COMPARISON>);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mode Comparison</CardTitle>
        <CardDescription>Detailed comparison of Study Mode vs Exam Mode</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(groupedFeatures).map(([category, features]) => (
            <div key={category}>
              <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">
                {category}
              </h4>
              <div className="space-y-2">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-3 gap-4 p-3 rounded-lg border bg-card text-sm"
                  >
                    <div className="font-medium flex items-center gap-2">
                      {getIconForFeature(feature.icon)}
                      {feature.feature}
                    </div>
                    <div className="text-center">
                      {typeof feature.studentMode === 'boolean' ? (
                        feature.studentMode ? (
                          <CheckCircle className="h-4 w-4 text-green-600 inline" />
                        ) : (
                          <XCircle className="h-4 w-4 text-muted-foreground inline" />
                        )
                      ) : (
                        <span className="text-primary dark:text-primary">
                          {feature.studentMode}
                        </span>
                      )}
                    </div>
                    <div className="text-center">
                      {typeof feature.cpaMode === 'boolean' ? (
                        feature.cpaMode ? (
                          <CheckCircle className="h-4 w-4 text-green-600 inline" />
                        ) : (
                          <XCircle className="h-4 w-4 text-muted-foreground inline" />
                        )
                      ) : (
                        <span className="text-red-600 dark:text-red-400">{feature.cpaMode}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Mode Switch Confirmation Dialog
 */
function ModeSwitchDialog({
  isOpen,
  onClose,
  onConfirm,
  confirmationMessage,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  confirmationMessage: ReturnType<typeof getModeSwitchConfirmationMessage> | null;
}) {
  if (!confirmationMessage) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{confirmationMessage.title}</AlertDialogTitle>
          <AlertDialogDescription>{confirmationMessage.description}</AlertDialogDescription>
        </AlertDialogHeader>

        <div className="my-4 space-y-2">
          {confirmationMessage.bullets.map((bullet, index) => (
            <div key={index} className="flex items-start gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
              <span>{bullet}</span>
            </div>
          ))}
        </div>

        {confirmationMessage.warning && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                {confirmationMessage.warning}
              </p>
            </div>
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Confirm Switch</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function formatFeatureLabel(key: string): string {
  const labels: Record<string, string> = {
    sequentialUnlock: 'Sequential unlock',
    hintsEnabled: 'Hints enabled',
    timeLimitsRequired: 'Time limits',
    unlimitedRetakes: 'Unlimited retakes',
    detailedExplanations: 'Detailed explanations',
    heartsSystem: 'Hearts system',
    skipAllowed: 'Can skip questions',
    fullLessonContent: 'Full lesson content',
  };
  return labels[key] || key;
}

function getSwitchBenefits(currentMode: LearningMode, targetMode: LearningMode): string[] {
  if (targetMode === 'cpa') {
    return [
      'Fast-paced review and exam preparation',
      'All content unlocked immediately',
      'Timed practice exams',
      'Condensed materials focused on key points',
      'Performance tracking and weak area identification',
    ];
  } else {
    return [
      'Detailed explanations and step-by-step guidance',
      'Hints available to help you learn',
      'Unlimited quiz retakes to master material',
      'Hearts system for gamified learning',
      'Full lesson content with examples',
    ];
  }
}
