import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(true)

  // Get authenticated user ID from token
  const getUserId = (): string | null => {
    const token = localStorage.getItem('authToken')
    if (!token) return null
    
    try {
      const payload = token.split('.')[1]
      if (payload) {
        const decoded = JSON.parse(atob(payload))
        return decoded.userId || decoded.nameidentifier || decoded.sub || decoded.unique_name || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
      }
    } catch {
      // Fallback to stored userId
      const stored = localStorage.getItem('userId')
      if (stored) return stored
    }
    return null
  }

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

    const userIdStr = getUserId()
    const userId = userIdStr || ''

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
        const normalized = {
          mbtiType: data.mbtiType || data.MBTIType,
          scores: data.scores || data.Scores || {}
        }
        localStorage.setItem('quizResult', JSON.stringify(normalized))
        navigate(`/result?type=${normalized.mbtiType}`)
      } else {
        const error = await response.json().catch(() => ({ message: 'Submission failed' }))
        alert(error.message || 'Submission failed')
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
