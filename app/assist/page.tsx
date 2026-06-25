"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AssistSession {
  sessionId: string;
  userId?: string;
  createdAt?: number;
  input: string;
  suggestions: number;
}

export default function AssistHistoryPage() {
  const [items, setItems] = useState<AssistSession[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/ai/assist-list");
        if (res.ok) {
          const data = await res.json();
          setItems(data.sessions || []);
        }
      } catch {}
    })();
  }, []);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-heading font-bold">Assistant Sessions</h1>
          <p className="text-sm text-muted-foreground">
            Review past "Fix It Now" sessions and jump into suggestions.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/">Home</Link>
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="text-sm text-muted-foreground">
          No sessions yet. Use the 🆘 button to start.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((s) => (
            <Card key={s.sessionId}>
              <CardHeader>
                <CardTitle className="text-base">{s.input?.slice(0, 60) || s.sessionId}</CardTitle>
                <CardDescription>
                  {s.createdAt ? new Date(s.createdAt).toLocaleString() : "Unknown date"} •{" "}
                  {s.suggestions} suggestions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button asChild className="btn-primary">
                    <Link href={`/assist/${encodeURIComponent(s.sessionId)}`}>Open</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
