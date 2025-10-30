import { loadWeek, loadMonth, hasData } from '@/lib/content-loader';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Trophy, Clock, Target, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import QuizComponent from '@/components/QuizComponent';

interface QuizPageProps {
  params: {
    monthId: string;
    weekId: string;
  };
}

export async function generateMetadata({ params }: QuizPageProps): Promise<Metadata> {
  try {
    const week = await loadWeek(params.monthId, params.weekId);
    const month = await loadMonth(params.monthId);
    return {
      title: `${week.title} Quiz - ${month.title} - Accountrix`,
      description: `Test your knowledge of ${week.title} with this interactive quiz.`,
    };
  } catch {
    return {
      title: 'Quiz Not Found - Accountrix',
    };
  }
}

export default async function QuizPage({ params }: QuizPageProps) {
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
    const week = await loadWeek(params.monthId, params.weekId);
    const month = await loadMonth(params.monthId);
    
    // Estimate quiz time
    const estimatedMinutes = Math.ceil(week.quiz.questions.length * 1.5);
    const maxXP = week.quiz.questions.length * 10; // 10 XP per question

    return (
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href={`/months/${params.monthId}/weeks/${params.weekId}`}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Week Overview
          </Link>
          
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="outline">Week {week.order}</Badge>
                <Badge variant="secondary">{month.title}</Badge>
                <Badge variant="default" className="bg-yellow-600">
                  <Trophy className="w-3 h-3 mr-1" />
                  Quiz
                </Badge>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Knowledge Quiz</h1>
              <p className="text-lg text-gray-600">{week.title}</p>
              <div className="flex items-center gap-4 text-gray-600 mt-2">
                <span className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  {week.quiz.questions.length} questions
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  ~{estimatedMinutes} min
                </span>
                <span className="flex items-center gap-1">
                  <Trophy className="w-4 h-4" />
                  {maxXP} max XP
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              Quiz Instructions
            </CardTitle>
            <CardDescription>
              Test your understanding and earn XP
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex flex-col items-center text-center p-4 border rounded-lg">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mb-3">
                  <Heart className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="font-medium mb-2">Hearts System</h3>
                <p className="text-gray-600">You start with 5 hearts. Wrong answers cost 1 heart each.</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 border rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <Trophy className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-medium mb-2">Earn XP</h3>
                <p className="text-gray-600">Get 10 XP for each correct answer. Bonus for perfect scores!</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 border rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <Target className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-medium mb-2">Detailed Feedback</h3>
                <p className="text-gray-600">Get explanations for each question to reinforce learning.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quiz Component */}
        <QuizComponent
          quiz={week.quiz}
          weekId={params.weekId}
          monthId={params.monthId}
          onComplete={() => {}}
          onExit={() => {}}
        />
      </div>
    );
  } catch (error) {
    console.error(`Failed to load quiz for week ${params.weekId} from month ${params.monthId}:`, error);
    notFound();
  }
}