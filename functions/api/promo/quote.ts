import { createClient } from '@supabase/supabase-js';

type Env = {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
};

function jsonResponse(data: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  headers.set('content-type', 'application/json; charset=utf-8');
  return new Response(JSON.stringify(data), { ...init, headers });
}

function normalizeCurrency(input: unknown): string | null {
  if (typeof input !== 'string') return null;
  const c = input.trim().toUpperCase();
  if (!/^[A-Z]{3}$/.test(c)) return null;
  return c;
}

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

function safePromoCode(input: unknown): string | null {
  if (typeof input !== 'string') return null;
  const s = input.trim();
  if (!s) return null;
  if (s.length > 32) return null;
  // allow letters/numbers/_/-
  if (!/^[A-Za-z0-9_-]+$/.test(s)) return null;
  return s.toUpperCase();
}

type Ctx = { request: Request; env: Env };

export const onRequestPost = async (ctx: Ctx) => {
  let body: any = null;
  try {
    body = await ctx.request.json();
  } catch {
    return jsonResponse({ valid: false, message: 'Invalid JSON body.' }, { status: 400 });
  }

  const amountRaw = body?.amount;
  const amount = typeof amountRaw === 'number' ? amountRaw : Number(amountRaw);
  const currency = normalizeCurrency(body?.currency);
  const promoCode = safePromoCode(body?.promoCode);

  if (!Number.isFinite(amount) || amount <= 0 || !currency) {
    return jsonResponse({ valid: false, message: 'Invalid amount or currency.' }, { status: 400 });
  }

  if (!promoCode) {
    // No code = no discount; not an error.
    return jsonResponse({
      valid: true,
      code: null,
      currency,
      originalAmount: round2(amount),
      discountAmount: 0,
      finalAmount: round2(amount),
    });
  }

  const supabaseUrl = ctx.env.SUPABASE_URL;
  const serviceKey = ctx.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return jsonResponse({ valid: false, message: 'Server configuration error.' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });

  // We query with ILIKE to be tolerant (case-insensitive exact match).
  const { data: promo, error } = await supabase
    .from('promo_codes')
    .select('code,active,percent_off,amount_off,currency,starts_at,ends_at,min_order_amount,max_discount_amount')
    .ilike('code', promoCode)
    .maybeSingle();

  if (error || !promo) {
    return jsonResponse({ valid: false, message: 'Invalid or expired promo code.' }, { status: 200 });
  }

  if (!promo.active) {
    return jsonResponse({ valid: false, message: 'Invalid or expired promo code.' }, { status: 200 });
  }

  // Enforce currency match (simple + professional, avoids ambiguity).
  if ((promo.currency || 'USD').toUpperCase() !== currency) {
    return jsonResponse({ valid: false, message: `Promo code is not valid for ${currency}.` }, { status: 200 });
  }

  const now = new Date();
  if (promo.starts_at) {
    const s = new Date(promo.starts_at);
    if (Number.isFinite(s.getTime()) && now < s) {
      return jsonResponse({ valid: false, message: 'Promo code is not active yet.' }, { status: 200 });
    }
  }
  if (promo.ends_at) {
    const e = new Date(promo.ends_at);
    if (Number.isFinite(e.getTime()) && now > e) {
      return jsonResponse({ valid: false, message: 'Promo code has expired.' }, { status: 200 });
    }
  }

  if (promo.min_order_amount != null) {
    const min = Number(promo.min_order_amount);
    if (Number.isFinite(min) && amount < min) {
      return jsonResponse({ valid: false, message: `Minimum order amount is ${min} ${currency}.` }, { status: 200 });
    }
  }

  const percentOff = promo.percent_off != null ? Number(promo.percent_off) : null;
  const amountOff = promo.amount_off != null ? Number(promo.amount_off) : null;

  let discount = 0;

  if (percentOff != null && Number.isFinite(percentOff)) {
    discount = (amount * percentOff) / 100;
  } else if (amountOff != null && Number.isFinite(amountOff)) {
    discount = amountOff;
  } else {
    return jsonResponse({ valid: false, message: 'Promo code is misconfigured.' }, { status: 200 });
  }

  if (promo.max_discount_amount != null) {
    const cap = Number(promo.max_discount_amount);
    if (Number.isFinite(cap) && cap >= 0) {
      discount = Math.min(discount, cap);
    }
  }

  discount = Math.max(0, Math.min(discount, amount));
  const finalAmount = Math.max(0, amount - discount);

  return jsonResponse({
    valid: true,
    code: promo.code,
    currency,
    originalAmount: round2(amount),
    discountAmount: round2(discount),
    finalAmount: round2(finalAmount),
  });
};
