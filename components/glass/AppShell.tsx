"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  BookOpen,
  Home,
  Layers,
  LineChart,
  Copy,
  FlaskConical,
  Compass,
  StickyNote,
  GraduationCap,
  Target,
  BookMarked,
  Search,
  Settings,
  Menu,
  X,
  Moon,
  Sun,
  Flame,
  Star,
  User,
  Dumbbell,
  Calculator,
  NotebookPen,
  Gauge,
  Lightbulb,
  Maximize2,
  Minimize2,
  Map,
  type LucideIcon,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useHydratedStore } from "@/lib/hooks";
import { AuroraOrbs } from "./AuroraOrbs";
import { CommandPalette, CMDK_OPEN_EVENT } from "./CommandPalette";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

// The daily loop — the few things you reach for every session.
const PRIMARY: NavItem[] = [
  { label: "Today", href: "/", icon: Home },
  { label: "Practice", href: "/practice", icon: Dumbbell },
  { label: "Method Cards", href: "/methods", icon: Lightbulb },
  { label: "Calculator Lab", href: "/calculator", icon: Calculator },
  { label: "Apply Lab", href: "/apply", icon: FlaskConical },
  { label: "Mastery", href: "/mastery", icon: Gauge },
  { label: "Notebook", href: "/scratchpad", icon: NotebookPen },
];

// The library — lessons, tracks, and tools behind a "More" divider.
const SECONDARY: NavItem[] = [
  { label: "Learn (CMA)", href: "/learn", icon: BookOpen },
  { label: "Finance", href: "/finance", icon: LineChart },
  { label: "CPA Lessons", href: "/cpa", icon: GraduationCap },
  { label: "CPA Practice", href: "/crossover", icon: Target },
  { label: "Flashcards", href: "/flashcards", icon: Copy },
  { label: "Diagnostic", href: "/diagnostic", icon: Compass },
  { label: "Tracks", href: "/tracks", icon: Layers },
  { label: "Mission", href: "/mission", icon: Compass },
  { label: "Reference", href: "/reference", icon: BookMarked },
  { label: "Notes", href: "/notes", icon: StickyNote },
  { label: "Search", href: "/search", icon: Search },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "All Pages", href: "/map", icon: Map },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

function NavList({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  const item = (n: NavItem) => {
    const active = isActive(pathname, n.href);
    const Icon = n.icon;
    return (
      <Link
        key={n.href}
        href={n.href}
        onClick={onNavigate}
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition hover:bg-white/50 dark:hover:bg-white/10"
        style={
          active
            ? {
                background: "hsl(var(--primary) / 0.13)",
                color: "hsl(var(--primary))",
                fontWeight: 600,
                boxShadow: "inset 0 0 0 1px hsl(var(--primary) / 0.12)",
              }
            : { color: "hsl(var(--muted-foreground))" }
        }
      >
        <Icon className="h-[17px] w-[17px] shrink-0" />
        {n.label}
      </Link>
    );
  };
  return (
    <nav className="flex flex-col gap-1">
      {PRIMARY.map(item)}
      <div className="my-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-text-light">
        More
      </div>
      {SECONDARY.map(item)}
    </nav>
  );
}

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 px-1">
      <span
        className="flex h-8 w-8 items-center justify-center rounded-xl text-white"
        style={{ background: "linear-gradient(135deg, #3b82f6, #7c3aed)" }}
      >
        <BookOpen style={{ height: 18, width: 18 }} />
      </span>
      <span className="font-display text-lg font-bold tracking-tight text-foreground">
        Accountrix
      </span>
    </Link>
  );
}

function ProfileLockup() {
  return (
    <Link
      href="/profile"
      className="mt-auto flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-white/50 dark:hover:bg-white/10"
    >
      <span
        className="flex h-8 w-8 items-center justify-center rounded-full text-white"
        style={{ background: "linear-gradient(135deg, #60a5fa, #c084fc)" }}
      >
        <User className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <div className="truncate text-[13px] font-semibold text-foreground">Your profile</div>
        <div className="truncate text-[11px] text-text-light">Progress & settings</div>
      </div>
    </Link>
  );
}

