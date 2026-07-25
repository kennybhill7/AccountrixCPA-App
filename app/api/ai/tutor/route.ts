import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * /api/ai/tutor — the streaming Claude tutor (our "Newt"): a real explain-anything
 * study assistant, not the lesson-title search in /api/ai/assist.
 *
 * Degrades gracefully: with no ANTHROPIC_API_KEY it returns 503 "tutor-not-configured"
 * so the client can fall back to lesson-search suggestions (mirrors the sync route's
 * configured() pattern). Streams plain-text tokens back so answers appear immediately.
 */

// Haiku 4.5 — plenty capable for concept/why-wrong tutoring at ~5x lower cost
// than Opus ($1/$5 vs $5/$25 per 1M). We omit thinking/effort/sampling params,
// so no Haiku-specific config is needed beyond the model id.
const MODEL = "claude-haiku-4-5";
const MAX_TURNS = 16; // cap history sent upstream
const MAX_CHARS = 6000; // cap a single message length

function configured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

const SYSTEM = `You are the study tutor inside Accountrix, an exam-prep app for a construction controller/CFO studying Corporate Finance now and the CMA then CPA next. Your job is to make hard accounting and finance concepts click fast.

How to teach:
- Answer directly first, then explain. Lead with the key idea or the number, then the reasoning.
- When shown a missed practice problem, do four things briefly: (1) name the concept/formula it tests, (2) pinpoint the specific misconception that made the wrong answer tempting, (3) walk the correct solution step by step with the actual numbers given, (4) give a one-line rule to remember so this type isn't missed again.
- Show formulas plainly (no LaTeX, no $ math delimiters, no \\frac). Use "/" for division and "^" for exponents. Prefer worked arithmetic with the real numbers over abstract symbols.
- Use short paragraphs and bullet/numbered lists. Bold key terms with **term**. Be concise — this is a study aid, not a textbook chapter.
- Ground examples in construction finance (WIP, over/under billings, job cost, retainage, POC) when it helps, since that's the user's day job — but keep all figures illustrative/fictional.
- If a question is ambiguous, make a reasonable assumption, state it in one line, and answer. Don't stall asking for clarification.
- You cannot see the app's screens or the user's data. Teach the concept; don't claim to look anything up.`;

type Msg = { role: "user" | "assistant"; content: string };

function sanitize(messages: unknown): Msg[] {
  if (!Array.isArray(messages)) return [];
  const out: Msg[] = [];
  for (const m of messages) {
    const role = (m as { role?: string })?.role;
    const content = (m as { content?: unknown })?.content;
    if (
      (role === "user" || role === "assistant") &&
      typeof content === "string" &&
      content.trim()
    ) {
      out.push({ role, content: content.slice(0, MAX_CHARS) });
    }
  }
  // keep the most recent turns, and ensure it starts on a user turn
  const trimmed = out.slice(-MAX_TURNS);
  while (trimmed.length && trimmed[0].role !== "user") trimmed.shift();
  return trimmed;
}

export async function POST(req: NextRequest) {
  if (!configured()) {
    return NextResponse.json({ error: "tutor-not-configured" }, { status: 503 });
  }

  let messages: Msg[];
  try {
    const body = await req.json();
    messages = sanitize(body?.messages);
  } catch {
    return NextResponse.json({ error: "bad-json" }, { status: 400 });
  }
  if (messages.length === 0) {
    return NextResponse.json({ error: "no-messages" }, { status: 400 });
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const anthropicStream = client.messages.stream({
          model: MODEL,
          max_tokens: 1500,
          system: SYSTEM,
          messages,
        });
        for await (const event of anthropicStream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (e) {
        console.error("tutor stream error", e);
        // The stream may already have started; close so the client shows what it got.
        try {
          controller.enqueue(
            encoder.encode("\n\n_(The tutor was interrupted. Please try again.)_")
          );
        } catch {
          /* controller may be closed */
        }
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
