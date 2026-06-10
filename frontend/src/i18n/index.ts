import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './locales/en/common.json';
import faTranslations from './locales/fa/common.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslations },
    fa: { translation: faTranslations }
  },
  lng: undefined,
  fallbackLng: 'en',
  supportedLngs: ['en', 'fa'],
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
