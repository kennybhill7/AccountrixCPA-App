import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import {
  generateFallbackPlanFromIntake,
  loadClaudeIntake,
  loadClaudePlan,
} from "@/lib/personalization";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId") || "demo-user";
  try {
    // Prefer Claude's plan if present
    const plan = await loadClaudePlan(userId);
    if (plan && plan.items?.length) {
      return NextResponse.json({ source: "claude", ...plan });
    }
    // Fallback: use intake + local mapping
    const intake = await loadClaudeIntake(userId);
    if (intake) {
      const fallback = await generateFallbackPlanFromIntake(intake);
      return NextResponse.json({ source: "fallback", ...fallback });
    }
    return NextResponse.json({ source: "none", userId, generatedAt: Date.now(), items: [] });
  } catch (e) {
    console.error("plan-resolve error:", e);
    return NextResponse.json({ error: "Failed to resolve plan" }, { status: 500 });
  }
}
