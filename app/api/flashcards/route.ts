import { NextResponse } from "next/server";
import { loadConsolidatedFlashcards } from "@/lib/content-loader";

// Serves consolidated flashcards to client components (which must not import the
// fs-based loader directly). S1-C11.
export async function GET() {
  try {
    const flashcards = await loadConsolidatedFlashcards();
    return NextResponse.json(flashcards);
  } catch (error) {
    console.error("API Error loading flashcards:", error);
    return NextResponse.json({ error: "Failed to load flashcards" }, { status: 500 });
  }
}
