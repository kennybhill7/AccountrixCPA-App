/**
 * CPA Final Exam Simulator - Usage Examples
 *
 * This file demonstrates how to integrate and use the CPA Final Exam Simulator
 * in your Accountrix application.
 */

'use client';

import React from 'react';
import CPAFinalExamSimulator from './CPAFinalExamSimulator';

// ============================================================================
// EXAMPLE 1: Basic Integration - Standalone Exam Page
// ============================================================================

/**
 * Simple integration - just render the exam component
 * Use this for a dedicated exam page
 */
export function BasicExamPage() {
  return (
    <div className="min-h-screen">
      <CPAFinalExamSimulator />
    </div>
  );
}

// ============================================================================
// EXAMPLE 2: Conditional Access - Unlock After Course Completion
// ============================================================================

interface UserProgress {
  completedWeeks: number;
  totalWeeks: number;
  hasAccessToFinalExam: boolean;
}

export function ConditionalExamAccess() {
  // In real app, fetch from user progress store
  const userProgress: UserProgress = {
    completedWeeks: 24,
    totalWeeks: 24,
    hasAccessToFinalExam: true
  };

  if (!userProgress.hasAccessToFinalExam) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Exam Locked
          </h2>
          <p className="text-gray-600 mb-6">
            Complete all {userProgress.totalWeeks} weeks of curriculum to unlock
            the CPA Final Exam.
          </p>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-2">Your Progress</div>
            <div className="text-3xl font-bold text-blue-600">
              {userProgress.completedWeeks}/{userProgress.totalWeeks}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{
                  width: `${(userProgress.completedWeeks / userProgress.totalWeeks) * 100}%`
                }}
              />
            </div>
          </div>
          <button
            onClick={() => window.location.href = '/curriculum'}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg"
          >
            Continue Curriculum
          </button>
        </div>
      </div>
    );
  }

  return <CPAFinalExamSimulator />;
}

// ============================================================================
// EXAMPLE 3: Exam Dashboard - Show Previous Attempts
// ============================================================================

interface ExamAttempt {
  id: string;
  date: Date;
  score: number;
  passed: boolean;
  timeTaken: number;
}

