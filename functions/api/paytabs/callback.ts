import {
  Env,
  getSupabaseAdmin,
  hmacSha256Base64,
  hmacSha256Hex,
  jsonResponse,
  timingSafeEqual
} from './_utils';

const mapStatus = (responseStatus: string | null, responseMessage: string | null) => {
  if (responseStatus === 'A') return 'authorised';
  const message = (responseMessage ?? '').toLowerCase();
  if (message.includes('cancel')) return 'cancelled';
  if (message.includes('expire')) return 'expired';
  return 'failed';
};

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  const rawBody = await request.text();
  const signatureHeader = request.headers.get('Signature') ?? request.headers.get('signature');

  if (!signatureHeader) {
    return jsonResponse({ error: 'Missing signature.' }, { status: 401 });
  }

  const expectedHex = await hmacSha256Hex(rawBody, env.PAYTABS_SERVER_KEY);
  const expectedBase64 = await hmacSha256Base64(rawBody, env.PAYTABS_SERVER_KEY);
  const incomingSignature = signatureHeader.trim();
  if (!timingSafeEqual(incomingSignature, expectedHex) && !timingSafeEqual(incomingSignature, expectedBase64)) {
    return jsonResponse({ error: 'Invalid signature.' }, { status: 401 });
  }

  let payload: Record<string, unknown> = {};
  if (rawBody) {
    try {
      payload = JSON.parse(rawBody) as Record<string, unknown>;
    } catch {
      return jsonResponse({ error: 'Invalid JSON body.' }, { status: 400 });
    }
  }
  const cartId = payload?.cart_id ?? payload?.cartId ?? null;
  const tranRef = payload?.tran_ref ?? payload?.tranRef ?? null;
  const paymentResult = (payload as { payment_result?: { response_status?: string; response_message?: string } })
    .payment_result;
  const responseStatus = paymentResult?.response_status ?? null;
  const responseMessage = paymentResult?.response_message ?? null;
  const status = mapStatus(responseStatus, responseMessage);

  const supabase = getSupabaseAdmin(env);
  const { error: applyError } = await supabase.rpc('apply_paytabs_result', {
    p_cart_id: cartId ?? null,
    p_tran_ref: tranRef ?? null,
    p_status: status,
    p_payload: payload
  });

  if (applyError) {
    return jsonResponse({ error: 'Failed to apply payment result.' }, { status: 500 });
  }
return jsonResponse({ ok: true });
};
