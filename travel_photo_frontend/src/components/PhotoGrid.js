import React from "react";

// PUBLIC_INTERFACE
export default function PhotoGrid({ title, items, itemType = "photo" }) {
  /** Responsive grid for photos or Unsplash images. */
  return (
    <section className="main">
      <div className="grid-title">
        <h3 style={{ margin: 0 }}>{title}</h3>
        <div style={{ color: "var(--muted)" }}>
          {items?.length || 0} {items?.length === 1 ? "item" : "items"}
        </div>
      </div>
      <div className="grid">
        {(items || []).map((p, i) => (
          <article className={`card ${i % 7 === 0 ? "large" : ""}`} key={(p.id || p.image_url || p.url_full || i) + "-card"}>
            <img
              className="card-media"
              src={p.image_url || p.url_small || p.url_full}
              alt={p.title || p.alt_description || p.description || "Travel photo"}
              loading="lazy"
            />
            <div className="card-body">
              <div className="card-title">{p.title || p.alt_description || "Untitled"}</div>
              <div className="card-sub">
                {p.location || (p.photographer ? `By ${p.photographer}` : itemType)}
              </div>
            </div>
          </article>
        ))}
        {(!items || items.length === 0) && (
          <div style={{
            gridColumn: "1 / -1",
            padding: 24,
            borderRadius: 16,
            background: "linear-gradient(180deg, rgba(255,255,255,.9), rgba(255,255,255,.7))",
            border: "1px solid rgba(17,24,39,.06)",
            textAlign: "center",
            color: "var(--muted)"
          }}>
            No results yet. Try a different location.
          </div>
        )}
      </div>
    </section>
  );
}
