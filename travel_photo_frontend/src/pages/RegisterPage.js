import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// PUBLIC_INTERFACE
export default function RegisterPage() {
  /** Registration page for creating a new user account. On success, auto-logs in and redirects to prior page or home. */
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const from = location.state?.from || "/";

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    try {
      setSubmitting(true);
      await register(email, password, name.trim() || null);
      navigate(from, { replace: true });
    } catch (e2) {
      setError(e2.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-card" role="main">
      <h2 className="auth-title">Create your account</h2>
      <div className="auth-subtitle">Join to save and search your travel photos.</div>

      {error && <div className="error" role="alert">{error}</div>}

      <form onSubmit={onSubmit} noValidate>
        <div className="form-row">
          <label htmlFor="name">Name (optional)</label>
          <input
            className="input"
            id="name"
            type="text"
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
        </div>

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
            autoComplete="new-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-required="true"
            minLength={6}
          />
        </div>

        <div className="form-row">
          <label htmlFor="confirm">Confirm password</label>
          <input
            className="input"
            id="confirm"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            aria-required="true"
            minLength={6}
          />
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 10, alignItems: "center", flexWrap: "wrap" }}>
          <button className="btn" type="submit" disabled={submitting}>
            {submitting ? "Creating account..." : "Create account"}
          </button>
          <Link className="btn secondary" to="/login" state={{ from }}>
            I already have an account
          </Link>
          <a className="btn secondary" href="/" onClick={(e) => { e.preventDefault(); navigate("/"); }}>
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
