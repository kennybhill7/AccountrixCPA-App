"use client";

import { useEffect, useMemo, useState } from 'react';

interface LessonTOCProps {
  html: string;
}

// Builds a TOC matching the auto-assigned heading ids in LessonBody (heading-0, heading-1, ...)
export function LessonTOC({ html }: LessonTOCProps) {
  const entries = useMemo(() => parseHeadings(html), [html]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (entries.length === 0) return;
    const observer = new IntersectionObserver(
      (obs) => {
        const visible = obs
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0));
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: '0px 0px -70% 0px', threshold: [0, 0.25, 0.5, 1] }
    );
    const elements = entries.map((e) => document.getElementById(e.id)).filter(Boolean) as Element[];
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [entries]);

  if (entries.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className="text-sm">
      <div className="font-medium mb-2">Contents</div>
      <ul className="space-y-1">
        {entries.map((h) => (
          <li key={h.id} style={{ paddingLeft: `${(h.level - 1) * 8}px` }}>
            <a
              href={`#${h.id}`}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(h.id);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className={
                activeId === h.id
                  ? 'text-primary font-medium underline'
                  : 'text-primary hover:underline'
              }
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function stripTags(s: string): string {
  return s.replace(/<[^>]*>/g, ' ')
          .replace(/&nbsp;/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
}

function parseHeadings(html: string): Array<{ id: string; text: string; level: number }> {
  const out: Array<{ id: string; text: string; level: number }> = [];
  const regex = /<(h[1-6])[^>]*>(.*?)<\/\1>/gis;
  let match: RegExpExecArray | null;
  let index = 0;
  while ((match = regex.exec(html)) && index < 1000) {
    const tag = match[1].toLowerCase();
    const text = stripTags(match[2]).trim();
    if (!text) continue;
    const level = parseInt(tag.substring(1), 10);
    out.push({ id: `heading-${index}`, text, level });
    index++;
  }
  return out;
}
