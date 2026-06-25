"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

interface TemplateCard { id: string; name: string; category: string; file: string; customized?: boolean; description?: string }

export function ApplyTemplates({ keywords }: { keywords: string[] }) {
  const [items, setItems] = useState<TemplateCard[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/ai/templates');
        if (res.ok) {
          const data = await res.json();
          const all: TemplateCard[] = data?.templates || [];
          // naive keyword filter
          const kw = keywords.map(k => k.toLowerCase());
          const matched = all.filter(t => kw.some(k => t.name.toLowerCase().includes(k) || (t.description||'').toLowerCase().includes(k) || t.category.toLowerCase().includes(k)));
          setItems(matched.length ? matched : all.slice(0, 3));
        }
      } catch {}
    })();
  }, [keywords.join('|')]);

  if (!items.length) {
    return (
      <div className="text-sm text-muted-foreground">
        No templates found. <a className="text-primary" href="/templates">Browse Templates</a>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map(t => (
        <div key={t.id} className="border rounded p-2">
          <div className="text-sm font-medium flex items-center gap-2">
            {t.name}
            {t.customized && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded">Customized</span>}
          </div>
          <div className="text-xs text-muted-foreground">{t.category}</div>
          <a className="text-primary text-xs" href={t.file} download>Download</a>
        </div>
      ))}
      <Button asChild variant="outline" size="sm"><a href="/templates">View All Templates</a></Button>
    </div>
  );
}

