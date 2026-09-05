"use client";

import { useEffect, useRef, useState } from "react";
import type { LessonSection } from "@/components/LessonBody";

/**
 * A sticky in-lesson table of contents, built from the section list
 * LessonBody hands back via onOutlineReady (its own h2 headings, already
 * carrying the real DOM ids) rather than re-parsing the HTML here — one
 * source of truth for what counts as a "section," no drift between the two.
 *
 * Tracks reading progress with an IntersectionObserver: a section is marked
 * "seen" once it has scrolled past the top of the viewport, and "current"
 * while it's the topmost section past the reading line. Matches the design
 * system's fixed-glyph convention (✓ seen, ▸ current, · unread) so it still
 * reads correctly in a grayscale screenshot.
 */
export function LessonTOC({ sections }: { sections: LessonSection[] }) {
  const [seen, setSeen] = useState<Set<string>>(new Set());
  const [current, setCurrent] = useState<string | null>(null);
  const orderRef = useRef<string[]>(sections.map((s) => s.id));
  orderRef.current = sections.map((s) => s.id);

  useEffect(() => {
    if (sections.length === 0) return;
    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          const idx = orderRef.current.indexOf(id);
          // Scrolled past above the viewport — mark every earlier section
          // seen too, in case a fast scroll skipped some intersection events.
          if (entry.boundingClientRect.top < 0 && !entry.isIntersecting) {
            setSeen((prev) => {
              const next = new Set(prev);
              for (let i = 0; i <= idx; i++) next.add(orderRef.current[i]);
              return next;
            });
          }
        }
        const above = entries
          .filter((e) => e.boundingClientRect.top <= 96)
          .sort((a, b) => b.boundingClientRect.top - a.boundingClientRect.top)[0];
        if (above) setCurrent(above.target.id);
      },
      { rootMargin: "-96px 0px -60% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  if (sections.length === 0) return null;

  return (
    <nav aria-label="Lesson sections" className="sticky top-24 space-y-1 text-sm">
      {sections.map((section) => {
        const isCurrent = section.id === current;
        const isSeen = seen.has(section.id) && !isCurrent;
        return (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="flex items-start gap-2 rounded px-2 py-1 transition-colors hover:bg-muted/60"
            style={{
              color: isCurrent
                ? "hsl(var(--foreground))"
                : isSeen
                  ? "hsl(var(--muted-foreground))"
                  : "hsl(var(--muted-foreground) / 0.7)",
              fontWeight: isCurrent ? 600 : 400,
            }}
          >
            <span
              aria-hidden
              className="mt-0.5 w-3 shrink-0 text-center"
              style={{
                color: isSeen
                  ? "hsl(var(--status-done))"
                  : isCurrent
                    ? "hsl(var(--primary))"
                    : "hsl(var(--border))",
              }}
            >
              {isSeen ? "✓" : isCurrent ? "▸" : "·"}
            </span>
            <span className="leading-snug">{section.text}</span>
          </a>
        );
      })}
    </nav>
  );
}
