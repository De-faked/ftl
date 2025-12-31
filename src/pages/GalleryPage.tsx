import React, { useMemo, useState } from "react";

// Adjust this import path if your project uses a different alias setup.
import manifest from "../content/photos.manifest.json";

// TODO: replace these with your real i18n hook/function.
// For now we keep UI strings minimal to avoid hardcoding later.
function useT() {
  return (key: string) => key;
}

type PhotoItem = {
  id: string;
  category: "medina" | "institute";
  album: string;
  originalRelativePath: string;
  width: number;
  height: number;
  thumb: string;
  src: string;
  srcSet: string;
};

const ALL = "all";
type Filter = typeof ALL | PhotoItem["category"];

export default function GalleryPage() {
  const t = useT();
  const [filter, setFilter] = useState<Filter>(ALL);
  const [active, setActive] = useState<PhotoItem | null>(null);

  const items: PhotoItem[] = (manifest as any).items ?? [];

  const filtered = useMemo(() => {
    if (filter === ALL) return items;
    return items.filter((p) => p.category === filter);
  }, [items, filter]);

  const title =
    filter === "medina"
      ? "Gallery — Medina"
      : filter === "institute"
      ? "Gallery — Institute"
      : "Gallery";

  return (
    <main className="page">
      <header className="pageHeader">
        <h1 className="pageTitle">{title}</h1>

        <div className="filters" role="tablist" aria-label="Gallery filters">
          <button
            type="button"
            className={`filterBtn ${filter === ALL ? "isActive" : ""}`}
            onClick={() => setFilter(ALL)}
            role="tab"
            aria-selected={filter === ALL}
          >
            All
          </button>
          <button
            type="button"
            className={`filterBtn ${filter === "medina" ? "isActive" : ""}`}
            onClick={() => setFilter("medina")}
            role="tab"
            aria-selected={filter === "medina"}
          >
            Medina
          </button>
          <button
            type="button"
            className={`filterBtn ${filter === "institute" ? "isActive" : ""}`}
            onClick={() => setFilter("institute")}
            role="tab"
            aria-selected={filter === "institute"}
          >
            Institute
          </button>
        </div>

        <p className="pageHint">
          {filtered.length} photo{filtered.length === 1 ? "" : "s"}
        </p>
      </header>

      <section className="grid" aria-label="Photo gallery">
        {filtered.map((p) => {
          const alt =
            p.category === "medina"
              ? `Medina photo — ${p.album}`
              : `Institute photo`;

          return (
            <button
              key={p.id}
              type="button"
              className="card"
              onClick={() => setActive(p)}
              aria-label={`Open photo`}
            >
              <img
                className="img"
                src={p.src}
                srcSet={p.srcSet}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                width={p.width}
                height={p.height}
                loading="lazy"
                decoding="async"
                alt={alt}
              />
              <div className="meta">
                <span className="badge">{p.category === "medina" ? "Medina" : "Institute"}</span>
                {p.category === "medina" && <span className="album">{p.album}</span>}
              </div>
            </button>
          );
        })}
      </section>

      {active && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Photo preview"
          onClick={() => setActive(null)}
        >
          <div className="lightboxInner" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="closeBtn"
              onClick={() => setActive(null)}
              aria-label="Close"
            >
              ×
            </button>

            <img
              className="lightboxImg"
              src={active.src}
              srcSet={active.srcSet}
              sizes="90vw"
              width={active.width}
              height={active.height}
              decoding="async"
              alt={active.category === "medina" ? `Medina photo — ${active.album}` : `Institute photo`}
            />

            <div className="lightboxMeta">
              <strong>{active.category === "medina" ? "Medina" : "Institute"}</strong>
              {active.category === "medina" ? ` — ${active.album}` : ""}
            </div>
          </div>
        </div>
      )}

      <style>{css}</style>
    </main>
  );
}

const css = `
.page { padding: 24px 16px; max-width: 1100px; margin: 0 auto; }
.pageHeader { display: grid; gap: 10px; margin-bottom: 16px; }
.pageTitle { font-size: 28px; line-height: 1.2; margin: 0; }
.pageHint { margin: 0; opacity: 0.75; }

.filters { display: flex; gap: 8px; flex-wrap: wrap; }
.filterBtn {
  border: 1px solid rgba(255,255,255,0.15);
  background: transparent;
  padding: 8px 12px;
  border-radius: 10px;
  cursor: pointer;
}
.filterBtn.isActive {
  border-color: rgba(255,255,255,0.45);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
}
.card {
  border: 1px solid rgba(255,255,255,0.10);
  background: rgba(255,255,255,0.03);
  border-radius: 14px;
  overflow: hidden;
  padding: 0;
  cursor: pointer;
  text-align: left;
}
.img {
  width: 100%;
  height: auto;
  display: block;
  background: rgba(255,255,255,0.04);
}
.meta {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 10px 12px;
}
.badge {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.18);
  opacity: 0.9;
}
.album { font-size: 13px; opacity: 0.8; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.72);
  display: grid;
  place-items: center;
  padding: 20px;
  z-index: 9999;
}
.lightboxInner {
  width: min(100%, 1100px);
  background: rgba(20,20,20,0.98);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 16px;
  overflow: hidden;
  position: relative;
}
.closeBtn {
  position: absolute;
  top: 8px;
  right: 10px;
  border: 1px solid rgba(255,255,255,0.18);
  background: rgba(0,0,0,0.35);
  border-radius: 10px;
  width: 38px;
  height: 38px;
  cursor: pointer;
  font-size: 22px;
  line-height: 1;
}
.lightboxImg { width: 100%; height: auto; display: block; }
.lightboxMeta { padding: 10px 12px; opacity: 0.9; }
`;
