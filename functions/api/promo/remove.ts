import { createClient } from '@supabase/supabase-js';

type Env = {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
};

function json(body: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  if (!headers.has('content-type')) headers.set('content-type', 'application/json');
  return new Response(JSON.stringify(body), { ...init, headers });
}

function getBearerToken(req: Request): string | null {
  const h = req.headers.get('authorization') || req.headers.get('Authorization') || '';
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m ? m[1].trim() : null;
}

export const onRequestPost = async (ctx: any) => {
  const env = ctx.env as Env;
  const request = ctx.request as Request;

  const token = getBearerToken(request);
  if (!token) return json({ error: 'Missing Authorization bearer token.' }, { status: 401 });

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
  });

  const { data: userData, error: userErr } = await supabase.auth.getUser(token);
  const user = userData?.user;
  if (userErr || !user) return json({ error: 'Unauthorized.' }, { status: 401 });

  const body = await request.json().catch(() => null) as any;
  const payment_id = String(body?.payment_id ?? body?.paymentId ?? '').trim();
  if (!payment_id) return json({ error: 'Missing payment_id.' }, { status: 400 });

  const { data: payment, error: payErr } = await supabase
    .from('payments')
    .select('id,user_id,status,amount,original_amount,currency,promo_code,discount_amount')
    .eq('id', payment_id)
    .single();

  if (payErr || !payment) return json({ error: 'Payment not found.' }, { status: 404 });
  if (payment.user_id !== user.id) return json({ error: 'Forbidden.' }, { status: 403 });

  if (payment.status === 'authorised') {
    return json({ error: 'Cannot remove promo after payment is authorised.' }, { status: 400 });
  }

  // If nothing to remove, return OK (idempotent)
  if (!payment.promo_code) {
    return json({
      valid: true,
      removed: true,
      discountAmount: 0,
      finalAmount: Number(payment.amount),
      currency: String(payment.currency || 'USD')
    });
  }

  const restored = Number(payment.original_amount ?? payment.amount ?? 0);

  const { error: clearErr } = await supabase
    .from('payments')
    .update({
      promo_code: null,
      discount_amount: 0,
      original_amount: null,
      amount: restored
    })
    .eq('id', payment.id)
    .eq('user_id', user.id);

  if (clearErr) return json({ error: 'Failed to remove promo code.' }, { status: 500 });

  return json({
    valid: true,
    removed: true,
    discountAmount: 0,
    finalAmount: restored,
    currency: String(payment.currency || 'USD')
  });
};
