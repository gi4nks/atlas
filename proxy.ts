import { auth } from '@/lib/auth';

export const proxy = auth.middleware;

export const config = {
  matcher: [
    '/((?!_next/static|_next/image/favicon.ico).*)',
  ],
};