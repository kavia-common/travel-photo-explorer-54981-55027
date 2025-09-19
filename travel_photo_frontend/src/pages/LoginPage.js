import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// PUBLIC_INTERFACE
export default function LoginPage() {
  /** Login page for user authentication. */
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const from = location.state?.from || "/";

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (e) {
      setError(e.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-card" role="main">
      <h2 className="auth-title">Welcome back</h2>
      <div className="auth-subtitle">Sign in to view your travel photo collection.</div>

      {error && <div className="error" role="alert">{error}</div>}

      <form onSubmit={onSubmit}>
        <div className="form-row">
          <label htmlFor="email">Email</label>
          <input
            className="input"
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-required="true"
          />
        </div>
        <div className="form-row">
          <label htmlFor="password">Password</label>
          <input
            className="input"
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-required="true"
          />
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          <button className="btn" type="submit" disabled={submitting}>
            {submitting ? "Signing in..." : "Sign in"}
          </button>
          <a className="btn secondary" href="/" onClick={(e) => { e.preventDefault(); navigate("/"); }}>
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
