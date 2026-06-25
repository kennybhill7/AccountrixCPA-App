"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const KEYS = ["user-progress", "quiz-results", "lesson-notes", "smart-notes"];

export default function StatePage() {
  const fileRef = useRef<HTMLInputElement>(null);

  function exportState() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const out: Record<string, any> = {};
    KEYS.forEach((k) => {
      try {
        const v = localStorage.getItem(k);
        if (v) out[k] = JSON.parse(v);
      } catch {}
    });
    const blob = new Blob([JSON.stringify(out, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "accountrix-state.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function importState(evt: React.ChangeEvent<HTMLInputElement>) {
    const file = evt.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        KEYS.forEach((k) => {
          if (data[k]) localStorage.setItem(k, JSON.stringify(data[k]));
        });
        alert("State imported. Reload to apply.");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        alert("Failed to import: " + e?.message);
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Export / Import State</CardTitle>
          <CardDescription>Backup or restore your progress and notes locally.</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-3 items-center">
          <Button onClick={exportState} className="btn-primary">
            Export JSON
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={importState}
          />
          <Button variant="outline" onClick={() => fileRef.current?.click()}>
            Import JSON
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
