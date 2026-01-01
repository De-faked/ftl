import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Check, Copy, Link2 } from 'lucide-react';
import { useAuth } from '../../src/auth/useAuth';
import { useLanguage } from '../../contexts/LanguageContext';
import { Alert } from '../Alert';
import { Bdi } from '../Bdi';
import { logDevError } from '../../src/utils/logging';

type GalleryKind = 'photo' | 'video' | 'external_video';

type GalleryItem = {
  id: string;
  kind: GalleryKind;
  storage_key: string | null;
  public_url: string | null;
  thumb_url: string | null;
  content_type: string | null;
  size_bytes: number | null;
  caption_ar: string | null;
  caption_en: string | null;
  caption_id: string | null;
  alt_ar: string | null;
  alt_en: string | null;
  alt_id: string | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
};

type Draft = Partial<Pick<
  GalleryItem,
  | 'caption_ar'
  | 'caption_en'
  | 'caption_id'
  | 'alt_ar'
  | 'alt_en'
  | 'alt_id'
  | 'sort_order'
  | 'is_published'
  | 'public_url'
  | 'thumb_url'
>>;

const trimSlash = (value: string) => value.replace(/\/+$/, '');

const normalizeNumber = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const normalizeText = (value: string) => {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

export const AdminGalleryPage: React.FC = () => {
  const { session } = useAuth();
  const { t, language, dir } = useLanguage();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [creatingExternal, setCreatingExternal] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [replacingId, setReplacingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [sorting, setSorting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ type: 'delete' | 'replace'; item: GalleryItem } | null>(null);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [replaceFiles, setReplaceFiles] = useState<Record<string, File | null>>({});

  const [uploadKind, setUploadKind] = useState<'photo' | 'video'>('photo');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadCaptionAr, setUploadCaptionAr] = useState('');
  const [uploadCaptionEn, setUploadCaptionEn] = useState('');
  const [uploadCaptionId, setUploadCaptionId] = useState('');
  const [uploadAltAr, setUploadAltAr] = useState('');
  const [uploadAltEn, setUploadAltEn] = useState('');
  const [uploadAltId, setUploadAltId] = useState('');
  const [uploadSortOrder, setUploadSortOrder] = useState('0');
  const [uploadPublished, setUploadPublished] = useState(false);

  const [externalUrl, setExternalUrl] = useState('');
  const [externalThumbUrl, setExternalThumbUrl] = useState('');
  const [externalCaptionAr, setExternalCaptionAr] = useState('');
  const [externalCaptionEn, setExternalCaptionEn] = useState('');
  const [externalCaptionId, setExternalCaptionId] = useState('');
  const [externalAltAr, setExternalAltAr] = useState('');
  const [externalAltEn, setExternalAltEn] = useState('');
  const [externalAltId, setExternalAltId] = useState('');
  const [externalSortOrder, setExternalSortOrder] = useState('0');
  const [externalPublished, setExternalPublished] = useState(false);

  const [kindFilter, setKindFilter] = useState<'all' | GalleryKind>('all');
  const [publishedFilter, setPublishedFilter] = useState<'all' | 'published' | 'unpublished'>('all');

  const r2PublicBase = useMemo(() => {
    const raw = import.meta.env.VITE_R2_PUBLIC_BASE_URL as string | undefined;
    return raw ? trimSlash(raw) : null;
  }, []);

  const resolvePublicUrl = useCallback(
    (item: GalleryItem) => {
      if (item.public_url) return item.public_url;
      if (r2PublicBase && item.storage_key) {
        return `${r2PublicBase}/${item.storage_key}`;
      }
      return null;
    },
    [r2PublicBase]
  );

  const getLanguageLabel = useCallback(
    (code: 'ar' | 'en' | 'id') => t.common.languages[code],
    [t]
  );

  const captionLabel = useCallback(
    (code: 'ar' | 'en' | 'id') => t.admin.gallery.captionLabel.replace('{language}', getLanguageLabel(code)),
    [getLanguageLabel, t]
  );

  const altLabel = useCallback(
    (code: 'ar' | 'en' | 'id') => t.admin.gallery.altLabel.replace('{language}', getLanguageLabel(code)),
    [getLanguageLabel, t]
  );

  const resolveDraftValue = useCallback(
    <K extends keyof Draft>(item: GalleryItem, key: K, fallback: Draft[K]) =>
      drafts[item.id]?.[key] ?? (item[key as keyof GalleryItem] as Draft[K]) ?? fallback,
    [drafts]
  );

  const buildErrorMessage = useCallback(
    (base: string, details?: string | null) => {
      const trimmed = details?.trim();
      if (!trimmed) return base;
      return t.admin.gallery.errors.withDetails
        .replace('{base}', base)
        .replace('{details}', trimmed);
    },
    [t.admin.gallery.errors.withDetails]
  );

  const updateDraft = useCallback((id: string, patch: Draft) => {
    setDrafts((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        ...patch,
      },
    }));
  }, []);

  const getPreviewCaption = useCallback(
    (item: GalleryItem) => {
      const primary =
        language === 'ar'
          ? item.caption_ar
          : language === 'id'
          ? item.caption_id
          : item.caption_en;
      return primary ?? item.caption_en ?? item.caption_ar ?? item.caption_id ?? '';
    },
    [language]
  );

  const getDomainFromUrl = useCallback((value?: string | null) => {
    if (!value) return null;
    try {
      const url = new URL(value);
      return url.hostname;
    } catch (err) {
      return null;
    }
  }, []);

  const sortItems = useCallback((list: GalleryItem[]) => {
    return [...list].sort((a, b) => {
      if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
      const created = b.created_at.localeCompare(a.created_at);
      if (created !== 0) return created;
      return a.id.localeCompare(b.id);
    });
  }, []);

  const hasDuplicateSortOrders = useCallback((list: GalleryItem[]) => {
    const seen = new Set<number>();
    for (const item of list) {
      if (seen.has(item.sort_order)) return true;
      seen.add(item.sort_order);
    }
    return false;
  }, []);

  const orderedItems = useMemo(() => sortItems(items), [items, sortItems]);

  const filteredItems = useMemo(() => {
    return orderedItems.filter((item) => {
      if (kindFilter !== 'all' && item.kind !== kindFilter) return false;
      if (publishedFilter === 'published' && !item.is_published) return false;
      if (publishedFilter === 'unpublished' && item.is_published) return false;
      return true;
    });
  }, [kindFilter, orderedItems, publishedFilter]);

  const fetchItems = useCallback(async () => {
    if (!session?.access_token) {
      setLoadError(t.admin.gallery.errors.authRequired);
      setLoading(false);
      return;
    }

    setLoading(true);
    setLoadError(null);

    const response = await fetch('/api/gallery/items', {
      headers: {
        authorization: `Bearer ${session.access_token}`,
      },
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      logDevError('admin gallery load failed', payload ?? response.status);
      setLoadError(t.admin.gallery.errors.loadFailed);
      setLoading(false);
      return;
    }

    setItems((payload?.items ?? []) as GalleryItem[]);
    setLoading(false);
  }, [session?.access_token, t.admin.gallery.errors.authRequired, t.admin.gallery.errors.loadFailed]);

  useEffect(() => {
    void fetchItems();
  }, [fetchItems]);

  const requireAccessToken = () => {
    if (!session?.access_token) {
      setActionError(t.admin.gallery.errors.authRequired);
      return null;
    }
    return session.access_token;
  };

  const resetAlerts = () => {
    setActionError(null);
    setSuccessMessage(null);
  };

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetAlerts();

    const token = requireAccessToken();
    if (!token) return;

    if (!uploadFile) {
      setActionError(t.admin.gallery.errors.fileRequired);
      return;
    }

    const isImage = uploadFile.type.startsWith('image/');
    const isVideo = uploadFile.type.startsWith('video/');
    if ((uploadKind === 'photo' && !isImage) || (uploadKind === 'video' && !isVideo)) {
      setActionError(t.admin.gallery.errors.kindMismatch);
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const uploadResponse = await fetch('/api/gallery/upload-url', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        filename: uploadFile.name,
        content_type: uploadFile.type,
        size: uploadFile.size,
      }),
    });

    const uploadPayload = await uploadResponse.json().catch(() => null);
    if (!uploadResponse.ok || !uploadPayload?.upload_url) {
      logDevError('gallery upload-url failed', uploadPayload ?? uploadResponse.status);
      setActionError(
        buildErrorMessage(
          t.admin.gallery.errors.uploadUrlFailed,
          uploadPayload?.error ?? uploadPayload?.message ?? null
        )
      );
      setUploading(false);
      setUploadProgress(null);
      return;
    }

    try {
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', uploadPayload.upload_url as string);
        xhr.setRequestHeader('content-type', uploadPayload.content_type as string);
        xhr.upload.onprogress = (event) => {
          if (!event.lengthComputable) return;
          setUploadProgress(Math.round((event.loaded / event.total) * 100));
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
            return;
          }
          reject(new Error(xhr.responseText || xhr.statusText));
        };
        xhr.onerror = () => reject(new Error(xhr.responseText || xhr.statusText));
        xhr.send(uploadFile);
      });
    } catch (err) {
      logDevError('gallery upload put failed', err);
      setActionError(buildErrorMessage(t.admin.gallery.errors.uploadFailed, String(err)));
      setUploading(false);
      setUploadProgress(null);
      return;
    }

    const createResponse = await fetch('/api/gallery/items', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        kind: uploadKind,
        storage_key: uploadPayload.key,
        public_url: uploadPayload.public_url ?? null,
        content_type: uploadPayload.content_type ?? uploadFile.type,
        size_bytes: uploadFile.size,
        caption_ar: normalizeText(uploadCaptionAr),
        caption_en: normalizeText(uploadCaptionEn),
        caption_id: normalizeText(uploadCaptionId),
        alt_ar: normalizeText(uploadAltAr),
        alt_en: normalizeText(uploadAltEn),
        alt_id: normalizeText(uploadAltId),
        sort_order: normalizeNumber(uploadSortOrder),
        is_published: uploadPublished,
      }),
    });

    const createPayload = await createResponse.json().catch(() => null);
    if (!createResponse.ok) {
      logDevError('gallery create failed', createPayload ?? createResponse.status);
      setActionError(
        buildErrorMessage(
          t.admin.gallery.errors.createFailed,
          createPayload?.error ?? createPayload?.message ?? null
        )
      );
      setUploading(false);
      setUploadProgress(null);
      return;
    }

    setSuccessMessage(t.admin.gallery.messages.createSuccess);
    setUploadFile(null);
    setUploadCaptionAr('');
    setUploadCaptionEn('');
    setUploadCaptionId('');
    setUploadAltAr('');
    setUploadAltEn('');
    setUploadAltId('');
    setUploadSortOrder('0');
    setUploadPublished(false);
    setUploading(false);
    setUploadProgress(null);
    await fetchItems();
  };

  const handleCreateExternal = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetAlerts();

    const token = requireAccessToken();
    if (!token) return;

    if (!externalUrl.trim()) {
      setActionError(t.admin.gallery.errors.externalUrlRequired);
      return;
    }

    setCreatingExternal(true);

    const response = await fetch('/api/gallery/items', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        kind: 'external_video',
        public_url: externalUrl.trim(),
        thumb_url: normalizeText(externalThumbUrl) ?? null,
        caption_ar: normalizeText(externalCaptionAr),
        caption_en: normalizeText(externalCaptionEn),
        caption_id: normalizeText(externalCaptionId),
        alt_ar: normalizeText(externalAltAr),
        alt_en: normalizeText(externalAltEn),
        alt_id: normalizeText(externalAltId),
        sort_order: normalizeNumber(externalSortOrder),
        is_published: externalPublished,
      }),
    });

    const payload = await response.json().catch(() => null);
    setCreatingExternal(false);

    if (!response.ok) {
      logDevError('gallery external create failed', payload ?? response.status);
      setActionError(
        buildErrorMessage(
          t.admin.gallery.errors.createFailed,
          payload?.error ?? payload?.message ?? null
        )
      );
      return;
    }

    setSuccessMessage(t.admin.gallery.messages.createSuccess);
    setExternalUrl('');
    setExternalThumbUrl('');
    setExternalCaptionAr('');
    setExternalCaptionEn('');
    setExternalCaptionId('');
    setExternalAltAr('');
    setExternalAltEn('');
    setExternalAltId('');
    setExternalSortOrder('0');
    setExternalPublished(false);
    await fetchItems();
  };

  const handleSaveItem = async (item: GalleryItem) => {
    resetAlerts();
    const token = requireAccessToken();
    if (!token) return;

    const draft = drafts[item.id] ?? {};
    const nextPublicUrl =
      item.kind === 'external_video'
        ? normalizeText((draft.public_url as string) ?? item.public_url ?? '')
        : undefined;

    if (item.kind === 'external_video' && !nextPublicUrl) {
      setActionError(t.admin.gallery.errors.externalUrlRequired);
      return;
    }

    setSavingId(item.id);

    const response = await fetch(`/api/gallery/items/${item.id}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        caption_ar: normalizeText(String(draft.caption_ar ?? item.caption_ar ?? '')),
        caption_en: normalizeText(String(draft.caption_en ?? item.caption_en ?? '')),
        caption_id: normalizeText(String(draft.caption_id ?? item.caption_id ?? '')),
        alt_ar: normalizeText(String(draft.alt_ar ?? item.alt_ar ?? '')),
        alt_en: normalizeText(String(draft.alt_en ?? item.alt_en ?? '')),
        alt_id: normalizeText(String(draft.alt_id ?? item.alt_id ?? '')),
        sort_order: normalizeNumber(String(draft.sort_order ?? item.sort_order ?? 0)),
        is_published: Boolean(draft.is_published ?? item.is_published),
        public_url: item.kind === 'external_video' ? nextPublicUrl : undefined,
        thumb_url:
          item.kind === 'external_video'
            ? normalizeText(String(draft.thumb_url ?? item.thumb_url ?? ''))
            : undefined,
      }),
    });

    const payload = await response.json().catch(() => null);
    setSavingId(null);

    if (!response.ok) {
      logDevError('gallery update failed', payload ?? response.status);
      setActionError(
        buildErrorMessage(
          t.admin.gallery.errors.updateFailed,
          payload?.error ?? payload?.message ?? null
        )
      );
      return;
    }

    setSuccessMessage(t.admin.gallery.messages.updateSuccess);
    await fetchItems();
  };

  const handleReplaceFile = async (item: GalleryItem) => {
    resetAlerts();
    const token = requireAccessToken();
    if (!token) return;

    const file = replaceFiles[item.id];
    if (!file) {
      setActionError(t.admin.gallery.errors.fileRequired);
      return;
    }

    setReplacingId(item.id);

    const uploadResponse = await fetch('/api/gallery/upload-url', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        filename: file.name,
        content_type: file.type,
        size: file.size,
      }),
    });

    const uploadPayload = await uploadResponse.json().catch(() => null);
    if (!uploadResponse.ok || !uploadPayload?.upload_url) {
      logDevError('gallery replace upload-url failed', uploadPayload ?? uploadResponse.status);
      setActionError(
        buildErrorMessage(
          t.admin.gallery.errors.uploadUrlFailed,
          uploadPayload?.error ?? uploadPayload?.message ?? null
        )
      );
      setReplacingId(null);
      return;
    }

    const putResponse = await fetch(uploadPayload.upload_url as string, {
      method: 'PUT',
      headers: {
        'content-type': uploadPayload.content_type as string,
      },
      body: file,
    });

    if (!putResponse.ok) {
      logDevError('gallery replace upload failed', putResponse.status);
      setActionError(buildErrorMessage(t.admin.gallery.errors.uploadFailed, putResponse.statusText));
      setReplacingId(null);
      return;
    }

    const patchResponse = await fetch(`/api/gallery/items/${item.id}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        storage_key: uploadPayload.key,
        public_url: uploadPayload.public_url ?? null,
        content_type: uploadPayload.content_type ?? file.type,
        size_bytes: file.size,
        delete_old: true,
      }),
    });

    const patchPayload = await patchResponse.json().catch(() => null);
    setReplacingId(null);

    if (!patchResponse.ok) {
      logDevError('gallery replace failed', patchPayload ?? patchResponse.status);
      setActionError(
        buildErrorMessage(
          t.admin.gallery.errors.replaceFailed,
          patchPayload?.error ?? patchPayload?.message ?? null
        )
      );
      return;
    }

    setSuccessMessage(t.admin.gallery.messages.replaceSuccess);
    setReplaceFiles((prev) => ({ ...prev, [item.id]: null }));
    await fetchItems();
  };

  const handleTogglePublish = async (item: GalleryItem, nextValue: boolean) => {
    resetAlerts();
    const token = requireAccessToken();
    if (!token) return;

    setPublishingId(item.id);
    const response = await fetch(`/api/gallery/items/${item.id}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ is_published: nextValue }),
    });

    const payload = await response.json().catch(() => null);
    setPublishingId(null);

    if (!response.ok) {
      logDevError('gallery publish toggle failed', payload ?? response.status);
      setActionError(
        buildErrorMessage(
          t.admin.gallery.errors.updateFailed,
          payload?.error ?? payload?.message ?? null
        )
      );
      return;
    }

    setItems((prev) =>
      prev.map((existing) =>
        existing.id === item.id ? { ...existing, is_published: nextValue } : existing
      )
    );
    updateDraft(item.id, { is_published: nextValue });
  };

  const handleCopyUrl = async (item: GalleryItem) => {
    resetAlerts();
    const resolvedUrl = resolvePublicUrl(item);
    if (!resolvedUrl) {
      setActionError(t.admin.gallery.errors.copyMissingUrl);
      return;
    }

    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('clipboard-unavailable');
      }
      await navigator.clipboard.writeText(resolvedUrl);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId((current) => (current === item.id ? null : current)), 2000);
    } catch (err) {
      logDevError('gallery copy failed', err);
      setActionError(t.admin.gallery.errors.copyFailed);
    }
  };

  const applySortUpdates = async (updates: Array<{ id: string; sort_order: number }>) => {
    const token = requireAccessToken();
    if (!token) return false;

    for (const update of updates) {
      const response = await fetch(`/api/gallery/items/${update.id}`, {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sort_order: update.sort_order }),
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        logDevError('gallery sort update failed', payload ?? response.status);
        setActionError(
          buildErrorMessage(
            t.admin.gallery.errors.sortFailed,
            payload?.error ?? payload?.message ?? null
          )
        );
        return false;
      }
    }

    return true;
  };

  const handleMoveItem = async (item: GalleryItem, direction: -1 | 1) => {
    resetAlerts();
    if (sorting) return;

    const ordered = sortItems(items);
    const index = ordered.findIndex((entry) => entry.id === item.id);
    const swapIndex = index + direction;
    if (index === -1 || swapIndex < 0 || swapIndex >= ordered.length) return;

    setSorting(true);
    const hasDuplicates = hasDuplicateSortOrders(ordered);
    const nextOrdered = [...ordered];
    const [moved] = nextOrdered.splice(index, 1);
    nextOrdered.splice(swapIndex, 0, moved);
    let updates: Array<{ id: string; sort_order: number }> = [];

    if (hasDuplicates) {
      updates = nextOrdered.map((entry, idx) => ({ id: entry.id, sort_order: idx }));
    } else {
      const current = ordered[index];
      const target = ordered[swapIndex];
      updates = [
        { id: current.id, sort_order: target.sort_order },
        { id: target.id, sort_order: current.sort_order },
      ];
    }

    const ok = await applySortUpdates(updates);
    if (ok) {
      setSuccessMessage(
        hasDuplicates ? t.admin.gallery.messages.orderNormalized : t.admin.gallery.messages.orderUpdated
      );
      await fetchItems();
    }
    setSorting(false);
  };

  const handleDelete = async (item: GalleryItem) => {
    resetAlerts();
    const token = requireAccessToken();
    if (!token) return;

    setDeletingId(item.id);

    const response = await fetch(`/api/gallery/items/${item.id}?delete_file=true`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    const payload = await response.json().catch(() => null);
    setDeletingId(null);

    if (!response.ok) {
      logDevError('gallery delete failed', payload ?? response.status);
      setActionError(
        buildErrorMessage(
          t.admin.gallery.errors.deleteFailed,
          payload?.error ?? payload?.message ?? null
        )
      );
      return;
    }

    setSuccessMessage(t.admin.gallery.messages.deleteSuccess);
    await fetchItems();
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8" dir={dir}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.admin.gallery.title}</h1>
          <p className="text-sm text-gray-500">{t.admin.gallery.subtitle}</p>
        </div>

        {actionError && (
          <Alert variant="error">
            <Bdi>{actionError}</Bdi>
          </Alert>
        )}
        {successMessage && (
          <Alert variant="success">
            <Bdi>{successMessage}</Bdi>
          </Alert>
        )}

        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-gray-900">{t.admin.gallery.uploadTitle}</h2>
            <p className="text-sm text-gray-500">{t.admin.gallery.uploadSubtitle}</p>
          </div>
          <form onSubmit={handleUpload} className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm font-semibold text-gray-600">
              {t.admin.gallery.kindLabel}
              <select
                value={uploadKind}
                onChange={(event) => setUploadKind(event.target.value as 'photo' | 'video')}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                disabled={uploading}
              >
                <option value="photo">{t.admin.gallery.kinds.photo}</option>
                <option value="video">{t.admin.gallery.kinds.video}</option>
              </select>
            </label>
            <label className="space-y-1 text-sm font-semibold text-gray-600">
              {t.admin.gallery.fileLabel}
              <input
                type="file"
                accept={uploadKind === 'photo' ? 'image/*' : 'video/*'}
                onChange={(event) => setUploadFile(event.target.files?.[0] ?? null)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                disabled={uploading}
              />
            </label>

            <label className="space-y-1 text-sm font-semibold text-gray-600">
              {captionLabel('ar')}
              <input
                type="text"
                value={uploadCaptionAr}
                onChange={(event) => setUploadCaptionAr(event.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                disabled={uploading}
              />
            </label>
            <label className="space-y-1 text-sm font-semibold text-gray-600">
              {captionLabel('en')}
              <input
                type="text"
                value={uploadCaptionEn}
                onChange={(event) => setUploadCaptionEn(event.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                disabled={uploading}
              />
            </label>
            <label className="space-y-1 text-sm font-semibold text-gray-600">
              {captionLabel('id')}
              <input
                type="text"
                value={uploadCaptionId}
                onChange={(event) => setUploadCaptionId(event.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                disabled={uploading}
              />
            </label>

            <label className="space-y-1 text-sm font-semibold text-gray-600">
              {altLabel('ar')}
              <input
                type="text"
                value={uploadAltAr}
                onChange={(event) => setUploadAltAr(event.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                disabled={uploading}
              />
            </label>
            <label className="space-y-1 text-sm font-semibold text-gray-600">
              {altLabel('en')}
              <input
                type="text"
                value={uploadAltEn}
                onChange={(event) => setUploadAltEn(event.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                disabled={uploading}
              />
            </label>
            <label className="space-y-1 text-sm font-semibold text-gray-600">
              {altLabel('id')}
              <input
                type="text"
                value={uploadAltId}
                onChange={(event) => setUploadAltId(event.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                disabled={uploading}
              />
            </label>

            <label className="space-y-1 text-sm font-semibold text-gray-600">
              {t.admin.gallery.sortOrderLabel}
              <input
                type="number"
                value={uploadSortOrder}
                onChange={(event) => setUploadSortOrder(event.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                disabled={uploading}
              />
            </label>
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 mt-6">
              <input
                type="checkbox"
                checked={uploadPublished}
                onChange={(event) => setUploadPublished(event.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-madinah-green focus:ring-madinah-gold"
                disabled={uploading}
              />
              {t.admin.gallery.publishedLabel}
            </label>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={uploading}
                className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-madinah-green px-4 py-2 text-sm font-semibold text-white hover:bg-madinah-green/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {uploading ? t.admin.gallery.states.uploading : t.admin.gallery.actions.upload}
              </button>
              {uploading && uploadProgress !== null && (
                <div className="mt-2 text-xs font-semibold text-gray-500">
                  {t.admin.gallery.states.uploadProgress.replace('{progress}', String(uploadProgress))}
                </div>
              )}
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-gray-900">{t.admin.gallery.externalVideoTitle}</h2>
            <p className="text-sm text-gray-500">{t.admin.gallery.externalVideoSubtitle}</p>
          </div>
          <form onSubmit={handleCreateExternal} className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm font-semibold text-gray-600 md:col-span-2">
              {t.admin.gallery.publicUrlLabel}
              <input
                type="url"
                value={externalUrl}
                onChange={(event) => setExternalUrl(event.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                disabled={creatingExternal}
              />
            </label>
            <label className="space-y-1 text-sm font-semibold text-gray-600 md:col-span-2">
              {t.admin.gallery.thumbUrlLabel}
              <input
                type="url"
                value={externalThumbUrl}
                onChange={(event) => setExternalThumbUrl(event.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                disabled={creatingExternal}
              />
            </label>

            <label className="space-y-1 text-sm font-semibold text-gray-600">
              {captionLabel('ar')}
              <input
                type="text"
                value={externalCaptionAr}
                onChange={(event) => setExternalCaptionAr(event.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                disabled={creatingExternal}
              />
            </label>
            <label className="space-y-1 text-sm font-semibold text-gray-600">
              {captionLabel('en')}
              <input
                type="text"
                value={externalCaptionEn}
                onChange={(event) => setExternalCaptionEn(event.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                disabled={creatingExternal}
              />
            </label>
            <label className="space-y-1 text-sm font-semibold text-gray-600">
              {captionLabel('id')}
              <input
                type="text"
                value={externalCaptionId}
                onChange={(event) => setExternalCaptionId(event.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                disabled={creatingExternal}
              />
            </label>

            <label className="space-y-1 text-sm font-semibold text-gray-600">
              {altLabel('ar')}
              <input
                type="text"
                value={externalAltAr}
                onChange={(event) => setExternalAltAr(event.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                disabled={creatingExternal}
              />
            </label>
            <label className="space-y-1 text-sm font-semibold text-gray-600">
              {altLabel('en')}
              <input
                type="text"
                value={externalAltEn}
                onChange={(event) => setExternalAltEn(event.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                disabled={creatingExternal}
              />
            </label>
            <label className="space-y-1 text-sm font-semibold text-gray-600">
              {altLabel('id')}
              <input
                type="text"
                value={externalAltId}
                onChange={(event) => setExternalAltId(event.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                disabled={creatingExternal}
              />
            </label>

            <label className="space-y-1 text-sm font-semibold text-gray-600">
              {t.admin.gallery.sortOrderLabel}
              <input
                type="number"
                value={externalSortOrder}
                onChange={(event) => setExternalSortOrder(event.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                disabled={creatingExternal}
              />
            </label>
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 mt-6">
              <input
                type="checkbox"
                checked={externalPublished}
                onChange={(event) => setExternalPublished(event.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-madinah-green focus:ring-madinah-gold"
                disabled={creatingExternal}
              />
              {t.admin.gallery.publishedLabel}
            </label>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={creatingExternal}
                className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-madinah-green px-4 py-2 text-sm font-semibold text-white hover:bg-madinah-green/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {creatingExternal ? t.admin.gallery.states.creating : t.admin.gallery.actions.create}
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{t.admin.gallery.itemsTitle}</h2>
              <p className="text-sm text-gray-500">{t.admin.gallery.itemsSubtitle}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <label className="text-xs font-semibold text-gray-600">
                {t.admin.gallery.filters.kindLabel}
                <select
                  value={kindFilter}
                  onChange={(event) => setKindFilter(event.target.value as 'all' | GalleryKind)}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600"
                >
                  <option value="all">{t.admin.gallery.filters.kindOptions.all}</option>
                  <option value="photo">{t.admin.gallery.kinds.photo}</option>
                  <option value="video">{t.admin.gallery.kinds.video}</option>
                  <option value="external_video">{t.admin.gallery.kinds.externalVideo}</option>
                </select>
              </label>
              <label className="text-xs font-semibold text-gray-600">
                {t.admin.gallery.filters.publishedLabel}
                <select
                  value={publishedFilter}
                  onChange={(event) => setPublishedFilter(event.target.value as 'all' | 'published' | 'unpublished')}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600"
                >
                  <option value="all">{t.admin.gallery.filters.publishedOptions.all}</option>
                  <option value="published">{t.admin.gallery.filters.publishedOptions.published}</option>
                  <option value="unpublished">{t.admin.gallery.filters.publishedOptions.unpublished}</option>
                </select>
              </label>
              <button
                type="button"
                onClick={() => void fetchItems()}
                className="mt-6 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 hover:border-madinah-gold"
                disabled={loading}
              >
                {t.admin.gallery.actions.refresh}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="mt-4 text-sm text-gray-500">{t.admin.gallery.states.loading}</div>
          ) : loadError ? (
            <div className="mt-4">
              <Alert variant="error">
                <Bdi>{loadError}</Bdi>
              </Alert>
            </div>
          ) : items.length === 0 ? (
            <div className="mt-4 text-sm text-gray-500">{t.admin.gallery.empty}</div>
          ) : filteredItems.length === 0 ? (
            <div className="mt-4 text-sm text-gray-500">{t.admin.gallery.filters.empty}</div>
          ) : (
            <div className="mt-6 space-y-6">
              {filteredItems.map((item) => {
                const resolvedUrl = resolvePublicUrl(item);
                const previewCaption = getPreviewCaption(item);
                const displayDomain = getDomainFromUrl(item.public_url ?? resolvedUrl);
                const isPublished = resolveDraftValue(item, 'is_published', item.is_published) as boolean;
                const sortOrder = resolveDraftValue(item, 'sort_order', item.sort_order ?? 0) as number;

                return (
                  <div key={item.id} className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
                    <div className="flex flex-col gap-4 border-b border-gray-100 pb-4">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                          <div className="w-full max-w-xs overflow-hidden rounded-xl bg-white shadow-sm">
                            {item.kind === 'photo' && resolvedUrl && (
                              <img
                                src={resolvedUrl}
                                alt={previewCaption || t.admin.gallery.previewFallback}
                                className="h-40 w-full object-cover"
                                loading="lazy"
                              />
                            )}
                            {item.kind === 'video' && resolvedUrl && (
                              <video
                                muted
                                playsInline
                                preload="metadata"
                                src={resolvedUrl}
                                className="h-40 w-full object-cover"
                              />
                            )}
                            {item.kind === 'external_video' && (
                              <div className="flex h-40 flex-col items-center justify-center gap-2 bg-white">
                                {item.thumb_url ? (
                                  <img
                                    src={item.thumb_url}
                                    alt={t.gallery.externalThumbnailAlt}
                                    className="h-40 w-full rounded-lg object-cover"
                                    loading="lazy"
                                  />
                                ) : (
                                  <div className="flex h-40 w-full items-center justify-center rounded-lg border border-dashed border-gray-200 text-xs text-gray-400">
                                    {t.admin.gallery.externalPreviewFallback}
                                  </div>
                                )}
                              </div>
                            )}
                            {!resolvedUrl && item.kind !== 'external_video' && (
                              <div className="flex h-40 items-center justify-center text-xs text-gray-400">
                                {t.admin.gallery.previewFallback}
                              </div>
                            )}
                          </div>
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700">
                              {item.kind === 'photo'
                                ? t.admin.gallery.kinds.photo
                                : item.kind === 'video'
                                ? t.admin.gallery.kinds.video
                                : t.admin.gallery.kinds.externalVideo}
                            </div>
                            {previewCaption ? (
                              <div className="text-sm font-semibold text-gray-900">
                                <Bdi dir="auto">{previewCaption}</Bdi>
                              </div>
                            ) : (
                              <div className="text-xs text-gray-400">{t.admin.gallery.captionFallback}</div>
                            )}
                            {item.kind === 'external_video' && displayDomain && (
                              <div className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500">
                                <Link2 className="h-3.5 w-3.5" />
                                <Bdi dir="auto">{displayDomain}</Bdi>
                              </div>
                            )}
                            {resolvedUrl && (
                              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                                <Bdi dir="auto" className="max-w-xs truncate">
                                  {resolvedUrl}
                                </Bdi>
                                <button
                                  type="button"
                                  onClick={() => void handleCopyUrl(item)}
                                  className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-2 py-1 text-xs font-semibold text-gray-600 hover:border-madinah-gold"
                                >
                                  {copiedId === item.id ? (
                                    <>
                                      <Check className="h-3.5 w-3.5 text-madinah-green" />
                                      {t.admin.gallery.actions.copySuccess}
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="h-3.5 w-3.5" />
                                      {t.admin.gallery.actions.copyLink}
                                    </>
                                  )}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                          <label className="inline-flex items-center gap-2 text-xs font-semibold text-gray-600">
                            <input
                              type="checkbox"
                              checked={Boolean(isPublished)}
                              onChange={(event) => void handleTogglePublish(item, event.target.checked)}
                              disabled={publishingId === item.id}
                              className="h-4 w-4 rounded border-gray-300 text-madinah-green focus:ring-madinah-gold"
                            />
                            {t.admin.gallery.publishedLabel}
                          </label>
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => void handleMoveItem(item, -1)}
                              disabled={sorting}
                              className="inline-flex min-h-[32px] items-center justify-center rounded-lg border border-gray-200 px-2 py-1 text-xs font-semibold text-gray-600 hover:border-madinah-gold disabled:cursor-not-allowed disabled:opacity-60"
                              aria-label={t.admin.gallery.actions.moveUp}
                              title={t.admin.gallery.actions.moveUp}
                            >
                              <ArrowUp className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleMoveItem(item, 1)}
                              disabled={sorting}
                              className="inline-flex min-h-[32px] items-center justify-center rounded-lg border border-gray-200 px-2 py-1 text-xs font-semibold text-gray-600 hover:border-madinah-gold disabled:cursor-not-allowed disabled:opacity-60"
                              aria-label={t.admin.gallery.actions.moveDown}
                              title={t.admin.gallery.actions.moveDown}
                            >
                              <ArrowDown className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700">
                          {item.kind === 'photo'
                            ? t.admin.gallery.kinds.photo
                            : item.kind === 'video'
                            ? t.admin.gallery.kinds.video
                            : t.admin.gallery.kinds.externalVideo}
                        </div>
                        {item.storage_key && (
                          <div>
                            <span className="text-xs font-semibold text-gray-500">{t.admin.gallery.storageKeyLabel}</span>
                            <div className="text-xs text-gray-600">
                              <Bdi>{item.storage_key}</Bdi>
                            </div>
                          </div>
                        )}
                        {item.content_type && (
                          <div>
                            <span className="text-xs font-semibold text-gray-500">{t.admin.gallery.contentTypeLabel}</span>
                            <div className="text-xs text-gray-600">{item.content_type}</div>
                          </div>
                        )}
                        {typeof item.size_bytes === 'number' && (
                          <div>
                            <span className="text-xs font-semibold text-gray-500">{t.admin.gallery.sizeLabel}</span>
                            <div className="text-xs text-gray-600">{item.size_bytes}</div>
                          </div>
                        )}
                        {resolvedUrl && (
                          <div>
                            <span className="text-xs font-semibold text-gray-500">{t.admin.gallery.publicUrlLabel}</span>
                            <div className="text-xs text-gray-600 break-all">
                              <Bdi>{resolvedUrl}</Bdi>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        {item.kind !== 'external_video' && (
                          <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-gray-600">
                              {t.admin.gallery.replaceFileLabel}
                              <input
                                type="file"
                                accept={item.kind === 'photo' ? 'image/*' : 'video/*'}
                                onChange={(event) =>
                                  setReplaceFiles((prev) => ({
                                    ...prev,
                                    [item.id]: event.target.files?.[0] ?? null,
                                  }))
                                }
                                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs"
                                disabled={replacingId === item.id}
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                if (!replaceFiles[item.id]) {
                                  setActionError(t.admin.gallery.errors.fileRequired);
                                  return;
                                }
                                setConfirmAction({ type: 'replace', item });
                              }}
                              disabled={replacingId === item.id}
                              className="inline-flex min-h-[36px] items-center justify-center rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-madinah-gold disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {replacingId === item.id ? t.admin.gallery.states.replacing : t.admin.gallery.actions.replace}
                            </button>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => setConfirmAction({ type: 'delete', item })}
                          disabled={deletingId === item.id}
                          className="inline-flex min-h-[36px] items-center justify-center rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:border-red-300 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {deletingId === item.id ? t.admin.gallery.states.deleting : t.admin.gallery.actions.delete}
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      {item.kind === 'external_video' && (
                        <>
                          <label className="space-y-1 text-sm font-semibold text-gray-600 md:col-span-2">
                            {t.admin.gallery.publicUrlLabel}
                            <input
                              type="url"
                              value={String(resolveDraftValue(item, 'public_url', item.public_url ?? '') || '')}
                              onChange={(event) => updateDraft(item.id, { public_url: event.target.value })}
                              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                            />
                          </label>
                          <label className="space-y-1 text-sm font-semibold text-gray-600 md:col-span-2">
                            {t.admin.gallery.thumbUrlLabel}
                            <input
                              type="url"
                              value={String(resolveDraftValue(item, 'thumb_url', item.thumb_url ?? '') || '')}
                              onChange={(event) => updateDraft(item.id, { thumb_url: event.target.value })}
                              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                            />
                          </label>
                        </>
                      )}

                      <label className="space-y-1 text-sm font-semibold text-gray-600">
                        {captionLabel('ar')}
                        <input
                          type="text"
                          value={String(resolveDraftValue(item, 'caption_ar', item.caption_ar ?? ''))}
                          onChange={(event) => updateDraft(item.id, { caption_ar: event.target.value })}
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                        />
                      </label>
                      <label className="space-y-1 text-sm font-semibold text-gray-600">
                        {captionLabel('en')}
                        <input
                          type="text"
                          value={String(resolveDraftValue(item, 'caption_en', item.caption_en ?? ''))}
                          onChange={(event) => updateDraft(item.id, { caption_en: event.target.value })}
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                        />
                      </label>
                      <label className="space-y-1 text-sm font-semibold text-gray-600">
                        {captionLabel('id')}
                        <input
                          type="text"
                          value={String(resolveDraftValue(item, 'caption_id', item.caption_id ?? ''))}
                          onChange={(event) => updateDraft(item.id, { caption_id: event.target.value })}
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                        />
                      </label>

                      <label className="space-y-1 text-sm font-semibold text-gray-600">
                        {altLabel('ar')}
                        <input
                          type="text"
                          value={String(resolveDraftValue(item, 'alt_ar', item.alt_ar ?? ''))}
                          onChange={(event) => updateDraft(item.id, { alt_ar: event.target.value })}
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                        />
                      </label>
                      <label className="space-y-1 text-sm font-semibold text-gray-600">
                        {altLabel('en')}
                        <input
                          type="text"
                          value={String(resolveDraftValue(item, 'alt_en', item.alt_en ?? ''))}
                          onChange={(event) => updateDraft(item.id, { alt_en: event.target.value })}
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                        />
                      </label>
                      <label className="space-y-1 text-sm font-semibold text-gray-600">
                        {altLabel('id')}
                        <input
                          type="text"
                          value={String(resolveDraftValue(item, 'alt_id', item.alt_id ?? ''))}
                          onChange={(event) => updateDraft(item.id, { alt_id: event.target.value })}
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                        />
                      </label>

                      <label className="space-y-1 text-sm font-semibold text-gray-600">
                        {t.admin.gallery.sortOrderLabel}
                        <input
                          type="number"
                          value={String(sortOrder)}
                          onChange={(event) =>
                            updateDraft(item.id, {
                              sort_order: event.target.value === '' ? 0 : Number(event.target.value),
                            })
                          }
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                        />
                      </label>
                      <label className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 mt-6">
                        <input
                          type="checkbox"
                          checked={Boolean(isPublished)}
                          onChange={(event) => updateDraft(item.id, { is_published: event.target.checked })}
                          className="h-4 w-4 rounded border-gray-300 text-madinah-green focus:ring-madinah-gold"
                        />
                        {t.admin.gallery.publishedLabel}
                      </label>

                      <div className="md:col-span-2">
                        <button
                          type="button"
                          onClick={() => void handleSaveItem(item)}
                          disabled={savingId === item.id}
                          className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {savingId === item.id ? t.admin.gallery.states.saving : t.admin.gallery.actions.save}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" dir={dir}>
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setConfirmAction(null)}
          ></div>
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">
              {confirmAction.type === 'delete'
                ? t.admin.gallery.confirmDeleteTitle
                : t.admin.gallery.confirmReplaceTitle}
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              {confirmAction.type === 'delete'
                ? t.admin.gallery.confirmDelete
                : t.admin.gallery.confirmReplace}
            </p>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmAction(null)}
                className="min-h-[40px] rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:border-gray-300"
              >
                {t.common.cancel}
              </button>
              <button
                type="button"
                onClick={() => {
                  const action = confirmAction;
                  setConfirmAction(null);
                  if (action.type === 'delete') {
                    void handleDelete(action.item);
                    return;
                  }
                  if (!replaceFiles[action.item.id]) {
                    setActionError(t.admin.gallery.errors.fileRequired);
                    return;
                  }
                  void handleReplaceFile(action.item);
                }}
                className="min-h-[40px] rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                {confirmAction.type === 'delete'
                  ? t.admin.gallery.actions.confirmDelete
                  : t.admin.gallery.actions.confirmReplace}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
