'use client'

import { useState } from 'react'
import { supabase, Note, QuizQuestion } from '@/lib/supabase'

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

  const handleFinishQuiz = async () => {
    // Check if all questions are answered
    if (Object.keys(selectedAnswers).length < quiz.length) {
      alert('Please answer all questions before submitting the quiz.')
      return
    }

    // Confirm submission
    const confirmed = window.confirm('Are you sure you want to submit your quiz? You will not be able to change your answers after submission.')
    
    if (confirmed) {
      setShowResults(true)
      
      // Save quiz results to database
      try {
        const { correct, total } = calculateScore()
        const questionsWithAnswers = quiz.map((q, index) => ({
          question: q.question,
          userAnswer: q.options[selectedAnswers[index]],
          correctAnswer: q.options[q.correct_answer],
          correct: selectedAnswers[index] === q.correct_answer,
        }))

        const { error } = await supabase
          .from('quiz_results')
          .insert([{
            class_id: classId,
            score: correct,
            total_questions: total,
            questions: questionsWithAnswers,
          }])

        if (error) {
          console.error('Error saving quiz results:', error)
        }
      } catch (error) {
        console.error('Error saving quiz results:', error)
      }
    }
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full h-[90vh] max-w-7xl flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Quiz</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {quiz.length === 0 && !isGenerating && (
            <div className="text-center py-16">
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
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
              <p className="text-gray-600">Generating quiz from your notes...</p>
            </div>
          )}

          {quiz.length > 0 && (
            <div className="flex h-full">
              {/* Notes Panel */}
              <div className="w-1/3 border-r border-gray-200 flex flex-col">
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Your Notes</h3>
                  <p className="text-sm text-gray-600">{notes.length} {notes.length === 1 ? 'note' : 'notes'}</p>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {notes.map((note, index) => (
                    <div key={note.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                      <p className="text-sm text-gray-800 whitespace-pre-wrap">{note.content}</p>
                      {index < notes.length - 1 && <div className="mt-4 border-t border-gray-100"></div>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quiz Panel */}
              <div className="w-2/3 flex flex-col">
                <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                  <div>
                    <p className="text-gray-600">
                      {quiz.length} {quiz.length === 1 ? 'question' : 'questions'}
                    </p>
                    {showResults && (
                      <div className="text-lg font-semibold text-indigo-600 mt-1">
                        Score: {score.correct}/{score.total} ({Math.round((score.correct / score.total) * 100)}%)
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleGenerateQuiz}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                    disabled={isGenerating}
                  >
                    Regenerate Quiz
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-6 max-w-3xl mx-auto">
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
                              : 'border-gray-200 bg-white'
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
                                      ? 'bg-indigo-50 border-indigo-500'
                                      : 'bg-gray-50 border-gray-200 hover:border-indigo-300'
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

                {/* Finish Quiz Button */}
                {!showResults && (
                  <div className="p-6 border-t border-gray-200 bg-gray-50">
                    <div className="max-w-3xl mx-auto flex justify-between items-center">
                      <p className="text-sm text-gray-600">
                        Answered: {Object.keys(selectedAnswers).length} / {quiz.length}
                      </p>
                      <button
                        onClick={handleFinishQuiz}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm"
                      >
                        Finish Quiz
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
