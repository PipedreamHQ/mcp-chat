import 'server-only';

import { auth } from '@/app/(auth)/auth';
import { isAuthDisabled, isPersistenceDisabled } from '@/lib/constants';
import { createGuestSession } from '@/lib/utils';

// Shared helper for API routes to get effective session
export async function getEffectiveSession() {
  const session = await auth();
  
  if (isAuthDisabled) {
    // In dev mode with auth disabled, always return a guest session
    return createGuestSession();
  } else {
    return session;
  }
}

// Helper to check if we should persist data to database
export function shouldPersistData() {
  return !isPersistenceDisabled;
}