import 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    error?: string;
    user: {
      id: string;
      email: string;
      name?: string | null;
      role: string;
      image?: string | null;
    };
  }

  interface User {
    role?: string;
    accessToken?: string;
    refreshToken?: string;
  }

  // JWT type augmentation (next-auth v5 exports JWT from main module)
  interface JWT {
    id?: string;
    role?: string;
    accessToken?: string;
    refreshToken?: string;
    error?: string;
  }
}
