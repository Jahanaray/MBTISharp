import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { funnyMbtiDescriptions } from '../data/mbtiDescriptions'

interface QuizResult {
  MBTIType: string
  Scores: Record<string, number>
}

const TYPE_TITLES: Record<string, string> = {
  INTJ: 'result.intj', INTP: 'result.intp', ENTJ: 'result.entj', ENTP: 'result.entp',
  INFJ: 'result.infj', INFP: 'result.infp', ENFJ: 'result.enfj', ENFP: 'result.enfp',
  ISTJ: 'result.istj', ISFJ: 'result.isfj', ESFJ: 'result.esfj', ESTJ: 'result.estj',
  ISTP: 'result.istp', ISFP: 'result.isfp', ESFP: 'result.esfp', ESTP: 'result.estp'
}

function Result() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const [result, setResult] = useState<QuizResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [showFunny, setShowFunny] = useState(false)

  useEffect(() => {
    const mbtiType = searchParams.get('type')
    if (mbtiType) {
      setResult({
        MBTIType: mbtiType,
        Scores: { E: 8, I: 7, S: 6, N: 9, T: 7, F: 8, C: 5, P: 10 }
      })
      setLoading(false)
      return
    }

    const savedResult = localStorage.getItem('quizResult')
    if (savedResult) {
      setResult(JSON.parse(savedResult))
    }
    setLoading(false)
  }, [searchParams])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('result.loading', 'Loading your result...')}</p>
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
        <div className="container mx-auto px-4 text-center max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('result.noResult', 'No Result Found')}</h2>
            <p className="text-gray-600 mb-6">{t('result.takeQuizFirst', 'Take the quiz first to discover your personality type.')}</p>
            <Link to="/quiz" className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">
              {t('result.takeQuizNow', 'Take Quiz Now')}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const typeKey = result.MBTIType.toLowerCase()
  const dimensionLabels: Record<string, { en: string; fa: string }> = {
    intj: { en: 'Strategic, analytical, and independent', fa: 'استراتژیک، تحلیلی و مستقل' },
    intp: { en: 'Innovative, curious, and logical', fa: 'نوآور، کنجکاو و منطقی' },
    entj: { en: 'Bold, strategic, and natural leader', fa: 'جسور، استراتژیک و رهبر طبیعی' },
    entp: { en: 'Inventive, clever, and love debate', fa: 'خلاق، زیرک و عاشق بحث' },
    infj: { en: 'Insightful, principled, and passionate', fa: 'بینش‌مند، اصولی و پرشور' },
    infp: { en: 'Poetic, kind, and altruistic', fa: 'شاعر، مهربان و فداکار' },
    enfj: { en: 'Charismatic, inspiring leader', fa: 'کاریزماتیک، الهام‌بخش و رهبر' },
    enfp: { en: 'Enthusiastic, creative, and free-spirited', fa: 'پرشور، خلاق و آزاداندیش' },
    istj: { en: 'Responsible, thorough, and dependable', fa: 'مسئول، دقیق و قابل اعتماد' },
    isfj: { en: 'Dedicated, warm, and protective', fa: 'فداکار، گرم و محافظت‌کننده' },
    esfj: { en: 'Caring, sociable, and helpful', fa: 'مهربان، اجتماعی و کمک‌کننده' },
    estj: { en: 'Excellent administrator, organized', fa: 'مدیر عالی، سازمان‌یافته' },
    istp: { en: 'Bold, practical, and hands-on', fa: 'جسور، عملی و دست‌به‌کار' },
    isfp: { en: 'Flexible, artistic, and exploratory', fa: 'انعطاف‌پذیر، هنری و کاوشگر' },
    esfp: { en: 'Spontaneous, energetic, and fun', fa: 'خودجوش، پرانرژی و شاد' },
    estp: { en: 'Smart, energetic, and perceptive', fa: 'باهوش، پرانرژی و هوشیار' }
  }

  const traits: Record<string, string[]> = {
    intj: ['Strategic', 'Analytical', 'Independent', 'Determined'],
    intp: ['Innovative', 'Curious', 'Logical', 'Objective'],
    entj: ['Bold', 'Strategic', 'Leader', 'Efficient'],
    entp: ['Inventive', 'Clever', 'Debate', 'Resourceful'],
    infj: ['Insightful', 'Principled', 'Passionate', 'Compassionate'],
    infp: ['Poetic', 'Kind', 'Altruistic', 'Creative'],
    enfj: ['Charismatic', 'Inspiring', 'Leader', 'Empathetic'],
    enfp: ['Enthusiastic', 'Creative', 'Sociable', 'Spontaneous'],
    istj: ['Responsible', 'Thorough', 'Dependable', 'Practical'],
    isfj: ['Dedicated', 'Warm', 'Protective', 'Reliable'],
    esfj: ['Caring', 'Sociable', 'Helpful', 'Loyal'],
    estj: ['Organized', 'Loyal', 'Practical', 'Direct'],
    istp: ['Bold', 'Practical', 'Hands-on', 'Observant'],
    isfp: ['Flexible', 'Artistic', 'Exploratory', 'Sensitive'],
    esfp: ['Spontaneous', 'Energetic', 'Fun', 'Observant'],
    estp: ['Smart', 'Energetic', 'Perceptive', 'Practical']
  }

  const desc = t(`result.typeDescriptions.${typeKey}.desc`, '') || (typeof window !== 'undefined' && document.dir === 'rtl'
    ? (dimensionLabels[typeKey]?.fa || '')
    : (dimensionLabels[typeKey]?.en || ''))

  const dimensionNames = [
    { label: t('result.energy', 'Energy'), a: t('result.extraversion', 'Extraversion'), b: t('result.introversion', 'Introversion'), scoreA: result.Scores.E || 0, scoreB: result.Scores.I || 0 },
    { label: t('result.sensing', 'Sensing'), a: t('result.sensingLabel', 'Sensing'), b: t('result.intuition', 'Intuition'), scoreA: result.Scores.S || 0, scoreB: result.Scores.N || 0 },
    { label: t('result.thinking', 'Thinking'), a: t('result.thinkingLabel', 'Thinking'), b: t('result.feeling', 'Feeling'), scoreA: result.Scores.T || 0, scoreB: result.Scores.F || 0 },
    { label: t('result.lifestyle', 'Lifestyle'), a: t('result.judging', 'Judging'), b: t('result.perceiving', 'Perceiving'), scoreA: result.Scores.C || 0, scoreB: result.Scores.P || 0 }
  ]

  const currentTraits = traits[typeKey as keyof typeof traits] || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Result Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">{t('result.yourType', 'Your Personality Type')}</h2>
          <div className="text-7xl font-bold text-primary mb-3">{result.MBTIType}</div>
          <h3 className="text-2xl font-medium text-gray-900 mb-3">
            {t(TYPE_TITLES[result.MBTIType] || 'result.yourType', result.MBTIType)}
          </h3>
          <p className="text-gray-600 max-w-lg mx-auto mb-6">{desc}</p>
          
          {/* Funny Toggle */}
          {(() => {
            const descData = funnyMbtiDescriptions[result.MBTIType]
            if (!descData) return null
            const funnyTitle = t(`result.funnyTypeTitles.${result.MBTIType}`, descData.funnyTitle)
            const funnyDesc = t(`result.funnyTypeDescs.${result.MBTIType}`, descData.funnyDesc)
            const funnyTraits = descData.funnyTraits
            return (
              <>
                <button
                  onClick={() => setShowFunny(!showFunny)}
                  className="text-sm text-purple-600 hover:text-purple-700 underline mb-4 inline-block"
                >
                  {showFunny ? t('result.showSerious', 'Show serious description') : t('result.showFunny', 'Show funny description 🎭')}
                </button>
                {showFunny && (
                  <>
                    <h3 className="text-xl font-medium text-purple-700 mb-2 italic">{funnyTitle}</h3>
                    <p className="text-gray-600 max-w-lg mx-auto mb-4 italic">{funnyDesc}</p>
                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                      {funnyTraits.map((trait, i) => (
                        <span key={i} className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
                          {t(`result.funnyTraits.${result.MBTIType}.${i}`, trait)}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </>
            )
          })()}
          
          {/* Traits */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {currentTraits.map((trait, i) => (
              <span key={i} className="px-4 py-2 bg-blue-50 text-primary rounded-full text-sm font-medium">
                {t(`result.typeDescriptions.${typeKey}.traits.${i}`, trait)}
              </span>
            ))}
          </div>

          {/* Dimension Bars */}
          <div className="space-y-4 max-w-lg mx-auto">
            {dimensionNames.map(dim => {
              const total = dim.scoreA + dim.scoreB || 1
              const percentA = Math.round((dim.scoreA / total) * 100)
              const percentB = 100 - percentA
              const dominant = dim.scoreA >= dim.scoreB ? dim.a : dim.b

              return (
                <div key={dim.label}>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{dim.a}</span>
                    <span>{dim.label}</span>
                    <span>{dim.b}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 flex overflow-hidden">
                    <div className="bg-primary transition-all" style={{ width: `${percentA}%` }}></div>
                    <div className="bg-secondary transition-all" style={{ width: `${percentB}%` }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{t('result.dominant', 'Dominant')}: {dominant}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/dashboard" className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-center">
            {t('result.goToDashboard', 'Go to Dashboard')}
          </Link>
          <Link to="/quiz" className="px-6 py-3 bg-white text-primary border-2 border-primary rounded-lg hover:bg-blue-50 transition-colors font-medium text-center">
            {t('result.retakeQuiz', 'Retake Quiz')}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Result
