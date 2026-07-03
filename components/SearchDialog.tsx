"use client";

import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, BookOpen, FileText, Brain, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSearch } from "@/lib/store";

interface SearchResult {
  type: "month" | "week";
  monthId: string;
  monthTitle: string;
  weekId?: string;
  weekTitle?: string;
  relevance: number;
  content: string;
}

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const router = useRouter();
  const { setQuery: setStoreQuery, setResults: setStoreResults, setSearching } = useSearch();

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("recent-searches");
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    }
  }, []);

  const saveRecentSearch = useCallback((searchQuery: string) => {
    if (searchQuery.length < 3) return;

    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s !== searchQuery);
      const updated = [searchQuery, ...filtered].slice(0, 5); // Keep only 5 recent searches

      if (typeof window !== "undefined") {
        localStorage.setItem("recent-searches", JSON.stringify(updated));
      }

      return updated;
    });
  }, []);

  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (searchQuery.length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      setSearching(true);
      setStoreQuery(searchQuery);

      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        const searchResults: {
          months: {
            monthId: string;
            month: { title: string; description?: string };
            relevance: number;
          }[];
          weeks: {
            monthId: string;
            weekId: string;
            week: { title: string; lessonHtml: string };
            relevance: number;
          }[];
        } = res.ok ? await res.json() : { months: [], weeks: [] };

        // Transform results for display
        const transformedResults: SearchResult[] = [
          ...searchResults.months.map((m) => ({
            type: "month" as const,
            monthId: m.monthId,
            monthTitle: m.month.title,
            relevance: m.relevance,
            content: m.month.description || "Month overview and lessons",
          })),
          ...searchResults.weeks.map((w) => ({
            type: "week" as const,
            monthId: w.monthId,
            monthTitle: "Week Content", // We'd need to fetch month title separately
            weekId: w.weekId,
            weekTitle: w.week.title,
            relevance: w.relevance,
            content: w.week.lessonHtml.replace(/<[^>]*>/g, "").substring(0, 150) + "...",
          })),
        ];

        // Sort by relevance
        transformedResults.sort((a, b) => b.relevance - a.relevance);

        setResults(transformedResults);
        setStoreResults({
          months: searchResults.months.map((m) => ({
            monthId: m.monthId,
            title: m.month.title,
            relevance: m.relevance,
          })),
          weeks: searchResults.weeks.map((w) => ({
            monthId: w.monthId,
            weekId: w.weekId,
            title: w.week.title,
            relevance: w.relevance,
          })),
        });
      } catch (error) {
        console.error("Search failed:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
        setSearching(false);
      }
    },
    [setSearching, setStoreQuery, setStoreResults]
  );

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, performSearch]);

  const handleResultClick = (result: SearchResult) => {
    saveRecentSearch(query);
    onOpenChange(false);

    if (result.type === "month") {
      router.push(`/learn/${result.monthId}`);
    } else if (result.type === "week" && result.weekId) {
      router.push(`/learn/${result.monthId}/${result.weekId}`);
    }
  };

  const handleRecentSearchClick = (recentQuery: string) => {
    setQuery(recentQuery);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("recent-searches");
    }
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case "month":
        return <BookOpen className="h-4 w-4 text-blue-600" />;
      case "week":
        return <FileText className="h-4 w-4 text-green-600" />;
      default:
        return <Brain className="h-4 w-4 text-purple-600" />;
    }
  };

  const getResultTypeLabel = (type: string) => {
    switch (type) {
      case "month":
        return "Month";
      case "week":
        return "Week";
      default:
        return "Content";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading font-bold text-blue-900">
            Search Curriculum
          </DialogTitle>
        </DialogHeader>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search lessons, concepts, or topics..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-4 py-3 text-base"
            autoFocus
          />
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setQuery("")}
              className="absolute right-1 top-1 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {query.length === 0 && recentSearches.length > 0 && (
            <div className="py-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-slate-700">Recent Searches</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearRecentSearches}
                  className="text-xs text-slate-500 hover:text-slate-700"
                >
                  Clear
                </Button>
              </div>
              <div className="space-y-2">
                {recentSearches.map((recentQuery, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentSearchClick(recentQuery)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 text-sm text-slate-600 hover:text-blue-900 transition-colors"
                  >
                    <Search className="inline h-3 w-3 mr-2 opacity-50" />
                    {recentQuery}
                  </button>
                ))}
              </div>
            </div>
          )}

          {query.length > 0 && (
            <div className="py-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-sm text-slate-600">Searching...</p>
                </div>
              ) : results.length === 0 && query.length > 1 ? (
                <div className="text-center py-8">
                  <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-lg font-medium text-slate-700 mb-2">No results found</p>
                  <p className="text-sm text-slate-500">
                    Try different keywords or check your spelling
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[50vh] overflow-y-auto">
                  {results.map((result, index) => (
                    <Card
                      key={`${result.type}-${result.monthId}-${result.weekId || ""}-${index}`}
                      className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-blue-200"
                      onClick={() => handleResultClick(result)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">{getResultIcon(result.type)}</div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                                {getResultTypeLabel(result.type)}
                              </span>
                              {result.relevance > 5 && (
                                <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                                  High match
                                </span>
                              )}
                            </div>

                            <h4 className="font-medium text-blue-900 mb-1">
                              {result.weekTitle || result.monthTitle}
                            </h4>

                            <p className="text-sm text-slate-600 line-clamp-2">{result.content}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {query.length === 0 && recentSearches.length === 0 && (
            <div className="text-center py-8">
              <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-lg font-medium text-slate-700 mb-2">Search the curriculum</p>
              <p className="text-sm text-slate-500">
                Find lessons, concepts, and topics across all months and weeks
              </p>
            </div>
          )}
        </div>

        {/* Search Tips */}
        {query.length === 0 && (
          <div className="border-t pt-4">
            <p className="text-xs text-slate-500 text-center">
              💡 Tip: Try searching for specific topics like "cash flow", "budgeting", or "financial
              analysis"
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
