import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

// PUBLIC_INTERFACE
export default function Header({ onSearch }) {
  /** Header with brand, search box, and auth actions. */
  const { user, logout } = useAuth();
  const [q, setQ] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const term = q.trim();
    onSearch?.(term);
  };

  return (
    <header className="header">
      <div className="header-inner">
        <div className="brand">
          <div className="brand-badge" aria-hidden="true" />
          <div className="app-title">Travel Photos</div>
        </div>

        <form className="search" onSubmit={submit} role="search" aria-label="Location search">
          <input
            className="search-input"
            type="search"
            placeholder="Search by location (e.g., Kyoto, Paris)"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search photos by location"
          />
          <button className="btn" type="submit" title="Search">Search</button>
        </form>

        <div style={{ display: "flex", justifyContent: "end", gap: 10 }}>
          {user ? (
            <>
              <div style={{ alignSelf: "center", color: "var(--muted)", fontSize: 14 }}>
                Hello, {user.name || user.email}
              </div>
              <button className="btn secondary" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <a className="btn secondary" href="/login">Login</a>
              <a className="btn" href="/register" style={{ textDecoration: "none" }}>Sign up</a>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
