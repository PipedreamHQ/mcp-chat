'use client';

import { useSession } from 'next-auth/react';
import { useAuthContext } from '@/components/session-provider';
import { SESSION_DURATION_MS } from '@/lib/constants';

/**
 * Hook that provides an "effective" session - either the real NextAuth session 
 * or a guest session when auth is disabled.
 * 
 * This abstraction allows components to use the same session interface regardless
 * of whether auth is enabled or disabled, making development easier while keeping
 * the same code paths for production.
 * 
 * @returns Session data compatible with NextAuth's useSession hook
 */
export function useEffectiveSession() {
  const { data: session, status } = useSession();
  const { isAuthDisabled, guestSession } = useAuthContext();

  // If auth is disabled, always return the guest session
  if (isAuthDisabled && guestSession) {
    return {
      data: {
        ...guestSession,
        expires: new Date(Date.now() + SESSION_DURATION_MS).toISOString()
      },
      status: 'authenticated' as const,
      update: () => Promise.resolve(null)
    };
  }

  // Otherwise return the real session
  return { data: session, status, update: () => Promise.resolve(null) };
}