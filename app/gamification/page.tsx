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
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Progress</h1>
            <p className="text-lg text-gray-600">
              Track your achievements, daily goals, and learning streaks
            </p>
          </div>
        </div>
      </div>

      {/* Gamification Dashboard */}
      <GamificationDashboard />
      
      {/* Action Buttons */}
      <div className="mt-8 flex gap-4">
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