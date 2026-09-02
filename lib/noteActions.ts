/**
 * Note engine helpers — tags, note→flashcard conversion, and the AskAI bridge.
 *
 * Notes tag themselves with inline hashtags ("Watch the #wip reclass on
 * #leases") so the existing lesson-notes/smart-notes storage needs no
 * migration: tags are derived, never stored separately.
 */

import type { Flashcard } from "./types";
import { trackForContentId, lessonHrefForContentId } from "./trackForContentId";

/** Extract normalized inline hashtags from note text (lowercase, deduped, in order). */
export function parseTags(text: string): string[] {
  const seen = new Set<string>();
  for (const match of text.matchAll(/#([a-z0-9][a-z0-9-]*)/gi)) {
    seen.add(match[1].toLowerCase());
  }
  return [...seen];
}

/** Note shape shared by lesson notes and smart notes on the /notes index. */
export interface AnyNote {
  id: string;
  createdAt: number;
  text: string;
  /** smart notes carry the capture path */
  path?: string;
  /** lesson notes carry their source lesson */
  monthId?: string;
  weekId?: string;
}

export interface CustomCard extends Flashcard {
  id: string;
  createdAt: number;
}

function trackFromNote(note: AnyNote): CustomCard["track"] {
  if (note.monthId) return trackForContentId(note.monthId);
  if (note.path?.startsWith("/finance")) return "finance";
  if (note.path?.startsWith("/cpa") || note.path?.startsWith("/crossover")) return "cpa";
  if (note.path?.startsWith("/apply")) return "apply";
  return "cma";
}

/**
 * Draft a flashcard from a note: the first line (or sentence) becomes the
 * front, the remainder the back. Single-line notes put the full text on the
 * back and a truncated prompt on the front. The user edits before saving.
 */
export function draftCardFromNote(note: AnyNote): { front: string; back: string } {
  const text = note.text.trim();
  const newlineIdx = text.indexOf("\n");
  if (newlineIdx > 0) {
    return { front: text.slice(0, newlineIdx).trim(), back: text.slice(newlineIdx + 1).trim() };
  }
  const sentenceMatch = text.match(/^(.{10,120}?[.?!])\s+(.+)$/s);
  if (sentenceMatch) {
    return { front: sentenceMatch[1].trim(), back: sentenceMatch[2].trim() };
  }
  return { front: text.length > 80 ? `${text.slice(0, 77)}...` : text, back: text };
}

/** Build the stored custom card, tagging track/route/skills from the note's source. */
export function cardFromNote(
  note: AnyNote,
  front: string,
  back: string,
  nowMs: number
): CustomCard {
  const fromLesson = Boolean(note.monthId && note.weekId);
  return {
    id: `cc-${nowMs}-${note.id}`,
    createdAt: nowMs,
    front,
    back,
    skills: parseTags(note.text),
    track: trackFromNote(note),
    href: fromLesson ? lessonHrefForContentId(note.monthId!, note.weekId!) : note.path || "/notes",
    sourceId: `custom:${note.id}`,
  };
}

/** Event name the global AskAI overlay listens for. */
export const ASK_AI_OPEN_EVENT = "askai:open";

/** Open the global AskAI overlay pre-filled with a question. */
export function openAskAI(question: string): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(ASK_AI_OPEN_EVENT, { detail: { question } }));
}
