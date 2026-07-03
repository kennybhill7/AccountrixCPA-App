"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { StreakHeartsXp } from "@/components/StreakHeartsXp";
import { LearningModeToggle } from "@/components/LearningModeToggle";
import { BookOpen, Search, User, Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (path: string) => pathname === path || pathname.startsWith(path);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Accountrix
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <Button
              asChild
              variant={isActive("/tracks") ? "secondary" : "ghost"}
              size="sm"
            >
              <Link href="/tracks">Tracks</Link>
            </Button>
            <Button
              asChild
              variant={isActive("/learn") ? "secondary" : "ghost"}
              size="sm"
            >
              <Link href="/learn">Learn</Link>
            </Button>
            <Button
              asChild
              variant={isActive("/flashcards") ? "secondary" : "ghost"}
              size="sm"
            >
              <Link href="/flashcards">Flashcards</Link>
            </Button>
            <Button
              asChild
              variant={isActive("/cpa") ? "secondary" : "ghost"}
              size="sm"
            >
              <Link href="/cpa">CPA Lessons</Link>
            </Button>
            <Button
              asChild
              variant={isActive("/apply") ? "secondary" : "ghost"}
              size="sm"
            >
              <Link href="/apply">Apply Lab</Link>
            </Button>
            <Button
              asChild
              variant={isActive("/crossover") ? "secondary" : "ghost"}
              size="sm"
            >
              <Link href="/crossover">CPA Practice</Link>
            </Button>
            <Button
              asChild
              variant={isActive("/search") ? "secondary" : "ghost"}
              size="sm"
            >
              <Link href="/search">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Link>
            </Button>
            <Button 
              asChild 
              variant={isActive("/profile") ? "secondary" : "ghost"}
              size="sm"
            >
              <Link href="/profile">
                <User className="h-4 w-4 mr-2" />
                Profile
              </Link>
            </Button>
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            <StreakHeartsXp />

            {/* Learning Mode Toggle (Compact) */}
            <div className="hidden md:block">
              <LearningModeToggle compact />
            </div>

            {/* Theme Toggle */}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="h-9 w-9"
              >
                {theme === "light" ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
