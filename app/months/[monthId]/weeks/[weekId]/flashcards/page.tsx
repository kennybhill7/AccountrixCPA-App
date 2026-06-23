import { loadWeek, loadMonth, hasData } from '@/lib/content-loader';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Brain, Clock, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FlashcardDeck from '@/components/FlashcardDeck';

interface FlashcardsPageProps {
  params: Promise<{
    monthId: string;
    weekId: string;
  }>;
}

export async function generateMetadata({ params }: FlashcardsPageProps): Promise<Metadata> {
  try {
    const { monthId, weekId } = await params;
    const week = await loadWeek(monthId, weekId);
    const month = await loadMonth(monthId);
    return {
      title: `${week.title} Flashcards - ${month.title} - Accountrix`,
      description: `Practice ${week.title} concepts with interactive flashcards and spaced repetition.`,
    };
  } catch {
    return {
      title: 'Flashcards Not Found - Accountrix',
    };
  }
}

export default async function FlashcardsPage({ params }: FlashcardsPageProps) {
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
    
    // Convert to ConsolidatedFlashcard format expected by FlashcardDeck
    const flashcardData = {
      deck: `${month.title} - ${week.title}`,
      cards: week.flashcards
    };

    // Estimate study time
    const estimatedMinutes = Math.ceil(week.flashcards.length * 0.5);

    return (
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href={`/months/${monthId}/weeks/${weekId}`}
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
                <Badge variant="default" className="bg-green-600">
                  <Brain className="w-3 h-3 mr-1" />
                  Flashcards
                </Badge>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Flashcard Practice</h1>
              <p className="text-lg text-gray-600">{week.title}</p>
              <div className="flex items-center gap-4 text-gray-600 mt-2">
                <span className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  {week.flashcards.length} cards
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  ~{estimatedMinutes} min
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-green-600" />
              How Flashcards Work
            </CardTitle>
            <CardDescription>
              Use spaced repetition to master key concepts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex flex-col items-center text-center p-4 border rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h3 className="font-medium mb-2">Study the Question</h3>
                <p className="text-gray-600">Read the front of each card and think about the answer</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 border rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <span className="text-green-600 font-bold">2</span>
                </div>
                <h3 className="font-medium mb-2">Check Your Answer</h3>
                <p className="text-gray-600">Flip the card to see the correct answer</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 border rounded-lg">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <h3 className="font-medium mb-2">Rate Your Knowledge</h3>
                <p className="text-gray-600">Mark how well you knew the answer for better learning</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Flashcard Component */}
        <FlashcardDeck 
          flashcardData={flashcardData}
          weekId={weekId}
          monthId={monthId}
        />
      </div>
    );
  } catch (error) {
    console.error(`Failed to load flashcards for week ${weekId} from month ${monthId}:`, error);
    notFound();
  }
}