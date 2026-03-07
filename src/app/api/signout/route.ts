import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const NEON_AUTH_COOKIE_PREFIX = '__Secure-neon-auth';

export async function POST() {
  console.log('[signout-api] Clearing all Neon Auth cookies');

  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  const authCookies = allCookies.filter(c => c.name.startsWith(NEON_AUTH_COOKIE_PREFIX));

  console.log('[signout-api] Found auth cookies:', authCookies.map(c => c.name));

  const response = NextResponse.json({ success: true });

  for (const cookie of authCookies) {
    console.log('[signout-api] Clearing cookie:', cookie.name);
    response.cookies.set(cookie.name, '', {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 0,
    });
  }

  // Also clear the well-known cookie names even if not found
  const knownCookies = [
    `${NEON_AUTH_COOKIE_PREFIX}.session_token`,
    `${NEON_AUTH_COOKIE_PREFIX}.local.session_data`,
    `${NEON_AUTH_COOKIE_PREFIX}.session_challange`,
    `${NEON_AUTH_COOKIE_PREFIX}.dont_remember`,
  ];

  for (const name of knownCookies) {
    if (!authCookies.some(c => c.name === name)) {
      console.log('[signout-api] Force-clearing known cookie:', name);
      response.cookies.set(name, '', {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 0,
      });
    }
  }

  console.log('[signout-api] All cookies cleared');
  return response;
}
