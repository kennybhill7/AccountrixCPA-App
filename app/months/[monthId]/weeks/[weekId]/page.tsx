import { loadWeek, loadMonth, hasData } from '@/lib/content-loader';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Brain, Trophy, Play, Clock, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface WeekPageProps {
  params: Promise<{
    monthId: string;
    weekId: string;
  }>;
}

export async function generateMetadata({ params }: WeekPageProps): Promise<Metadata> {
  try {
    const { monthId, weekId } = await params;
    const week = await loadWeek(monthId, weekId);
    const month = await loadMonth(monthId);
    return {
      title: `${week.title} - ${month.title} - Accountrix`,
      description: `Study ${week.title} with interactive lessons, flashcards, and quizzes.`,
    };
  } catch {
    return {
      title: 'Week Not Found - Accountrix',
    };
  }
}

export default async function WeekPage({ params }: WeekPageProps) {
  const { monthId, weekId } = await params;
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
    const week = await loadWeek(monthId, weekId);
    const month = await loadMonth(monthId);
    
    // Calculate study time estimates
    const flashcardMinutes = week.flashcards.length * 0.5;
    const quizMinutes = week.quiz.questions.length * 1.5;
    const lessonMinutes = Math.max(10, Math.ceil(week.lessonHtml.length / 1000 * 2)); // Rough reading time
    const totalMinutes = flashcardMinutes + quizMinutes + lessonMinutes;

    return (
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href={`/months/${monthId}`}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {month.title}
          </Link>
          
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="outline">Week {week.order}</Badge>
                <Badge variant="secondary">{month.title}</Badge>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{week.title}</h1>
              <p className="text-lg text-gray-600">
                Complete the lesson, practice with flashcards, and test your knowledge
              </p>
            </div>
            
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600 mb-1">0%</p>
              <p className="text-sm text-gray-500">Complete</p>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Week Progress
            </CardTitle>
            <CardDescription>
              Track your progress through lesson, flashcards, and quiz
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={0} className="w-full" />
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-2 mx-auto">
                    <BookOpen className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium">Lesson</p>
                  <p className="text-xs text-gray-500">Not Started</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-2 mx-auto">
                    <Brain className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium">Flashcards</p>
                  <p className="text-xs text-gray-500">Locked</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-2 mx-auto">
                    <Trophy className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium">Quiz</p>
                  <p className="text-xs text-gray-500">Locked</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Study Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Lesson Card */}
          <Card className="hover:shadow-md transition-all duration-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Lesson
              </CardTitle>
              <CardDescription>
                Read and understand the core concepts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  ~{Math.ceil(lessonMinutes)} min
                </span>
                <Badge variant="outline">Start Here</Badge>
              </div>
              
              <Button asChild className="w-full">
                <Link href={`/months/${monthId}/weeks/${weekId}/lesson`}>
                  <Play className="w-4 h-4 mr-2" />
                  Start Lesson
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Flashcards Card */}
          <Card className="opacity-60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-green-600" />
                Flashcards
              </CardTitle>
              <CardDescription>
                Practice key concepts with spaced repetition
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  ~{Math.ceil(flashcardMinutes)} min
                </span>
                <Badge variant="outline">{week.flashcards.length} cards</Badge>
              </div>
              
              <Button disabled className="w-full" variant="outline">
                <Brain className="w-4 h-4 mr-2" />
                Complete Lesson First
              </Button>
            </CardContent>
          </Card>

          {/* Quiz Card */}
          <Card className="opacity-60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-600" />
                Quiz
              </CardTitle>
              <CardDescription>
                Test your knowledge and earn XP
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  ~{Math.ceil(quizMinutes)} min
                </span>
                <Badge variant="outline">{week.quiz.questions.length} questions</Badge>
              </div>
              
              <Button disabled className="w-full" variant="outline">
                <Trophy className="w-4 h-4 mr-2" />
                Complete Flashcards First
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Study Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Week Overview</CardTitle>
            <CardDescription>
              Detailed breakdown of this week's content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="stats" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="stats">Statistics</TabsTrigger>
                <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
                <TabsTrigger value="quiz">Quiz Preview</TabsTrigger>
              </TabsList>
              
              <TabsContent value="stats" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{Math.ceil(totalMinutes)}</p>
                    <p className="text-sm text-gray-600">Total Minutes</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{week.flashcards.length}</p>
                    <p className="text-sm text-gray-600">Flashcards</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">{week.quiz.questions.length}</p>
                    <p className="text-sm text-gray-600">Quiz Questions</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">100</p>
                    <p className="text-sm text-gray-600">Max XP</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="flashcards" className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Flashcard Topics</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {week.flashcards.slice(0, 6).map((card, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <p className="text-sm font-medium text-gray-900">{card.front}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {card.back.length > 50 ? `${card.back.substring(0, 50)}...` : card.back}
                        </p>
                      </div>
                    ))}
                    {week.flashcards.length > 6 && (
                      <div className="p-3 border rounded-lg bg-gray-50 flex items-center justify-center">
                        <p className="text-sm text-gray-600">+{week.flashcards.length - 6} more cards</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="quiz" className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Sample Questions</h4>
                  {week.quiz.questions.slice(0, 3).map((question, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <p className="font-medium text-gray-900 mb-2">{question.q}</p>
                      <div className="space-y-1">
                        {question.choices.map((choice, choiceIndex) => (
                          <div key={choiceIndex} className="text-sm text-gray-600 flex items-center gap-2">
                            <div className="w-4 h-4 border rounded-full"></div>
                            {choice}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {week.quiz.questions.length > 3 && (
                    <p className="text-sm text-gray-600 text-center">
                      +{week.quiz.questions.length - 3} more questions in the quiz
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    console.error(`Failed to load week ${weekId} from month ${monthId}:`, error);
    notFound();
  }
}