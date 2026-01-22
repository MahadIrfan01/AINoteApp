'use client'

import { useState } from 'react'
import { Note, QuizQuestion } from '@/lib/supabase'

interface QuizGeneratorProps {
  isOpen: boolean
  onClose: () => void
  classId: string
  notes: Note[]
}

export default function QuizGenerator({ isOpen, onClose, classId, notes }: QuizGeneratorProps) {
  const [quiz, setQuiz] = useState<QuizQuestion[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({})
  const [showResults, setShowResults] = useState(false)

  if (!isOpen) return null

  const handleGenerateQuiz = async () => {
    if (notes.length === 0) {
      alert('Please add some notes first before generating a quiz.')
      return
    }

    setIsGenerating(true)
    setShowResults(false)
    setSelectedAnswers({})

    try {
      const allNotes = notes.map(n => n.content).join('\n\n')
      
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notes: allNotes,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate quiz')
      }

      const data = await response.json()
      setQuiz(data.questions || [])
    } catch (error) {
      console.error('Error generating quiz:', error)
      alert('Failed to generate quiz. Please make sure you have set up your Gemini API key.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answerIndex,
    })
  }

  const calculateScore = () => {
    let correct = 0
    quiz.forEach((q, index) => {
      if (selectedAnswers[index] === q.correct_answer) {
        correct++
      }
    })
    return { correct, total: quiz.length }
  }

  const score = quiz.length > 0 ? calculateScore() : { correct: 0, total: 0 }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full p-6 my-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Generate Quiz</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {quiz.length === 0 && !isGenerating && (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              Generate a quiz based on your notes using AI
            </p>
            <button
              onClick={handleGenerateQuiz}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Generate Quiz
            </button>
          </div>
        )}

        {isGenerating && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-600">Generating quiz from your notes...</p>
          </div>
        )}

        {quiz.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-600">
                {quiz.length} {quiz.length === 1 ? 'question' : 'questions'}
              </p>
              {showResults && (
                <div className="text-lg font-semibold">
                  Score: {score.correct}/{score.total}
                </div>
              )}
              <div className="flex gap-2">
                {!showResults && Object.keys(selectedAnswers).length === quiz.length && (
                  <button
                    onClick={() => setShowResults(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    Check Answers
                  </button>
                )}
                <button
                  onClick={handleGenerateQuiz}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                  disabled={isGenerating}
                >
                  Regenerate
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {quiz.map((question, qIndex) => {
                const isCorrect = selectedAnswers[qIndex] === question.correct_answer
                const showAnswer = showResults

                return (
                  <div
                    key={qIndex}
                    className={`border rounded-lg p-4 ${
                      showAnswer
                        ? isCorrect
                          ? 'border-green-500 bg-green-50'
                          : 'border-red-500 bg-red-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <h3 className="font-semibold text-gray-900 mb-3">
                      {qIndex + 1}. {question.question}
                    </h3>
                    <div className="space-y-2">
                      {question.options.map((option, oIndex) => {
                        const isSelected = selectedAnswers[qIndex] === oIndex
                        const isCorrectOption = oIndex === question.correct_answer

                        return (
                          <label
                            key={oIndex}
                            className={`block p-3 rounded-lg border cursor-pointer transition-colors ${
                              showAnswer && isCorrectOption
                                ? 'bg-green-100 border-green-500'
                                : showAnswer && isSelected && !isCorrect
                                ? 'bg-red-100 border-red-500'
                                : isSelected
                                ? 'bg-primary-50 border-primary-500'
                                : 'bg-gray-50 border-gray-200 hover:border-primary-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`question-${qIndex}`}
                              value={oIndex}
                              checked={isSelected}
                              onChange={() => handleAnswerSelect(qIndex, oIndex)}
                              disabled={showResults}
                              className="mr-2"
                            />
                            {option}
                          </label>
                        )
                      })}
                    </div>
                    {showAnswer && question.explanation && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <strong>Explanation:</strong> {question.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
