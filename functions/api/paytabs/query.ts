import {
  Env,
  getSupabaseAdmin,
  jsonResponse,
  parseJsonBody,
  requireAdmin
} from './_utils'
import { isPaytabsEnabled } from './_utils';

const mapStatus = (responseStatus: string | null, responseMessage: string | null) => {
  if (responseStatus === 'A') return 'authorised';
  const message = (responseMessage ?? '').toLowerCase();
  if (message.includes('cancel')) return 'cancelled';
  if (message.includes('expire')) return 'expired';
  return 'failed';
};

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  const authResult = await requireAdmin(request, env);
  if ('error' in authResult) return authResult.error;

  
  if (!isPaytabsEnabled(env)) {
    return jsonResponse({ error: 'Payments are temporarily disabled.' }, { status: 503 });
  }

const { data: body, error: parseError } = await parseJsonBody(request);
  if (parseError || !body) {
    return jsonResponse({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const tranRef = typeof body.tran_ref === 'string' ? body.tran_ref : null;
  const cartId = typeof body.cart_id === 'string' ? body.cart_id : null;

  if (!tranRef && !cartId) {
    return jsonResponse({ error: 'tran_ref or cart_id is required.' }, { status: 400 });
  }

  const payload = tranRef
    ? { profile_id: env.PAYTABS_PROFILE_ID, tran_ref: tranRef }
    : { profile_id: env.PAYTABS_PROFILE_ID, cart_id: cartId };

  const paytabsResponse = await fetch(`${env.PAYTABS_BASE_URL}/payment/query`, {
    method: 'POST',
    headers: {
      authorization: env.PAYTABS_SERVER_KEY,
      'content-type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const paytabsBody = await paytabsResponse.json().catch(() => null);
  if (!paytabsResponse.ok) {
    return jsonResponse({ error: 'PayTabs query failed.', details: paytabsBody ?? null }, { status: 502 });
  }

  const responseStatus = paytabsBody?.payment_result?.response_status ?? null;
  const responseMessage = paytabsBody?.payment_result?.response_message ?? null;
  const status = mapStatus(responseStatus, responseMessage);
  const tranRefResponse = paytabsBody?.tran_ref ?? tranRef ?? null;
  const cartIdResponse = paytabsBody?.cart_id ?? cartId ?? null;

  const supabase = getSupabaseAdmin(env);
  const { error: applyError } = await supabase.rpc('apply_paytabs_result', {
    p_cart_id: cartIdResponse ?? null,
    p_tran_ref: tranRefResponse ?? null,
    p_status: status,
    p_payload: paytabsBody ?? {}
  });

  if (applyError) {
    return jsonResponse({ error: 'Failed to apply payment result.' }, { status: 500 });
  }
return jsonResponse({ response: paytabsBody });
};
