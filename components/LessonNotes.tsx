"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface Note {
  id: string;
  createdAt: number;
  monthId: string;
  weekId: string;
  text: string;
}

export function LessonNotes({ monthId, weekId }: { monthId: string; weekId: string }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("lesson-notes");
      const all: Note[] = raw ? JSON.parse(raw) : [];
      setNotes(all.filter((n) => n.monthId === monthId && n.weekId === weekId));
    } catch {}
  }, [monthId, weekId]);

  function save() {
    if (!text.trim()) return;
    const note: Note = { id: `ln-${Date.now()}`, createdAt: Date.now(), monthId, weekId, text };
    let all: Note[] = [];
    try {
      all = JSON.parse(localStorage.getItem("lesson-notes") || "[]");
    } catch {}
    const nextAll = [note, ...all];
    const next = nextAll.filter((n) => n.monthId === monthId && n.weekId === weekId);
    setNotes(next);
    try {
      localStorage.setItem("lesson-notes", JSON.stringify(nextAll));
    } catch {}
    setText("");
  }

  return (
    <div className="space-y-2">
      <div className="font-medium">Notes</div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full min-h-[90px] rounded border p-2"
        placeholder="Write a quick note; auto-saved locally"
      />
      <div className="flex gap-2">
        <Button size="sm" onClick={save}>
          Save Note
        </Button>
      </div>
      <div className="max-h-60 overflow-auto space-y-2">
        {notes.length === 0 && (
          <div className="text-xs text-muted-foreground">No notes yet for this lesson.</div>
        )}
        {notes.map((n) => (
          <div key={n.id} className="border rounded p-2">
            <div className="text-[11px] text-muted-foreground">
              {new Date(n.createdAt).toLocaleString()}
            </div>
            <div className="text-sm whitespace-pre-wrap">{n.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
