"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserProgress } from "@/lib/store";

export default function ModePage() {
  const { learningMode, switchLearningMode, getModeConfig } = useUserProgress();
  const current = getModeConfig();

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-heading font-bold mb-2">Choose Your Mode</h1>
      <p className="text-muted-foreground mb-8">Switch anytime. Your progress carries over.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className={learningMode === 'student' ? 'ring-2 ring-primary' : ''}>
          <CardHeader>
            <CardTitle>Job Training (Student Mode)</CardTitle>
            <CardDescription>Guided learning, full explanations, unlimited retakes.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <Button onClick={() => switchLearningMode('student', 'User selected Student Mode')} className="btn-primary">
              Switch to Student Mode
            </Button>
            {learningMode === 'student' && <span className="text-sm text-green-600">Current</span>}
          </CardContent>
        </Card>

        <Card className={learningMode === 'cpa' ? 'ring-2 ring-primary' : ''}>
          <CardHeader>
            <CardTitle>CPA Review (CPA Mode)</CardTitle>
            <CardDescription>Fast-paced exam prep with time limits.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <Button onClick={() => switchLearningMode('cpa', 'User selected CPA Mode')} className="btn-secondary">
              Switch to CPA Mode
            </Button>
            {learningMode === 'cpa' && <span className="text-sm text-green-600">Current</span>}
          </CardContent>
        </Card>
      </div>

      <div className="mt-10 flex gap-3">
        <Button asChild className="btn-primary"><Link href="/onboarding">Start Onboarding</Link></Button>
        <Button asChild variant="outline"><Link href="/plan">View Your Plan</Link></Button>
        <Button asChild variant="ghost"><Link href="/months">Browse Content</Link></Button>
      </div>
    </div>
  );
}