function StreakXpPills() {
  const hydrated = useHydratedStore();
  const xp = useAppStore((s) => s.xp);
  const streak = useAppStore((s) => s.streak);
  return (
    <div className="flex items-center gap-2">
      <span
        className="glass inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold"
        style={{ borderRadius: 13 }}
      >
        <Flame className="h-4 w-4" style={{ color: "hsl(var(--status-streak))" }} />
        {hydrated ? streak : 0}
      </span>
      <span
        className="glass inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold"
        style={{ borderRadius: 13 }}
      >
        <Star className="h-4 w-4 fill-current" style={{ color: "hsl(var(--primary))" }} />
        {hydrated ? xp.toLocaleString() : 0}
      </span>
    </div>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return <span className="h-10 w-10" />;
  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      className="glass flex h-10 w-10 items-center justify-center text-text-muted transition hover:text-foreground"
      style={{ borderRadius: 13 }}
      aria-label="Toggle theme"
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const [open, setOpen] = React.useState(false);

  // Close the mobile drawer on route change.
  React.useEffect(() => setOpen(false), [pathname]);

  // Focus mode — a calm, chrome-free study surface (no sidebar, no orbs). Persisted.
  const [focus, setFocus] = React.useState(false);
  React.useEffect(() => {
    try {
      setFocus(localStorage.getItem("ui:focus") === "1");
    } catch {
      /* ignore */
    }
  }, []);
  const toggleFocus = () =>
    setFocus((f) => {
      const n = !f;
      try {
        localStorage.setItem("ui:focus", n ? "1" : "0");
      } catch {
        /* ignore */
      }
      return n;
    });

  return (
    <div className="relative flex min-h-screen">
      {focus ? (
        <div
          aria-hidden
          className="fixed inset-0"
          style={{ zIndex: 0, background: "hsl(var(--background))" }}
        />
      ) : (
        <AuroraOrbs />
      )}

      {/* Desktop sidebar */}
      <aside
        className={`relative z-10 shrink-0 p-5 ${focus ? "hidden" : "hidden lg:block"}`}
        style={{ width: 258 }}
      >
        <div
          className="glass-strong sticky top-5 flex h-[calc(100vh-40px)] flex-col p-3.5"
          style={{ borderRadius: 24 }}
        >
          <div className="mb-3 pt-1">
            <Logo />
          </div>
          <div className="flex-1 overflow-y-auto pr-0.5">
            <NavList pathname={pathname} />
          </div>
          <ProfileLockup />
        </div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside
            className="glass-strong absolute inset-y-0 left-0 flex w-[280px] flex-col p-4"
            style={{ borderRadius: "0 24px 24px 0" }}
          >
            <div className="mb-3 flex items-center justify-between">
              <Logo />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="rounded-lg p-1.5 text-text-muted hover:bg-white/50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <NavList pathname={pathname} onNavigate={() => setOpen(false)} />
            </div>
            <ProfileLockup />
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="relative z-10 flex min-w-0 flex-1 flex-col px-4 pb-10 pt-5 sm:px-6 lg:px-8">
        {/* Top strip */}
        <div className="mb-6 flex items-center gap-3">
          {!focus && (
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="glass flex h-10 w-10 items-center justify-center text-text-muted lg:hidden"
              style={{ borderRadius: 13 }}
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          {!focus ? (
            <button
              onClick={() => window.dispatchEvent(new CustomEvent(CMDK_OPEN_EVENT))}
              className="glass flex h-10 flex-1 items-center gap-2 px-4 text-sm text-text-light sm:max-w-sm"
              style={{ borderRadius: 14 }}
              aria-label="Open command palette"
            >
              <Search className="h-4 w-4" />
              <span className="truncate">Jump to… pages, formulas, actions</span>
              <kbd
                className="ml-auto hidden shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold sm:inline"
                style={{ background: "hsl(var(--foreground) / 0.06)" }}
              >
                ⌘K
              </kbd>
            </button>
          ) : (
            <div className="flex-1" />
          )}
          <div className="flex items-center gap-2">
            {!focus && (
              <div className="hidden sm:block">
                <StreakXpPills />
              </div>
            )}
            <button
              onClick={toggleFocus}
              title={focus ? "Exit focus mode" : "Focus mode — hide the chrome"}
              aria-label={focus ? "Exit focus mode" : "Focus mode"}
              className="glass flex h-10 items-center gap-2 px-3 text-sm font-medium text-text-muted transition hover:text-foreground"
              style={{ borderRadius: 13 }}
            >
              {focus ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              <span className="hidden sm:inline">{focus ? "Exit focus" : "Focus"}</span>
            </button>
            <ThemeToggle />
          </div>
        </div>

        <main className="min-w-0 flex-1">{children}</main>
      </div>

      <CommandPalette />
    </div>
  );
}
