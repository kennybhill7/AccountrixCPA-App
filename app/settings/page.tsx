"use client";

import { LearningModeToggle } from "@/components/LearningModeToggle";
import { GlassCard } from "@/components/glass/GlassCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserProgress } from "@/lib/store";
import Link from "next/link";
import { BarChart3, Bell, BookOpen, GraduationCap, Heart, Lightbulb, Settings, Timer, User } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Settings Page
 *
 * Includes learning mode settings and other user preferences
 */
export default function SettingsPage() {
  const { learningMode } = useUserProgress();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Settings className="h-8 w-8 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground font-display tracking-tight">
            Settings
          </h1>
        </div>
        <p className="text-muted-foreground">
          Customize your learning experience and local profile
        </p>
      </div>

      <Tabs defaultValue="learning-mode" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="learning-mode">
            <GraduationCap className="h-4 w-4 mr-2" />
            Learning Mode
          </TabsTrigger>
          <TabsTrigger value="account">
            <User className="h-4 w-4 mr-2" />
            Account
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* Learning Mode Tab */}
        <TabsContent value="learning-mode" className="space-y-6">
          <GlassCard className="p-6 space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground font-display tracking-tight">
                Learning Mode
              </h2>
              <p className="text-sm text-muted-foreground">
                Choose between Study Mode for guided learning and Exam Mode for faster timed review.
              </p>
            </div>
            <LearningModeToggle showComparison />
          </GlassCard>

          {/* Mode-specific recommendations */}
          <GlassCard className="p-6 space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground font-display tracking-tight">
                Current Mode Benefits
              </h2>
              <p className="text-sm text-muted-foreground">
                What you get with {learningMode === 'student' ? 'Study' : 'Exam'} Mode
              </p>
            </div>
            {learningMode === 'student' ? (
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div
                    className="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "hsl(var(--primary) / 0.14)" }}
                  >
                    <GraduationCap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-foreground">Perfect for Beginners</h4>
                    <p className="text-sm text-muted-foreground">
                      Start from the basics and build a solid foundation in accounting principles.
                      Sequential lessons ensure you master each concept before moving forward.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div
                    className="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "hsl(var(--status-current) / 0.14)" }}
                  >
                    <Lightbulb className="h-4 w-4" style={{ color: "hsl(var(--status-current))" }} />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-foreground">Comprehensive Support</h4>
                    <p className="text-sm text-muted-foreground">
                      Access hints, detailed explanations, and guidance at every step. Our mascot
                      will help you stay motivated and understand difficult concepts.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div
                    className="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "hsl(var(--status-done) / 0.14)" }}
                  >
                    <Heart className="h-4 w-4" style={{ color: "hsl(var(--status-done))" }} />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-foreground">Gamified Learning</h4>
                    <p className="text-sm text-muted-foreground">
                      Hearts system keeps learning fun and engaging. Take your time and retry
                      quizzes as many times as needed to achieve mastery.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div
                    className="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "hsl(var(--destructive) / 0.14)" }}
                  >
                    <BookOpen className="h-4 w-4" style={{ color: "hsl(var(--destructive))" }} />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-foreground">Exam-Style Review</h4>
                    <p className="text-sm text-muted-foreground">
                      Intensive review designed for timed, high-focus sessions across Finance,
                      CMA, and CPA work. All content stays available so you can target weak areas.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div
                    className="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "hsl(var(--status-current) / 0.14)" }}
                  >
                    <Timer className="h-4 w-4" style={{ color: "hsl(var(--status-current))" }} />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-foreground">Timed Practice</h4>
                    <p className="text-sm text-muted-foreground">
                      Time limits on quizzes simulate real exam conditions. Build your speed and
                      accuracy to perform under pressure.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div
                    className="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "hsl(var(--primary) / 0.14)" }}
                  >
                    <BarChart3 className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-foreground">Performance Analytics</h4>
                    <p className="text-sm text-muted-foreground">
                      Track your performance across topics and identify areas that need more
                      review. Get targeted recommendations for improvement.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </GlassCard>
        </TabsContent>

        {/* Account Tab */}
        <TabsContent value="account">
          <GlassCard className="p-6 space-y-3">
            <div>
              <h2 className="text-lg font-semibold text-foreground font-display tracking-tight">
                Local Profile &amp; Backup
              </h2>
              <p className="text-sm text-muted-foreground">
                Accountrix currently stores progress locally in this browser.
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Use state export/import before switching machines or clearing browser data.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <Link href="/state">Open Backup / Restore</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/onboarding">Update Study Profile</Link>
              </Button>
            </div>
          </GlassCard>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <GlassCard className="p-6 space-y-3">
            <div>
              <h2 className="text-lg font-semibold text-foreground font-display tracking-tight">
                Review Reminders
              </h2>
              <p className="text-sm text-muted-foreground">
                Use Mission Control and the SRS queue as the reminder source.
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Browser notifications are not enabled in this local-first build. Open Mission
              Control daily to clear due review items before starting new material.
            </p>
            <Button asChild variant="outline">
              <Link href="/mission">Open Mission Control</Link>
            </Button>
          </GlassCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
