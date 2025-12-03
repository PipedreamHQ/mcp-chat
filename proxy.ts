import NextAuth from 'next-auth';

import { authConfig } from '@/app/(auth)/auth.config';

export const proxy = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET,
}).auth;

export const config = {
  matcher: ['/api/:path*', '/login', '/register'],
};
