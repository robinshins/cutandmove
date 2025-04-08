'use client';

import { useState } from 'react';
import { usePathname, useRouter } from '@/app/i18n';

// 지원 언어 및 이름
const locales = ['en', 'ko', 'ja', 'zh', 'ru', 'es', 'fr', 'it', 'de', 'vi', 'th', 'hi'] as const;
const localeNames: Record<string, string> = {
  en: 'English',
  ko: '한국어',
  ja: '日本語',
  zh: '中文',
  ru: 'Русский',
  es: 'Español',
  fr: 'Français',
  it: 'Italiano',
  de: 'Deutsch',
  vi: 'Tiếng Việt',
  th: 'ไทย',
  hi: 'हिन्दी'
};

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
  // 현재 locale 가져오기
  const currentLocale = locales.find(locale => pathname.startsWith(`/${locale}`)) || 'ko';
  
  const handleLanguageChange = (locale: string) => {
    setIsOpen(false);
    router.push(pathname.replace(/^\/[^\/]+/, '') || '/', { locale });
  };
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-sm"
      >
        <span>{localeNames[currentLocale]}</span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-1 w-40 py-2 bg-white rounded-md shadow-lg z-10">
          {locales.map(locale => (
            <button
              key={locale}
              onClick={() => handleLanguageChange(locale)}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                locale === currentLocale ? 'font-medium bg-gray-50' : ''
              }`}
            >
              {localeNames[locale]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 