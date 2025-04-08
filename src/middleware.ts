import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from '@/app/i18n';

// 미들웨어 직접 구현
export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // 루트 경로를 기본 로케일로 리다이렉션
  if (pathname === '/' || pathname === '') {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  // 미들웨어가 적용될 경로 패턴 (루트 경로만)
  matcher: ['/', '/((?!api|_next|.*\\..*).*)', '/[locale](.*)'],
}; 