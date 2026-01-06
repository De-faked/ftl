import { createClient } from '@supabase/supabase-js';

export type Env = {
  PAYMENTS_MODE?: string;
  PAYMENTS_DISABLED?: string;
  PAYTABS_BASE_URL: string;
  PAYTABS_PROFILE_ID: string;
  PAYTABS_SERVER_KEY: string;
  PAYTABS_TTL_MIN?: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
};

export type AuthResult = {
  user: { id: string; email?: string | null };
  token: string;
};

export const jsonResponse = (data: unknown, init?: ResponseInit) =>
  new Response(JSON.stringify(data), {
    ...init,
    headers: {
      'content-type': 'application/json',
      ...(init?.headers ?? {})
    }
  });

export const isPaytabsEnabled = (env: Env) => {
  if (env.PAYMENTS_DISABLED === '1') return false;
  return (env.PAYMENTS_MODE ?? 'bank_transfer') === 'paytabs';
};

export const getSupabaseAdmin = (env: Env) =>
  createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

export const getBearerToken = (request: Request) => {
  const header = request.headers.get('authorization') ?? '';
  if (!header.toLowerCase().startsWith('bearer ')) return null;
  return header.slice(7).trim();
};

export const requireUser = async (
  request: Request,
  env: Env
): Promise<{ auth: AuthResult } | { error: Response }> => {
  const token = getBearerToken(request);
  if (!token) {
    return { error: jsonResponse({ error: 'Unauthorized' }, { status: 401 }) };
  }

  const supabase = getSupabaseAdmin(env);
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user) {
    return { error: jsonResponse({ error: 'Unauthorized' }, { status: 401 }) };
  }

  return { auth: { user: { id: data.user.id, email: data.user.email ?? null }, token } };
};

export const requireAdmin = async (
  request: Request,
  env: Env
): Promise<{ auth: AuthResult } | { error: Response }> => {
  const authResult = await requireUser(request, env);
  if ('error' in authResult) return authResult;

  const supabase = getSupabaseAdmin(env);
  const { data, error } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', authResult.auth.user.id)
    .limit(1);

  if (error || !data || data.length === 0) {
    return { error: jsonResponse({ error: 'Forbidden' }, { status: 403 }) };
  }

  return authResult;
};

export const parseJsonBody = async (request: Request) => {
  try {
    return { data: (await request.json()) as Record<string, unknown>, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const normalizePaypageLang = (value: unknown) => {
  if (typeof value !== 'string') return 'en';
  return value.toLowerCase() === 'ar' ? 'ar' : 'en';
};

export const normalizeCurrency = (value: unknown) =>
  typeof value === 'string' && value.trim() ? value.trim().toUpperCase() : null;

export const normalizeAmount = (value: unknown) => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

export const resolvePaypageTtl = (env: Env) => {
  const raw = env.PAYTABS_TTL_MIN;
  const parsed = raw ? Number(raw) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 20;
};

export const isExpired = (createdAt: string | null | undefined, ttlMinutes: number) => {
  if (!createdAt) return false;
  const createdTime = new Date(createdAt).getTime();
  if (Number.isNaN(createdTime)) return false;
  const expiresAt = createdTime + ttlMinutes * 60 * 1000;
  return Date.now() > expiresAt;
};

export const timingSafeEqual = (a: string, b: string) => {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
};

export const hmacSha256Hex = async (message: string, secret: string) => {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

export const hmacSha256Base64 = async (message: string, secret: string) => {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
  const bytes = new Uint8Array(signature);
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
};

export const getOrigin = (request: Request) => new URL(request.url).origin;

export const safeString = (value: unknown, fallback: string) =>
  typeof value === 'string' && value.trim() ? value.trim() : fallback;
