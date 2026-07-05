import { describe, expect, it } from "vitest";
import {
  cardFromNote,
  draftCardFromNote,
  parseTags,
  type AnyNote,
} from "@/lib/noteActions";

describe("parseTags", () => {
  it("extracts inline hashtags, lowercased and deduped in order", () => {
    expect(parseTags("Watch the #WIP reclass on #leases and #wip again")).toEqual([
      "wip",
      "leases",
    ]);
  });

  it("supports digits and hyphens", () => {
    expect(parseTags("#asc-842 rules and #1031 exchanges")).toEqual(["asc-842", "1031"]);
  });

  it("returns empty for untagged text", () => {
    expect(parseTags("plain note with no tags")).toEqual([]);
  });

  it("does not treat mid-word hashes or bare # as tags", () => {
    expect(parseTags("C# is not a tag here: # ")).toEqual([]);
  });
});

describe("draftCardFromNote", () => {
  const note = (text: string): AnyNote => ({ id: "n1", createdAt: 1, text });

  it("splits multi-line notes at the first newline", () => {
    const d = draftCardFromNote(note("What is over/under billing?\nBilled minus earned revenue."));
    expect(d.front).toBe("What is over/under billing?");
    expect(d.back).toBe("Billed minus earned revenue.");
  });

  it("splits single-line notes at the first sentence", () => {
    const d = draftCardFromNote(
      note("NCI share equals sub NI times the outside percentage. Dividends are irrelevant.")
    );
    expect(d.front).toBe("NCI share equals sub NI times the outside percentage.");
    expect(d.back).toBe("Dividends are irrelevant.");
  });

  it("falls back to full-text back with truncated front", () => {
    const short = draftCardFromNote(note("DSCR floor 1.25x"));
    expect(short.front).toBe("DSCR floor 1.25x");
    expect(short.back).toBe("DSCR floor 1.25x");
  });
});

describe("cardFromNote", () => {
  it("tags lesson notes with their source track, route, and hashtag skills", () => {
    const note: AnyNote = {
      id: "ln-1",
      createdAt: 1,
      text: "PV factor confusion on #leases",
      monthId: "far-u1",
      weekId: "w2",
    };
    const card = cardFromNote(note, "Q", "A", 1000);
    expect(card.track).toBe("cpa");
    expect(card.href).toBe("/cpa/far-u1/w2");
    expect(card.skills).toEqual(["leases"]);
    expect(card.sourceId).toBe("custom:ln-1");
  });

  it("routes finance lesson notes to /finance", () => {
    const card = cardFromNote(
      { id: "ln-2", createdAt: 1, text: "x", monthId: "finance-u2", weekId: "w1" },
      "Q",
      "A",
      1000
    );
    expect(card.track).toBe("finance");
    expect(card.href).toBe("/finance/finance-u2/w1");
  });

  it("uses the capture path for smart notes", () => {
    const card = cardFromNote(
      { id: "sn-1", createdAt: 1, text: "y", path: "/apply/mbg/wip-schedule" },
      "Q",
      "A",
      1000
    );
    expect(card.href).toBe("/apply/mbg/wip-schedule");
    expect(card.track).toBe("cma");
  });
});
