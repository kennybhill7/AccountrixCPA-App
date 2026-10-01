import type { ReactNode } from "react";

/**
 * Replaces every <table> and every stat list. Negatives are parenthesized,
 * never a minus sign. Row height stays 36-40px regardless of density —
 * density comes from structure (more rows, a real total), not smaller type.
 */
export interface LedgerColumn {
  key: string;
  label: string;
  align?: "left" | "right";
  /** Numeric columns get .ledger-number, tabular figures, right alignment by
   * default, and parenthesized negatives. */
  numeric?: boolean;
  unit?: "$" | "%" | "days" | "";
  width?: string;
}

export interface LedgerRow {
  id: string;
  cells: Record<string, ReactNode | number | null | undefined>;
  /** subtotal = foreground top rule + secondary fill + weight 600.
   * total = 3px double foreground top rule. */
  kind?: "normal" | "subtotal" | "total";
}

function formatCell(value: ReactNode | number | null | undefined, unit?: string): ReactNode {
  if (typeof value !== "number") return value ?? "";
  const negative = value < 0;
  const abs = Math.abs(value);
  const body =
    unit === "$"
      ? abs.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : abs.toLocaleString();
  const withUnit = unit === "$" ? `$${body}` : unit ? `${body} ${unit}` : body;
  return negative ? `(${withUnit})` : withUnit;
}

export function LedgerTable({ columns, rows }: { columns: LedgerColumn[]; rows: LedgerRow[] }) {
  return (
    <table className="w-full border-collapse">
      <colgroup>
        {columns.map((c) => (
          <col key={c.key} style={c.width ? { width: c.width } : undefined} />
        ))}
      </colgroup>
      <thead>
        <tr style={{ borderBottom: "1px solid hsl(var(--foreground))" }}>
          {columns.map((c) => (
            <th
              key={c.key}
              className="blueprint-label px-3 py-2 font-normal"
              style={{ textAlign: c.align ?? (c.numeric ? "right" : "left") }}
            >
              {c.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => {
          const isSubtotal = row.kind === "subtotal";
          const isTotal = row.kind === "total";
          return (
            <tr
              key={row.id}
              style={{
                height: 38,
                borderTop: isTotal
                  ? "3px double hsl(var(--foreground))"
                  : isSubtotal
                    ? "1px solid hsl(var(--foreground))"
                    : "1px solid hsl(var(--border))",
                background: isSubtotal || isTotal ? "hsl(var(--secondary))" : undefined,
                fontWeight: isSubtotal || isTotal ? 600 : undefined,
              }}
            >
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={`px-3 ${c.numeric ? "ledger-number text-[15px]" : "text-sm"}`}
                  style={{ textAlign: c.align ?? (c.numeric ? "right" : "left") }}
                >
                  {c.numeric ? formatCell(row.cells[c.key], c.unit) : row.cells[c.key]}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
