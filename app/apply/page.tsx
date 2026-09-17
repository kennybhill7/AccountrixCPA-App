import Link from "next/link";
import { ArrowRight, BriefcaseBusiness } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { TitleBlock } from "@/components/sheet/TitleBlock";
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
    <div className="container mx-auto px-4 py-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <TitleBlock
          eyebrow="Fictional data only"
          title="Apply Lab"
          subtitle="Fictional controller/CFO workflows that turn Finance, CMA, and CPA concepts into job-ready workpapers. No private company data is used."
          meta={[
            { label: "Workflows live", value: String(workflows.length) },
            {
              label: "Graded tasks",
              value: String(workflows.reduce((sum, w) => sum + w.taskCount, 0)),
            },
            {
              label: "Skills covered",
              value: String(new Set(workflows.flatMap((w) => w.skills)).size),
            },
          ]}
        />

        <div className="space-y-8">
          {Object.entries(byCompetency).map(([competency, items]) => (
            <section key={competency}>
              <h2 className="mb-3 font-display text-xl font-bold capitalize tracking-tight text-foreground">
                {competency} workflows
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {items.map((workflow) => (
                  <Link
                    key={`${workflow.caseId}/${workflow.fileId}`}
                    href={`/apply/${workflow.caseId}/${workflow.fileId}`}
                    className="group p-5 transition-colors hover:bg-accent/30"
                    style={{ border: "1px solid hsl(var(--border))", borderRadius: 2 }}
                  >
                    <div className="mb-2 flex items-start justify-between gap-4">
                      <h3 className="font-semibold leading-snug">{workflow.title}</h3>
                      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
                    </div>
                    <p className="mb-4 text-sm text-muted-foreground">
                      {preview(workflow.scenario)}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="blueprint-label">{workflow.taskCount} tasks</span>
                      <span className="text-xs text-muted-foreground">
                        {workflow.exhibitCount} exhibits
                      </span>
                      {workflow.skills.slice(0, 3).map((skill) => (
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
          ))}
        </div>

        <div>
          <Button asChild variant="outline">
            <Link href="/tracks">
              <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
              All tracks
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
