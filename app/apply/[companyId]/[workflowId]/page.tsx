import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BadgeCheck, Calculator, FileText, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCaseWorkflow } from "@/lib/case-workflows";

interface PageProps {
  params: Promise<{ companyId: string; workflowId: string }>;
}

function renderValue(value: unknown) {
  if (value === null || value === undefined) return <span className="text-muted-foreground">None</span>;

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return <span>{String(value)}</span>;
  }

  return (
    <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs leading-relaxed">
      {JSON.stringify(value, null, 2)}
    </pre>
  );
}

export default async function ApplyWorkflowPage({ params }: PageProps) {
  const { companyId, workflowId } = await params;
  const workflow = await getCaseWorkflow(companyId, workflowId);

  if (!workflow) notFound();

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-16 z-40 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <Button asChild variant="ghost" size="sm">
                <Link href="/apply">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Apply Lab
                </Link>
              </Button>
              <div className="min-w-0">
                <h1 className="truncate font-semibold">{workflow.title}</h1>
                <p className="text-sm text-muted-foreground">
                  {workflow.company} · {workflow.competency ?? "controller"}
                </p>
              </div>
            </div>
            <div className="hidden text-xs text-muted-foreground md:block">
              Fictional case data only
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-5xl space-y-8">
          <section className="rounded-lg border bg-card p-6">
            <div className="mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Scenario</h2>
            </div>
            <p className="leading-7 text-muted-foreground">{workflow.scenario}</p>
            {workflow.skills?.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {workflow.skills.map((skill) => (
                  <span key={skill} className="rounded-md border px-2 py-1 text-xs text-muted-foreground">
                    {skill}
                  </span>
                ))}
              </div>
            ) : null}
          </section>

          {workflow.exhibits?.length ? (
            <section>
              <h2 className="mb-4 text-xl font-semibold">Exhibits</h2>
              <div className="space-y-4">
                {workflow.exhibits.map((exhibit) => (
                  <details key={exhibit.id} className="rounded-lg border bg-card p-4">
                    <summary className="cursor-pointer font-medium">{exhibit.label}</summary>
                    <div className="mt-3">{renderValue(exhibit.data)}</div>
                  </details>
                ))}
              </div>
            </section>
          ) : null}

          <section>
            <div className="mb-4 flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Workpaper Tasks</h2>
            </div>
            <div className="space-y-4">
              {workflow.tasks.map((task, index) => (
                <div key={task.id} className="rounded-lg border bg-card p-5">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <h3 className="font-semibold">
                      {index + 1}. {task.prompt}
                    </h3>
                    <span className="shrink-0 rounded-md bg-primary/10 px-2 py-1 text-xs text-primary">
                      {task.type}
                    </span>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <div className="mb-1 text-sm font-medium">Input</div>
                      {renderValue(task.input)}
                    </div>
                    <div>
                      <div className="mb-1 flex items-center gap-1 text-sm font-medium">
                        <BadgeCheck className="h-4 w-4 text-green-600" />
                        Expected check
                      </div>
                      {renderValue(task.expected)}
                    </div>
                  </div>
                  {task.explanation ? (
                    <p className="mt-4 rounded-md bg-muted p-3 text-sm text-muted-foreground">
                      {task.explanation}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>

          {workflow.outputArtifact ? (
            <section className="rounded-lg border bg-card p-6">
              <h2 className="mb-2 text-xl font-semibold">Output Artifact</h2>
              <p className="leading-7 text-muted-foreground">{workflow.outputArtifact}</p>
            </section>
          ) : null}

          {workflow.conversationSim ? (
            <section className="rounded-lg border bg-card p-6">
              <div className="mb-3 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">
                  Conversation Sim
                  {workflow.conversationSim.stakeholder ? ` · ${workflow.conversationSim.stakeholder}` : ""}
                </h2>
              </div>
              <p className="mb-4 leading-7 text-muted-foreground">{workflow.conversationSim.prompt}</p>
              {workflow.conversationSim.modelAnswer ? (
                <details className="rounded-md border p-4">
                  <summary className="cursor-pointer font-medium">Show model answer</summary>
                  <p className="mt-3 text-sm text-muted-foreground">{workflow.conversationSim.modelAnswer}</p>
                </details>
              ) : null}
            </section>
          ) : null}
        </div>
      </main>
    </div>
  );
}

