"use server";

import { signOut } from '@/auth';
import { redirect } from 'next/navigation';

export async function signOutAction() {
  // Prevent NextAuth from returning its own redirect/Response object
  // and instead perform a Next.js server redirect which the form action
  // flow understands.
  try {
    await signOut({ redirect: false });
  } catch (err) {
    // Log and proceed to ensure we still redirect client-side
    console.error('signOut failed in server action', err);
  }

  // Use Next.js server redirect to send the client back to '/'
  redirect('/');
}
