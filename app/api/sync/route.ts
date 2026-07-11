import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// A sync id is a random client-generated token — the only credential. Anyone
// with it can read/write that bucket, so it's a long random hex string.
const ID_RE = /^[A-Za-z0-9_-]{16,64}$/;
const MAX_BYTES = 3_000_000;

function configured(): boolean {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

interface SyncBucket {
  updatedAt: number;
  data: Record<string, string>;
}

export async function GET(req: NextRequest) {
  if (!configured()) return NextResponse.json({ error: "sync-not-configured" }, { status: 503 });
  const id = new URL(req.url).searchParams.get("id") || "";
  if (!ID_RE.test(id)) return NextResponse.json({ error: "bad-id" }, { status: 400 });
  try {
    const val = await kv.get<SyncBucket>(`sync:${id}`);
    if (!val) return NextResponse.json({ error: "not-found" }, { status: 404 });
    return NextResponse.json(val);
  } catch (e) {
    console.error("sync GET error", e);
    return NextResponse.json({ error: "kv-error" }, { status: 502 });
  }
}

export async function PUT(req: NextRequest) {
  if (!configured()) return NextResponse.json({ error: "sync-not-configured" }, { status: 503 });
  const id = new URL(req.url).searchParams.get("id") || "";
  if (!ID_RE.test(id)) return NextResponse.json({ error: "bad-id" }, { status: 400 });

  const text = await req.text();
  if (text.length > MAX_BYTES) return NextResponse.json({ error: "too-large" }, { status: 413 });

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "bad-json" }, { status: 400 });
  }
  const b = body as Partial<SyncBucket>;
  if (!b || typeof b.updatedAt !== "number" || !b.data || typeof b.data !== "object") {
    return NextResponse.json({ error: "bad-body" }, { status: 400 });
  }
  try {
    await kv.set(`sync:${id}`, { updatedAt: b.updatedAt, data: b.data } satisfies SyncBucket);
    return NextResponse.json({ ok: true, updatedAt: b.updatedAt });
  } catch (e) {
    console.error("sync PUT error", e);
    return NextResponse.json({ error: "kv-error" }, { status: 502 });
  }
}
