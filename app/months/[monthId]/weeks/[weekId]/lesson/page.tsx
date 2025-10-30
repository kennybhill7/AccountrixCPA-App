import { loadWeek, loadMonth, hasData } from '@/lib/content-loader';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, ArrowRight, Clock, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import DOMPurify from 'isomorphic-dompurify';

interface LessonPageProps {
  params: {
    monthId: string;
    weekId: string;
  };
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  try {
    const week = await loadWeek(params.monthId, params.weekId);
    const month = await loadMonth(params.monthId);
    return {
      title: `${week.title} Lesson - ${month.title} - Accountrix`,
      description: `Learn ${week.title} with interactive content and examples.`,
    };
  } catch {
    return {
      title: 'Lesson Not Found - Accountrix',
    };
  }
}

export default async function LessonPage({ params }: LessonPageProps) {
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
    
    // Sanitize HTML content
    const sanitizedHtml = DOMPurify.sanitize(week.lessonHtml, {
      ALLOWED_TAGS: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em', 'u', 'ul', 'ol', 'li', 'br', 'div', 'span', 'blockquote', 'code', 'pre'],
      ALLOWED_ATTR: ['class', 'style'],
    });

    // Estimate reading time
    const wordCount = sanitizedHtml.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(word => word.length > 0).length;
    const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200)); // Average reading speed

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
                <Badge variant="default" className="bg-blue-600">
                  <BookOpen className="w-3 h-3 mr-1" />
                  Lesson
                </Badge>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{week.title}</h1>
              <div className="flex items-center gap-4 text-gray-600">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  ~{readingTimeMinutes} min read
                </span>
                <span>{wordCount} words</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Lesson Progress
            </CardTitle>
            <CardDescription>
              Read through the lesson content to unlock flashcards and quiz
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={0} className="w-full" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Reading Progress</span>
                <span className="font-medium">0% Complete</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Lesson Content</CardTitle>
                <CardDescription>
                  Study the material carefully - understanding these concepts is key to success
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div 
                  className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700"
                  dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Lesson Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Lesson Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Reading Time</span>
                    <span className="text-sm font-medium">{readingTimeMinutes} min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Word Count</span>
                    <span className="text-sm font-medium">{wordCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Flashcards</span>
                    <span className="text-sm font-medium">{week.flashcards.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Quiz Questions</span>
                    <span className="text-sm font-medium">{week.quiz.questions.length}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Next Steps */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Next Steps</CardTitle>
                  <CardDescription className="text-xs">
                    Continue your learning journey
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button disabled className="w-full justify-start" variant="outline" size="sm">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                    Mark as Complete
                  </Button>
                  <Button disabled className="w-full justify-start" variant="outline" size="sm">
                    Practice Flashcards
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button disabled className="w-full justify-start" variant="outline" size="sm">
                    Take Quiz
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              {/* Study Tips */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Study Tips</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-gray-600 space-y-2">
                  <p>• Take notes on key concepts</p>
                  <p>• Review examples carefully</p>
                  <p>• Practice with flashcards after reading</p>
                  <p>• Test understanding with the quiz</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <Link 
            href={`/months/${params.monthId}/weeks/${params.weekId}`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Week Overview
          </Link>
          
          <div className="flex gap-3">
            <Button variant="outline" disabled>
              Mark Complete & Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error(`Failed to load lesson for week ${params.weekId} from month ${params.monthId}:`, error);
    notFound();
  }
}