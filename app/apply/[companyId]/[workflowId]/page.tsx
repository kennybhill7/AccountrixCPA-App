import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText } from "lucide-react";
import { ApplyWorkflowClient } from "@/components/ApplyWorkflowClient";
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

function exhibitTitle(exhibit: { id: string; label?: string; title?: string }) {
  return exhibit.label ?? exhibit.title ?? exhibit.id;
}

function exhibitBody(exhibit: { data?: unknown; body?: unknown; rows?: unknown }) {
  return exhibit.data ?? exhibit.body ?? exhibit.rows;
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
                    <summary className="cursor-pointer font-medium">{exhibitTitle(exhibit)}</summary>
                    <div className="mt-3">{renderValue(exhibitBody(exhibit))}</div>
                  </details>
                ))}
              </div>
            </section>
          ) : null}

          <ApplyWorkflowClient workflow={workflow} />
        </div>
      </main>
    </div>
  );
}
