import { NextResponse, type NextRequest } from 'next/server';

const CAPSTONE_SESSION_TOKEN = process.env.CAPSTONE_SESSION_TOKEN || 'capstone-session-token';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const userToken = !!request.cookies.get(CAPSTONE_SESSION_TOKEN);
  const currentPathname = request.nextUrl.pathname;
  if (!userToken && currentPathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.nextUrl.origin));
  }
  if (userToken && currentPathname === '/login') {
    return NextResponse.redirect(new URL('/home', request.nextUrl.origin));
  }
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/',
    '/login',
    '/home',
    '/create',
    '/edit/:path*',
    '/detail/:path*',
    '/progress/:path*',
  ],
};
