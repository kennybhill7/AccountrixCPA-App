"use client";

import { LearningModeToggle } from "@/components/LearningModeToggle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Settings className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Settings</h1>
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
          <Card>
            <CardHeader>
              <CardTitle>Learning Mode</CardTitle>
              <CardDescription>
                Choose between Study Mode for guided learning and Exam Mode for faster timed review.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LearningModeToggle showComparison />
            </CardContent>
          </Card>

          {/* Mode-specific recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Current Mode Benefits</CardTitle>
              <CardDescription>
                What you get with {learningMode === 'student' ? 'Study' : 'Exam'} Mode
              </CardDescription>
            </CardHeader>
            <CardContent>
              {learningMode === 'student' ? (
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-accent dark:bg-accent flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="h-4 w-4 text-primary dark:text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Perfect for Beginners</h4>
                      <p className="text-sm text-muted-foreground">
                        Start from the basics and build a solid foundation in accounting principles.
                        Sequential lessons ensure you master each concept before moving forward.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="h-4 w-4 text-purple-700 dark:text-purple-200" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Comprehensive Support</h4>
                      <p className="text-sm text-muted-foreground">
                        Access hints, detailed explanations, and guidance at every step. Our mascot
                        will help you stay motivated and understand difficult concepts.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                      <Heart className="h-4 w-4 text-green-700 dark:text-green-200" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Gamified Learning</h4>
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
                    <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="h-4 w-4 text-red-700 dark:text-red-200" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Exam-Style Review</h4>
                      <p className="text-sm text-muted-foreground">
                        Intensive review designed for timed, high-focus sessions across Finance,
                        CMA, and CPA work. All content stays available so you can target weak areas.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center flex-shrink-0">
                      <Timer className="h-4 w-4 text-orange-700 dark:text-orange-200" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Timed Practice</h4>
                      <p className="text-sm text-muted-foreground">
                        Time limits on quizzes simulate real exam conditions. Build your speed and
                        accuracy to perform under pressure.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="h-4 w-4 text-yellow-700 dark:text-yellow-200" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Performance Analytics</h4>
                      <p className="text-sm text-muted-foreground">
                        Track your performance across topics and identify areas that need more
                        review. Get targeted recommendations for improvement.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Tab */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Local Profile & Backup</CardTitle>
              <CardDescription>
                Accountrix currently stores progress locally in this browser.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Review Reminders</CardTitle>
              <CardDescription>Use Mission Control and the SRS queue as the reminder source.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Browser notifications are not enabled in this local-first build. Open Mission
                Control daily to clear due review items before starting new material.
              </p>
              <Button asChild variant="outline">
                <Link href="/mission">Open Mission Control</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
