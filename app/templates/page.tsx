"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TemplateCard {
  id: string;
  name: string;
  category: string;
  file: string;
  customized?: boolean;
  description?: string;
}

export default function TemplatesPage() {
  const [items, setItems] = useState<TemplateCard[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const [aiMTime, setAiMTime] = useState<number>(0);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/ai/templates");
        if (res.ok) {
          const data = await res.json();
          setItems((data?.templates || []) as TemplateCard[]);
        }
      } catch {}
    }
    load();
  }, []);

  // Poll AI folder mtime and refresh when it changes
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let timer: any;
    let mounted = true;
    async function tick() {
      try {
        const res = await fetch("/api/ai/mtime");
        if (res.ok) {
          const d = await res.json();
          if (mounted && d.mtime && d.mtime !== aiMTime) {
            setAiMTime(d.mtime);
            const r = await fetch("/api/ai/templates");
            if (r.ok) {
              const data = await r.json();
              setItems((data?.templates || []) as TemplateCard[]);
            }
          }
        }
      } catch {}
      timer = setTimeout(tick, 5000);
    }
    tick();
    return () => {
      mounted = false;
      if (timer) clearTimeout(timer);
    };
  }, [aiMTime]);

  const categories = ["All", ...Array.from(new Set(items.map((i) => i.category)))];
  const visible = items.filter(
    (i) =>
      (filter === "All" || i.category === filter) &&
      (!search.trim() ||
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        (i.description || "").toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-heading font-bold">Templates</h1>
          <p className="text-sm text-muted-foreground">
            Download templates referenced in your plan and lessons.
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates"
            className="w-56"
          />
          {categories.map((c) => (
            <Button
              key={c}
              variant={filter === c ? "secondary" : "outline"}
              size="sm"
              onClick={() => setFilter(c)}
            >
              {c}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visible.map((t) => (
          <Card key={t.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {t.name}
                {t.customized && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                    Customized for You
                  </span>
                )}
              </CardTitle>
              <CardDescription>{t.category}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">{t.description || "Template"}</p>
              <a className="text-primary text-sm" href={t.file} download>
                Download
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
