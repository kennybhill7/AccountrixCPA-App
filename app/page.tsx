"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, TrendingUp, Target, Users, Heart, Flame, Trophy, Play } from "lucide-react";
import { useUserProgress } from "@/lib/store";
// Client-side content checking

export default function HomePage() {
  const [hasContent, setHasContent] = useState<boolean | null>(null);
  const [stats, setStats] = useState<{ months: number; weeks: number; flashcards: number; quizQuestions: number } | null>(null);
  
  const { xp, hearts, streak, getXPLevel, getXPProgress } = useUserProgress();

  useEffect(() => {
    async function checkContent() {
      try {
        const response = await fetch('/api/stats');
        if (response.ok) {
          const dataStats = await response.json();
          setStats(dataStats);
          setHasContent(true);
        } else {
          setHasContent(false);
        }
      } catch (error) {
        console.error('Failed to check content:', error);
        setHasContent(false);
      }
    }
    
    checkContent();
  }, []);

  const currentLevel = getXPLevel();
  const xpProgress = getXPProgress();

  if (hasContent === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!hasContent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-2xl mx-auto text-center p-8">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
            <BookOpen className="h-16 w-16 text-primary mx-auto mb-6" />
            <h1 className="text-3xl font-heading font-bold text-blue-900 mb-4">
              Welcome to Construction CFO Learning
            </h1>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Ready to start your learning journey? First, we need to import your curriculum content from Word documents.
            </p>
            <div className="bg-blue-100 rounded-2xl p-4 mb-6">
              <p className="text-sm text-primary font-medium">
                💡 Pro tip: Prepare your DOCX lesson files in a single folder, then run the import command to get started!
              </p>
            </div>
            <Button size="lg" className="btn-primary">
              <BookOpen className="h-5 w-5 mr-2" />
              Import Curriculum
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Header with User Progress */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Trophy className="h-6 w-6 text-warning" />
                <div>
                  <div className="font-heading font-bold text-blue-900">Level {currentLevel}</div>
                  <div className="text-xs text-slate-600">{xp} XP</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Flame className="h-6 w-6 text-orange-500" />
                <div>
                  <div className="font-heading font-bold text-blue-900">{streak}</div>
                  <div className="text-xs text-slate-600">day streak</div>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Heart 
                    key={i}
                    className={`h-5 w-5 ${
                      i < hearts ? 'text-error fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="btn-primary">
                <Link href="/months">
                  <Play className="h-4 w-4 mr-2" />
                  Continue Learning
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/gamification">
                  <Trophy className="h-4 w-4 mr-2" />
                  View Progress
                </Link>
              </Button>
            </div>
          </div>
          
          {/* XP Progress Bar */}
          <div className="mt-3 bg-surface rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-primary-light transition-all duration-300"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Hero Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-heading font-bold text-blue-900 mb-6">
              Master Construction Finance
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Transform your construction financial expertise with our comprehensive CFO curriculum. 
              Learn through interactive lessons, master concepts with quizzes, and retain knowledge with spaced-repetition flashcards.
            </p>
            
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-200">
                  <div className="text-2xl font-bold text-primary">{stats.months}</div>
                  <div className="text-sm text-slate-600">Months</div>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-200">
                  <div className="text-2xl font-bold text-primary">{stats.weeks}</div>
                  <div className="text-sm text-slate-600">Weeks</div>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-200">
                  <div className="text-2xl font-bold text-primary">{stats.flashcards}</div>
                  <div className="text-sm text-slate-600">Flashcards</div>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-200">
                  <div className="text-2xl font-bold text-primary">{stats.quizQuestions}</div>
                  <div className="text-sm text-slate-600">Questions</div>
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="btn-primary">
                <Link href="/months">Start Learning</Link>
              </Button>
              <Button asChild size="lg" className="btn-secondary">
                <Link href="/flashcards">Practice Flashcards</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-blue-900 mb-4">Why Choose Our Platform?</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our proven methodology combines traditional learning with modern gamification to ensure maximum retention and engagement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card-duolingo text-center">
              <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-heading font-bold text-blue-900 mb-2">Structured Learning</h3>
              <p className="text-slate-600 text-sm">
                3 comprehensive months covering every aspect of construction financial management.
              </p>
            </div>

            <div className="card-duolingo text-center">
              <Target className="h-12 w-12 text-success mx-auto mb-4" />
              <h3 className="font-heading font-bold text-blue-900 mb-2">Interactive Quizzes</h3>
              <p className="text-slate-600 text-sm">
                Test your knowledge with carefully crafted quizzes that provide instant feedback and explanations.
              </p>
            </div>

            <div className="card-duolingo text-center">
              <TrendingUp className="h-12 w-12 text-primary-light mx-auto mb-4" />
              <h3 className="font-heading font-bold text-blue-900 mb-2">Spaced Repetition</h3>
              <p className="text-slate-600 text-sm">
                Master key concepts with intelligent flashcards that optimize review timing for retention.
              </p>
            </div>

            <div className="card-duolingo text-center">
              <Users className="h-12 w-12 text-warning mx-auto mb-4" />
              <h3 className="font-heading font-bold text-blue-900 mb-2">Progress Tracking</h3>
              <p className="text-slate-600 text-sm">
                Stay motivated with XP points, streak tracking, and detailed progress analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary-hover">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-heading font-bold text-white mb-4">Ready to Master Construction Finance?</h2>
          <p className="text-lg text-primary-light mb-8 max-w-2xl mx-auto">
            Join construction professionals who are advancing their careers with our comprehensive CFO curriculum.
          </p>
          <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-50">
            <Link href="/months">Start Your Journey Today</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}