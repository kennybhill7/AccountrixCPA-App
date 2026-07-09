"use client";

interface FilterTabsProps<T extends string> {
  tabs: readonly T[];
  active: T;
  onChange: (t: T) => void;
}

/** Segmented glass chips (All / In progress / …). Client-controlled. */
export function FilterTabs<T extends string>({ tabs, active, onChange }: FilterTabsProps<T>) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {tabs.map((t) => {
        const on = t === active;
        return (
          <button
            key={t}
            type="button"
            onClick={() => onChange(t)}
            className={on ? "rounded-xl px-3 py-1.5 text-xs font-semibold" : "glass rounded-xl px-3 py-1.5 text-xs font-medium text-text-muted transition hover:text-foreground"}
            style={on ? { background: "hsl(var(--primary) / 0.13)", color: "hsl(var(--primary))" } : { borderRadius: 11 }}
          >
            {t}
          </button>
        );
      })}
    </div>
  );
}
