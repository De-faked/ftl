import { createClient } from '@supabase/supabase-js';

type Env = {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
};

type ApplyBody = {
  payment_id?: string;
  promoCode?: string;
  promo_code?: string;
};

type PaymentRow = {
  id: string;
  user_id: string;
  status: string;
  amount: number;
  currency: string;
  original_amount: number | null;
  discount_amount: number | null;
  promo_code: string | null;
  created_at?: string;
};

type PromoRow = {
  code: string;
  active: boolean;
  currency: string | null;
  percent_off: number | null;
  amount_off: number | null;
  max_discount_amount: number | null;
  min_order_amount: number | null;
  starts_at: string | null;
  ends_at: string | null;
  max_uses: number | null;
  uses_count: number | null;
};

type PromoApplyResponse =
  | { valid: false; message: string }
  | { valid: true; code: string; discountAmount: number; finalAmount: number; currency: string };

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });
}

function getBearer(req: Request) {
  const h = req.headers.get('authorization') || '';
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m ? m[1] : null;
}

function normCode(v: unknown) {
  return String(v ?? '').trim().toUpperCase();
}

function round2(n: number) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

function nowUtc() {
  return new Date();
}

export const onRequestPost = async (ctx: any) => {
  const env = ctx.env as Env;
  const request = ctx.request as Request;

  if (!env?.SUPABASE_URL || !env?.SUPABASE_SERVICE_ROLE_KEY) {
    return json({ error: 'Server not configured (missing Supabase env).' }, 500);
  }

  const token = getBearer(request);
  if (!token) return json({ error: 'Unauthorized' }, 401);

  let body: ApplyBody = {};
  try {
    body = (await request.json()) as ApplyBody;
  } catch {
    body = {};
  }

  const promoCode = normCode(body.promoCode ?? body.promo_code);
  if (!promoCode) return json({ valid: false, message: 'Promo code is required.' }, 400);

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  // Validate user token
  const userRes = await supabase.auth.getUser(token);
  const userId = userRes.data.user?.id;
  if (!userId) return json({ error: 'Unauthorized' }, 401);

  // Load pending payment (or specific payment_id)
  const paymentSelect =
    'id,user_id,status,amount,currency,original_amount,discount_amount,promo_code,created_at';

  const payQuery = supabase
    .from('payments')
    .select(paymentSelect)
    .eq('user_id', userId)
    .in('status', ['created', 'redirected'])
    .order('created_at', { ascending: false })
    .limit(1);

  const payRes = body.payment_id ? await payQuery.eq('id', body.payment_id) : await payQuery;

  if (payRes.error) return json({ error: 'Failed to load payment.' }, 500);

  const payment = (Array.isArray(payRes.data) ? payRes.data[0] : null) as PaymentRow | null;
  if (!payment) return json({ valid: false, message: 'No pending payment found.' }, 404);

  // Don’t allow changing promo after applied (safer)
  if (payment.promo_code) {
    return json({ valid: false, message: 'A promo code is already applied to this payment.' }, 409);
  }

  const currency = String(payment.currency || 'USD').toUpperCase();
  const original = Number(payment.original_amount ?? payment.amount);
  if (!Number.isFinite(original) || original <= 0) {
    return json({ valid: false, message: 'Invalid payment amount.' }, 400);
  }

  // Load promo
  const promoSelect =
    'code,active,currency,percent_off,amount_off,max_discount_amount,min_order_amount,starts_at,ends_at,max_uses,uses_count';

  const promoRes = await supabase
    .from('promo_codes')
    .select(promoSelect)
    .ilike('code', promoCode)
    .limit(1);

  if (promoRes.error) return json({ valid: false, message: 'Invalid or expired promo code.' }, 400);

  const promo = (Array.isArray(promoRes.data) ? promoRes.data[0] : null) as PromoRow | null;
  if (!promo || !promo.active) {
    return json({ valid: false, message: 'Invalid or expired promo code.' }, 400);
  }

  const promoCurrency = String(promo.currency || 'USD').toUpperCase();
  if (promoCurrency !== currency) {
    return json({ valid: false, message: 'Promo code currency does not match payment currency.' }, 400);
  }

  const now = nowUtc();
  if (promo.starts_at) {
    const s = new Date(promo.starts_at);
    if (!Number.isNaN(s.getTime()) && now < s) {
      return json({ valid: false, message: 'Promo code is not active yet.' }, 400);
    }
  }
  if (promo.ends_at) {
    const e = new Date(promo.ends_at);
    if (!Number.isNaN(e.getTime()) && now > e) {
      return json({ valid: false, message: 'Promo code has expired.' }, 400);
    }
  }

  if (promo.min_order_amount != null) {
    const min = Number(promo.min_order_amount);
    if (Number.isFinite(min) && original < min) {
      return json({ valid: false, message: 'Order amount does not meet promo minimum.' }, 400);
    }
  }

  if (promo.max_uses != null && promo.uses_count != null) {
    const maxUses = Number(promo.max_uses);
    const used = Number(promo.uses_count);
    if (Number.isFinite(maxUses) && Number.isFinite(used) && used >= maxUses) {
      return json({ valid: false, message: 'Promo code usage limit reached.' }, 400);
    }
  }

  // Calculate discount
  const percentOff = promo.percent_off != null ? Number(promo.percent_off) : null;
  const amountOff = promo.amount_off != null ? Number(promo.amount_off) : null;

  if (!percentOff && !amountOff) {
    return json({ valid: false, message: 'Promo code is misconfigured.' }, 400);
  }

  let discount = 0;
  if (percentOff && percentOff > 0) {
    discount = (original * percentOff) / 100;
  } else if (amountOff && amountOff > 0) {
    discount = amountOff;
  }

  if (promo.max_discount_amount != null) {
    const cap = Number(promo.max_discount_amount);
    if (Number.isFinite(cap) && cap >= 0) discount = Math.min(discount, cap);
  }

  discount = round2(Math.max(0, discount));
  const finalAmount = round2(original - discount);

  if (!(finalAmount > 0)) {
    return json({ valid: false, message: 'Discount is too large for this payment.' }, 400);
  }

  // Persist on payment (server-side enforced)
  const upd = await supabase
    .from('payments')
    .update({
      original_amount: original,
      discount_amount: discount,
      promo_code: String(promo.code).toUpperCase(),
      amount: finalAmount
    })
    .eq('id', payment.id)
    .eq('user_id', userId)
    .is('promo_code', null);

  if (upd.error) return json({ error: 'Failed to apply promo code.' }, 500);

  const resp: PromoApplyResponse = {
    valid: true,
    code: String(promo.code).toUpperCase(),
    discountAmount: discount,
    finalAmount,
    currency
  };

  return json(resp, 200);
};
