import React from "react";

// PUBLIC_INTERFACE
export default function Footer() {
  /** Branded footer with minimal links. */
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>© {new Date().getFullYear()} Travel Photos</div>
        <div style={{ display: "flex", gap: 16 }}>
          <a href="https://unsplash.com" target="_blank" rel="noreferrer" style={{ color: "inherit", textDecoration: "none" }}>
            Photos via Unsplash
          </a>
          <a href="/privacy" style={{ color: "inherit", textDecoration: "none" }}>
            Privacy
          </a>
        </div>
      </div>
    </footer>
  );
}
