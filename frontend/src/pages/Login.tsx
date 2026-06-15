import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { isContentSafe } from '../utils/safetyFilter'

type View = 'login' | 'signup'

function Login() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [view, setView] = useState<View>('login')
  
  // Login fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  // Signup fields
  const [fullName, setFullName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [gender, setGender] = useState('')
  const [city, setCity] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [allowChat, setAllowChat] = useState(true)
  const [allowMeetInPerson, setAllowMeetInPerson] = useState(false)
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const switchView = (v: View) => {
    setView(v)
    setError('')
    setValidationErrors({})
    setEmail('')
    setPassword('')
    setFullName('')
    setConfirmPassword('')
    setBirthDate('')
    setGender('')
    setCity('')
    setTermsAccepted(false)
  }

  const validateSignup = (): boolean => {
    const errors: Record<string, string> = {}

    // Email validation
    if (!email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Invalid email format'
    }

    // Password validation
    if (!password) {
      errors.password = 'Password is required'
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }

    // Confirm password
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    // Full name validation
    if (!fullName.trim()) {
      errors.fullName = 'Full name is required'
    } else if (!isContentSafe(fullName.trim())) {
      errors.fullName = 'Invalid content in name'
    }

    // Birthdate validation (mandatory)
    if (!birthDate) {
      errors.birthDate = 'Birthdate is required'
    } else {
      const birth = new Date(birthDate)
      const age = (Date.now() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
      if (age < 18) {
        errors.birthDate = 'You must be at least 18 years old'
      }
      if (age > 120) {
        errors.birthDate = 'Invalid birthdate'
      }
    }

    // Gender validation (mandatory)
    if (!gender) {
      errors.gender = 'Gender is required'
    }

    // Terms acceptance (mandatory)
    if (!termsAccepted) {
      errors.terms = 'You must accept the terms and rules'
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return false
    }
    return true
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!email.trim()) {
      setError('Email is required')
      return
    }
    if (!password) {
      setError('Password is required')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase(), password })
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('authToken', data.token)
        navigate('/dashboard')
      } else {
        const data = await response.json().catch(() => ({ message: 'Login failed' }))
        setError(data.message || 'Login failed')
      }
    } catch {
      setError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setValidationErrors({})

    if (!validateSignup()) return

    setLoading(true)
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          password,
          fullName: fullName.trim(),
          birthDate,
          gender,
          city: city.trim() || 'Unknown',
          termsAccepted,
          allowChat,
          allowMeetInPerson,
          allowCallVerification: false,
          interestedMBTIs: ''
        })
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('authToken', data.token)
        navigate('/dashboard')
      } else {
        const data = await response.json().catch(() => ({ message: 'Registration failed' }))
        if (data.errors && Array.isArray(data.errors)) {
          setValidationErrors(Object.fromEntries(data.errors.map((e: any) => [e.field || 'general', e.message])))
          setError('Validation failed. Please check the form.')
        } else {
          const msg = data.message || 'Registration failed'
          if (msg.includes('already registered')) {
            setValidationErrors({ email: 'Email already registered' })
          }
          setError(msg)
        }
      }
    } catch {
      setError('Network error. Please check your connection.')
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
          {view === 'login' ? (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Sign In</h2>
              <p className="text-gray-600 mb-6 text-center">Enter your email and password to continue.</p>
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
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
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <p className="text-center text-sm text-gray-600 mt-6">
                Don't have an account?{' '}
                <button onClick={() => switchView('signup')} className="text-primary hover:underline font-medium">
                  Sign Up
                </button>
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Create Account</h2>
              <p className="text-gray-600 mb-6 text-center">All fields are required.</p>
              
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className={`w-full px-4 py-3 border ${validationErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none`}
                  />
                  {validationErrors.email && <p className="text-xs text-red-600 mt-1">{validationErrors.email}</p>}
                </div>

                <div>
                  <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                    className={`w-full px-4 py-3 border ${validationErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none`}
                  />
                  {validationErrors.password && <p className="text-xs text-red-600 mt-1">{validationErrors.password}</p>}
                </div>

                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password *
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    required
                    className={`w-full px-4 py-3 border ${validationErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none`}
                  />
                  {validationErrors.confirmPassword && <p className="text-xs text-red-600 mt-1">{validationErrors.confirmPassword}</p>}
                </div>

                <div>
                  <label htmlFor="full-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    id="full-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                    required
                    className={`w-full px-4 py-3 border ${validationErrors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none`}
                  />
                  {validationErrors.fullName && <p className="text-xs text-red-600 mt-1">{validationErrors.fullName}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="birth-date" className="block text-sm font-medium text-gray-700 mb-1">
                      Birthdate *
                    </label>
                    <input
                      id="birth-date"
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      required
                      max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                      className={`w-full px-4 py-3 border ${validationErrors.birthDate ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none`}
                    />
                    {validationErrors.birthDate && <p className="text-xs text-red-600 mt-1">{validationErrors.birthDate}</p>}
                  </div>

                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                      Gender *
                    </label>
                    <select
                      id="gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      required
                      className={`w-full px-4 py-3 border ${validationErrors.gender ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none`}
                    >
                      <option value="">Select...</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {validationErrors.gender && <p className="text-xs text-red-600 mt-1">{validationErrors.gender}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    id="city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Your city"
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
                    I agree to the{' '}
                    <a href="/legal" className="text-primary hover:underline" target="_blank">
                      Terms of Service
                    </a>
                  </label>
                </div>
                {validationErrors.terms && <p className="text-xs text-red-600">{validationErrors.terms}</p>}

                <div className="flex items-start">
                  <input
                    id="allowChat"
                    type="checkbox"
                    checked={allowChat}
                    onChange={(e) => setAllowChat(e.target.checked)}
                    className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <label htmlFor="allowChat" className="ml-2 text-sm text-gray-600">
                    Allow chat with matches
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
                    Allow meet in person
                  </label>
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50"
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>

              <p className="text-center text-sm text-gray-600 mt-6">
                Already have an account?{' '}
                <button onClick={() => switchView('login')} className="text-primary hover:underline font-medium">
                  Sign In
                </button>
              </p>
            </>
          )}
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          By continuing, you agree to our{' '}
          <a href="/legal" className="text-primary hover:underline">Terms of Service</a>
        </p>
      </div>
    </div>
  )
}

export default Login
