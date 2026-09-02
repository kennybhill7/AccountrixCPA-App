import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, ClipboardCheck } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { listCaseWorkflows } from "@/lib/case-workflows";

function preview(text: string, max = 180) {
  return text.length > max ? `${text.slice(0, max).trim()}...` : text;
}

export default async function ApplyPage() {
  const workflows = await listCaseWorkflows();

  if (workflows.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <EmptyState
          icon={BriefcaseBusiness}
          title="No case workflows built yet"
          description="Author fictional case workflows under data/cases/<company>/workflows to make controller/CFO practice available here."
        />
      </div>
    );
  }

  const byCompetency = workflows.reduce<Record<string, typeof workflows>>((acc, workflow) => {
    const key = workflow.competency || "controller";
    acc[key] = acc[key] ?? [];
    acc[key].push(workflow);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <div className="mb-2 flex items-center gap-3">
              <BriefcaseBusiness className="h-7 w-7 text-primary" />
              <h1 className="text-3xl font-bold">Apply Lab</h1>
            </div>
            <p className="max-w-3xl text-muted-foreground">
              Fictional controller/CFO workflows that turn Finance, CMA, and CPA concepts into
              job-ready workpapers. No private company data is used.
            </p>
          </div>

          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border bg-card p-4">
              <div className="text-2xl font-semibold">{workflows.length}</div>
              <div className="text-sm text-muted-foreground">workflows live</div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="text-2xl font-semibold">
                {workflows.reduce((sum, w) => sum + w.taskCount, 0)}
              </div>
              <div className="text-sm text-muted-foreground">graded tasks</div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="text-2xl font-semibold">
                {new Set(workflows.flatMap((w) => w.skills)).size}
              </div>
              <div className="text-sm text-muted-foreground">skills covered</div>
            </div>
          </div>

          <div className="space-y-8">
            {Object.entries(byCompetency).map(([competency, items]) => (
              <section key={competency}>
                <div className="mb-3 flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold capitalize">{competency} workflows</h2>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {items.map((workflow) => (
                    <Link
                      key={`${workflow.caseId}/${workflow.fileId}`}
                      href={`/apply/${workflow.caseId}/${workflow.fileId}`}
                      className="group rounded-lg border bg-card p-5 transition-colors hover:bg-accent/50"
                    >
                      <div className="mb-2 flex items-start justify-between gap-4">
                        <h3 className="font-semibold leading-snug">{workflow.title}</h3>
                        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
                      </div>
                      <p className="mb-4 text-sm text-muted-foreground">{preview(workflow.scenario)}</p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span className="rounded-md bg-primary/10 px-2 py-1 text-primary">
                          {workflow.taskCount} tasks
                        </span>
                        <span>{workflow.exhibitCount} exhibits</span>
                        {workflow.skills.slice(0, 3).map((skill) => (
                          <span key={skill} className="rounded-md border px-2 py-1">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-10">
            <Button asChild variant="outline">
              <Link href="/tracks">
                <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
                All tracks
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

