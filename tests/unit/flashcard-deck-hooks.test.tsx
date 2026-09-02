import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { FlashcardDeck } from "@/components/FlashcardDeck";

// Regression: the guards used to sit BEFORE the hooks, so an empty→populated
// deck changed the number of hooks between renders and crashed React with
// "Rendered more hooks than during the previous render". Hooks now run first.
describe("FlashcardDeck — stable hook order", () => {
  it("renders an empty deck gracefully (no crash)", () => {
    const { getByText } = render(<FlashcardDeck flashcardData={{ deck: "t", cards: [] }} />);
    expect(getByText(/no cards yet/i)).toBeTruthy();
  });

  it("survives an empty → populated transition without a hook-order error", () => {
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { rerender } = render(<FlashcardDeck flashcardData={{ deck: "t", cards: [] }} />);
    rerender(
      <FlashcardDeck flashcardData={{ deck: "t", cards: [{ front: "Q1", back: "A1" }] }} />
    );
    const logged = errSpy.mock.calls.flat().join(" ");
    expect(/rendered (more|fewer) hooks/i.test(logged)).toBe(false);
    errSpy.mockRestore();
  });
});
