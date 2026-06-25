"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type Urgency = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

interface Message {
  role: "ai" | "user";
  text: string;
  options?: string[];
}

const STEPS = [
  {
    key: "role",
    q: "What's your current role?",
    options: ["CFO", "Controller", "Staff Accountant", "Bookkeeper", "Accounting Manager", "Other"],
  },
  {
    key: "industry",
    q: "What industry do you work in?",
    options: [
      "Construction",
      "Real Estate",
      "Manufacturing",
      "Technology",
      "Non-Profit",
      "Government",
      "Healthcare",
      "Other",
    ],
  },
  { key: "entities", q: "How many entities do you manage?", options: ["1", "2-5", "6-10", "10+"] },
  {
    key: "software",
    q: "What accounting software do you use?",
    options: ["Ledgerline Intacct", "QuickBooks", "NetSuite", "Xero", "SAP", "Other"],
  },
  {
    key: "pain",
    q: 'List your current work challenges (one per message). Type "done" when finished.',
    options: [],
  },
  {
    key: "urgency",
    q: "How urgent is the top issue? (CRITICAL/HIGH/MEDIUM/LOW)",
    options: ["CRITICAL", "HIGH", "MEDIUM", "LOW"],
  },
  {
    key: "goals",
    q: "Your goals? (Fix work problems / Pass CPA / Both / Promotion / New CFO role)",
    options: ["Fix work problems", "Pass CPA", "Both", "Promotion", "New CFO role"],
  },
  {
    key: "timeline",
    q: "What is your timeline?",
    options: ["1week", "1-3months", "6months", "12months"],
  },
  { key: "hours", q: "How many hours per week can you dedicate?", options: [] },
];

export default function OnboardingChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: "Hi! I'm your CPA/CFO learning assistant. Let's build your personalized plan. First, what's your role?",
      options: STEPS[0].options,
    },
  ]);
  const [step, setStep] = useState(0);
  const [input, setInput] = useState("");
  const [painPoints, setPainPoints] = useState<string[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>({ userId: "demo-user" });
  const router = useRouter();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function push(role: "ai" | "user", text: string, options?: string[]) {
    setMessages((m) => [...m, { role, text, options }]);
  }

  function nextPrompt() {
    const next = step + 1;
    if (next < STEPS.length) {
      const s = STEPS[next];
      push("ai", s.q, s.options);
      setStep(next);
    } else {
      finalize();
    }
  }

  function handleSubmit() {
    const s = STEPS[step];
    const text = input.trim();
    if (!text) return;
    push("user", text);
    setInput("");

    if (s.key === "pain") {
      if (text.toLowerCase() !== "done") {
        setPainPoints((p) => [...p, text]);
        push("ai", 'Got it. Add another, or type "done" when finished.');
        return;
      }
    } else if (s.key === "hours") {
      const hours = Math.max(0, parseInt(text.replace(/[^0-9]/g, ""), 10) || 0);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setData((d: any) => ({ ...d, hoursPerWeek: hours }));
    } else if (s.key === "urgency") {
      const u = ["CRITICAL", "HIGH", "MEDIUM", "LOW"].includes(text.toUpperCase())
        ? text.toUpperCase()
        : "MEDIUM";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setData((d: any) => ({ ...d, topUrgency: u }));
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setData((d: any) => ({ ...d, [s.key]: text }));
    }
    nextPrompt();
  }

  async function finalize() {
    const mappedPain = painPoints
      .slice(0, 6)
      .map((p, idx) => ({
        key: `free_${idx + 1}`,
        label: p,
        urgency: (data.topUrgency as Urgency) || "MEDIUM",
      }));
    const payload = {
        userId: data.userId || "demo-user",
      timestamp: Date.now(),
      role: data.role || "CFO",
      industry: data.industry || "Construction",
      entities: data.entities || "1",
      software: data.software || "Other",
      painPoints: mappedPain,
      goals: data.goals ? [data.goals] : ["Both"],
      timeline: data.timeline || "12months",
      hoursPerWeek: data.hoursPerWeek || 5,
      notes: "",
    };
    try {
      localStorage.setItem("ai-intake", JSON.stringify(payload));
      await fetch("/api/ai/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {}
    push("ai", "Thanks! Building your custom plan…");
    setTimeout(() => router.push("/plan"), 600);
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <h1 className="text-3xl font-heading font-bold mb-4">Onboarding Chat</h1>
      <div className="border rounded-xl p-4 bg-background">
        <div className="space-y-3 max-h-[60vh] overflow-auto pr-2">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === "ai" ? "justify-start" : "justify-end"}`}>
              <div
                className={`px-3 py-2 rounded-lg ${m.role === "ai" ? "bg-muted text-foreground" : "bg-primary text-primary-foreground"}`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>
                {m.options && m.options.length > 0 && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {m.options.map((opt) => (
                      <Button
                        key={opt}
                        size="sm"
                        variant={m.role === "ai" ? "outline" : "secondary"}
                        onClick={() => {
                          setInput(opt);
                          handleSubmit();
                        }}
                      >
                        {opt}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
        <div className="mt-3 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            className="flex-1 rounded border px-3 py-2"
            placeholder="Type here and press Enter"
          />
          <Button onClick={handleSubmit} className="btn-primary">
            Send
          </Button>
        </div>
      </div>
      <div className="text-sm text-muted-foreground mt-2">
        Step {step + 1} of {STEPS.length}
      </div>
    </div>
  );
}
