"use client";

/**
 * Scratchpad — a pressure-sensitive handwriting canvas built for Apple Pencil
 * on iPad (Pointer Events: pen pressure, palm rejection). Pen / highlighter /
 * stroke-eraser, a small ink palette, undo, clear, and optional persistence of
 * the vector strokes to localStorage so a page survives reloads. Vector strokes
 * (not a raster bitmap) keep it crisp at any DPR and make undo/erase exact.
 */

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Eraser, Highlighter, Pen, RotateCcw, Trash2 } from "lucide-react";

type Tool = "pen" | "highlighter" | "eraser";
interface Point { x: number; y: number; p: number }
interface Stroke { tool: Exclude<Tool, "eraser">; color: string; width: number; points: Point[] }

const INKS = ["#1a1a2e", "#2563eb", "#dc2626", "#15803d", "#a16207"];
const ERASE_RADIUS = 12;

function distToStroke(x: number, y: number, s: Stroke): number {
  let min = Infinity;
  for (const pt of s.points) {
    const d = Math.hypot(pt.x - x, pt.y - y);
    if (d < min) min = d;
  }
  return min;
}

export function Scratchpad({
  storageKey,
  heightClass = "h-[420px]",
  ruled = true,
}: {
  storageKey?: string;
  heightClass?: string;
  ruled?: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const currentRef = useRef<Stroke | null>(null);
  const sawPenRef = useRef(false); // once a pen is seen, reject touch (palm)
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 });

  const [tool, setTool] = useState<Tool>("pen");
  const [color, setColor] = useState(INKS[0]);
  const [, force] = useState(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { w, h } = sizeRef.current;
    ctx.clearRect(0, 0, w, h);
    const all = currentRef.current ? [...strokesRef.current, currentRef.current] : strokesRef.current;
    for (const s of all) {
      if (s.points.length === 0) continue;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.strokeStyle = s.color;
      ctx.globalAlpha = s.tool === "highlighter" ? 0.35 : 1;
      if (s.points.length === 1) {
        const p = s.points[0];
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, s.width / 2, 0, Math.PI * 2);
        ctx.fill();
        continue;
      }
      // Variable-width pen via per-segment stroking (pressure → width).
      for (let i = 1; i < s.points.length; i++) {
        const a = s.points[i - 1];
        const b = s.points[i];
        ctx.lineWidth = s.tool === "highlighter" ? s.width : s.width * (0.45 + b.p);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
  }, []);

  const resize = useCallback(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    sizeRef.current = { w, h, dpr };
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }, [draw]);

  // Load persisted strokes.
  useEffect(() => {
    if (!storageKey) return;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) strokesRef.current = JSON.parse(raw) as Stroke[];
    } catch {
      /* ignore */
    }
    draw();
  }, [storageKey, draw]);

  useLayoutEffect(() => {
    resize();
    const ro = new ResizeObserver(resize);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, [resize]);

  const persist = useCallback(() => {
    if (!storageKey) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(strokesRef.current));
    } catch {
      /* quota / blocked — non-fatal */
    }
  }, [storageKey]);

  const pointFrom = (e: React.PointerEvent): Point => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      p: e.pressure && e.pressure > 0 ? e.pressure : e.pointerType === "pen" ? 0.5 : 1,
    };
  };

  const shouldReject = (e: React.PointerEvent) =>
    e.pointerType === "touch" && sawPenRef.current;

  const onDown = (e: React.PointerEvent) => {
    if (e.pointerType === "pen") sawPenRef.current = true;
    if (shouldReject(e)) return;
    e.preventDefault();
    canvasRef.current?.setPointerCapture(e.pointerId);
    const pt = pointFrom(e);
    if (tool === "eraser") {
      eraseAt(pt.x, pt.y);
      return;
    }
    currentRef.current = {
      tool,
      color,
      width: tool === "highlighter" ? 18 : 2.6,
      points: [pt],
    };
    draw();
  };

  const onMove = (e: React.PointerEvent) => {
    if (shouldReject(e)) return;
    if (tool === "eraser" && (e.buttons === 1 || e.pressure > 0)) {
      const pt = pointFrom(e);
      eraseAt(pt.x, pt.y);
      return;
    }
    if (!currentRef.current) return;
    e.preventDefault();
    // Coalesced events give smoother Pencil lines.
    const events = (e.nativeEvent as PointerEvent).getCoalescedEvents?.() ?? [e.nativeEvent as PointerEvent];
    const rect = canvasRef.current!.getBoundingClientRect();
    for (const ev of events) {
      currentRef.current.points.push({
        x: ev.clientX - rect.left,
        y: ev.clientY - rect.top,
        p: ev.pressure && ev.pressure > 0 ? ev.pressure : e.pointerType === "pen" ? 0.5 : 1,
      });
    }
    draw();
  };

  const onUp = (e: React.PointerEvent) => {
    if (currentRef.current && currentRef.current.points.length > 0) {
      strokesRef.current.push(currentRef.current);
      persist();
    }
    currentRef.current = null;
    draw();
    force((n) => n + 1);
  };

  const eraseAt = (x: number, y: number) => {
    const before = strokesRef.current.length;
    strokesRef.current = strokesRef.current.filter((s) => distToStroke(x, y, s) > ERASE_RADIUS);
    if (strokesRef.current.length !== before) {
      persist();
      draw();
    }
  };

  const undo = () => {
    strokesRef.current.pop();
    persist();
    draw();
    force((n) => n + 1);
  };
  const clear = () => {
    strokesRef.current = [];
    persist();
    draw();
    force((n) => n + 1);
  };

  const toolBtn = (t: Tool, Icon: typeof Pen, label: string) => (
    <button
      onClick={() => setTool(t)}
      title={label}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-lg transition"
      style={tool === t ? { background: "hsl(var(--primary) / 0.14)", color: "hsl(var(--primary))" } : { color: "hsl(var(--text-muted))" }}
    >
      <Icon className="h-4.5 w-4.5" style={{ height: 18, width: 18 }} />
    </button>
  );

  return (
    <div className="glass overflow-hidden" style={{ borderRadius: 18 }}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1.5 border-b px-3 py-2" style={{ borderColor: "hsl(var(--border) / 0.6)" }}>
        {toolBtn("pen", Pen, "Pen")}
        {toolBtn("highlighter", Highlighter, "Highlighter")}
        {toolBtn("eraser", Eraser, "Eraser")}
        <div className="mx-1 h-6 w-px" style={{ background: "hsl(var(--border))" }} />
        {INKS.map((c) => (
          <button
            key={c}
            onClick={() => {
              setColor(c);
              if (tool === "eraser") setTool("pen");
            }}
            aria-label={`Ink ${c}`}
            className="h-6 w-6 rounded-full transition"
            style={{ background: c, outline: color === c ? "2px solid hsl(var(--primary))" : "none", outlineOffset: 2 }}
          />
        ))}
        <div className="ml-auto flex items-center gap-1">
          <button onClick={undo} title="Undo" aria-label="Undo" className="flex h-9 w-9 items-center justify-center rounded-lg text-text-muted hover:text-foreground">
            <RotateCcw className="h-4 w-4" />
          </button>
          <button onClick={clear} title="Clear page" aria-label="Clear page" className="flex h-9 w-9 items-center justify-center rounded-lg text-text-muted hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div
        ref={wrapRef}
        className={`relative w-full ${heightClass}`}
        style={{
          background: ruled
            ? "repeating-linear-gradient(to bottom, transparent, transparent 31px, hsl(var(--primary) / 0.08) 32px)"
            : "transparent",
          touchAction: "none",
        }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 touch-none"
          style={{ cursor: tool === "eraser" ? "cell" : "crosshair" }}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerLeave={onUp}
          onPointerCancel={onUp}
        />
      </div>
    </div>
  );
}
