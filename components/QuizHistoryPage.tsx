'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface QuizResult {
  id: string
  class_id: string
  class_name: string
  score: number
  total_questions: number
  created_at: string
  questions: any[]
  status?: string
  scheduled_date?: string
}

export default function QuizHistoryPage() {
  const [quizResults, setQuizResults] = useState<QuizResult[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedQuiz, setSelectedQuiz] = useState<QuizResult | null>(null)

  useEffect(() => {
    fetchQuizHistory()
  }, [])

  const fetchQuizHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('quiz_results')
        .select(`
          *,
          classes (name)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      const formattedData = data?.map((item: any) => ({
        id: item.id,
        class_id: item.class_id,
        class_name: item.classes?.name || 'Unknown Class',
        score: item.score,
        total_questions: item.total_questions,
        created_at: item.created_at,
        questions: item.questions || [],
        status: item.status || 'completed',
        scheduled_date: item.scheduled_date,
      })) || []

      setQuizResults(formattedData)
    } catch (error) {
      console.error('Error fetching quiz history:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const calculatePercentage = (score: number, total: number) => {
    return Math.round((score / total) * 100)
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 bg-green-50 border-green-200'
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-red-600 bg-red-50 border-red-200'
  }

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading quiz history...</div>
        </div>
      </div>
    )
  }

  const completedQuizzes = quizResults.filter(q => q.status === 'completed')
  const scheduledQuizzes = quizResults.filter(q => q.status === 'scheduled')

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz History</h1>
        <p className="text-gray-600">Review your past quiz performances and track your progress</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-4">
          <button className="px-4 py-2 font-medium text-indigo-600 border-b-2 border-indigo-600">
            Completed ({completedQuizzes.length})
          </button>
          <button className="px-4 py-2 font-medium text-gray-600 hover:text-gray-900">
            Scheduled ({scheduledQuizzes.length})
          </button>
        </div>
      </div>

      {/* Scheduled Quizzes Section */}
      {scheduledQuizzes.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Quizzes</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {scheduledQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-white rounded-xl shadow-sm border-2 border-indigo-200 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{quiz.class_name}</h3>
                    <p className="text-sm text-gray-500">
                      {quiz.scheduled_date && formatDate(quiz.scheduled_date)}
                    </p>
                  </div>
                  <div className="px-3 py-1 rounded-full border-2 border-indigo-600 text-indigo-600 text-sm font-semibold">
                    Scheduled
                  </div>
                </div>
                <p className="text-sm text-gray-600">Quiz reminder has been set</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Quizzes Section */}
      {completedQuizzes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
          <svg className="w-20 h-20 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-600 text-lg mb-2">No completed quizzes yet</p>
          <p className="text-gray-500">Take your first quiz to see results here</p>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Completed Quizzes</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {completedQuizzes.map((quiz) => {
            const percentage = calculatePercentage(quiz.score, quiz.total_questions)
            const scoreColorClass = getScoreColor(percentage)

            return (
              <div
                key={quiz.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedQuiz(quiz)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{quiz.class_name}</h3>
                    <p className="text-sm text-gray-500">{formatDate(quiz.created_at)}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full border text-sm font-semibold ${scoreColorClass}`}>
                    {percentage}%
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Score</span>
                    <span className="font-semibold text-gray-900">
                      {quiz.score} / {quiz.total_questions}
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        percentage >= 80
                          ? 'bg-green-500'
                          : percentage >= 60
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Questions</span>
                    <span className="text-gray-900">{quiz.total_questions}</span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedQuiz(quiz)
                  }}
                  className="mt-4 w-full px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium"
                >
                  View Details
                </button>
              </div>
            )
            })}
          </div>
        </div>
      )}

      {/* Quiz Detail Modal */}
      {selectedQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedQuiz.class_name}</h2>
                <p className="text-sm text-gray-500">{formatDate(selectedQuiz.created_at)}</p>
              </div>
              <button
                onClick={() => setSelectedQuiz(null)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="bg-indigo-50 rounded-lg p-4 mb-6 border border-indigo-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Final Score</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {selectedQuiz.score} / {selectedQuiz.total_questions}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-1">Percentage</p>
                    <p className="text-3xl font-bold text-indigo-600">
                      {calculatePercentage(selectedQuiz.score, selectedQuiz.total_questions)}%
                    </p>
                  </div>
                </div>
              </div>

              {selectedQuiz.questions && selectedQuiz.questions.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Questions & Answers</h3>
                  <div className="space-y-4">
                    {selectedQuiz.questions.map((q: any, index: number) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <p className="font-semibold text-gray-900 mb-2">
                          {index + 1}. {q.question}
                        </p>
                        <div className="space-y-2 text-sm">
                          <p className="text-gray-600">
                            <span className="font-medium">Your answer:</span>{' '}
                            <span className={q.correct ? 'text-green-600' : 'text-red-600'}>
                              {q.userAnswer}
                            </span>
                          </p>
                          {!q.correct && (
                            <p className="text-gray-600">
                              <span className="font-medium">Correct answer:</span>{' '}
                              <span className="text-green-600">{q.correctAnswer}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
