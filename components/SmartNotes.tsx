"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Note {
  id: string;
  createdAt: number;
  path: string;
  title?: string;
  text: string;
  tags?: string[];
}

export function SmartNotes() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("smart-notes");
      if (raw) setNotes(JSON.parse(raw));
    } catch {}
  }, []);

  function save() {
    if (!text.trim()) return;
    const note: Note = { id: `n-${Date.now()}`, createdAt: Date.now(), path: pathname, text };
    const next = [note, ...notes].slice(0, 500);
    setNotes(next);
    try {
      localStorage.setItem("smart-notes", JSON.stringify(next));
    } catch {}
    setText("");
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 z-50 bg-blue-600 shadow-lg hover:bg-blue-700"
      >
        <StickyNote className="mr-2 h-4 w-4" />
        Notes
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quick Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[100px] w-full rounded border p-2"
              placeholder="Jot the point you do not want to lose..."
            />
            <div className="flex flex-wrap gap-2">
              <Button onClick={save} className="btn-primary">
                Save
              </Button>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
              <Button asChild variant="ghost">
                <Link href="/notes" onClick={() => setOpen(false)}>
                  View all notes
                </Link>
              </Button>
            </div>
            {notes.length > 0 && (
              <div className="max-h-60 overflow-auto rounded border p-2">
                {notes.slice(0, 10).map((n) => (
                  <div key={n.id} className="mb-2 border-b pb-2 last:mb-0 last:border-0 last:pb-0">
                    <div className="text-xs text-muted-foreground">
                      {new Date(n.createdAt).toLocaleString()} · {n.path}
                    </div>
                    <div className="whitespace-pre-wrap text-sm">{n.text}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
