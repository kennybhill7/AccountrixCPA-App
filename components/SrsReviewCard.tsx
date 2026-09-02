"use client";

import { useState } from "react";
import Link from "next/link";
import { RotateCcw, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSrs } from "@/lib/store";
import { dayNumber, isDue } from "@/lib/spacedRepetition";

const MAX_ITEMS = 10;

/**
 * SRS review surface (FABLE5_ANALYSIS §5 Week 3) — shared by /mission and
 * /profile. Lists up to 10 due items (most overdue first) with a link back to
 * the source quiz/workflow and one-tap "got it / missed it" review buttons.
 */
export function SrsReviewCard() {
  const items = useSrs((s) => s.items);
  const reviewItem = useSrs((s) => s.reviewItem);
  // Stamp "today" once per mount so the list doesn't shift mid-session.
  const [nowDay] = useState(() => dayNumber(Date.now()));

  const due = Object.values(items)
    .filter((i) => isDue(i, nowDay))
    .sort((a, b) => a.dueDay - b.dueDay || a.id.localeCompare(b.id))
    .slice(0, MAX_ITEMS);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <RotateCcw className="h-5 w-5 mr-2" />
          Review queue
        </CardTitle>
        <CardDescription>
          Missed items scheduled by spaced repetition — clear them before new material.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {due.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nothing due. Missed quiz questions and Apply Lab tasks land here automatically.
          </p>
        ) : (
          <div className="space-y-3">
            {due.map((item) => {
              const overdue = nowDay - item.dueDay;
              return (
                <div
                  key={item.id}
                  className="flex flex-col gap-2 rounded-lg border p-3 md:flex-row md:items-center md:justify-between"
                >
                  <div className="min-w-0 text-sm">
                    <Link href={item.href} className="font-medium hover:underline">
                      {item.label}
                    </Link>
                    <div className="mt-1">
                      <Badge variant={overdue > 0 ? "destructive" : "outline"}>
                        {overdue > 0 ? `${overdue} day${overdue === 1 ? "" : "s"} overdue` : "due today"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => reviewItem(item.id, 5, nowDay)}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Reviewed — got it
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => reviewItem(item.id, 1, nowDay)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Missed it
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
