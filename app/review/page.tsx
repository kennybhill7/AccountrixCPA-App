import Link from "next/link";
import { ArrowRight, ScanSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";
import { TitleBlock } from "@/components/sheet/TitleBlock";
import { StateGlyph } from "@/components/sheet/StateGlyph";
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
    <div className="container mx-auto px-4 py-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <TitleBlock
          eyebrow="80% of the job"
          title="Review Mode"
          subtitle="Every other drill asks you to produce an answer. Controller and CFO work is roughly 20% building and 80% reviewing. Here you are handed a finished, confident, plausible workpaper and you decide whether to sign it — then say exactly where and why it breaks."
          meta={[
            { label: "Workpapers", value: String(workpapers.length) },
            { label: "Defect patterns", value: String(defects.length) },
            { label: "Graded levels", value: "3" },
          ]}
        />

        <div
          className="flex items-start gap-3 p-4 text-sm leading-6"
          style={{ border: "1px solid hsl(var(--border))", borderRadius: 2 }}
        >
          <StateGlyph state="ref" />
          <p>
            <span className="font-medium">Some of these workpapers are correct. </span>
            Each case number draws a variant at random, and a clean paper is always in the pool. A
            reviewer who cannot sign off on correct work is as useless as one who signs off on bad
            work — so raising a false exception is scored as a miss.
          </p>
        </div>

        <section>
          <h2 className="mb-3 font-display text-xl font-bold tracking-tight text-foreground">
            Workpapers awaiting your signature
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {workpapers.map((wp) => (
              <Link
                key={wp.id}
                href={`/review/${wp.id}`}
                className="group p-5 transition-colors hover:bg-accent/30"
                style={{ border: "1px solid hsl(var(--border))", borderRadius: 2 }}
              >
                <div className="mb-2 flex items-start justify-between gap-4">
                  <h3 className="font-semibold leading-snug">{wp.title}</h3>
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </div>
                <p className="mb-1 text-sm text-muted-foreground">{wp.company}</p>
                <p className="mb-4 text-sm text-muted-foreground">{wp.period}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="blueprint-label">{wp.difficulty}</span>
                  {wp.skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 text-xs text-muted-foreground"
                      style={{ border: "1px solid hsl(var(--border))", borderRadius: 2 }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-display text-xl font-bold tracking-tight text-foreground">
            The defect library
          </h2>
          <p className="mb-4 max-w-3xl text-sm text-muted-foreground">
            These are the failures that actually get through review. Learn the technique that
            catches each class — which paper is carrying which defect is not disclosed.
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            {defects.map(([type, def]) => (
              <div
                key={type}
                className="p-4"
                style={{ border: "1px solid hsl(var(--border))", borderRadius: 2 }}
              >
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
  );
}
