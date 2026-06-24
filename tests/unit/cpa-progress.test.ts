import { describe, it, expect, beforeEach } from 'vitest'
import { useUserProgress, useQuizResults, useCpaProgress } from '@/lib/store'

/**
 * Regression: CPA quiz completions must be fully track-isolated from CMA
 * progress. A completed `far-u1:w1` quiz must NOT change CMA completion counts
 * (no inflation, no non-m{N} ids leaking into CMA state / profile labels), while
 * remaining retrievable from the CPA store. Guards the fix for Codex's blocker.
 */
describe('CPA progress isolation (track-aware state)', () => {
  beforeEach(() => {
    localStorage.clear()
    // zustand stores are module singletons — reset both tracks to a clean state.
    useUserProgress.setState({ completedQuizzes: [], xp: 0, streak: 0, hearts: 5 })
    useQuizResults.setState({ results: [] })
    useCpaProgress.setState({ completedQuizzes: [], results: [] })
  })

  it('a completed CPA quiz does not change CMA completion counts', () => {
    // Baseline: one genuine CMA quiz completed.
    useUserProgress.getState().completeQuiz('m1', 'w1', 8, 10)
    expect(useUserProgress.getState().completedQuizzes).toEqual(['m1:w1'])

    // Complete a CPA quiz through the isolated CPA store.
    useCpaProgress.getState().completeQuiz('far-u1', 'w1', 9, 10)
    useCpaProgress
      .getState()
      .addResult({ monthId: 'far-u1', weekId: 'w1', score: 9, totalQuestions: 10 })

    // CMA completion array is unchanged — no inflation, no `far-u1:w1` id.
    expect(useUserProgress.getState().completedQuizzes).toEqual(['m1:w1'])
    expect(useUserProgress.getState().completedQuizzes).not.toContain('far-u1:w1')
    // CMA quiz-results store (drives profile labels) never sees the CPA result.
    expect(useQuizResults.getState().results).toHaveLength(0)
    expect(useUserProgress.getState().isQuizCompleted('far-u1', 'w1')).toBe(false)
  })

  it('the CPA result remains retrievable from the CPA store', () => {
    useCpaProgress.getState().completeQuiz('far-u1', 'w1', 9, 10)
    useCpaProgress
      .getState()
      .addResult({ monthId: 'far-u1', weekId: 'w1', score: 9, totalQuestions: 10 })

    expect(useCpaProgress.getState().isQuizCompleted('far-u1', 'w1')).toBe(true)
    const results = useCpaProgress.getState().getResultsForWeek('far-u1', 'w1')
    expect(results).toHaveLength(1)
    expect(results[0].score).toBe(9)
  })

  it('a CPA quiz still awards global XP (track-agnostic)', () => {
    const before = useUserProgress.getState().xp
    useCpaProgress.getState().completeQuiz('far-u1', 'w1', 10, 10) // perfect → +50
    expect(useUserProgress.getState().xp).toBe(before + 50)
  })

  it('a CPA retake does not re-award the one-time completion XP bonus', () => {
    const before = useUserProgress.getState().xp
    useCpaProgress.getState().completeQuiz('far-u1', 'w1', 10, 10) // first completion → +50
    const afterFirst = useUserProgress.getState().xp
    expect(afterFirst).toBe(before + 50)

    // Retake the same quiz — the one-time bonus must NOT be awarded again.
    useCpaProgress.getState().completeQuiz('far-u1', 'w1', 10, 10)
    expect(useUserProgress.getState().xp).toBe(afterFirst)
    // And the completion is recorded exactly once.
    expect(useCpaProgress.getState().completedQuizzes).toEqual(['far-u1:w1'])
  })
})
