"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/glass/GlassCard";
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

  const getTypeStyle = (type: string): React.CSSProperties => {
    switch (type) {
      case 'month':
        return { background: 'hsl(var(--primary) / 0.14)', color: 'hsl(var(--primary))' };
      case 'week':
        return { background: 'hsl(var(--status-done) / 0.14)', color: 'hsl(var(--status-done))' };
      case 'flashcard':
        return { background: 'hsl(var(--status-current) / 0.14)', color: 'hsl(var(--status-current))' };
      default:
        return { background: 'hsl(var(--foreground) / 0.06)', color: 'hsl(var(--text-light))' };
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
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Initializing search...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-3">
          <Search className="h-9 w-9 text-primary mr-3" />
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground font-display tracking-tight">
            Search
          </h1>
        </div>
        <p className="text-muted-foreground">
          Search across all lessons, concepts, and flashcards to quickly find the information you need.
        </p>
      </div>

      {/* Search Input */}
      <GlassCard strong className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for lessons, concepts, or topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="glass border-0 pl-10 h-12 text-base"
            autoFocus
          />
        </div>
      </GlassCard>

      {/* Results */}
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
          <p className="text-sm text-muted-foreground">
            {results.length} results for "{searchTerm}"
          </p>

          <div className="space-y-4">
            {results.map((result, index) => {
              const Icon = getTypeIcon(result.type);
              return (
                <GlassCard
                  key={`${result.type}-${result.id}-${index}`}
                  hover
                  className="p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start space-x-3 flex-1">
                      <Icon className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            className="border-0"
                            style={getTypeStyle(result.type)}
                          >
                            {result.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {result.monthId.toUpperCase()}
                            {result.weekId && ` • ${result.weekId.toUpperCase()}`}
                          </span>
                        </div>
                        <div className="text-lg font-semibold text-foreground font-display tracking-tight">
                          {result.title}
                        </div>
                      </div>
                    </div>
                    <Button asChild size="sm">
                      <Link href={getResultLink(result)}>View</Link>
                    </Button>
                  </div>

                  <p className="mt-3 text-sm text-muted-foreground">
                    {highlightMatch(result.content)}
                  </p>
                </GlassCard>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
