"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, MessageSquare, Trash2 } from "lucide-react";
import { lessonHrefForContentId } from "@/lib/trackForContentId";
import {
  cardFromNote,
  draftCardFromNote,
  openAskAI,
  parseTags,
  type AnyNote,
} from "@/lib/noteActions";
import { useCustomCards } from "@/lib/store";

/**
 * Notes index — search, inline #tags, and the two conversions that make notes
 * part of the learning engine instead of a side page: note → flashcard (lands
 * in the "My Notes" deck and feeds SRS on rating) and note → AskAI.
 */

interface IndexedNote extends AnyNote {
  origin: "lesson" | "smart";
  tags: string[];
}

const STORE_KEY: Record<IndexedNote["origin"], string> = {
  lesson: "lesson-notes",
  smart: "smart-notes",
};

function noteHref(note: IndexedNote): string | null {
  if (note.path) return note.path;
  if (note.monthId && note.weekId) return lessonHrefForContentId(note.monthId, note.weekId);
  return null;
}

function noteKey(note: IndexedNote): string {
  return `${note.origin}:${note.id}`;
}

function loadNotes(): IndexedNote[] {
  const out: IndexedNote[] = [];
  for (const origin of ["lesson", "smart"] as const) {
    try {
      const raw = localStorage.getItem(STORE_KEY[origin]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const list: any[] = raw ? JSON.parse(raw) : [];
      for (const n of list) {
        out.push({
          id: n.id,
          createdAt: n.createdAt,
          text: n.text ?? "",
          path: n.path,
          monthId: n.monthId,
          weekId: n.weekId,
          origin,
          tags: parseTags(n.text ?? ""),
        });
      }
    } catch {}
  }
  return out.sort((a, b) => b.createdAt - a.createdAt);
}

export default function NotesPage() {
  const [q, setQ] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [notes, setNotes] = useState<IndexedNote[]>([]);
  const [converting, setConverting] = useState<string | null>(null);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const addCard = useCustomCards((s) => s.addCard);
  const customCount = useCustomCards((s) => s.cards.length);

  useEffect(() => {
    setNotes(loadNotes());
  }, []);

  const allTags = useMemo(() => {
    const tally = new Map<string, number>();
    for (const n of notes) for (const t of n.tags) tally.set(t, (tally.get(t) ?? 0) + 1);
    return [...tally.entries()].sort((a, b) => b[1] - a[1]);
  }, [notes]);

  const filtered = useMemo(() => {
    let list = notes;
    if (activeTag) list = list.filter((n) => n.tags.includes(activeTag));
    const t = q.trim().toLowerCase();
    if (t) {
      list = list.filter(
        (n) => n.text.toLowerCase().includes(t) || n.tags.some((tag) => tag.includes(t))
      );
    }
    return list;
  }, [q, activeTag, notes]);

  function deleteNote(note: IndexedNote) {
    try {
      const raw = localStorage.getItem(STORE_KEY[note.origin]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const list: any[] = raw ? JSON.parse(raw) : [];
      localStorage.setItem(
        STORE_KEY[note.origin],
        JSON.stringify(list.filter((n) => n.id !== note.id))
      );
      setNotes((prev) => prev.filter((n) => !(n.id === note.id && n.origin === note.origin)));
      setStatus("Note deleted.");
    } catch {
      setStatus("Delete failed.");
    }
  }

  function startConvert(note: IndexedNote) {
    const draft = draftCardFromNote(note);
    setConverting(noteKey(note));
    setFront(draft.front);
    setBack(draft.back);
    setStatus(null);
  }

  function saveCard(note: IndexedNote) {
    if (!front.trim() || !back.trim()) {
      setStatus("Both sides of the card need text.");
      return;
    }
    addCard(cardFromNote(note, front.trim(), back.trim(), Date.now()));
    setConverting(null);
    setStatus('Card saved to the "My Notes" deck on /flashcards. Ratings feed SRS like any deck.');
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Notes</h1>
          <p className="text-muted-foreground">
            Quick notes and lesson notes in one place. Tag inline with #hashtags; convert anything
            worth remembering into a flashcard or an AskAI question.
          </p>
        </div>
        {customCount > 0 && (
          <Button asChild variant="outline" size="sm">
            <Link href="/flashcards">My Notes deck ({customCount})</Link>
          </Button>
        )}
      </div>

      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search notes and tags..."
        className="mb-3 max-w-md"
      />

      {allTags.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {allTags.map(([tag, count]) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`rounded-full border px-3 py-1 text-xs transition ${
                activeTag === tag
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              #{tag} ({count})
            </button>
          ))}
        </div>
      )}

      {status && <p className="mb-4 text-sm text-muted-foreground">{status}</p>}

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            {notes.length === 0
              ? "No notes yet. Use the floating Notes button anywhere, or the Notes box under any lesson. Add #tags inline to organize."
              : "Nothing matches this search."}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((n) => (
            <Card key={`${n.origin}:${n.id}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  {new Date(n.createdAt).toLocaleString()}
                </CardTitle>
                <CardDescription className="flex flex-wrap items-center gap-1">
                  {n.origin === "lesson" ? "Lesson note" : "Quick note"}
                  {n.tags.map((t) => (
                    <Badge key={t} variant="secondary" className="text-[10px]">
                      #{t}
                    </Badge>
                  ))}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm whitespace-pre-wrap">{n.text}</div>

                {converting === noteKey(n) ? (
                  <div className="mt-4 space-y-2 rounded-md border p-3">
                    <label className="block text-xs font-medium">
                      Front (question)
                      <Input value={front} onChange={(e) => setFront(e.target.value)} className="mt-1" />
                    </label>
                    <label className="block text-xs font-medium">
                      Back (answer)
                      <textarea
                        value={back}
                        onChange={(e) => setBack(e.target.value)}
                        className="mt-1 min-h-20 w-full rounded-md border bg-background p-2 text-sm"
                      />
                    </label>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => saveCard(n)}>
                        Save card
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setConverting(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {noteHref(n) && (
                      <Button asChild variant="outline" size="sm">
                        <Link href={noteHref(n) ?? "#"}>Open source</Link>
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => startConvert(n)}>
                      <Brain className="mr-1 h-3 w-3" />
                      Make flashcard
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openAskAI(`Explain this note from my studies:\n\n${n.text}`)}
                    >
                      <MessageSquare className="mr-1 h-3 w-3" />
                      Ask AI
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label="Delete note"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => deleteNote(n)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
