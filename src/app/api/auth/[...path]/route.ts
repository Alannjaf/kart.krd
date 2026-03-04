import { auth } from '@/lib/auth/server';

const h = auth.handler();
export const GET = h.GET;
export const POST = h.POST;
