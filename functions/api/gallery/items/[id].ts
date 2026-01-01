import { AwsClient } from 'aws4fetch';
import {
  Env as BaseEnv,
  getSupabaseAdmin,
  jsonResponse,
  parseJsonBody,
  requireAdmin,
} from '../../paytabs/_utils';

type GalleryEnv = BaseEnv & {
  R2_ACCOUNT_ID?: string;
  R2_ACCESS_KEY_ID?: string;
  R2_SECRET_ACCESS_KEY?: string;
  R2_BUCKET?: string;
};

const canOperateOnKey = (key: unknown) =>
  typeof key === 'string' && key.startsWith('gallery/');

const r2Configured = (env: GalleryEnv) =>
  Boolean(env.R2_ACCOUNT_ID && env.R2_ACCESS_KEY_ID && env.R2_SECRET_ACCESS_KEY && env.R2_BUCKET);

const r2DeleteObject = async (env: GalleryEnv, key: string) => {
  const url = `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${env.R2_BUCKET}/${key}`;

  const client = new AwsClient({
    service: 's3',
    region: 'auto',
    accessKeyId: env.R2_ACCESS_KEY_ID!,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY!,
  });

  const signed = await client.sign(new Request(url, { method: 'DELETE' }));
  const res = await fetch(signed);
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`R2 delete failed (${res.status}): ${txt || res.statusText}`);
  }
};

export const onRequestPatch = async ({
  request,
  env,
  params,
}: {
  request: Request;
  env: GalleryEnv;
  params: Record<string, string>;
}) => {
  const auth = await requireAdmin(request, env);
  if ('error' in auth) return auth.error;

  const id = params.id;
  if (!id) return jsonResponse({ error: 'Missing id.' }, { status: 400 });

  const { data: body, error: parseError } = await parseJsonBody(request);
  if (parseError || !body) return jsonResponse({ error: 'Invalid JSON body.' }, { status: 400 });

  const supabase = getSupabaseAdmin(env);

  // If replacing file: optionally delete old object
  const deleteOld = body.delete_old === true;

  let oldKey: string | null = null;
  if (deleteOld) {
    const { data: existing, error } = await supabase
      .from('gallery_items')
      .select('storage_key')
      .eq('id', id)
      .single();

    if (!error) oldKey = (existing?.storage_key as string) ?? null;
  }

  const patch: Record<string, unknown> = {};

  const allowed = [
    'storage_key',
    'public_url',
    'thumb_url',
    'content_type',
    'size_bytes',
    'width',
    'height',
    'duration_seconds',
    'caption_ar',
    'caption_en',
    'caption_id',
    'alt_ar',
    'alt_en',
    'alt_id',
    'sort_order',
    'is_published',
  ];

  for (const k of allowed) {
    if (k in body) patch[k] = body[k];
  }

  // Safety: if storage_key is being set, keep it within our gallery prefix.
  if ('storage_key' in patch && patch.storage_key !== null && !canOperateOnKey(patch.storage_key)) {
    return jsonResponse({ error: 'storage_key must start with "gallery/".' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('gallery_items')
    .update(patch)
    .eq('id', id)
    .select('*')
    .single();

  if (error) return jsonResponse({ error: error.message }, { status: 500 });

  // Best-effort old file cleanup (only if R2 is configured and we have a safe oldKey)
  if (deleteOld && oldKey && canOperateOnKey(oldKey) && r2Configured(env)) {
    try {
      await r2DeleteObject(env, oldKey);
    } catch (e) {
      return jsonResponse({ item: data, warning: String(e) }, { status: 200 });
    }
  }

  return jsonResponse({ item: data }, { status: 200 });
};

export const onRequestDelete = async ({
  request,
  env,
  params,
}: {
  request: Request;
  env: GalleryEnv;
  params: Record<string, string>;
}) => {
  const auth = await requireAdmin(request, env);
  if ('error' in auth) return auth.error;

  const id = params.id;
  if (!id) return jsonResponse({ error: 'Missing id.' }, { status: 400 });

  const url = new URL(request.url);
  const deleteFile = url.searchParams.get('delete_file') === 'true';

  const supabase = getSupabaseAdmin(env);

  // Fetch the key first (for optional delete)
  const { data: existing } = await supabase
    .from('gallery_items')
    .select('storage_key')
    .eq('id', id)
    .single();

  const key = (existing?.storage_key as string) ?? null;

  // Delete DB row
  const { error } = await supabase.from('gallery_items').delete().eq('id', id);
  if (error) return jsonResponse({ error: error.message }, { status: 500 });

  // Optional: delete R2 object (only if configured and key is safe)
  if (deleteFile && key && canOperateOnKey(key)) {
    if (!r2Configured(env)) {
      return jsonResponse({ ok: true, warning: 'Deleted DB row, but R2 env is not configured; file not deleted.' });
    }
    try {
      await r2DeleteObject(env, key);
    } catch (e) {
      return jsonResponse({ ok: true, warning: String(e) }, { status: 200 });
    }
  }

  return jsonResponse({ ok: true }, { status: 200 });
};
