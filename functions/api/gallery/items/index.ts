import {
  Env as BaseEnv,
  getSupabaseAdmin,
  jsonResponse,
  parseJsonBody,
  requireAdmin,
} from '../../paytabs/_utils';

type GalleryEnv = BaseEnv;

const isValidKind = (k: unknown) =>
  k === 'photo' || k === 'video' || k === 'external_video';

export const onRequestGet = async ({ request, env }: { request: Request; env: GalleryEnv }) => {
  const auth = await requireAdmin(request, env);
  if ('error' in auth) return auth.error;

  const supabase = getSupabaseAdmin(env);

  const url = new URL(request.url);
  const published = url.searchParams.get('published'); // "true" | "false" | null

  let query = supabase
    .from('gallery_items')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (published === 'true') query = query.eq('is_published', true);
  if (published === 'false') query = query.eq('is_published', false);

  const { data, error } = await query;
  if (error) return jsonResponse({ error: error.message }, { status: 500 });

  return jsonResponse({ items: data ?? [] });
};

export const onRequestPost = async ({ request, env }: { request: Request; env: GalleryEnv }) => {
  const auth = await requireAdmin(request, env);
  if ('error' in auth) return auth.error;

  const { data: body, error: parseError } = await parseJsonBody(request);
  if (parseError || !body) return jsonResponse({ error: 'Invalid JSON body.' }, { status: 400 });

  const kind = body.kind;
  if (!isValidKind(kind)) {
    return jsonResponse({ error: 'Invalid kind. Use: photo | video | external_video' }, { status: 400 });
  }

  const row = {
    kind,
    storage_key: typeof body.storage_key === 'string' ? body.storage_key : null,
    public_url: typeof body.public_url === 'string' ? body.public_url : null,
    thumb_url: typeof body.thumb_url === 'string' ? body.thumb_url : null,

    content_type: typeof body.content_type === 'string' ? body.content_type : null,
    size_bytes: Number.isFinite(Number(body.size_bytes)) ? Number(body.size_bytes) : null,
    width: Number.isFinite(Number(body.width)) ? Number(body.width) : null,
    height: Number.isFinite(Number(body.height)) ? Number(body.height) : null,
    duration_seconds: Number.isFinite(Number(body.duration_seconds)) ? Number(body.duration_seconds) : null,

    caption_ar: typeof body.caption_ar === 'string' ? body.caption_ar : null,
    caption_en: typeof body.caption_en === 'string' ? body.caption_en : null,
    caption_id: typeof body.caption_id === 'string' ? body.caption_id : null,

    alt_ar: typeof body.alt_ar === 'string' ? body.alt_ar : null,
    alt_en: typeof body.alt_en === 'string' ? body.alt_en : null,
    alt_id: typeof body.alt_id === 'string' ? body.alt_id : null,

    sort_order: Number.isFinite(Number(body.sort_order)) ? Number(body.sort_order) : 0,
    is_published: Boolean(body.is_published),
  };

  // Minimal server-side safety (prevents deleting/overwriting arbitrary paths later)
  if ((kind === 'photo' || kind === 'video') && (!row.storage_key || !row.storage_key.startsWith('gallery/'))) {
    return jsonResponse({ error: 'storage_key is required for photo/video and must start with "gallery/".' }, { status: 400 });
  }
  if (kind === 'external_video' && !row.public_url) {
    return jsonResponse({ error: 'public_url is required for external_video.' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin(env);
  const { data, error } = await supabase.from('gallery_items').insert(row).select('*').single();

  if (error) return jsonResponse({ error: error.message }, { status: 500 });
  return jsonResponse({ item: data }, { status: 201 });
};
