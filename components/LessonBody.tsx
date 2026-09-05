"use client";

import { useEffect, useMemo, useRef } from "react";
import { createRoot, type Root } from "react-dom/client";
import { sanitizeHTML } from "@/lib/sanitize";
import { BookmarkButton } from "@/components/BookmarkButton";

export interface LessonSection {
  id: string;
  text: string;
}

interface LessonBodyProps {
  html: string;
  monthId: string;
  weekId: string;
  /** Fires with the lesson's top-level (h2) subsections, in document order —
   * lets a parent page build a table of contents without re-parsing the HTML
   * itself. May fire more than once (see the self-healing note below). */
  onOutlineReady?: (sections: LessonSection[]) => void;
}

/**
 * Assigns heading ids, builds the h2 outline, and styles this lesson prose's
 * own "Trap:" bolded lead-in convention as a callout. Pure DOM mutation, no
 * React roots — safe to call more than once on the same content.
 */
function applyOutlineAndCallouts(
  root: HTMLElement,
  onOutlineReady?: (sections: LessonSection[]) => void
) {
  const headings = root.querySelectorAll("h1, h2, h3, h4, h5, h6");
  const outline: LessonSection[] = [];
  headings.forEach((heading, index) => {
    if (!heading.id) {
      heading.id = `heading-${index}`;
    }
    if (heading.tagName === "H2") {
      const title = heading.textContent?.trim() || `Section ${index + 1}`;
      outline.push({ id: heading.id, text: title });
    }
  });
  onOutlineReady?.(outline);

  // Lesson prose already uses a "Trap:" bolded lead-in as its own writing
  // convention (see e.g. data/curriculum/cma/m3-w1.json) — style those
  // paragraphs as a proper callout instead of leaving them as plain text.
  // Content-driven, not new data: works for every lesson that already uses
  // the convention, does nothing where it doesn't appear.
  root.querySelectorAll("p").forEach((p) => {
    const firstStrong = p.querySelector("strong:first-child");
    if (firstStrong?.textContent?.trim() === "Trap:") {
      p.classList.add("lesson-trap-callout");
    }
  });
}

export function LessonBody({ html, monthId, weekId, onOutlineReady }: LessonBodyProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  // Applies heading ids / outline / trap callouts, then keeps re-applying
  // them if the article's content ever gets replaced wholesale afterward.
  // Confirmed live (via a MutationObserver during development) that
  // something — even with sanitizedHTML memoized on `html` below — performs
  // a full childList replacement of the article's children shortly after
  // initial mount, silently discarding every imperative DOM mutation made by
  // this component's effects (this component's own bookmark buttons
  // included). Root cause not fully isolated; self-healing avoids depending
  // on understanding it exactly, and is harmless if it never fires.
  useEffect(() => {
    if (!contentRef.current) return;
    const el = contentRef.current;

    applyOutlineAndCallouts(el, onOutlineReady);

    const observer = new MutationObserver((mutations) => {
      const wasReset = mutations.some((m) => m.type === "childList" && m.target === el);
      if (wasReset) {
        applyOutlineAndCallouts(el, onOutlineReady);
      }
    });
    observer.observe(el, { childList: true });

    return () => observer.disconnect();
  }, [html, onOutlineReady]);

  // Bookmark buttons — kept as its own effect. If the content-reset above
  // fires after this effect's bookmark spans are already appended, those
  // spans (and their React roots) are lost along with everything else; this
  // effect does not currently re-run to replace them. Known gap, not fixed
  // here — flagging rather than silently leaving undocumented.
  useEffect(() => {
    if (!contentRef.current) return;

    const mounted: Array<{ root: Root; container: HTMLSpanElement }> = [];

    const headings = contentRef.current.querySelectorAll("h1, h2, h3, h4, h5, h6");
    headings.forEach((heading, index) => {
      if (!heading.id) {
        heading.id = `heading-${index}`;
      }

      const title = heading.textContent?.trim() || `Section ${index + 1}`;

      const bookmarkContainer = document.createElement("span");
      bookmarkContainer.className =
        "inline-flex ml-2 opacity-0 group-hover:opacity-100 transition-opacity print:hidden";
      bookmarkContainer.dataset.bookmarkRoot = "true";

      heading.classList.add("group", "flex", "items-center");
      heading.appendChild(bookmarkContainer);

      const root = createRoot(bookmarkContainer);
      root.render(
        <BookmarkButton monthId={monthId} weekId={weekId} anchor={`#${heading.id}`} title={title} />
      );
      mounted.push({ root, container: bookmarkContainer });
    });

    return () => {
      // Deferred: calling root.unmount() synchronously here, immediately
      // after root.render() scheduled work that may not have flushed yet
      // (exactly what happens under Strict Mode's mount→cleanup→mount
      // double-invoke, once per heading), is the textbook cause of React's
      // "Attempted to synchronously unmount a root while React was already
      // rendering" race. Deferring past the current commit avoids it.
      setTimeout(() => {
        mounted.forEach(({ root, container }) => {
          root.unmount();
          container.remove();
        });
      }, 0);
    };
  }, [html, monthId, weekId]);

  // Memoized so the same string instance survives re-renders.
  const sanitizedHTML = useMemo(() => sanitizeHTML(html), [html]);

  return (
    <article
      ref={contentRef}
      className="lesson-content prose prose-slate max-w-none dark:prose-invert"
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
    />
  );
}
