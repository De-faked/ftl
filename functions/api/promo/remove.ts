import { createClient } from '@supabase/supabase-js';

type Env = {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  SUPABASE_ANON_KEY?: string;
  SUPABASE_PUBLISHABLE_KEY?: string;
};

type RemoveBody = { payment_id?: string };

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
  });
}

function getBearerToken(req: Request) {
  const h = req.headers.get('authorization') || '';
  if (!h.toLowerCase().startsWith('bearer ')) return null;
  return h.slice(7).trim() || null;
}

export const onRequestPost = async (ctx: { request: Request; env: Env }) => {
  const { request, env } = ctx;

  const token = getBearerToken(request);
  if (!token) return json({ ok: false, message: 'Authentication required.' }, 401);

  const supabaseUrl = env.SUPABASE_URL;
  const userKey = env.SUPABASE_ANON_KEY || env.SUPABASE_PUBLISHABLE_KEY;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !userKey || !serviceKey) {
    console.error('[promo/remove] Missing env vars');
    return json({ ok: false, message: 'Server misconfigured.' }, 500);
  }

  let body: RemoveBody | null = null;
  try {
    body = (await request.json()) as RemoveBody;
  } catch {
    body = null;
  }

  const paymentId = body?.payment_id;
  if (!paymentId) return json({ ok: false, message: 'Missing payment_id.' }, 400);

  const userDb = createClient(supabaseUrl, userKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
  });

  const serviceDb = createClient(supabaseUrl, serviceKey, {
    global: { headers: { Authorization: `Bearer ${serviceKey}` } },
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
  });

  // Ownership proof
  const payRes = await userDb
    .from('payments')
    .select('id,user_id,original_amount,amount')
    .eq('id', paymentId)
    .maybeSingle();

  if (payRes.error) {
    console.error('[promo/remove] payment select failed', payRes.error);
    return json({ ok: false, message: 'Unable to remove promo.' }, 500);
  }
  const pay = payRes.data;
  if (!pay) return json({ ok: false, message: 'Payment not found.' }, 404);

  const restoredAmount = pay.original_amount != null ? Number(pay.original_amount) : Number(pay.amount);

  const upd = await serviceDb
    .from('payments')
    .update({
      promo_code: null,
      discount_amount: 0,
      amount: restoredAmount
    })
    .eq('id', paymentId)
    .eq('user_id', pay.user_id);

  if (upd.error) {
    console.error('[promo/remove] payment update failed', upd.error);
    return json({ ok: false, message: 'Unable to remove promo.' }, 500);
  }

  return json({ ok: true, restoredAmount });
};
