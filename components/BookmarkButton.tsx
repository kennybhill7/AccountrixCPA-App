"use client";

import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useHydratedStore } from "@/lib/hooks";

interface BookmarkButtonProps {
  monthId: string;
  weekId: string;
  anchor: string;
  title: string;
}

export function BookmarkButton({ monthId, weekId, anchor, title }: BookmarkButtonProps) {
  const hydrated = useHydratedStore();
  const bookmarks = useAppStore((state) => state.bookmarks);
  const addBookmark = useAppStore((state) => state.addBookmark);
  const removeBookmark = useAppStore((state) => state.removeBookmark);

  const isBookmarked = hydrated ? bookmarks?.some(
    b => b.monthId === monthId && b.weekId === weekId && b.anchor === anchor
  ) : false;

  const handleToggleBookmark = () => {
    if (!hydrated) return;

    if (isBookmarked) {
      removeBookmark(monthId, weekId, anchor);
    } else {
      addBookmark(monthId, weekId, title, anchor);
    }
  };

  if (!hydrated) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 opacity-60"
        disabled
      >
        <Bookmark className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggleBookmark}
      className="h-8 w-8 opacity-60 hover:opacity-100 transition-opacity"
      title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
    >
      {isBookmarked ? (
        <BookmarkCheck className="h-4 w-4 text-blue-600 fill-current" />
      ) : (
        <Bookmark className="h-4 w-4" />
      )}
    </Button>
  );
}
