"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LessonBody } from '@/components/LessonBody';

export default function CustomLessonPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/ai/custom-lessons/${encodeURIComponent(id)}`);
        if (!res.ok) { setError('Custom lesson not found'); return; }
        setData(await res.json());
      } catch (e: any) { setError(e?.message || 'Failed to load lesson'); }
    })();
  }, [id]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-10">
        <p className="text-red-600 text-sm">{error}</p>
        <Button asChild variant="outline" className="mt-4"><Link href="/plan">Back to Plan</Link></Button>
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
          <h1 className="text-3xl font-heading font-bold">{data.title}</h1>
          <p className="text-sm text-muted-foreground">Custom Lesson • {data.id}</p>
        </div>
        <Button asChild variant="outline"><Link href="/plan">Back to Plan</Link></Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <LessonBody html={data.html || '<p>No content</p>'} monthId={data.id} weekId="c1" />
        </div>
        <aside className="lg:col-span-4 space-y-4">
          {Array.isArray(data.flashcards) && data.flashcards.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Flashcards</CardTitle>
                <CardDescription>Quick reference</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {data.flashcards.map((c: any, i: number) => (
                    <li key={i} className="border rounded p-2">
                      <div className="font-medium">{c.front}</div>
                      <div className="text-muted-foreground">{c.back}</div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </aside>
      </div>
    </div>
  );
}

