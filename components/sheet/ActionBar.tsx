"use client";

import { useEffect } from "react";
import Link from "next/link";

export interface ActionBarAction {
  label: string;
  onClick?: () => void;
  href?: string;
}

// Module-level count of currently-mounted ActionBars carrying a `primary`.
// This is how rule 4.4 (the accent fires once per screen) stops regressing:
// a second primary action anywhere on a rendered page is a real bug, not a
// style nit, so it warns immediately in dev instead of waiting to be
// noticed in a screenshot review.
let mountedPrimaryCount = 0;

function usePrimaryGuard(hasPrimary: boolean) {
  useEffect(() => {
    if (!hasPrimary || process.env.NODE_ENV === "production") return;
    mountedPrimaryCount += 1;
    if (mountedPrimaryCount > 1) {
      console.warn(
        `[ActionBar] ${mountedPrimaryCount} primary actions are mounted at once. ` +
          "Rule 4.4: the accent fires once per screen — at most one ActionBar's " +
          "primary should be rendered at a time."
      );
    }
    return () => {
      mountedPrimaryCount -= 1;
    };
  }, [hasPrimary]);
}

function ActionButton({
  action,
  variant,
}: {
  action: ActionBarAction;
  variant: "primary" | "secondary";
}) {
  const style: React.CSSProperties =
    variant === "primary"
      ? { background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }
      : {
          background: "transparent",
          color: "hsl(var(--foreground))",
          border: "1px solid hsl(var(--foreground))",
        };

  const className = "font-display text-[13px] font-semibold uppercase";
  const inner = <span style={{ letterSpacing: "0.18em" }}>{action.label}</span>;
  const commonStyle: React.CSSProperties = {
    ...style,
    height: 52,
    padding: "0 22px",
    borderRadius: 2,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  };

  if (action.href) {
    return (
      <Link href={action.href} className={className} style={commonStyle}>
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" onClick={action.onClick} className={className} style={commonStyle}>
      {inner}
    </button>
  );
}

export function ActionBar({
  primary,
  secondary,
}: {
  primary?: ActionBarAction;
  secondary?: ActionBarAction[];
}) {
  usePrimaryGuard(!!primary);

  return (
    <div className="flex items-center gap-3">
      {secondary?.map((action) => (
        <ActionButton key={action.label} action={action} variant="secondary" />
      ))}
      {primary && <ActionButton action={primary} variant="primary" />}
    </div>
  );
}
