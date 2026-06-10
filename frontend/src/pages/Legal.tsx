import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

type Tab = 'terms' | 'privacy' | 'cookies'

function Legal() {
  const { t, i18n } = useTranslation()
  const [activeTab, setActiveTab] = useState<Tab>('terms')

  const isRtl = i18n.language === 'fa'

  const tabs: { key: Tab; label: string }[] = [
    { key: 'terms', label: t('footer.termsOfService', 'Terms of Service') },
    { key: 'privacy', label: t('footer.privacyPolicy', 'Privacy Policy') },
    { key: 'cookies', label: t('footer.cookiePolicy', 'Cookie Policy') }
  ]

  const content = {
    terms: {
      title: t('legal.termsTitle', 'Terms of Service'),
      lastUpdated: t('legal.lastUpdated', 'Last Updated'),
      sections: [
        {
          heading: t('legal.acceptanceOfTerms', 'Acceptance of Terms'),
          body: t('legal.termsAcceptanceBody', 'By accessing and using MBTI Match, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, please do not use this service.')
        },
        {
          heading: t('legal.descriptionOfService', 'Description of Service'),
          body: t('legal.termsServiceBody', 'MBTI Match provides personality type assessment based on the Myers-Briggs Type Indicator framework. Our service includes quiz assessments, personality matching, and real-time chat features. We reserve the right to modify or discontinue any aspect of the service at any time.')
        },
        {
          heading: t('legal.userAccounts', 'User Accounts'),
          body: t('legal.termsAccountsBody', 'You are responsible for maintaining the security of your account. You must provide accurate and complete information during registration. You agree to notify us immediately of any unauthorized use of your account.')
        },
        {
          heading: t('legal.contentGuidelines', 'Content Guidelines'),
          body: t('legal.termsContentBody', 'You agree not to post content that is abusive, offensive, threatening, or otherwise inappropriate. Our safety filter system automatically monitors content in both English and Persian languages. Violations may result in account suspension.')
        },
        {
          heading: t('legal.privacy', 'Privacy'),
          body: t('legal.termsPrivacyBody', 'Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your personal information.')
        },
        {
          heading: t('legal.contactUs', 'Contact Us'),
          body: t('legal.termsContactBody', 'If you have any questions about these Terms of Service, please contact us through our application or via email at support@mbtimatch.com.')
        }
      ]
    },
    privacy: {
      title: t('legal.privacyTitle', 'Privacy Policy'),
      lastUpdated: t('legal.lastUpdated', 'Last Updated'),
      sections: [
        {
          heading: t('legal.informationWeCollect', 'Information We Collect'),
          body: t('legal.privacyCollectBody', 'We collect information you provide directly, including phone number, full name, city, profile photo, and location data. We also collect quiz responses to determine your personality type and match you with compatible users.')
        },
        {
          heading: t('legal.howWeUseInfo', 'How We Use Your Information'),
          body: t('legal.privacyUseBody', 'Your information is used to provide personality matching, facilitate communication between matches, improve our service, and ensure platform safety. We do not sell your personal information to third parties.')
        },
        {
          heading: t('legal.dataSharing', 'Data Sharing'),
          body: t('legal.privacySharingBody', 'Your profile information is shared only with your matched partners. Location data is used solely for proximity-based matching and is never shared with third parties. Chat messages are encrypted in transit.')
        },
        {
          heading: t('legal.dataSecurity', 'Data Security'),
          body: t('legal.privacySecurityBody', 'We implement industry-standard security measures to protect your data, including encryption, secure authentication, and regular security audits. However, no method of transmission over the Internet is 100% secure.')
        },
        {
          heading: t('legal.yourRights', 'Your Rights'),
          body: t('legal.privacyRightsBody', 'You have the right to access, modify, or delete your personal data at any time. You can also request a copy of all data we hold about you. To exercise these rights, please contact our support team.')
        }
      ]
    },
    cookies: {
      title: t('legal.cookiesTitle', 'Cookie Policy'),
      lastUpdated: t('legal.lastUpdated', 'Last Updated'),
      sections: [
        {
          heading: t('legal.whatAreCookies', 'What Are Cookies'),
          body: t('legal.cookiesWhatBody', 'Cookies are small text files stored on your device when you visit our website. They help us provide a better user experience by remembering your preferences, language settings, and authentication state.')
        },
        {
          heading: t('legal.cookiesWeUse', 'Cookies We Use'),
          body: t('legal.cookiesUseBody', 'We use essential cookies for authentication and session management, analytics cookies to understand how users interact with our service, and preference cookies to remember your language and regional settings.')
        },
        {
          heading: t('legal.managingCookies', 'Managing Cookies'),
          body: t('legal.cookiesManagingBody', 'You can control cookies through your browser settings. Please note that disabling certain cookies may affect the functionality of our service. Essential cookies cannot be disabled as they are required for the service to work.')
        },
        {
          heading: t('legal.cookieChanges', 'Changes to Cookie Policy'),
          body: t('legal.cookiesChangesBody', 'We may update this Cookie Policy from time to time. We will notify you of any significant changes by posting a notice on our website or through the application.')
        }
      ]
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6 text-primary hover:text-blue-700 transition-colors">
            &larr; {t('common.back', 'Back')}
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('legal.legalTitle', 'Legal')}</h1>
          <p className="text-gray-600">{t('legal.legalSubtitle', 'Terms, privacy, and cookie policies')}</p>
        </div>

        {/* Tabs */}
        <div className={`flex gap-2 mb-8 bg-white rounded-xl p-2 shadow-sm ${isRtl ? 'flex-row-reverse' : ''}`}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {(() => {
            const section = content[activeTab as Tab]
            return (
              <>
                <div className="flex items-center justify-between mb-6 pb-4 border-b">
                  <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                  <span className="text-sm text-gray-500">{section.lastUpdated} 2026-06-10</span>
                </div>
                <div className="space-y-6">
                  {section.sections.map((s: { heading: string; body: string }, i: number) => (
                    <div key={i}>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{s.heading}</h3>
                      <p className="text-gray-600 leading-relaxed">{s.body}</p>
                    </div>
                  ))}
                </div>
              </>
            )
          })()}
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-gray-500 mt-6">
          {t('legal.footerNote', 'By using MBTI Match, you acknowledge that you have read and understand these legal documents.') }
        </p>
      </div>
    </div>
  )
}

export default Legal
