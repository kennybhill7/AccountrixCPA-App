"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AssistDetailPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/ai/assist/${encodeURIComponent(sessionId)}`);
        if (!res.ok) {
          setError("Session not found");
          return;
        }
        setData(await res.json());
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        setError(e?.message || "Failed to load session");
      }
    })();
  }, [sessionId]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-10">
        <p className="text-sm text-red-600">{error}</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/assist">Back to Sessions</Link>
        </Button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-10">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-heading font-bold">Session {data.sessionId}</h1>
          <p className="text-sm text-muted-foreground">
            {data.createdAt ? new Date(data.createdAt).toLocaleString() : ""}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/assist">All Sessions</Link>
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">User Input</CardTitle>
          <CardDescription>Problem statement</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm whitespace-pre-wrap">{data.input}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(data.suggestions || []).map(
          (
            s: any,
            idx: number // eslint-disable-line @typescript-eslint/no-explicit-any
          ) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle className="text-base">{s.title}</CardTitle>
                <CardDescription>
                  {s.type} • {s.mapping ? `${s.mapping.monthId}/${s.mapping.weekId}` : "Unmapped"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">{s.description}</p>
                {s.mapping && (
                  <Button asChild className="btn-primary mb-2">
                    <Link href={`/learn/${s.mapping.monthId}/${s.mapping.weekId}`}>
                      Jump to Lesson
                    </Link>
                  </Button>
                )}
                {s.steps?.length ? (
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    {s.steps.map((st: string, i: number) => (
                      <li key={i}>{st}</li>
                    ))}
                  </ul>
                ) : null}
              </CardContent>
            </Card>
          )
        )}
      </div>
    </div>
  );
}
