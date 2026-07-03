import fs from "fs/promises";
import path from "path";

const CASES_DIR = path.join(process.cwd(), "data", "cases");

export interface CaseProfile {
  id: string;
  name?: string;
  description?: string;
  industry?: string;
  [key: string]: unknown;
}

export interface WorkflowExhibit {
  id: string;
  label: string;
  data: unknown;
}

export interface WorkflowTask {
  id: string;
  prompt: string;
  type: "calc" | "select" | "je" | "writeup" | string;
  input?: unknown;
  expected: unknown;
  tolerance?: number | null;
  explanation?: string;
}

export interface CaseWorkflow {
  id: string;
  title: string;
  company: string;
  skills?: string[];
  competency?: "exam" | "controller" | "cfo" | string;
  scenario: string;
  exhibits?: WorkflowExhibit[];
  tasks: WorkflowTask[];
  gradingRules?: unknown;
  outputArtifact?: string;
  conversationSim?: {
    stakeholder?: string;
    prompt: string;
    modelAnswer?: string;
  };
}

export interface CaseWorkflowSummary {
  id: string;
  title: string;
  company: string;
  skills: string[];
  competency: string;
  scenario: string;
  taskCount: number;
  exhibitCount: number;
}

async function readJson<T>(filePath: string): Promise<T> {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw) as T;
}

function summarize(workflow: CaseWorkflow): CaseWorkflowSummary {
  return {
    id: workflow.id,
    title: workflow.title,
    company: workflow.company,
    skills: workflow.skills ?? [],
    competency: workflow.competency ?? "controller",
    scenario: workflow.scenario,
    taskCount: workflow.tasks?.length ?? 0,
    exhibitCount: workflow.exhibits?.length ?? 0,
  };
}

export async function listCases(): Promise<CaseProfile[]> {
  try {
    const dirs = await fs.readdir(CASES_DIR, { withFileTypes: true });
    const cases = await Promise.all(
      dirs
        .filter((d) => d.isDirectory())
        .map(async (d) => {
          try {
            const profile = await readJson<CaseProfile>(path.join(CASES_DIR, d.name, "case.json"));
            return { ...profile, id: d.name };
          } catch {
            return { id: d.name };
          }
        }),
    );
    return cases;
  } catch {
    return [];
  }
}

export async function listCaseWorkflows(companyId?: string): Promise<CaseWorkflowSummary[]> {
  const cases = companyId ? [{ id: companyId }] : await listCases();
  const all: CaseWorkflowSummary[] = [];

  for (const c of cases) {
    const workflowsDir = path.join(CASES_DIR, c.id, "workflows");
    try {
      const files = await fs.readdir(workflowsDir);
      for (const file of files.filter((f) => f.endsWith(".json")).sort()) {
        try {
          const workflow = await readJson<CaseWorkflow>(path.join(workflowsDir, file));
          all.push(summarize(workflow));
        } catch {
          // Skip malformed drafts; validation/audit owns surfacing authoring errors.
        }
      }
    } catch {
      // A case can exist before workflows are authored.
    }
  }

  return all;
}

export async function getCaseWorkflow(
  companyId: string,
  workflowId: string,
): Promise<CaseWorkflow | null> {
  try {
    return await readJson<CaseWorkflow>(
      path.join(CASES_DIR, companyId, "workflows", `${workflowId}.json`),
    );
  } catch {
    return null;
  }
}
