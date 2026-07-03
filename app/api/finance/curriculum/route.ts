import { NextResponse } from "next/server";
import { loadFinanceCurriculum } from "@/lib/finance-content";

export async function GET() {
  try {
    return NextResponse.json(await loadFinanceCurriculum());
  } catch (error) {
    console.error("Failed to load Finance curriculum", error);
    return NextResponse.json({ units: [] }, { status: 200 });
  }
}

