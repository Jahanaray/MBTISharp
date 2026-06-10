import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { isContentSafe } from '../utils/safetyFilter'

type Step = 'phone' | 'otp' | 'success'

function Login() {
  const { t } = useTranslation()
  const [step, setStep] = useState<Step>('phone')
  const [fullName, setFullName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [city, setCity] = useState('')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [latitude, setLatitude] = useState<number | undefined>()
  const [longitude, setLongitude] = useState<number | undefined>()
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [allowChat, setAllowChat] = useState(true)
  const [allowMeetInPerson, setAllowMeetInPerson] = useState(false)
  const [allowCallVerification, setAllowCallVerification] = useState(false)
  const [interestedMBTIs, setInterestedMBTIs] = useState<string[]>([])
  const [contentError, setContentError] = useState('')
  const [otp, setOtp] = useState('')

  const mbtiTypes = ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESFJ', 'ESTJ', 'ISTP', 'ISFP', 'ESFP', 'ESTP']

  const toggleMBTI = (type: string) => {
    setInterestedMBTIs(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError(t('auth.geolocationNotSupported', 'Geolocation is not supported by your browser.'))
      return
    }
    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude)
        setLongitude(position.coords.longitude)
        setError('')
        setLoading(false)
      },
      () => {
        setError(t('auth.locationDenied', 'Location access was denied. Please enable it in settings.'))
        setLoading(false)
      }
    )
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phoneNumber.trim()) {
      setError(t('auth.enterPhone', 'Please enter a phone number.'))
      return
    }
    // Client-side safety filter validation (T104-T105)
    setContentError('')
    if (fullName.trim() && !isContentSafe(fullName.trim())) {
      setContentError(t('auth.contentUnsafe', 'Your name contains inappropriate language.'))
      return
    }
    if (city.trim() && !isContentSafe(city.trim())) {
      setContentError(t('auth.contentUnsafe', 'Your city name contains inappropriate language.'))
      return
    }
    setLoading(true)
    setError('')
    try {
      const body: BodyInit | null = photoFile
        ? (() => {
            const formData = new FormData()
            formData.append('phoneNumber', phoneNumber)
            formData.append('fullName', fullName)
            formData.append('city', city)
            formData.append('termsAccepted', termsAccepted.toString())
            formData.append('allowChat', allowChat.toString())
            formData.append('allowMeetInPerson', allowMeetInPerson.toString())
            formData.append('allowCallVerification', allowCallVerification.toString())
            if (interestedMBTIs.length) formData.append('interestedMBTIs', interestedMBTIs.join(','))
            if (latitude) formData.append('latitude', latitude.toString())
            if (longitude) formData.append('longitude', longitude.toString())
            if (photoFile) formData.append('photo', photoFile)
            return formData
          })()
        : JSON.stringify({ phoneNumber, fullName, city, latitude, longitude, termsAccepted, allowChat, allowMeetInPerson, allowCallVerification, interestedMBTIs: interestedMBTIs.join(',') })
      
      const headers: HeadersInit = photoFile
        ? {}
        : { 'Content-Type': 'application/json' }
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers,
        body
      })
      if (response.ok) {
        setStep('otp')
      } else {
        setError(t('auth.otpFailed', 'Failed to send OTP. Please try again.'))
      }
    } catch {
      setError(t('auth.networkError', 'Network error. Please check your connection.'))
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp.trim()) {
      setError(t('auth.enterOtp', 'Please enter the OTP.'))
      return
    }
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, otp })
      })
      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('authToken', data.token)
        setStep('success')
      } else {
        setError(t('auth.invalidOtp', 'Invalid OTP. Please try again.'))
      }
    } catch {
      setError(t('auth.networkError', 'Network error. Please check your connection.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <Link to="/" className="text-center block mb-8">
          <span className="text-2xl font-bold text-gray-900">MBTI </span>
          <span className="text-2xl font-bold text-primary">Match</span>
        </Link>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {step === 'phone' && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">{t('auth.signIn', 'Sign In')}</h2>
              <p className="text-gray-600 mb-6 text-center">{t('auth.enterPhoneDesc', 'Enter your phone number to receive an OTP.')}</p>
              
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('auth.fullName', 'Full Name')}
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t('auth.enterFullName', 'Enter your full name')}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('auth.city', 'City')}
                  </label>
                  <input
                    id="city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder={t('auth.enterCity', 'Enter your city')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('auth.profilePhoto', 'Profile Photo')}
                  </label>
                  <input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) setPhotoFile(file)
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-blue-600"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{t('auth.location', 'Location')}</span>
                  {latitude && longitude ? (
                    <span className="text-sm text-green-600 font-medium">
                      {t('auth.locationCaptured', 'Captured ({lat}, {lng})', { lat: latitude.toFixed(4), lng: longitude.toFixed(4) })}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleGetLocation}
                      disabled={loading}
                      className="text-sm px-3 py-1 bg-secondary text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
                    >
                      {loading ? t('auth.gettingLocation', 'Getting location...') : t('auth.shareLocation', 'Share Location')}
                    </button>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('auth.phoneNumber', 'Phone Number')}
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1234567890"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                </div>

                <div className="flex items-start">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    required
                    className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                    {t('auth.acceptTerms', 'I agree to the')}{' '}
                    <a href="/legal" className="text-primary hover:underline" target="_blank">
                      {t('auth.termsOfService', 'Terms of Service')}
                    </a>
                  </label>
                </div>

                <div className="flex items-start">
                  <input
                    id="allowChat"
                    type="checkbox"
                    checked={allowChat}
                    onChange={(e) => setAllowChat(e.target.checked)}
                    className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <label htmlFor="allowChat" className="ml-2 text-sm text-gray-600">
                    {t('auth.allowChat', 'Allow chat with matches')}
                  </label>
                </div>

                <div className="flex items-start">
                  <input
                    id="allowMeetInPerson"
                    type="checkbox"
                    checked={allowMeetInPerson}
                    onChange={(e) => setAllowMeetInPerson(e.target.checked)}
                    className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <label htmlFor="allowMeetInPerson" className="ml-2 text-sm text-gray-600">
                    {t('auth.allowMeetInPerson', 'Allow meet in person')}
                  </label>
                </div>

                <div className="flex items-start">
                  <input
                    id="allowCallVerification"
                    type="checkbox"
                    checked={allowCallVerification}
                    onChange={(e) => setAllowCallVerification(e.target.checked)}
                    className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <label htmlFor="allowCallVerification" className="ml-2 text-sm text-gray-600">
                    {t('auth.allowCallVerification', 'Allow call verification')}
                  </label>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">{t('auth.interestedTypes', 'Interested MBTI Types')}</p>
                  <div className="grid grid-cols-4 gap-2">
                    {mbtiTypes.map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleMBTI(type)}
                        className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-colors ${
                          interestedMBTIs.includes(type)
                            ? 'bg-primary text-white border-primary'
                            : 'border-gray-300 text-gray-600 hover:border-primary'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {contentError && (
                  <p className="text-sm text-orange-600 bg-orange-50 p-3 rounded-lg">{contentError}</p>
                )}

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50"
                >
                  {loading ? t('auth.sending', 'Sending...') : t('auth.sendOtp', 'Send OTP')}
                </button>
              </form>
            </>
          )}

          {step === 'otp' && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">{t('auth.verifyOtp', 'Verify OTP')}</h2>
              <p className="text-gray-600 mb-6 text-center">{t('auth.enterCodeSent', 'Enter the code sent to {{phone}}.', { phone: phoneNumber })}</p>
              
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('auth.otpCode', 'OTP Code')}
                  </label>
                  <input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    maxLength={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-center text-2xl tracking-widest"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50"
                >
                  {loading ? t('auth.verifying', 'Verifying...') : t('auth.verify', 'Verify')}
                </button>

                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="w-full py-2 text-gray-600 hover:text-gray-900 transition-colors text-sm"
                >
                  {t('auth.changePhone', 'Change phone number')}
                </button>
              </form>
            </>
          )}

          {step === 'success' && (
            <>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('auth.success', 'Success!')}</h2>
                <p className="text-gray-600 mb-6">{t('auth.verifiedDesc', 'You have been verified successfully.')}</p>
                <Link
                  to="/quiz"
                  className="inline-block w-full py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  {t('quiz.startQuiz', 'Take the Quiz')}
                </Link>
              </div>
            </>
          )}
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          {t('auth.terms', 'By continuing, you agree to our')}{' '}
          <a href="#" className="text-primary hover:underline">{t('auth.termsOfService', 'Terms of Service')}</a>
        </p>
      </div>
    </div>
  )
}

export default Login
