'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import { createContext, useContext } from 'react';
import { SESSION_DURATION_MS } from '@/lib/constants';
import { GuestSession } from '@/types/user';

type AuthContextType = {
  isAuthDisabled: boolean;
  isPersistenceDisabled: boolean;
  guestSession?: GuestSession;
};

const AuthContext = createContext<AuthContextType>({ isAuthDisabled: false, isPersistenceDisabled: false });

/**
 * SessionProvider wraps the NextAuth SessionProvider and provides additional context
 * for development mode features like disabled auth and persistence.
 * 
 * This pattern allows the app to work in development without requiring auth setup,
 * while maintaining the same session interface throughout the application.
 */
export function SessionProvider({ 
  children, 
  isAuthDisabled, 
  isPersistenceDisabled,
  guestSession 
}: { 
  children: React.ReactNode;
  isAuthDisabled: boolean;
  isPersistenceDisabled: boolean;
  guestSession?: GuestSession;
}) {
  // For NextAuth, we need to provide a full session object with expires field
  // When auth is disabled, we inject the guest session into NextAuth's provider
  const session = isAuthDisabled ? (guestSession ? {
    ...guestSession,
    expires: new Date(Date.now() + SESSION_DURATION_MS).toISOString()
  } : undefined) : undefined;
  
  
  return (
    <AuthContext.Provider value={{ isAuthDisabled, isPersistenceDisabled, guestSession }}>
      <NextAuthSessionProvider session={session}>
        {children}
      </NextAuthSessionProvider>
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}