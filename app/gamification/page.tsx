import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GamificationDashboard from '@/components/GamificationDashboard';

export const metadata: Metadata = {
  title: 'Your Progress - Accountrix',
  description: 'Track your learning progress, achievements, and daily goals.',
};

export default function GamificationPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary hover:underline mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Your Progress</h1>
        <p className="text-muted-foreground">
          Track your achievements, daily goals, and learning streaks
        </p>
      </div>

      {/* Gamification Dashboard */}
      <GamificationDashboard />

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/learn">
            Continue Learning
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">
            Back to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}