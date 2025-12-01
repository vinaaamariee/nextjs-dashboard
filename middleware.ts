
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  
  return NextResponse.next();
}

export const config = {
  // ✅ FIX: The regex now excludes '/api/auth' routes along with others.
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};