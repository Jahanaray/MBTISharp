import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function Home() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          MBTI <span className="text-primary">Match</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          {t('home.subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/quiz"
            className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-md"
          >
            {t('home.startQuiz')}
          </Link>
          <Link
            to="/login"
            className="px-8 py-3 bg-white text-primary border-2 border-primary rounded-lg hover:bg-blue-50 transition-colors font-medium shadow-sm"
          >
            {t('auth.login')}
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {t('home.howItWorks', 'How It Works')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6 rounded-xl bg-blue-50">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t('home.step1Title', 'Take the Quiz')}
              </h3>
              <p className="text-gray-600">
                {t('home.step1Desc', 'Answer 15 thoughtful questions about your preferences.')}
              </p>
            </div>
            <div className="text-center p-6 rounded-xl bg-purple-50">
              <div className="w-16 h-16 mx-auto mb-4 bg-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t('home.step2Title', 'Get Your Type')}
              </h3>
              <p className="text-gray-600">
                {t('home.step2Desc', 'Receive your detailed MBTI type with in-depth insights.')}
              </p>
            </div>
            <div className="text-center p-6 rounded-xl bg-pink-50">
              <div className="w-16 h-16 mx-auto mb-4 bg-accent rounded-full flex items-center justify-center text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t('home.step3Title', 'Meet Matches')}
              </h3>
              <p className="text-gray-600">
                {t('home.step3Desc', 'Discover compatible personalities and build meaningful relationships.')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {t('home.ctaTitle', 'Ready to Discover Yourself?')}
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-xl mx-auto">
            {t('home.ctaDesc', 'Join thousands who have found their perfect match.')}
          </p>
          <Link
            to="/quiz"
            className="inline-block px-8 py-3 bg-white text-primary rounded-lg hover:bg-gray-100 transition-colors font-medium shadow-md"
          >
            {t('home.ctaButton', "Start Now - It's Free")}
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} MBTI Match. {t('common.allRightsReserved', 'All rights reserved.')}</p>
        </div>
      </footer>
    </div>
  )
}

export default Home
