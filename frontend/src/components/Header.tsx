import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'

interface HeaderProps {
  isAuthenticated?: boolean
}

function Header({ isAuthenticated }: HeaderProps) {
  const { t } = useTranslation()

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50" dir={typeof window !== 'undefined' ? (document.dir || 'ltr') : 'ltr'}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-gray-900">
          MBTI <span className="text-primary">Match</span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link to="/quiz" className="text-gray-600 hover:text-primary transition-colors">
            {t('header.quiz', 'Quiz')}
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="text-gray-600 hover:text-primary transition-colors text-sm"
              >
                {t('header.dashboard', 'Dashboard')}
              </Link>
              <Link
                to="/chat"
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
              >
                {t('header.chat', 'Chat')}
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-600 hover:text-primary transition-colors text-sm"
              >
                {t('auth.login', 'Sign In')}
              </Link>
              <Link
                to="/quiz"
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
              >
                {t('header.getStarted', 'Get Started')}
              </Link>
            </>
          )}

          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  )
}

export default Header
