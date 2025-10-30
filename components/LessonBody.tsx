"use client";

import { useEffect, useRef } from "react";
import { sanitizeHTML } from "@/lib/sanitize";
import { BookmarkButton } from "@/components/BookmarkButton";

interface LessonBodyProps {
  html: string;
  monthId: string;
  weekId: string;
}

export function LessonBody({ html, monthId, weekId }: LessonBodyProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    // Add bookmark buttons to headings
    const headings = contentRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach((heading, index) => {
      if (!heading.id) {
        heading.id = `heading-${index}`;
      }
      
      // Create bookmark button container
      const bookmarkContainer = document.createElement('div');
      bookmarkContainer.className = 'inline-block ml-2 opacity-0 group-hover:opacity-100 transition-opacity';
      
      // Add group class to heading for hover effect
      heading.classList.add('group', 'flex', 'items-center');
      heading.appendChild(bookmarkContainer);
    });
  }, [html, monthId, weekId]);

  const sanitizedHTML = sanitizeHTML(html);

  return (
    <article 
      ref={contentRef}
      className="lesson-content prose prose-slate max-w-none dark:prose-invert"
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
    />
  );
}