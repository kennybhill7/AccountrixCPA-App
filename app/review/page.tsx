import Link from "next/link";
import { ArrowRight, ClipboardCheck, ScanSearch, ShieldQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";
import { DEFECT_LIBRARY, listReviewWorkpapers, type DefectType } from "@/lib/reviewMode";

export const metadata = {
  title: "Review Mode",
  description: "Catch the defect in a finished workpaper before you sign it.",
};

export default function ReviewHubPage() {
  const workpapers = listReviewWorkpapers();

  if (workpapers.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <EmptyState
          icon={ScanSearch}
          title="No review workpapers seeded yet"
          description="Author fictional workpapers under data/review/ with a clean variant and at least one defect variant to make Review Mode available here."
        />
      </div>
    );
  }

  const defects = (
    Object.entries(DEFECT_LIBRARY) as [DefectType, (typeof DEFECT_LIBRARY)[DefectType]][]
  ).filter(([type]) => type !== "none");

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <div className="mb-2 flex items-center gap-3">
              <ScanSearch className="h-7 w-7 text-primary" />
              <h1 className="text-3xl font-bold">Review Mode</h1>
            </div>
            <p className="max-w-3xl text-muted-foreground">
              Every other drill asks you to produce an answer. Controller and CFO work is roughly
              20% building and 80% reviewing. Here you are handed a finished, confident, plausible
              workpaper and you decide whether to sign it — then say exactly where and why it
              breaks.
            </p>
          </div>

          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border bg-card p-4">
              <div className="text-2xl font-semibold">{workpapers.length}</div>
              <div className="text-sm text-muted-foreground">workpapers</div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="text-2xl font-semibold">{defects.length}</div>
              <div className="text-sm text-muted-foreground">defect patterns seeded</div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="text-2xl font-semibold">3</div>
              <div className="text-sm text-muted-foreground">
                graded levels: found it / located it / explained it
              </div>
            </div>
          </div>

          <div className="mb-8 rounded-lg border-l-4 border-primary/60 bg-primary/5 p-4 text-sm leading-6">
            <span className="font-medium">Some of these workpapers are correct. </span>
            Each case number draws a variant at random, and a clean paper is always in the pool. A
            reviewer who cannot sign off on correct work is as useless as one who signs off on bad
            work — so raising a false exception is scored as a miss.
          </div>

          <section className="mb-10">
            <div className="mb-3 flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Workpapers awaiting your signature</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {workpapers.map((wp) => (
                <Link
                  key={wp.id}
                  href={`/review/${wp.id}`}
                  className="group rounded-lg border bg-card p-5 transition-colors hover:bg-accent/50"
                >
                  <div className="mb-2 flex items-start justify-between gap-4">
                    <h3 className="font-semibold leading-snug">{wp.title}</h3>
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </div>
                  <p className="mb-1 text-sm text-muted-foreground">{wp.company}</p>
                  <p className="mb-4 text-sm text-muted-foreground">{wp.period}</p>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="rounded-md bg-primary/10 px-2 py-1 capitalize text-primary">
                      {wp.difficulty}
                    </span>
                    {wp.skills.slice(0, 3).map((skill) => (
                      <span key={skill} className="rounded-md border px-2 py-1">
                        {skill}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <div className="mb-3 flex items-center gap-2">
              <ShieldQuestion className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">The defect library</h2>
            </div>
            <p className="mb-4 max-w-3xl text-sm text-muted-foreground">
              These are the failures that actually get through review. Learn the technique that
              catches each class — which paper is carrying which defect is not disclosed.
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              {defects.map(([type, def]) => (
                <div key={type} className="rounded-lg border bg-card p-4">
                  <div className="mb-1 font-medium">{def.label}</div>
                  <p className="mb-2 text-sm text-muted-foreground">{def.description}</p>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Catch it by: </span>
                    {def.technique}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <div>
            <Button asChild variant="outline">
              <Link href="/apply">
                <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
                Apply Lab
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
