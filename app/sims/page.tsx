import Link from "next/link";
import { FlaskConical, PenLine, Timer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { loadEssaySims, loadTbsSims } from "@/lib/sims-content";

/**
 * Exam Sims hub — CPA task-based simulations and CMA essays. These are the
 * exam formats MCQ practice does not cover: TBS is roughly half the CPA
 * score, and every CMA part ends with essays.
 */
export default async function SimsPage() {
  const [tbs, essays] = await Promise.all([loadTbsSims(), loadEssaySims()]);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <div className="mb-2 flex items-center gap-3">
        <FlaskConical className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-bold">Exam Sims</h1>
      </div>
      <p className="mb-8 text-muted-foreground">
        Timed, exam-format practice beyond multiple choice. Task-based simulations grade exact
        journal entries and computations; essays grade against a written rubric with model answers.
        Everything feeds readiness, SRS, and the Mistake Bank.
      </p>

      <h2 className="mb-3 text-xl font-semibold">CPA Task-Based Simulations</h2>
      <div className="mb-10 grid gap-4 md:grid-cols-2">
        {tbs.map((sim) => (
          <Link key={sim.id} href={`/sims/tbs/${sim.id}`}>
            <Card className="h-full transition hover:border-primary">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{sim.section}</Badge>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Timer className="h-3 w-3" />
                    {sim.timeMinutes} min · {sim.tasks.length} requirements
                  </span>
                </div>
                <CardTitle className="text-base leading-snug">{sim.title}</CardTitle>
                <CardDescription className="line-clamp-2">{sim.scenario}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
        {tbs.length === 0 && (
          <Card>
            <CardContent className="py-8 text-muted-foreground">No simulations loaded.</CardContent>
          </Card>
        )}
      </div>

      <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold">
        <PenLine className="h-5 w-5" />
        CMA Essays
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        {essays.map((essay) => (
          <Link key={essay.id} href={`/sims/essay/${essay.id}`}>
            <Card className="h-full transition hover:border-primary">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{essay.part}</Badge>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Timer className="h-3 w-3" />
                    {essay.timeMinutes} min · {essay.requirements.length} requirements
                  </span>
                </div>
                <CardTitle className="text-base leading-snug">{essay.title}</CardTitle>
                <CardDescription className="line-clamp-2">{essay.scenario}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
        {essays.length === 0 && (
          <Card>
            <CardContent className="py-8 text-muted-foreground">No essays loaded.</CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
