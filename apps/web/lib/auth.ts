import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!res.ok) return null;

          const { data } = await res.json();

          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            role: data.user.role,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign-in — persist tokens from authorize()
      if (user) {
        token.id = user.id;
        const u = user as any;
        token.role = u.role;
        token.accessToken = u.accessToken;
        token.refreshToken = u.refreshToken;
      }

      // Fallback: if role is missing but we have an access token, fetch from API
      if (!token.role && token.accessToken) {
        try {
          const res = await fetch(`${API_URL}/auth/profile`, {
            headers: { Authorization: `Bearer ${token.accessToken}` },
          });
          if (res.ok) {
            const { data } = await res.json();
            token.role = data.role;
          }
        } catch {}
      }

      // Refresh access token if needed (check expiry with 1-min buffer)
      if (token.accessToken) {
        try {
          const payload = JSON.parse(
            Buffer.from((token.accessToken as string).split('.')[1], 'base64').toString()
          );
          const expiresAt = payload.exp * 1000;

          if (Date.now() > expiresAt - 60_000) {
            const res = await fetch(`${API_URL}/auth/refresh`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refreshToken: token.refreshToken }),
            });

            if (res.ok) {
              const { data } = await res.json();
              token.accessToken = data.accessToken;
              token.refreshToken = data.refreshToken;
              if (data.user?.role) {
                token.role = data.user.role;
              }
            } else {
              // Refresh failed — force re-login
              token.error = 'RefreshAccessTokenError';
            }
          }
        } catch {
          token.error = 'RefreshAccessTokenError';
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.accessToken = token.accessToken as string;
        session.error = token.error as string | undefined;
      }
      return session;
    },
  },
  session: { strategy: 'jwt' },
});
