import type { AuthOptions } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  // callbacks: { /* removed to match NextAuth v4 options */ },
  providers: [], // Add providers with an empty array for now
} satisfies AuthOptions;