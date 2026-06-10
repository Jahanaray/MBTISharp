import { useTranslation } from 'react-i18next'

function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-gray-900 text-gray-400 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-6">
          <div>
            <h3 className="text-white font-semibold mb-2">MBTI Match</h3>
            <p className="text-sm">
              {t('footer.description', 'Discover your personality type and connect with compatible people.')}
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">{t('footer.quickLinks', 'Quick Links')}</h3>
            <ul className="text-sm space-y-1">
              <li><a href="/" className="hover:text-white transition-colors">{t('footer.home', 'Home')}</a></li>
              <li><a href="/quiz" className="hover:text-white transition-colors">{t('footer.quiz', 'Quiz')}</a></li>
              <li><a href="/login" className="hover:text-white transition-colors">{t('footer.signIn', 'Sign In')}</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">{t('footer.legal', 'Legal')}</h3>
            <ul className="text-sm space-y-1">
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.privacyPolicy', 'Privacy Policy')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.termsOfService', 'Terms of Service')}</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} MBTI Match. {t('common.allRightsReserved', 'All rights reserved.')}</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
