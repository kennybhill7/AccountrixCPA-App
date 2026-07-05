import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useUserProgress } from '@/lib/store'
import { act, renderHook } from '@testing-library/react'

describe('User Progress Store', () => {
  beforeEach(() => {
    // Clear all mocks and localStorage before each test
    vi.clearAllMocks()
    localStorage.clear()

    // zustand stores are module singletons whose in-memory state survives across
    // `it` blocks; localStorage.clear() alone does not reset them. Reset the
    // tested fields to their initial values so each test starts clean.
    useUserProgress.setState({ xp: 0, hearts: 5, streak: 0, completedQuizzes: [], currentTheme: 'light', lastVisit: undefined })

    // Mock Date.now for consistent testing
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2023-01-01'))
  })
  
  afterEach(() => {
    vi.useRealTimers()
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useUserProgress())
    
    expect(result.current.xp).toBe(0)
    expect(result.current.hearts).toBe(5)
    expect(result.current.streak).toBe(0)
    expect(result.current.completedQuizzes).toEqual([])
    expect(result.current.currentTheme).toBe('light')
  })

  it('should add XP correctly', () => {
    const { result } = renderHook(() => useUserProgress())
    
    act(() => {
      result.current.addXP(50)
    })
    
    expect(result.current.xp).toBe(50)
  })

  it('should lose hearts correctly', () => {
    const { result } = renderHook(() => useUserProgress())
    
    act(() => {
      result.current.loseHeart()
    })
    
    expect(result.current.hearts).toBe(4)
  })

  it('should not go below 0 hearts', () => {
    const { result } = renderHook(() => useUserProgress())
    
    act(() => {
      // Lose all hearts
      for (let i = 0; i < 10; i++) {
        result.current.loseHeart()
      }
    })
    
    expect(result.current.hearts).toBe(0)
  })

  it('should calculate level correctly', () => {
    const { result } = renderHook(() => useUserProgress())
    
    act(() => {
      result.current.addXP(150) // Should be level 2
    })
    
    expect(result.current.getXPLevel()).toBe(2)
  })

  it('should calculate XP progress correctly', () => {
    const { result } = renderHook(() => useUserProgress())
    
    act(() => {
      result.current.addXP(250) // 50 XP into level 3
    })
    
    expect(result.current.getXPProgress()).toBe(50)
  })

  it('should complete quiz correctly', () => {
    const { result } = renderHook(() => useUserProgress())
    
    act(() => {
      result.current.completeQuiz('m1', 'w1', 8, 10) // 80% score
    })
    
    expect(result.current.completedQuizzes).toContain('m1:w1')
    expect(result.current.xp).toBe(30) // Good score XP
    expect(result.current.streak).toBe(1) // studying today advances the day streak
  })

  it('treats streak as a DAY streak: a failing quiz does not reset it, and same-day quizzes do not double-count', () => {
    const { result } = renderHook(() => useUserProgress())

    act(() => {
      result.current.completeQuiz('m1', 'w1', 4, 10) // 40% — a failing quiz
    })
    // Studying today counts even on a failure; streak is 1, NOT reset to 0.
    expect(result.current.streak).toBe(1)

    act(() => {
      result.current.completeQuiz('m2', 'w1', 9, 10) // another quiz, same day
    })
    // Day-based: a second quiz the same day does not bump the streak to 2.
    expect(result.current.streak).toBe(1)
  })

  it('should not allow duplicate quiz completions', () => {
    const { result } = renderHook(() => useUserProgress())
    
    act(() => {
      result.current.completeQuiz('m1', 'w1', 10, 10) // Perfect score
      result.current.completeQuiz('m1', 'w1', 5, 10) // Try to complete again
    })
    
    expect(result.current.completedQuizzes).toEqual(['m1:w1'])
    expect(result.current.xp).toBe(50) // Only perfect score XP, not added again
  })

  it('should increment streak correctly', () => {
    const { result } = renderHook(() => useUserProgress())
    
    act(() => {
      result.current.incrementStreak()
      result.current.incrementStreak()
    })
    
    expect(result.current.streak).toBe(2)
  })

  it('should reset streak correctly', () => {
    const { result } = renderHook(() => useUserProgress())
    
    act(() => {
      result.current.incrementStreak()
      result.current.incrementStreak()
      result.current.resetStreak()
    })
    
    expect(result.current.streak).toBe(0)
  })

  it('should toggle theme correctly', () => {
    const { result } = renderHook(() => useUserProgress())
    
    expect(result.current.currentTheme).toBe('light')
    
    act(() => {
      result.current.toggleTheme()
    })
    
    expect(result.current.currentTheme).toBe('dark')
    
    act(() => {
      result.current.toggleTheme()
    })
    
    expect(result.current.currentTheme).toBe('light')
  })

  it('should check if quiz is completed', () => {
    const { result } = renderHook(() => useUserProgress())
    
    expect(result.current.isQuizCompleted('m1', 'w1')).toBe(false)
    
    act(() => {
      result.current.completeQuiz('m1', 'w1', 10, 10)
    })
    
    expect(result.current.isQuizCompleted('m1', 'w1')).toBe(true)
    expect(result.current.isQuizCompleted('m1', 'w2')).toBe(false)
  })

  it('should check if user can take quiz', () => {
    const { result } = renderHook(() => useUserProgress())
    
    expect(result.current.canTakeQuiz()).toBe(true)
    
    act(() => {
      // Lose all hearts
      for (let i = 0; i < 5; i++) {
        result.current.loseHeart()
      }
    })
    
    expect(result.current.canTakeQuiz()).toBe(false)
  })
})