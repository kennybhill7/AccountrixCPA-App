"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Command } from "lucide-react";
import { SearchDialog } from "./SearchDialog";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

export function SearchBar({ placeholder = "Search curriculum...", className = "" }: SearchBarProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleInputClick = () => {
    setIsDialogOpen(true);
  };

  const handleKeyboardShortcut = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      setIsDialogOpen(true);
    }
  };

  // Add keyboard shortcut listener
  useState(() => {
    const handleKeyDown = (e: KeyboardEvent) => handleKeyboardShortcut(e);
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <>
      {/* Search Input - Opens Dialog */}
      <div className={`relative ${className}`}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder={placeholder}
            onClick={handleInputClick}
            readOnly
            className="pl-10 pr-16 cursor-pointer bg-white hover:bg-slate-50 transition-colors"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs font-mono text-slate-500 bg-slate-100 rounded border">
              <Command className="h-3 w-3 mr-1" />
              K
            </kbd>
          </div>
        </div>
      </div>

      {/* Search Dialog */}
      <SearchDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
}

// Compact search button for mobile/small spaces
export function SearchButton({ onClick }: { onClick?: () => void }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      setIsDialogOpen(true);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClick}
        className="text-slate-600 hover:text-blue-900"
      >
        <Search className="h-4 w-4" />
        <span className="sr-only">Search</span>
      </Button>

      <SearchDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
}