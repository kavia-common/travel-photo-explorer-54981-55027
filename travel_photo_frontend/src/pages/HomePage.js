import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PhotoGrid from "../components/PhotoGrid";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";

// PUBLIC_INTERFACE
export default function HomePage() {
  /** Home page: search by location with your photos and Unsplash images. */
  const { token, user, ready } = useAuth();
  const [query, setQuery] = useState("");
  const [myPhotos, setMyPhotos] = useState([]);
  const [unsplash, setUnsplash] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unsplashLoading, setUnsplashLoading] = useState(false);
  const [error, setError] = useState("");

  const canSearchMy = useMemo(() => ready && !!token, [ready, token]);

  useEffect(() => {
    // Initial load: if logged in, load all photos.
    if (!canSearchMy) return;
    let ignore = false;
    async function loadInitial() {
      try {
        setLoading(true);
        const data = await api.listMyPhotos(token);
        if (!ignore) setMyPhotos(data);
      } catch (e) {
        if (!ignore) setError(e.message || "Failed to load photos");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    loadInitial();
    return () => { ignore = true; };
  }, [canSearchMy, token]);

  const handleSearch = async (term) => {
    setQuery(term);
    setError("");
    if (term.length === 0) {
      // Clear to default
      if (token) {
        try {
          setLoading(true);
          const data = await api.listMyPhotos(token);
          setMyPhotos(data);
        } catch (e) {
          setError(e.message || "Failed to load photos");
        } finally {
          setLoading(false);
        }
      } else {
        setMyPhotos([]);
      }
      setUnsplash([]);
      return;
    }

    // My photos (if authenticated)
    if (token) {
      try {
        setLoading(true);
        const data = await api.searchMyPhotos(token, term);
        setMyPhotos(data);
      } catch (e) {
        setError(e.message || "Failed to search your photos");
      } finally {
        setLoading(false);
      }
    } else {
      setMyPhotos([]);
    }

    // Unsplash images
    try {
      setUnsplashLoading(true);
      const u = await api.searchUnsplash(term, 1, 12);
      setUnsplash(u?.results || []);
    } catch (_e) {
      // ignore external errors but do not break UX
      setUnsplash([]);
    } finally {
      setUnsplashLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <Header onSearch={handleSearch} />
      <main>
        <section className="main">
          {!user && ready && (
            <div style={{
              padding: 18,
              borderRadius: 16,
              background: "linear-gradient(180deg, rgba(255,255,255,.9), rgba(255,255,255,.7))",
              border: "1px solid rgba(17,24,39,.06)",
              boxShadow: "var(--shadow)",
              marginTop: 18
            }}>
              You are browsing as guest. Login to view your personal photos. You can still search Unsplash using the search bar above.
            </div>
          )}
          {error && (
            <div className="error" role="alert" style={{ marginTop: 14 }}>{error}</div>
          )}
        </section>

        {user && (
          <PhotoGrid
            title={loading ? "Loading your photos..." : (query ? `Your photos for "${query}"` : "Your photos")}
            items={myPhotos}
            itemType="photo"
          />
        )}

        <PhotoGrid
          title={unsplashLoading ? "Searching Unsplash..." : (query ? `Unsplash for "${query}"` : "Featured from Unsplash")}
          items={unsplash}
          itemType="unsplash"
        />
      </main>
      <Footer />
    </div>
  );
}
