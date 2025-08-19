'use client';

import { useLanguage } from '@/contexts/LanguageContext';

const LANGUAGES = [
  { code: 'ko', name: '한국어' },
  { code: 'en', name: 'English' },
  { code: 'ja', name: '日本語' },
  { code: 'zh-CN', name: '中文' }, // Using zh-CN for Simplified Chinese
];

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`px-3 py-1 text-sm rounded-full transition-colors ${
            language === lang.code
              ? 'bg-blue-600 text-white font-semibold'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {lang.name}
        </button>
      ))}
    </div>
  );
}
