'use client';

import { useEffect } from 'react';
import {
  SessionProvider as NextAuthSessionProvider,
  useSession,
  signOut,
} from 'next-auth/react';

/**
 * When the refresh token is expired/revoked, the jwt callback sets
 * session.error = 'RefreshAccessTokenError' but leaves the user "logged in"
 * with a dead access token (every authenticated call then 401s with no
 * recovery path). Detect that and sign the user out so they're prompted to
 * re-authenticate instead of hitting silent failures.
 */
function SessionErrorHandler() {
  const { data: session } = useSession();
  const error = (session as { error?: string } | null)?.error;

  useEffect(() => {
    if (error === 'RefreshAccessTokenError') {
      signOut({ callbackUrl: '/login' });
    }
  }, [error]);

  return null;
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthSessionProvider>
      <SessionErrorHandler />
      {children}
    </NextAuthSessionProvider>
  );
}
