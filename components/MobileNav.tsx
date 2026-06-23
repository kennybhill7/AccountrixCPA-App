"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, LayoutList, FileDown, StickyNote, Layers } from "lucide-react";

const items = [
  { href: "/months", label: "Learn", icon: BookOpen },
  { href: "/tracks", label: "Tracks", icon: Layers },
  { href: "/plan", label: "Plan", icon: LayoutList },
  { href: "/templates", label: "Templates", icon: FileDown },
  { href: "/notes", label: "Notes", icon: StickyNote },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur md:hidden">
      <div className="grid grid-cols-5">
        {items.map((it) => {
          const Icon = it.icon;
          const active = pathname === it.href || pathname?.startsWith(it.href);
          return (
            <Link
              key={it.href}
              href={it.href}
              className={`flex flex-col items-center justify-center py-2 text-xs ${active ? "text-primary" : "text-muted-foreground"}`}
            >
              <Icon className="h-5 w-5" />
              <span>{it.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
