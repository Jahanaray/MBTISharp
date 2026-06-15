import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

interface MatchData {
  matchId: string
  userAId: string
  userBId: string
  status: string
  matchedAt: string
}

function Dashboard() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [mbtiType, setMbtiType] = useState<string>('Not completed')
  const [match, setMatch] = useState<MatchData | null>(null)
  const [loading, setLoading] = useState(true)
  const [matching, setMatching] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    // Get user from auth token
    const token = localStorage.getItem('authToken')
    if (!token) {
      navigate('/login')
      return
    }
    
    // Decode JWT to get user ID (simple base64 decode of payload)
    try {
      const payload = token.split('.')[1]
      if (payload) {
        const decoded = JSON.parse(atob(payload))
        const uid = decoded.nameidentifier || decoded.sub || decoded.unique_name
        if (uid) {
          setUserId(uid)
        }
      }
    } catch {
      // Fallback: use stored userId
      const stored = localStorage.getItem('userId')
      if (stored) setUserId(stored)
    }
  }, [navigate])

  useEffect(() => {
    if (userId) {
      fetchDashboardData(userId)
    }
  }, [userId])

  const fetchDashboardData = async (uid: string) => {
    try {
      const resultRes = await fetch(`/api/quiz/result/${uid}`)
      if (resultRes.ok) {
        const resultData = await resultRes.json()
        setMbtiType(resultData.MBTIType || 'Not completed')
      }

      const matchRes = await fetch(`/api/match/me/${uid}`)
      if (matchRes.ok) {
        const matchData = await matchRes.json()
        setMatch(matchData)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateMatch = async () => {
    if (!userId) return
    setMatching(true)
    try {
      const response = await fetch('/api/match/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })
      if (response.ok) {
        const data = await response.json()
        setMatch(data)
      }
    } catch (error) {
      console.error('Failed to create match:', error)
    } finally {
      setMatching(false)
    }
  }

  const mbtiDescriptions: Record<string, string> = {
    'INTJ': t('result.intj', 'The Architect - Strategic and analytical'),
    'INTP': t('result.intp', 'The Logician - Innovative and curious'),
    'ENTJ': t('result.entj', 'The Commander - Bold and strategic'),
    'ENTP': t('result.entp', 'The Debater - Inventive and clever'),
    'INFJ': t('result.infj', 'The Advocate - Insightful and principled'),
    'INFP': t('result.infp', 'The Mediator - Poetic and kind'),
    'ENFJ': t('result.enfj', 'The Protagonist - Charismatic and inspiring'),
    'ENFP': t('result.enfp', 'The Campaigner - Enthusiastic and creative'),
    'ISTJ': t('result.istj', 'The Logistician - Responsible and thorough'),
    'ISFJ': t('result.isfj', 'The Defender - Dedicated and warm'),
    'ESFJ': t('result.esfj', 'The Consul - Caring and sociable'),
    'ESTJ': t('result.estj', 'The Executive - Excellent administrator'),
    'ISTP': t('result.istp', 'The Virtuoso - Bold and practical'),
    'ISFP': t('result.isfp', 'The Adventurer - Flexible and artistic'),
    'ESFP': t('result.esfp', 'The Entertainer - Spontaneous and energetic'),
    'ESTP': t('result.estp', 'The Entrepreneur - Smart and energetic')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('dashboard.loading', 'Loading dashboard...')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.title', 'Your Dashboard')}</h1>
          <button
            onClick={() => { localStorage.removeItem('authToken'); navigate('/login') }}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* MBTI Result Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">{t('dashboard.myType', 'Your Personality Type')}</h2>
            <div className="text-6xl font-bold text-primary mb-3">{mbtiType}</div>
            <p className="text-gray-600">{mbtiDescriptions[mbtiType] || t('result.discoverType', 'Discover your type by taking the quiz!')}</p>
          </div>
        </div>

        {/* Action Card */}
        {!match ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">{t('dashboard.findMatch', 'Find Your Match')}</h2>
            <p className="text-gray-600 mb-6">{t('dashboard.getPaired', 'Get paired with someone compatible based on your personality type.')}</p>
            <button
              onClick={handleCreateMatch}
              disabled={matching}
              className="px-8 py-3 bg-accent text-white rounded-lg hover:bg-red-500 transition-colors font-medium disabled:opacity-50"
            >
              {matching ? t('dashboard.findingMatch', 'Finding match...') : t('dashboard.findMatchBtn', 'Find Match')}
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">{t('dashboard.yourMatch', 'Your Match')}</h2>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold">
                A
              </div>
              <div className="text-3xl text-accent">&#10084;</div>
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-white text-xl font-bold">
                B
              </div>
            </div>
            <div className="text-center">
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                match.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
              </span>
            </div>
            <div className="mt-6 text-center">
              <Link
                to="/chat"
                className="inline-block px-8 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                {t('dashboard.startChat', 'Start Chatting')}
              </Link>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Link to="/quiz" className="bg-white rounded-xl shadow p-6 text-center hover:shadow-lg transition-shadow">
            <h3 className="font-semibold text-gray-900 mb-1">{t('dashboard.retakeQuiz', 'Retake Quiz')}</h3>
            <p className="text-sm text-gray-600">{t('dashboard.testAgain', 'Test yourself again')}</p>
          </Link>
          <button className="bg-white rounded-xl shadow p-6 text-center hover:shadow-lg transition-shadow">
            <h3 className="font-semibold text-gray-900 mb-1">{t('dashboard.profile', 'Profile')}</h3>
            <p className="text-sm text-gray-600">{t('common.comingSoon', 'Coming soon')}</p>
          </button>
          <button className="bg-white rounded-xl shadow p-6 text-center hover:shadow-lg transition-shadow">
            <h3 className="font-semibold text-gray-900 mb-1">{t('dashboard.settings', 'Settings')}</h3>
            <p className="text-sm text-gray-600">{t('common.comingSoon', 'Coming soon')}</p>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
