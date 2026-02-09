import { createClient } from '@supabase/supabase-js';

type Env = {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  SUPABASE_ANON_KEY?: string;
  SUPABASE_PUBLISHABLE_KEY?: string;
};

type ApplyBody = {
  payment_id?: string;
  promoCode?: string;
  promo_code?: string;
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store'
    }
  });
}

function getBearerToken(req: Request) {
  const h = req.headers.get('authorization') || '';
  if (!h.toLowerCase().startsWith('bearer ')) return null;
  return h.slice(7).trim() || null;
}

function normCode(s: string) {
  return s.trim().toUpperCase();
}

function toNumber(x: any): number | null {
  const n = Number(x);
  return Number.isFinite(n) ? n : null;
}

export const onRequestPost = async (ctx: { request: Request; env: Env }) => {
  const { request, env } = ctx;

  const token = getBearerToken(request);
  if (!token) return json({ valid: false, message: 'Authentication required.' }, 401);

  const supabaseUrl = env.SUPABASE_URL;
  const userKey = env.SUPABASE_ANON_KEY || env.SUPABASE_PUBLISHABLE_KEY;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    console.error('[promo/apply] Missing SUPABASE_URL');
    return json({ valid: false, message: 'Server misconfigured.' }, 500);
  }
  if (!userKey) {
    console.error('[promo/apply] Missing SUPABASE_ANON_KEY or SUPABASE_PUBLISHABLE_KEY');
    return json({ valid: false, message: 'Server misconfigured.' }, 500);
  }
  if (!serviceKey) {
    console.error('[promo/apply] Missing SUPABASE_SERVICE_ROLE_KEY (required for safe promo read)');
    return json({ valid: false, message: 'Promo service not configured.' }, 500);
  }

  let body: ApplyBody | null = null;
  try {
    body = (await request.json()) as ApplyBody;
  } catch {
    body = null;
  }

  const paymentId = body?.payment_id;
  const rawCode = body?.promoCode ?? body?.promo_code;

  if (!paymentId || !rawCode) {
    return json({ valid: false, message: 'Missing payment_id or promo code.' }, 400);
  }

  const promoCode = normCode(rawCode);

  // Client A: user-scoped (RLS enforced) - only to prove user owns payment
  const userDb = createClient(supabaseUrl, userKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
  });

  // Client B: service-scoped (RLS bypass) - safe to read promos + update payment AFTER ownership proof
  const serviceDb = createClient(supabaseUrl, serviceKey, {
    global: { headers: { Authorization: `Bearer ${serviceKey}` } },
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
  });

  // 1) Ownership proof: user must be able to read this payment via RLS
  const paymentRes = await userDb
    .from('payments')
    .select('id,user_id,amount,currency,promo_code,discount_amount,original_amount,status')
    .eq('id', paymentId)
    .maybeSingle();

  if (paymentRes.error) {
    console.error('[promo/apply] payment select failed', paymentRes.error);
    return json({ valid: false, message: 'Unable to apply promo code.' }, 500);
  }
  const payment = paymentRes.data;
  if (!payment) return json({ valid: false, message: 'Payment not found.' }, 404);

  // already applied
  if (payment.promo_code && String(payment.promo_code).trim().length > 0) {
    const existing = String(payment.promo_code).toUpperCase();
    if (existing === promoCode) {
      return json({
        valid: true,
        code: promoCode,
        discountAmount: Number(payment.discount_amount ?? 0),
        finalAmount: Number(payment.amount)
      });
    }
    return json({ valid: false, message: 'A promo code is already applied. Remove it first.' }, 409);
  }

  const payAmount = Number(payment.amount);
  const payCurrency = String(payment.currency || 'USD').toUpperCase();
  if (!Number.isFinite(payAmount) || payAmount <= 0) {
    return json({ valid: false, message: 'Invalid payment amount.' }, 400);
  }

  // 2) Read promo as service role (bypasses promo_codes RLS safely)
  const promoRes = await serviceDb
    .from('promo_codes')
    .select('code,active,currency,percent_off,amount_off,min_order_amount,max_discount_amount,starts_at,ends_at')
    .ilike('code', promoCode)
    .limit(1)
    .maybeSingle();

  if (promoRes.error) {
    console.error('[promo/apply] promo select failed', promoRes.error);
    return json({ valid: false, message: 'Invalid or expired promo code.' }, 400);
  }

  const promo = promoRes.data as any;
  if (!promo || !promo.active) {
    return json({ valid: false, message: 'Invalid or expired promo code.' }, 400);
  }

  const promoCurrency = String(promo.currency || payCurrency).toUpperCase();
  if (promoCurrency !== payCurrency) {
    return json({ valid: false, message: 'Invalid or expired promo code.' }, 400);
  }

  const now = new Date();
  if (promo.starts_at) {
    const s = new Date(promo.starts_at);
    if (s.getTime() > now.getTime()) return json({ valid: false, message: 'Invalid or expired promo code.' }, 400);
  }
  if (promo.ends_at) {
    const e = new Date(promo.ends_at);
    if (e.getTime() < now.getTime()) return json({ valid: false, message: 'Invalid or expired promo code.' }, 400);
  }

  const minOrder = promo.min_order_amount != null ? toNumber(promo.min_order_amount) : null;
  if (minOrder != null && payAmount < minOrder) {
    return json({ valid: false, message: 'Invalid or expired promo code.' }, 400);
  }

  const percentOff = promo.percent_off != null ? toNumber(promo.percent_off) : null;
  const amountOff = promo.amount_off != null ? toNumber(promo.amount_off) : null;

  if (percentOff == null && amountOff == null) {
    console.error('[promo/apply] promo has no percent_off/amount_off', promo);
    return json({ valid: false, message: 'Invalid or expired promo code.' }, 400);
  }

  let discountRaw = 0;
  if (percentOff != null) discountRaw = payAmount * (percentOff / 100);
  else discountRaw = amountOff as number;

  const cap = promo.max_discount_amount != null ? toNumber(promo.max_discount_amount) : null;
  let discountFinal = discountRaw;
  if (cap != null) discountFinal = Math.min(discountFinal, cap);

  discountFinal = Math.max(0, Math.min(discountFinal, payAmount));
  const finalAmount = payAmount - discountFinal;

  if (!(finalAmount > 0)) {
    return json({ valid: false, message: 'Invalid or expired promo code.' }, 400);
  }

  const originalAmount =
    payment.original_amount != null ? Number(payment.original_amount) : payAmount;

  // 3) Update payment as service role BUT with guard: id + user_id (ownership proven)
  const upd = await serviceDb
    .from('payments')
    .update({
      promo_code: promoCode,
      discount_amount: discountFinal,
      original_amount: originalAmount,
      amount: finalAmount
    })
    .eq('id', paymentId)
    .eq('user_id', payment.user_id);

  if (upd.error) {
    console.error('[promo/apply] payment update failed', upd.error);
    return json({ valid: false, message: 'Unable to apply promo code.' }, 500);
  }

  return json({ valid: true, code: promoCode, discountAmount: discountFinal, finalAmount });
};
