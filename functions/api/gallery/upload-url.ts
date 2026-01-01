import { AwsClient } from 'aws4fetch';
import {
  Env as BaseEnv,
  jsonResponse,
  parseJsonBody,
  requireAdmin
} from '../paytabs/_utils';

type GalleryEnv = BaseEnv & {
  R2_ACCOUNT_ID?: string;
  R2_ACCESS_KEY_ID?: string;
  R2_SECRET_ACCESS_KEY?: string;
  R2_BUCKET?: string;
  R2_PUBLIC_BASE_URL?: string;

  // Optional tuning knobs
  GALLERY_UPLOAD_EXPIRES_SEC?: string; // default 600
  GALLERY_UPLOAD_MAX_IMAGE_MB?: string; // default 12
  GALLERY_UPLOAD_MAX_VIDEO_MB?: string; // default 200
};

const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_VIDEO_TYPES = new Set(['video/mp4', 'video/webm']);

const sanitizeFilename = (name: string) => {
  const base = name.split('/').pop()?.split('\\').pop() ?? 'file';
  const cleaned = base
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9._-]/g, '');
  return cleaned || 'file';
};

const extFromContentType = (ct: string) => {
  if (ct === 'image/jpeg') return 'jpg';
  if (ct === 'image/png') return 'png';
  if (ct === 'image/webp') return 'webp';
  if (ct === 'video/mp4') return 'mp4';
  if (ct === 'video/webm') return 'webm';
  return null;
};

const clampInt = (value: unknown, fallback: number) => {
  const n = typeof value === 'string' ? Number(value) : NaN;
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
};

const trimSlash = (s: string) => s.replace(/\/+$/, '');

export const onRequestPost = async ({ request, env }: { request: Request; env: GalleryEnv }) => {
  // Admin only
  const auth = await requireAdmin(request, env);
  if ('error' in auth) return auth.error;

  // Validate env (runtime)
  if (!env.R2_ACCOUNT_ID || !env.R2_ACCESS_KEY_ID || !env.R2_SECRET_ACCESS_KEY || !env.R2_BUCKET) {
    return jsonResponse(
      { error: 'R2 is not configured (missing env vars).' },
      { status: 500 }
    );
  }

  const { data: body, error: parseError } = await parseJsonBody(request);
  if (parseError || !body) {
    return jsonResponse({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const filename = typeof body.filename === 'string' ? body.filename : '';
  const contentType = typeof body.content_type === 'string' ? body.content_type : '';
  const size = typeof body.size === 'number' ? body.size : Number(body.size);

  if (!filename || !contentType || !Number.isFinite(size) || size <= 0) {
    return jsonResponse(
      { error: 'Missing/invalid fields. Required: filename, content_type, size.' },
      { status: 400 }
    );
  }

  const isImage = ALLOWED_IMAGE_TYPES.has(contentType);
  const isVideo = ALLOWED_VIDEO_TYPES.has(contentType);
  if (!isImage && !isVideo) {
    return jsonResponse(
      { error: 'Unsupported content_type.' },
      { status: 400 }
    );
  }

  const maxImageBytes = clampInt(env.GALLERY_UPLOAD_MAX_IMAGE_MB, 12) * 1024 * 1024;
  const maxVideoBytes = clampInt(env.GALLERY_UPLOAD_MAX_VIDEO_MB, 200) * 1024 * 1024;
  const maxBytes = isImage ? maxImageBytes : maxVideoBytes;

  if (size > maxBytes) {
    return jsonResponse(
      { error: `File too large. Max ${(maxBytes / 1024 / 1024).toFixed(0)} MB.` },
      { status: 413 }
    );
  }

  const id = crypto.randomUUID();
  const safeName = sanitizeFilename(filename);
  const forcedExt = extFromContentType(contentType);
  const finalName = forcedExt
    ? safeName.replace(/\.[a-zA-Z0-9]+$/, '') + '.' + forcedExt
    : safeName;

  const key = `gallery/${id}/${finalName}`;

  // Cloudflare R2 S3 endpoint
  const r2Url = `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
  const objectUrl = `${r2Url}/${env.R2_BUCKET}/${key}`;

  // Presigned expiry: Cloudflare recommends X-Amz-Expires query param for aws4fetch signing
  const expiresSec = clampInt(env.GALLERY_UPLOAD_EXPIRES_SEC, 600);

  const client = new AwsClient({
    service: 's3',
    region: 'auto',
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY
  });

  const signed = await client.sign(
    new Request(`${objectUrl}?X-Amz-Expires=${expiresSec}`, {
      method: 'PUT',
      headers: { 'Content-Type': contentType }
    }),
    { aws: { signQuery: true } }
  );

  const publicBase = env.R2_PUBLIC_BASE_URL ? trimSlash(env.R2_PUBLIC_BASE_URL) : null;
  const publicUrl = publicBase ? `${publicBase}/${key}` : null;

  return jsonResponse({
    id,
    key,
    upload_url: signed.url.toString(),
    public_url: publicUrl,
    content_type: contentType,
    expires_sec: expiresSec
  });
};
