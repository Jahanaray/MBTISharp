import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

interface Question {
  id: number
  text: string
  dimension: string
  optionA: string
  optionB: string
  weightA: number
  weightB: number
}

function Quiz() {
  const { t } = useTranslation()
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState<{ MBTIType: string; Scores: Record<string, number> } | null>(null)

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/quiz/questions')
      if (response.ok) {
        const data = await response.json()
        setQuestions(data)
      }
    } catch (error) {
      console.error('Failed to fetch questions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = (option: string) => {
    if (questions[currentIndex]) {
      setAnswers(prev => ({
        ...prev,
        [questions[currentIndex].id]: option
      }))
    }
  }

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      alert(t('quiz.pleaseAnswerAll', 'Please answer all questions before submitting.'))
      return
    }

    const userId = crypto.randomUUID()
    const answersArray = Object.entries(answers).map(([questionId, selectedOption]) => ({
      questionId: parseInt(questionId),
      selectedOption
    }))

    try {
      const response = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, answers: answersArray })
      })

      if (response.ok) {
        const data = await response.json()
        setResult(data)
        setSubmitted(true)
      }
    } catch (error) {
      console.error('Failed to submit quiz:', error)
    }
  }

  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('quiz.loading', 'Loading questions...')}</p>
        </div>
      </div>
    )
  }

  if (submitted && result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('result.title', 'Your Personality Type')}</h2>
            <div className="text-6xl font-bold text-primary mb-6">{result.MBTIType}</div>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              {Object.entries(result.Scores).map(([dimension, score]) => (
                <div key={dimension} className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">{dimension}</div>
                  <div className="text-xl font-semibold text-gray-900">{score}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                {t('result.backToHome', 'Back to Home')}
              </Link>
              <Link
                to="/login"
                className="px-6 py-3 bg-white text-primary border-2 border-primary rounded-lg hover:bg-blue-50 transition-colors font-medium"
              >
                {t('result.signInToSave', 'Sign In to Save')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('quiz.noQuestions', 'No Questions Available')}</h2>
          <p className="text-gray-600 mb-6">{t('quiz.tryAgainLater', 'Please try again later.')}</p>
          <Link to="/" className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">
            {t('common.goHome', 'Go Home')}
          </Link>
        </div>
      </div>
    )
  }

  const question = questions[currentIndex]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>{t('quiz.progress', 'Question {{current}} of {{total}}', { current: currentIndex + 1, total: questions.length })}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <span className="inline-block px-3 py-1 bg-blue-100 text-primary text-sm font-medium rounded-full mb-4">
            {question.dimension}
          </span>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">{question.text}</h2>

          <div className="space-y-4">
            <button
              onClick={() => handleAnswer(question.optionA)}
              className={`w-full text-start p-4 rounded-xl border-2 transition-all ${
                answers[question.id] === question.optionA
                  ? 'border-primary bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-6 h-6 rounded-full border-2 me-3 flex items-center justify-center ${
                  answers[question.id] === question.optionA
                    ? 'border-primary bg-primary'
                    : 'border-gray-300'
                }`}>
                  {answers[question.id] === question.optionA && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span className="text-gray-900 font-medium">{question.optionA}</span>
              </div>
            </button>

            <button
              onClick={() => handleAnswer(question.optionB)}
              className={`w-full text-start p-4 rounded-xl border-2 transition-all ${
                answers[question.id] === question.optionB
                  ? 'border-primary bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-6 h-6 rounded-full border-2 me-3 flex items-center justify-center ${
                  answers[question.id] === question.optionB
                    ? 'border-primary bg-primary'
                    : 'border-gray-300'
                }`}>
                  {answers[question.id] === question.optionB && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span className="text-gray-900 font-medium">{question.optionB}</span>
              </div>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="px-6 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('quiz.previous', 'Previous')}
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              {t('quiz.next', 'Next')}
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-red-500 transition-colors font-medium"
            >
              {t('quiz.submit', 'Submit Quiz')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Quiz
