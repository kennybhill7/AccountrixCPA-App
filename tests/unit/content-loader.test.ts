import { describe, it, expect, vi, beforeEach } from 'vitest'
import { hasData, getDataStats } from '@/lib/content-loader'
import fs from 'fs/promises'

// Mock fs module
vi.mock('fs/promises', () => ({
  default: {
    access: vi.fn(),
    readFile: vi.fn(),
  },
  access: vi.fn(),
  readFile: vi.fn(),
}))

const mockFs = vi.mocked(fs)

describe('Content Loader', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('hasData', () => {
    it('should return true when data files exist', async () => {
      mockFs.access.mockResolvedValue(undefined)
      
      const result = await hasData()
      
      expect(result).toBe(true)
      expect(mockFs.access).toHaveBeenCalledWith(expect.stringContaining('curriculum.json'))
      expect(mockFs.access).toHaveBeenCalledWith(expect.stringContaining('curriculum-index.json'))
    })

    it('should return false when data files do not exist', async () => {
      mockFs.access.mockRejectedValue(new Error('File not found'))
      
      const result = await hasData()
      
      expect(result).toBe(false)
    })
  })

  describe('getDataStats', () => {
    it('should return statistics when curriculum exists', async () => {
      const mockCurriculum = {
        m1: {
          title: 'Month 1',
          weeks: [
            {
              id: 'w1',
              flashcards: [{ front: 'Q1', back: 'A1' }, { front: 'Q2', back: 'A2' }],
              quiz: {
                questions: [
                  { q: 'Question 1', choices: ['A', 'B', 'C'], answer: 0 },
                  { q: 'Question 2', choices: ['A', 'B', 'C'], answer: 1 }
                ]
              }
            }
          ]
        },
        m2: {
          title: 'Month 2',
          weeks: [
            {
              id: 'w1',
              flashcards: [{ front: 'Q3', back: 'A3' }],
              quiz: {
                questions: [
                  { q: 'Question 3', choices: ['A', 'B', 'C'], answer: 2 }
                ]
              }
            }
          ]
        }
      }

      mockFs.readFile.mockResolvedValue(JSON.stringify(mockCurriculum))
      
      const result = await getDataStats()
      
      expect(result).toEqual({
        months: 2,
        weeks: 2,
        flashcards: 3,
        quizQuestions: 3
      })
    })

    it('should return null when curriculum cannot be loaded', async () => {
      mockFs.readFile.mockRejectedValue(new Error('File not found'))
      
      const result = await getDataStats()
      
      expect(result).toBe(null)
    })

    it('should handle empty curriculum', async () => {
      mockFs.readFile.mockResolvedValue('{}')
      
      const result = await getDataStats()
      
      expect(result).toEqual({
        months: 0,
        weeks: 0,
        flashcards: 0,
        quizQuestions: 0
      })
    })
  })
})