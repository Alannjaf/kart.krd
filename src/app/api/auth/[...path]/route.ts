import { auth } from '@/lib/auth/server';
import { NextRequest } from 'next/server';

const handler = auth.handler();

function withDebugLogging(
  method: string,
  fn: (req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) => Promise<Response>
) {
  return async (req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) => {
    const path = (await ctx.params).path.join('/');
    const isSignOut = path === 'sign-out';

    if (isSignOut) {
      console.log(`[auth-api] ${method} /api/auth/${path} - sign-out request received`);
      console.log('[auth-api] Request cookies:', req.headers.get('cookie')?.substring(0, 200) ?? '(none)');
    }

    const response = await fn(req, ctx);

    if (isSignOut) {
      console.log(`[auth-api] sign-out response status: ${response.status}`);
      const setCookies = response.headers.getSetCookie();
      console.log('[auth-api] sign-out Set-Cookie headers:', setCookies.length, 'cookies');
      for (const cookie of setCookies) {
        console.log('[auth-api] Set-Cookie:', cookie.substring(0, 150));
      }
    }

    return response;
  };
}

export const GET = withDebugLogging('GET', handler.GET);
export const POST = withDebugLogging('POST', handler.POST);
