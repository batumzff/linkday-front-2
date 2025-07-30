import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Auth layout'ları yönlendirme yapacağı için middleware'i basitleştiriyoruz
  // Sadece temel güvenlik kontrolleri yapıyoruz
  
  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard')
  
  // Dashboard sayfalarına erişim için token kontrolü
  if (isDashboardPage) {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
  ],
} 