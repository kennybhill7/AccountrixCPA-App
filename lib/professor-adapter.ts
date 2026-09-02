// Optional adapter to a local Professor module.
// If a `professor/` folder is present and exports generation helpers,
// these functions will delegate; otherwise they return null.

export interface ProfessorPlanInput {
  userId: string;
  intake: unknown;
}

export interface ProfessorPlanOutput {
  userId: string;
  generatedAt: number;
  items: Array<{
    week: number;
    urgency: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
    title: string;
    hours: number;
    deliverables: string[];
    mapping?: { monthId: string; weekId: string } | null;
    rationale?: string;
  }>;
}

export interface ProfessorAssistOutput {
  sessionId: string;
  userId: string;
  createdAt: number;
  input: string;
  suggestions: Array<{
    type: "lesson" | "lab" | "template";
    title: string;
    description: string;
    mapping?: { monthId: string; weekId: string } | null;
    steps?: string[];
  }>;
}

// The `professor/` module is OPTIONAL and may not exist. We use variable module
// specifiers so `tsc` does not statically resolve them (no TS2307); resolution
// happens at runtime and any failure falls through to the local fallback.
const PROFESSOR_ENTRY_POINTS = ["../../professor", "../../professor/index"];

async function loadProfessor(): Promise<any | null> {
  for (const spec of PROFESSOR_ENTRY_POINTS) {
    try {
      return await import(spec);
    } catch {
      /* try next entry point */
    }
  }
  return null;
}

export async function professorAvailable(): Promise<boolean> {
  return (await loadProfessor()) !== null;
}

export async function professorGeneratePlan(
  input: ProfessorPlanInput
): Promise<ProfessorPlanOutput | null> {
  const mod = await loadProfessor();
  if (mod && typeof mod.generatePlan === "function") {
    // A throwing professor module must fall back to the local path, not 500.
    try {
      return await mod.generatePlan(input);
    } catch (e) {
      console.error("professor generatePlan failed; using fallback", e);
      return null;
    }
  }
  return null;
}

export async function professorAssist(
  userId: string,
  input: string
): Promise<ProfessorAssistOutput | null> {
  const mod = await loadProfessor();
  if (mod && typeof mod.assist === "function") {
    try {
      const result = await mod.assist({ userId, input });
      // Only trust a well-shaped result; otherwise fall back to local search.
      if (result && Array.isArray(result.suggestions)) return result;
      return null;
    } catch (e) {
      console.error("professor assist failed; using fallback", e);
      return null;
    }
  }
  return null;
}