export function ExamDashboard() {
  // In real app, fetch from localStorage or API
  const previousAttempts: ExamAttempt[] = [
    {
      id: 'exam-001',
      date: new Date('2025-01-15'),
      score: 165,
      passed: false,
      timeTaken: 9845
    },
    {
      id: 'exam-002',
      date: new Date('2025-01-20'),
      score: 186,
      passed: true,
      timeTaken: 9243
    }
  ];

  const [showExam, setShowExam] = React.useState(false);
  const canRetake = true; // In real app, check if 24 hours passed

  if (showExam) {
    return <CPAFinalExamSimulator />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            CPA Final Exam
          </h1>
          <p className="text-gray-600 mb-6">
            Comprehensive assessment to earn your Accountrix certification
          </p>

          {previousAttempts.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Previous Attempts
              </h2>
              <div className="space-y-3">
                {previousAttempts.map((attempt, idx) => (
                  <div
                    key={attempt.id}
                    className={`p-4 rounded-lg border-2 ${
                      attempt.passed
                        ? 'border-green-300 bg-green-50'
                        : 'border-red-300 bg-red-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-gray-900">
                          Attempt #{previousAttempts.length - idx}
                        </div>
                        <div className="text-sm text-gray-600">
                          {attempt.date.toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-2xl font-bold ${
                            attempt.passed ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {attempt.score}/230 ({Math.round((attempt.score / 230) * 100)}%)
                        </div>
                        <div
                          className={`text-sm font-semibold ${
                            attempt.passed ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {attempt.passed ? '✓ PASSED' : '✗ FAILED'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {previousAttempts.some(a => a.passed) ? (
            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6 text-center">
              <div className="text-6xl mb-3">🎓</div>
              <h3 className="text-2xl font-bold text-green-900 mb-2">
                Congratulations!
              </h3>
              <p className="text-green-800 mb-4">
                You have earned your Accountrix certification
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => {
                    // Download certificate
                    alert('Certificate download functionality');
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg"
                >
                  Download Certificate
                </button>
                {canRetake && (
                  <button
                    onClick={() => setShowExam(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg"
                  >
                    Retake to Improve Score
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div>
              {canRetake ? (
                <button
                  onClick={() => setShowExam(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold py-4 px-8 rounded-lg"
                >
                  {previousAttempts.length > 0 ? 'Retake Exam' : 'Start Exam'}
                </button>
              ) : (
                <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-3">⏰</div>
                  <h3 className="text-xl font-bold text-yellow-900 mb-2">
                    Please Wait 24 Hours
                  </h3>
                  <p className="text-yellow-800">
                    You can retake the exam 24 hours after your last attempt
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-3">
            Exam Information
          </h3>
          <ul className="space-y-2 text-blue-800">
            <li>• 100 questions covering all 24 weeks</li>
            <li>• 3-hour time limit</li>
            <li>• 80% passing score (184/230 points)</li>
            <li>• Multiple choice, true/false, calculations, and scenarios</li>
            <li>• Certificate awarded upon passing</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 4: Progress Integration - Update User Store After Completion
// ============================================================================

/**
 * Example showing how to handle exam completion and update user progress
 * In your real app, you'd integrate this with your state management solution
 */
export function ExamWithProgressTracking() {
  const handleExamComplete = React.useCallback((results: any) => {
    // Update user progress store
    console.log('Exam completed with results:', results);

    // Example: Save to your state management
    // userProgressStore.updateExamResults({
    //   examId: results.examId,
    //   score: results.score,
    //   passed: results.passed,
    //   completionDate: new Date(),
    //   certificateData: results.certificateData
    // });

    // Award XP
    if (results.passed) {
      const baseXP = 200;
      const bonusXP = Math.floor((results.percentage - 80) * 5);
      const totalXP = baseXP + bonusXP;

      console.log(`Awarding ${totalXP} XP to user`);
      // userProgressStore.addXP(totalXP);
    }

    // Unlock badge
    if (results.passed) {
      console.log('Unlocking "Certified" badge');
      // badgeStore.unlockBadge('accountrix-certified');
    }

    // Save to localStorage
    localStorage.setItem('cpa-exam-latest-results', JSON.stringify(results));

    // Optional: Send to backend API
    // await fetch('/api/exam-results', {
    //   method: 'POST',
    //   body: JSON.stringify(results)
    // });
  }, []);

  return (
    <div>
      <CPAFinalExamSimulator />
      {/* In the real component, you'd pass handleExamComplete as a prop */}
    </div>
  );
}

// ============================================================================
// EXAMPLE 5: Admin View - Question Bank Management
// ============================================================================

export function AdminQuestionBankView() {
  const [questions, setQuestions] = React.useState<any[]>([]);
  const [filter, setFilter] = React.useState({
    topic: 'all',
    difficulty: 'all',
    type: 'all'
  });

  React.useEffect(() => {
    // In real app, load from database or question bank file
    // setQuestions(EXAM_QUESTIONS);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            CPA Exam Question Bank
          </h1>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Filter by Topic
              </label>
              <select
                value={filter.topic}
                onChange={(e) => setFilter({ ...filter, topic: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="all">All Topics</option>
                <option value="Construction CFO Fundamentals">Construction CFO</option>
                <option value="COA & Financial Statements">COA & Financials</option>
                <option value="Job Costing">Job Costing</option>
                <option value="Multi-Entity Accounting">Multi-Entity</option>
                <option value="Payroll & Taxes">Payroll & Taxes</option>
                <option value="Advanced Topics">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Filter by Difficulty
              </label>
              <select
                value={filter.difficulty}
                onChange={(e) => setFilter({ ...filter, difficulty: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="expert">Expert</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Filter by Type
              </label>
              <select
                value={filter.type}
                onChange={(e) => setFilter({ ...filter, type: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="all">All Types</option>
                <option value="multiple-choice">Multiple Choice</option>
                <option value="true-false">True/False</option>
                <option value="multiple-select">Multiple Select</option>
                <option value="fill-blank">Fill Blank</option>
                <option value="scenario">Scenario</option>
              </select>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">100</div>
                <div className="text-sm text-gray-600">Total Questions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">230</div>
                <div className="text-sm text-gray-600">Total Points</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">6</div>
                <div className="text-sm text-gray-600">Topics Covered</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">5</div>
                <div className="text-sm text-gray-600">Question Types</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {/* Question list would go here */}
            <div className="text-center text-gray-500 py-8">
              Question list view (connect to question bank data)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 6: Study Mode Integration
// ============================================================================

export function StudyModeWithExam() {
  const [mode, setMode] = React.useState<'study' | 'practice' | 'certification'>('study');

  return (
    <div className="min-h-screen bg-gray-50">
      {mode === 'study' ? (
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Final Exam Preparation
            </h1>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <button
                onClick={() => setMode('study')}
                className="p-4 border-2 border-blue-600 bg-blue-50 rounded-lg"
              >
                <div className="text-4xl mb-2">📚</div>
                <div className="font-bold">Study Mode</div>
                <div className="text-sm text-gray-600">Review concepts</div>
              </button>

              <button
                onClick={() => setMode('practice')}
                className="p-4 border-2 border-gray-300 hover:border-green-400 rounded-lg"
              >
                <div className="text-4xl mb-2">✏️</div>
                <div className="font-bold">Practice Exam</div>
                <div className="text-sm text-gray-600">Untimed, with feedback</div>
              </button>

              <button
                onClick={() => setMode('certification')}
                className="p-4 border-2 border-gray-300 hover:border-purple-400 rounded-lg"
              >
                <div className="text-4xl mb-2">🎓</div>
                <div className="font-bold">Certification Exam</div>
                <div className="text-sm text-gray-600">Official 3-hour test</div>
              </button>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
              <h3 className="font-bold text-yellow-900 mb-2">
                Recommended Study Path
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-yellow-800">
                <li>Review all 24 weeks of curriculum</li>
                <li>Complete practice quizzes for each module</li>
                <li>Take practice exam in study mode</li>
                <li>Review weak areas</li>
                <li>Take official certification exam</li>
              </ol>
            </div>
          </div>
        </div>
      ) : (
        <CPAFinalExamSimulator />
      )}
    </div>
  );
}

// ============================================================================
// EXPORT ALL EXAMPLES
// ============================================================================

export default {
  BasicExamPage,
  ConditionalExamAccess,
  ExamDashboard,
  ExamWithProgressTracking,
  AdminQuestionBankView,
  StudyModeWithExam
};
