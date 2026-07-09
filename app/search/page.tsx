"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, Brain, FileText } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";

interface SearchResult {
  id: string;
  title: string;
  content: string;
  type: 'month' | 'week' | 'flashcard';
  monthId: string;
  weekId?: string;
  relevance?: number;
}

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = searchTerm.trim();
    if (!q) {
      setResults([]);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Search failed: ${response.status}`);
        const data = await response.json();

        const monthResults: SearchResult[] = (data.months || []).map((r: any) => ({
          id: r.monthId,
          title: r.month?.title || r.monthId,
          content: r.month?.description || "",
          type: "month",
          monthId: r.monthId,
          relevance: r.relevance,
        }));

        const weekResults: SearchResult[] = (data.weeks || []).map((r: any) => ({
          id: `${r.monthId}-${r.weekId}`,
          title: r.week?.title || r.weekId,
          content: (r.week?.lessonHtml || "").replace(/<[^>]*>/g, " "),
          type: "week",
          monthId: r.monthId,
          weekId: r.weekId,
          relevance: r.relevance,
        }));

        setResults([...monthResults, ...weekResults].slice(0, 20));
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Search failed:", error);
          setResults([]);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 250);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [searchTerm]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'month': return BookOpen;
      case 'week': return FileText;
      case 'flashcard': return Brain;
      default: return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'month': return 'bg-accent text-primary-dark dark:bg-accent dark:text-primary';
      case 'week': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'flashcard': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-muted text-foreground dark:bg-card dark:text-foreground';
    }
  };

  const getResultLink = (result: SearchResult) => {
    switch (result.type) {
      case 'month':
        return `/learn/${result.monthId}`;
      case 'week':
        return `/learn/${result.monthId}/${result.weekId}`;
      case 'flashcard':
        return `/flashcards`;
      default:
        return '/learn';
    }
  };

  const highlightMatch = (text: string) =>
    text.substring(0, 200) + (text.length > 200 ? "..." : "");

  if (loading && results.length === 0 && searchTerm.trim() !== "") {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Initializing search...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <Search className="h-12 w-12 text-green-500 mr-3" />
              <h1 className="text-4xl font-bold">Search</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Search across all lessons, concepts, and flashcards to quickly find the information you need.
            </p>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="container mx-auto px-4 -mt-6 relative z-10">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for lessons, concepts, or topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-base"
                  autoFocus
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {searchTerm.trim() === '' ? (
            <div className="text-center text-muted-foreground">
              <p>Start typing to search across all content...</p>
            </div>
          ) : results.length === 0 ? (
            <EmptyState 
              icon={Search}
              title="No Results Found"
              description={`No content matches "${searchTerm}". Try different keywords or check your spelling.`}
            />
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {results.length} results for "{searchTerm}"
                </p>
              </div>

              <div className="space-y-4">
                {results.map((result, index) => {
                  const Icon = getTypeIcon(result.type);
                  return (
                    <Card key={`${result.type}-${result.id}-${index}`} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <Icon className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className={getTypeColor(result.type)}>
                                  {result.type}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {result.monthId.toUpperCase()}
                                  {result.weekId && ` â€¢ ${result.weekId.toUpperCase()}`}
                                </span>
                              </div>
                              <CardTitle className="text-lg">
                                {result.title}
                              </CardTitle>
                            </div>
                          </div>
                          <Button asChild size="sm">
                            <Link href={getResultLink(result)}>
                              View
                            </Link>
                          </Button>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <CardDescription className="text-sm">
                          {highlightMatch(result.content)}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
