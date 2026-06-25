"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TextareaHTMLAttributes } from "react";

export function FixItNowButton() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [suggestions, setSuggestions] = useState<any[] | null>(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  async function submit() {
    setLoading(true);
    setError(null);
    setSuggestions(null);
    try {
      const res = await fetch("/api/ai/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "kenny", input }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setSuggestions(data.suggestions || []);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e?.message || "Failed to get suggestions");
    }
    setLoading(false);
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 shadow-lg"
      >
        🆘 Need Help Now?
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Describe your current work problem</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full min-h-[120px] rounded border p-2"
              placeholder="e.g., Bank rec off by $12k; 2023 not closed; lender deadline Friday"
            />
            <div className="flex gap-2">
              <Button disabled={loading || !input} onClick={submit} className="btn-primary">
                {loading ? "Thinking…" : "Get Steps"}
              </Button>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
            </div>
            {error && <div className="text-sm text-red-600">{error}</div>}
            {suggestions && (
              <div className="space-y-2">
                {suggestions.map((s, i) => (
                  <div key={i} className="p-3 rounded border">
                    <div className="font-medium">{s.title}</div>
                    <div className="text-sm text-muted-foreground mb-2">{s.description}</div>
                    {s.mapping ? (
                      <a
                        className="text-primary text-sm"
                        href={`/learn/${s.mapping.monthId}/${s.mapping.weekId}`}
                      >
                        Jump to Related Lesson
                      </a>
                    ) : null}
                    {s.steps?.length ? (
                      <ul className="list-disc pl-5 text-sm mt-2">
                        {s.steps.map((st: string, idx: number) => (
                          <li key={idx}>{st}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ))}
                <div className="pt-2">
                  <Button variant="outline" size="sm" onClick={() => setScheduleOpen(true)}>
                    Schedule 1‑on‑1 Help
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Schedule Stub */}
      <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule 1‑on‑1 Help (Coming Soon)</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground">
            We’ll add scheduling and calendar integration here. For now, add a note with your
            availability in 📝 Notes.
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
