import { describe, it, expect, beforeEach } from 'vitest'
import { useUserProgress, useQuizResults, useCpaProgress, useFinanceProgress } from '@/lib/store'

/**
 * Regression: Finance lesson progress must stay track-isolated from CMA and
 * CPA. Finance should share global XP, but it must not inflate CMA completion
 * counts or appear in CPA results/profile sections.
 */
describe('Finance progress isolation (track-aware state)', () => {
  beforeEach(() => {
    localStorage.clear()
    useUserProgress.setState({ completedQuizzes: [], xp: 0, streak: 0, hearts: 5 })
    useQuizResults.setState({ results: [] })
    useCpaProgress.setState({ completedQuizzes: [], results: [] })
    useFinanceProgress.setState({ completedQuizzes: [], results: [] })
  })

  it('a completed Finance quiz does not change CMA or CPA completion counts', () => {
    useUserProgress.getState().completeQuiz('m1', 'w1', 8, 10)
    expect(useUserProgress.getState().completedQuizzes).toEqual(['m1:w1'])

    useFinanceProgress.getState().completeQuiz('finance-u1', 'w1', 9, 10)
    useFinanceProgress
      .getState()
      .addResult({ monthId: 'finance-u1', weekId: 'w1', score: 9, totalQuestions: 10 })

    expect(useUserProgress.getState().completedQuizzes).toEqual(['m1:w1'])
    expect(useUserProgress.getState().completedQuizzes).not.toContain('finance-u1:w1')
    expect(useQuizResults.getState().results).toHaveLength(0)
    expect(useCpaProgress.getState().results).toHaveLength(0)
    expect(useUserProgress.getState().isQuizCompleted('finance-u1', 'w1')).toBe(false)
  })

  it('the Finance result remains retrievable from the Finance store', () => {
    useFinanceProgress.getState().completeQuiz('finance-u2', 'w3', 7, 10)
    useFinanceProgress
      .getState()
      .addResult({ monthId: 'finance-u2', weekId: 'w3', score: 7, totalQuestions: 10 })

    expect(useFinanceProgress.getState().isQuizCompleted('finance-u2', 'w3')).toBe(true)
    const results = useFinanceProgress.getState().getResultsForWeek('finance-u2', 'w3')
    expect(results).toHaveLength(1)
    expect(results[0].score).toBe(7)
  })

  it('a Finance quiz awards global XP once per completed lesson', () => {
    const before = useUserProgress.getState().xp
    useFinanceProgress.getState().completeQuiz('finance-u1', 'w1', 10, 10)
    const afterFirst = useUserProgress.getState().xp

    expect(afterFirst).toBe(before + 50)

    useFinanceProgress.getState().completeQuiz('finance-u1', 'w1', 10, 10)
    expect(useUserProgress.getState().xp).toBe(afterFirst)
    expect(useFinanceProgress.getState().completedQuizzes).toEqual(['finance-u1:w1'])
  })
})
