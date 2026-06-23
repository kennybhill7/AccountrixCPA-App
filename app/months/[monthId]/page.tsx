import { loadMonth, hasData } from '@/lib/content-loader';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Play, BookOpen, Brain, Trophy, Clock, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface MonthPageProps {
  params: Promise<{
    monthId: string;
  }>;
}

export async function generateMetadata({ params }: MonthPageProps): Promise<Metadata> {
  try {
    const { monthId } = await params;
    const month = await loadMonth(monthId);
    return {
      title: `${month.title} - Accountrix`,
      description: month.description || `Learn ${month.title} with interactive lessons, flashcards, and quizzes.`,
    };
  } catch {
    return {
      title: 'Month Not Found - Accountrix',
    };
  }
}

export default async function MonthPage({ params }: MonthPageProps) {
  const { monthId } = await params;
  const dataExists = await hasData();
  
  if (!dataExists) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Content Available</h1>
          <p className="text-gray-600 mb-6">Please import curriculum data first.</p>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  try {
    const month = await loadMonth(monthId);
    
    // Calculate progress statistics
    const totalWeeks = month.weeks.length;
    const totalFlashcards = month.weeks.reduce((sum, week) => sum + week.flashcards.length, 0);
    const totalQuizQuestions = month.weeks.reduce((sum, week) => sum + week.quiz.questions.length, 0);
    
    // Estimate study time (rough calculation)
    const estimatedMinutes = totalFlashcards * 0.5 + totalQuizQuestions * 1.5;
    const estimatedHours = Math.ceil(estimatedMinutes / 60);

    return (
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/months"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Months
          </Link>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{month.title}</h1>
              {month.description && (
                <p className="text-lg text-gray-600 max-w-2xl">{month.description}</p>
              )}
            </div>
            
            <div className="text-right">
              <Badge variant="secondary" className="mb-2">
                {totalWeeks} Weeks
              </Badge>
              <p className="text-sm text-gray-500">~{estimatedHours} hours</p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Weeks</p>
                  <p className="text-2xl font-bold text-gray-900">{totalWeeks}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Brain className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Flashcards</p>
                  <p className="text-2xl font-bold text-gray-900">{totalFlashcards}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Trophy className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Quiz Questions</p>
                  <p className="text-2xl font-bold text-gray-900">{totalQuizQuestions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Study Time</p>
                  <p className="text-2xl font-bold text-gray-900">{estimatedHours}h</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Your Progress
            </CardTitle>
            <CardDescription>
              Track your completion across all weeks in this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Overall Progress</span>
                <span className="font-medium">0% Complete</span>
              </div>
              <Progress value={0} className="w-full" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-600">0</p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">0</p>
                  <p className="text-sm text-gray-600">In Progress</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-600">0</p>
                  <p className="text-sm text-gray-600">XP Earned</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">5</p>
                  <p className="text-sm text-gray-600">Hearts</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Week Cards */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Weeks</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {month.weeks.map((week, index) => {
              const isFirst = index === 0;
              const isLocked = !isFirst; // For now, only first week is unlocked
              
              return (
                <Card 
                  key={week.id} 
                  className={`transition-all duration-200 ${
                    isLocked 
                      ? 'opacity-60 bg-gray-50' 
                      : 'hover:shadow-md cursor-pointer'
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                          isLocked ? 'bg-gray-400' : 'bg-blue-600'
                        }`}>
                          {week.order}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{week.title}</CardTitle>
                          <CardDescription>
                            {week.flashcards.length} flashcards, {week.quiz.questions.length} quiz questions
                          </CardDescription>
                        </div>
                      </div>
                      
                      {isLocked && (
                        <Badge variant="outline" className="text-gray-500">
                          Locked
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      {/* Week progress */}
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium">0%</span>
                        </div>
                        <Progress value={0} className="w-full" />
                      </div>
                      
                      {/* Action buttons */}
                      <div className="flex gap-2">
                        <Button 
                          asChild
                          disabled={isLocked}
                          className="flex-1"
                          variant={isLocked ? "outline" : "default"}
                        >
                          <Link href={`/months/${monthId}/weeks/${week.id}`}>
                            <Play className="w-4 h-4 mr-2" />
                            Start Week
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error(`Failed to load month ${monthId}:`, error);
    notFound();
  }
}