import { createNavigation } from 'next-intl/navigation';

// locales 배열 정의
export const locales = ['en', 'ko', 'ja', 'zh', 'ru', 'es', 'fr', 'it', 'de', 'vi', 'th', 'hi'] as const;
export const defaultLocale = 'ko' as const;

// 언어 이름 맵핑
export const localeNames: Record<string, string> = {
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

// 네비게이션 함수 생성
export const { Link, redirect, usePathname, useRouter } = 
  createNavigation({ locales, defaultLocale }); 