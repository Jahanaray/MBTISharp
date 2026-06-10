import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'fa' : 'en';
    i18n.changeLanguage(newLang);
    document.dir = newLang === 'fa' ? 'rtl' : 'ltr';
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
        aria-label="Toggle language"
      >
        {i18n.language === 'en' ? '🇬🇧 EN' : '🇮🇷 FA'}
      </button>

      {isOpen && (
        <div className="absolute end-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          <button
            onClick={toggleLanguage}
            className="px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors w-full text-start"
          >
            {i18n.language === 'en' ? 'Switch to Persian' : 'تغییر به English'}
          </button>
        </div>
      )}
    </div>
  );
}
