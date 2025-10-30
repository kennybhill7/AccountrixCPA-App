"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { contentLoader } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, Brain, FileText } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import Fuse from "fuse.js";

interface SearchResult {
  id: string;
  title: string;
  content: string;
  type: 'month' | 'week' | 'flashcard';
  monthId: string;
  weekId?: string;
  matches?: readonly any[];
}

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [fuse, setFuse] = useState<Fuse<SearchResult> | null>(null);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    async function initializeSearch() {
      try {
        setLoading(true);
        await contentLoader.loadContent();
        const searchableContent = contentLoader.getSearchableContent();
        
        if (searchableContent.length > 0) {
          const fuseInstance = new Fuse(searchableContent, {
            keys: [
              { name: 'title', weight: 0.4 },
              { name: 'content', weight: 0.6 }
            ],
            threshold: 0.3,
            includeMatches: true,
            minMatchCharLength: 2,
          });
          
          setFuse(fuseInstance);
          setHasData(true);
        }
      } catch (error) {
        console.error("Failed to initialize search:", error);
      } finally {
        setLoading(false);
      }
    }

    initializeSearch();
  }, []);

  useEffect(() => {
    if (!fuse || !searchTerm.trim()) {
      setResults([]);
      return;
    }

    const searchResults = fuse.search(searchTerm).map(result => ({
      ...result.item,
      matches: result.matches,
    }));

    setResults(searchResults.slice(0, 20)); // Limit to 20 results
  }, [searchTerm, fuse]);

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
      case 'month': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'week': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'flashcard': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
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

  const highlightMatch = (text: string, matches?: readonly any[]) => {
    if (!matches || matches.length === 0) {
      return text.substring(0, 200) + (text.length > 200 ? '...' : '');
    }

    // Simple highlighting - this could be enhanced
    let highlightedText = text.substring(0, 200);
    if (text.length > 200) {
      highlightedText += '...';
    }
    
    return highlightedText;
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Initializing search...</p>
        </div>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="container mx-auto py-8 px-4">
        <EmptyState 
          icon={Search}
          title="Search Not Available"
          description="No content is available to search. Please ensure the curriculum is loaded."
        />
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
                                  Month {result.monthId}
                                  {result.weekId && ` • ${result.weekId.toUpperCase()}`}
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
                          {highlightMatch(result.content, result.matches)}
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