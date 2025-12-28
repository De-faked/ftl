import {
  Env,
  getOrigin,
  getSupabaseAdmin,
  isExpired,
  jsonResponse,
  normalizeAmount,
  normalizeCurrency,
  normalizePaypageLang,
  parseJsonBody,
  requireUser,
  resolvePaypageTtl,
  safeString
} from './_utils';

const buildCustomerDetails = (
  profile: { full_name?: string | null; email?: string | null } | null,
  applicationData: Record<string, unknown> | null,
  fallbackEmail: string | null
) => {
  const name = safeString(applicationData?.fullName, safeString(profile?.full_name, 'Student'));
  const email = safeString(profile?.email ?? fallbackEmail, 'student@example.com');
  const phone = safeString(applicationData?.phone, '+966000000000');
  const country = safeString(applicationData?.nationality, 'SA');

  return {
    name,
    email,
    phone,
    street1: 'N/A',
    city: 'Madinah',
    state: 'Madinah',
    country,
    zip: '00000'
  };
};

const fetchProfile = async (supabase: ReturnType<typeof getSupabaseAdmin>, userId: string) => {
  const { data } = await supabase.from('profiles').select('full_name,email').eq('id', userId).maybeSingle();
  return data as { full_name?: string | null; email?: string | null } | null;
};

const fetchApplicationData = async (
  supabase: ReturnType<typeof getSupabaseAdmin>,
  userId: string,
  applicationId: string | null
) => {
  if (applicationId) {
    const { data } = await supabase
      .from('applications')
      .select('data')
      .eq('id', applicationId)
      .maybeSingle();
    return (data?.data as Record<string, unknown> | null) ?? null;
  }

  const { data } = await supabase
    .from('applications')
    .select('data')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data?.data as Record<string, unknown> | null) ?? null;
};

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  const authResult = await requireUser(request, env);
  if ('error' in authResult) return authResult.error;

  const { data: body, error: parseError } = await parseJsonBody(request);
  if (parseError || !body) {
    return jsonResponse({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const amount = normalizeAmount(body.amount);
  const currency = normalizeCurrency(body.currency);
  const description = safeString(
    body.description,
    'Tuition payment - PT Dima Khriza Group Co.'
  );

  if (!amount || amount <= 0 || !currency) {
    return jsonResponse({ error: 'Invalid amount or currency.' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin(env);
  const paypageTtl = resolvePaypageTtl(env);
  const paypageLang = normalizePaypageLang(body.paypage_lang);
  const applicationId = typeof body.application_id === 'string' ? body.application_id : null;
  const requestedTargetId = typeof body.target_user_id === 'string' ? body.target_user_id : null;

  let targetUserId = authResult.auth.user.id;
  if (requestedTargetId && requestedTargetId !== targetUserId) {
    const { data: adminRows, error: adminError } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', authResult.auth.user.id)
      .limit(1);

    if (adminError || !adminRows || adminRows.length === 0) {
      return jsonResponse({ error: 'Forbidden' }, { status: 403 });
    }

    targetUserId = requestedTargetId;
  }

  const applicationData = await fetchApplicationData(supabase, targetUserId, applicationId);
  const profile = await fetchProfile(supabase, targetUserId);
  const customerDetails = buildCustomerDetails(profile, applicationData, authResult.auth.user.email ?? null);

  let existingQuery = supabase
    .from('payments')
    .select('id,cart_id,redirect_url,created_at,paypage_ttl,tran_ref')
    .eq('user_id', targetUserId)
    .eq('amount', amount)
    .eq('currency', currency)
    .in('status', ['created', 'redirected'])
    .order('created_at', { ascending: false })
    .limit(1);

  existingQuery = applicationId
    ? existingQuery.eq('application_id', applicationId)
    : existingQuery.is('application_id', null);

  const { data: existing } = await existingQuery.maybeSingle();

  if (existing) {
    const ttl = typeof existing.paypage_ttl === 'number' ? existing.paypage_ttl : paypageTtl;
    if (!isExpired(existing.created_at, ttl)) {
      if (existing.redirect_url) {
        return jsonResponse({
          redirect_url: existing.redirect_url,
          cart_id: existing.cart_id,
          tran_ref: existing.tran_ref ?? null
        });
      }
    } else {
      await supabase.from('payments').update({ status: 'expired' }).eq('id', existing.id);
    }
  }

  const cartId = existing?.cart_id ?? crypto.randomUUID();
  const origin = getOrigin(request);

  const payload = {
    profile_id: env.PAYTABS_PROFILE_ID,
    tran_type: 'sale',
    tran_class: 'ecom',
    cart_id: cartId,
    cart_currency: currency,
    cart_amount: amount,
    cart_description: description,
    return: `${origin}/payment/return`,
    callback: `${origin}/api/paytabs/callback`,
    hide_shipping: true,
    paypage_ttl: paypageTtl,
    paypage_lang: paypageLang,
    customer_details: customerDetails
  };

  const paytabsResponse = await fetch(`${env.PAYTABS_BASE_URL}/payment/request`, {
    method: 'POST',
    headers: {
      authorization: env.PAYTABS_SERVER_KEY,
      'content-type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const paytabsBody = await paytabsResponse.json().catch(() => null);
  if (!paytabsResponse.ok || !paytabsBody?.redirect_url) {
    return jsonResponse({
      error: 'PayTabs request failed.',
      details: paytabsBody ?? null
    }, { status: 502 });
  }

  const paymentUpdate = {
    user_id: targetUserId,
    application_id: applicationId,
    cart_id: cartId,
    tran_ref: paytabsBody.tran_ref ?? null,
    amount,
    currency,
    status: 'redirected',
    redirect_url: paytabsBody.redirect_url,
    paypage_ttl: paypageTtl
  };

  if (existing?.id) {
    await supabase.from('payments').update(paymentUpdate).eq('id', existing.id);
  } else {
    await supabase.from('payments').insert(paymentUpdate);
  }

  return jsonResponse({
    redirect_url: paytabsBody.redirect_url,
    cart_id: cartId,
    tran_ref: paytabsBody.tran_ref ?? null
  });
};
