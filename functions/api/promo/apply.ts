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
  const supabaseKey =
    env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY || env.SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('[promo/apply] Missing SUPABASE_URL or server key in env');
    return json({ valid: false, message: 'Server misconfigured.' }, 500);
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

  // IMPORTANT:
  // Use server key as apikey, but ALSO pass the user's JWT as Authorization
  // so RLS runs as authenticated user (safer) and policies "to authenticated" work.
  const supabase = createClient(supabaseUrl, supabaseKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
  });

  // 1) Load the payment (RLS should ensure user can only see their own row)
  const paymentRes = await supabase
    .from('payments')
    .select('id, amount, currency, promo_code, discount_amount, original_amount, status')
    .eq('id', paymentId)
    .maybeSingle();

  if (paymentRes.error) {
    console.error('[promo/apply] payment select failed', paymentRes.error);
    return json({ valid: false, message: 'Unable to apply promo code.' }, 500);
  }

  const payment = paymentRes.data;
  if (!payment) return json({ valid: false, message: 'Payment not found.' }, 404);

  // If a promo is already applied, require using the Remove button first
  if (payment.promo_code && String(payment.promo_code).trim().length > 0) {
    if (String(payment.promo_code).toUpperCase() === promoCode) {
      // already applied — return success as idempotent
      return json({
        valid: true,
        code: promoCode,
        discountAmount: Number(payment.discount_amount ?? 0),
        finalAmount: Number(payment.amount)
      });
    }
    return json(
      { valid: false, message: 'A promo code is already applied. Remove it first.' },
      409
    );
  }

  const payAmount = Number(payment.amount);
  const payCurrency = String(payment.currency || 'USD').toUpperCase();
  if (!Number.isFinite(payAmount) || payAmount <= 0) {
    return json({ valid: false, message: 'Invalid payment amount.' }, 400);
  }

  // 2) Load promo (this is where your current code is failing)
  const promoRes = await supabase
    .from('promo_codes')
    .select(
      'code, active, currency, percent_off, amount_off, min_order_amount, max_discount_amount, starts_at, ends_at'
    )
    .ilike('code', promoCode)
    .limit(1)
    .maybeSingle();

  if (promoRes.error) {
    console.error('[promo/apply] promo select failed', promoRes.error);
    // keep message generic for users
    return json({ valid: false, message: 'Invalid or expired promo code.' }, 400);
  }

  const promo = promoRes.data;
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
    if (s.getTime() > now.getTime()) {
      return json({ valid: false, message: 'Invalid or expired promo code.' }, 400);
    }
  }
  if (promo.ends_at) {
    const e = new Date(promo.ends_at);
    if (e.getTime() < now.getTime()) {
      return json({ valid: false, message: 'Invalid or expired promo code.' }, 400);
    }
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
  if (percentOff != null) {
    discountRaw = payAmount * (percentOff / 100);
  } else if (amountOff != null) {
    discountRaw = amountOff;
  }

  const cap =
    promo.max_discount_amount != null ? toNumber(promo.max_discount_amount) : null;
  let discountFinal = discountRaw;
  if (cap != null) discountFinal = Math.min(discountFinal, cap);

  // clamp
  discountFinal = Math.max(0, Math.min(discountFinal, payAmount));

  const finalAmount = payAmount - discountFinal;

  // do not allow zero/negative totals (keeps billing sane)
  if (!(finalAmount > 0)) {
    return json({ valid: false, message: 'Invalid or expired promo code.' }, 400);
  }

  // 3) Update payment (store original amount once)
  const originalAmount =
    payment.original_amount != null ? Number(payment.original_amount) : payAmount;

  const upd = await supabase
    .from('payments')
    .update({
      promo_code: promoCode,
      discount_amount: discountFinal,
      original_amount: originalAmount,
      amount: finalAmount
    })
    .eq('id', paymentId);

  if (upd.error) {
    console.error('[promo/apply] payment update failed', upd.error);
    return json({ valid: false, message: 'Unable to apply promo code.' }, 500);
  }

  return json({
    valid: true,
    code: promoCode,
    discountAmount: discountFinal,
    finalAmount
  });
};
