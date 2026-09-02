import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  heartsWithRefill,
  msUntilNextHeart,
  HEART_REFILL_MS,
  MAX_HEARTS,
  useUserProgress,
} from "@/lib/store";

const MIN = 60_000;
const T0 = 1_700_000_000_000; // arbitrary fixed anchor

describe("heartsWithRefill (pure refill math)", () => {
  it("refills nothing at 0 elapsed", () => {
    expect(heartsWithRefill({ hearts: 0, lastHeartLossAt: T0 }, T0)).toBe(0);
    expect(heartsWithRefill({ hearts: 3, lastHeartLossAt: T0 }, T0)).toBe(3);
  });

  it("refills nothing before the 30-minute mark", () => {
    expect(heartsWithRefill({ hearts: 0, lastHeartLossAt: T0 }, T0 + 29 * MIN)).toBe(0);
  });

  it("refills 1 heart at exactly 30 minutes", () => {
    expect(heartsWithRefill({ hearts: 0, lastHeartLossAt: T0 }, T0 + 30 * MIN)).toBe(1);
  });

  it("refills 3 hearts after 90 minutes", () => {
    expect(heartsWithRefill({ hearts: 0, lastHeartLossAt: T0 }, T0 + 90 * MIN)).toBe(3);
  });

  it("caps at 5 hearts no matter how long has elapsed", () => {
    expect(heartsWithRefill({ hearts: 0, lastHeartLossAt: T0 }, T0 + 600 * MIN)).toBe(MAX_HEARTS);
    expect(heartsWithRefill({ hearts: 4, lastHeartLossAt: T0 }, T0 + 90 * MIN)).toBe(MAX_HEARTS);
  });

  it("adds refill on top of remaining hearts", () => {
    expect(heartsWithRefill({ hearts: 2, lastHeartLossAt: T0 }, T0 + 60 * MIN)).toBe(4);
  });

  it("returns MAX_HEARTS when already full", () => {
    expect(heartsWithRefill({ hearts: 5, lastHeartLossAt: T0 }, T0)).toBe(MAX_HEARTS);
  });

  it("treats a missing timestamp as fully refilled (legacy state migration)", () => {
    // Users locked out by the pre-refill bug have hearts:0 and no timestamp —
    // they must not stay locked forever.
    expect(heartsWithRefill({ hearts: 0 }, T0)).toBe(MAX_HEARTS);
  });

  it("ignores a future timestamp (clock skew) instead of draining hearts", () => {
    expect(heartsWithRefill({ hearts: 2, lastHeartLossAt: T0 + 10 * MIN }, T0)).toBe(2);
  });
});

describe("msUntilNextHeart", () => {
  it("returns null when hearts are full", () => {
    expect(msUntilNextHeart({ hearts: 5, lastHeartLossAt: T0 }, T0)).toBeNull();
    expect(msUntilNextHeart({ hearts: 0 }, T0)).toBeNull(); // legacy -> effectively full
  });

  it("counts down within the 30-minute window", () => {
    expect(msUntilNextHeart({ hearts: 0, lastHeartLossAt: T0 }, T0)).toBe(HEART_REFILL_MS);
    expect(msUntilNextHeart({ hearts: 0, lastHeartLossAt: T0 }, T0 + 12 * MIN)).toBe(18 * MIN);
  });

  it("uses the remainder past already-credited refills", () => {
    // 40 min elapsed: 1 heart credited, next heart due at 60 min -> 20 min away.
    expect(msUntilNextHeart({ hearts: 0, lastHeartLossAt: T0 }, T0 + 40 * MIN)).toBe(20 * MIN);
  });
});

describe("store loseHeart / canTakeQuiz with time-based refill", () => {
  beforeEach(() => {
    localStorage.clear();
    useUserProgress.setState({ hearts: 5, lastHeartLossAt: undefined });
    vi.useFakeTimers();
    vi.setSystemTime(new Date(T0));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("stamps lastHeartLossAt when a heart is lost from full", () => {
    useUserProgress.getState().loseHeart();
    expect(useUserProgress.getState().hearts).toBe(4);
    expect(useUserProgress.getState().lastHeartLossAt).toBe(T0);
  });

  it("locks quizzes at 0 hearts but unlocks after 30 minutes", () => {
    for (let i = 0; i < 5; i++) useUserProgress.getState().loseHeart();
    expect(useUserProgress.getState().hearts).toBe(0);
    expect(useUserProgress.getState().canTakeQuiz()).toBe(false);

    vi.setSystemTime(new Date(T0 + 29 * MIN));
    expect(useUserProgress.getState().canTakeQuiz()).toBe(false);

    vi.setSystemTime(new Date(T0 + 30 * MIN));
    expect(useUserProgress.getState().canTakeQuiz()).toBe(true);
  });

  it("materializes accrued refills when spending a heart later", () => {
    for (let i = 0; i < 5; i++) useUserProgress.getState().loseHeart();
    // 90 minutes later: 3 hearts accrued; losing one leaves 2.
    vi.setSystemTime(new Date(T0 + 90 * MIN));
    useUserProgress.getState().loseHeart();
    expect(useUserProgress.getState().hearts).toBe(2);
    // Anchor advanced by the 3 credited refills, preserving partial progress.
    expect(useUserProgress.getState().lastHeartLossAt).toBe(T0 + 90 * MIN);
  });

  it("refillHearts restores full hearts and clears the anchor", () => {
    for (let i = 0; i < 5; i++) useUserProgress.getState().loseHeart();
    useUserProgress.getState().refillHearts();
    expect(useUserProgress.getState().hearts).toBe(MAX_HEARTS);
    expect(useUserProgress.getState().lastHeartLossAt).toBeUndefined();
    expect(useUserProgress.getState().canTakeQuiz()).toBe(true);
  });
});
