import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
    return user[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

const nextAuthHandler = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        // Validate credentials
        const parsed = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsed.success) {
          console.log('Invalid credentials format');
          return null;
        }

        const { email, password } = parsed.data;

        // Fetch user from database
        const user = await getUser(email);
        if (!user) {
          console.log('User not found');
          return null;
        }

        // Check password
        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) {
          console.log('Invalid password');
          return null;
        }

        // Authentication successful
        return user;
      },
    }),
  ],
});

// Create a callable wrapper as the default export so the app route
// always imports a function. Different NextAuth/packaging versions
// may return different shapes (function, object with `.default`,
// object with `.auth`), so detect the runtime shape and delegate.
async function callIfFunction(fn: any, ...args: any[]) {
  if (typeof fn === 'function') return fn(...args);
  return undefined;
}

export default function authRoute(...args: any[]) {
  const h: any = nextAuthHandler as any;

  // Try several common shapes for the handler
  const candidates = [h, h?.default, h?.auth, h?.handler];

  for (const cand of candidates) {
    if (typeof cand === 'function') {
      // Delegate to the underlying handler function
      return cand(...args);
    }
  }

  // If nothing is callable, log details for debugging and return a Response
  try {
    // eslint-disable-next-line no-console
    console.error('NextAuth handler is not callable. Exported value keys:', h ? Object.keys(h) : h);
  } catch (e) {
    // ignore
  }

  return new Response('Auth handler misconfigured on server', { status: 500 });
}

// Also expose named helpers for existing server-action imports.
// NextAuth's handler may attach helpers on the returned function.
const _helpers: any = nextAuthHandler as any;
export const auth = _helpers.auth ?? _helpers;
export const signIn = _helpers.signIn ?? _helpers.signin ?? (async () => {
  throw new Error('signIn helper is not available on NextAuth handler');
});
export const signOut = _helpers.signOut ?? _helpers.signout ?? (async () => {
  throw new Error('signOut helper is not available on NextAuth handler');
});
