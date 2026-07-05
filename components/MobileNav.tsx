"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AlertTriangle,
  BookOpen,
  Calculator,
  ClipboardCheck,
  FlaskConical,
  Gauge,
  GraduationCap,
  Layers,
  ListChecks,
  Search,
  StickyNote,
  Target,
  User,
  Zap,
} from "lucide-react";

// Same destinations as the desktop Header nav.
const items = [
  { href: "/tracks", label: "Tracks", icon: Layers },
  { href: "/mission", label: "Mission", icon: Target },
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/finance", label: "Finance", icon: Calculator },
  { href: "/flashcards", label: "Flashcards", icon: Zap },
  { href: "/cpa", label: "CPA Lessons", icon: GraduationCap },
  { href: "/apply", label: "Apply Lab", icon: ClipboardCheck },
  { href: "/crossover", label: "CPA Practice", icon: ListChecks },
  { href: "/sims", label: "Exam Sims", icon: FlaskConical },
  { href: "/readiness", label: "Readiness", icon: Gauge },
  { href: "/mistakes", label: "Mistake Bank", icon: AlertTriangle },
  { href: "/search", label: "Search", icon: Search },
  { href: "/notes", label: "Notes", icon: StickyNote },
  { href: "/profile", label: "Profile", icon: User },
];

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const pathname = usePathname();

  if (!open) return null;

  return (
    <nav className="md:hidden border-t bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4 py-2 grid grid-cols-2 gap-1">
        {items.map((it) => {
          const Icon = it.icon;
          const active = pathname === it.href || pathname?.startsWith(`${it.href}/`);
          return (
            <Link
              key={it.href}
              href={it.href}
              onClick={onClose}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
                active
                  ? "bg-secondary text-foreground font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{it.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
