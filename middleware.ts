import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const { pathname } = request.nextUrl;

  console.log('ACCESS TOKEN:', token);

  // Nếu chưa đăng nhập → chặn truy cập folder (authenticated)
  if (!token && pathname.startsWith('/(authenticated)')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Nếu đã đăng nhập → chặn vào login
  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Chặn tất cả route trừ static/assets/api
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
};
