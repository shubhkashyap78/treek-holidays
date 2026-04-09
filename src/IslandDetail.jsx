import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fallbackIslands } from "./fallbackData.js";

export default function IslandDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log('Fetching island with ID:', id);
    
    const apiUrl = import.meta.env.VITE_API_URL || "https://andaman-treek-holidays-backend.onrender.com";
    fetch(`${apiUrl}/api/islands/${id}`)
      .then((r) => {
        console.log('API Response status:', r.status);
        if (!r.ok) throw new Error(`HTTP ${r.status}: Not found`);
        return r.json();
      })
      .then((data) => { 
        console.log('Island data received:', data);
        setItem(data); 
        setLoading(false); 
      })
      .catch((err) => { 
        console.error('API Error:', err);
        console.log('Trying fallback data for ID:', id);
        
        // Fallback to static data if API fails
        const fallbackItem = fallbackIslands.find(item => item._id === id);
        console.log('Fallback item found:', fallbackItem);
        
        if (fallbackItem) {
          setItem(fallbackItem);
          setLoading(false);
        } else {
          console.log('Available fallback IDs:', fallbackIslands.map(item => item._id));
          setError(`Island not found. ID: ${id}`);
          setLoading(false);
        }
      });
  }, [id]);

  const isAdmin = !!localStorage.getItem("admin_token");

  if (loading) return <div className="detail-loading">Loading...</div>;
  if (error) return (
    <div className="detail-loading">
      <div>{error}</div>
      <div style={{ marginTop: 16, fontSize: 14, color: "var(--muted)" }}>
        <div>Available Island IDs:</div>
        <ul style={{ marginTop: 8, paddingLeft: 20 }}>
          {fallbackIslands.map(item => (
            <li key={item._id}>
              <a href={`/islands/${item._id}`} style={{ color: "var(--accent)" }}>
                {item._id} - {item.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <a href="/islands" style={{ marginTop: 16, display: "inline-block" }}>← Go back to Islands</a>
    </div>
  );

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">AB</span>
          <div>
            <div className="brand-title">Andaman Treek Holidays</div>
            <div className="brand-sub">Tours and Experiences</div>
          </div>
        </div>
        <nav className="nav">
          <a href="/">Home</a>
          <a href="/#packages">Packages</a>
          <a href="/activities">Activities</a>
          <a href="/islands">Islands</a>
          <a href="/ferries">Ferry</a>
          <a href="/#contact">Contact</a>
        </nav>
        <div style={{ display: "flex", gap: 8 }}>
          {isAdmin && <button className="ghost" onClick={() => window.location.href = "/admin"}>Admin</button>}
          <button className="cta" onClick={() => window.location.href = "/#contact"}>Book Now</button>
        </div>
      </header>

      <div className="detail-hero" style={{ backgroundImage: `url(${item.image})` }}>
        <div className="detail-hero-overlay">
          <div className="pill" style={{ marginBottom: 12 }}>🏝️ Island Paradise</div>
          <h1 className="detail-title">{item.name}</h1>
          {item.tagline && <p className="detail-subtitle">{item.tagline}</p>}
        </div>
      </div>

      <div className="detail-body">
        <div className="detail-main">
          <section className="detail-section">
            <h2>About {item.name}</h2>
            <p>{item.description || "No description available."}</p>
          </section>

          {Array.isArray(item.highlights) && item.highlights.length > 0 && (
            <section className="detail-section">
              <h2>Key Attractions</h2>
              <ul className="detail-highlights">
                {item.highlights.map((h, i) => <li key={i}>🌟 {h}</li>)}
              </ul>
            </section>
          )}

          <section className="detail-section">
            <h2>What to Expect</h2>
            <ul className="detail-highlights">
              <li>🏖️ Pristine white sand beaches</li>
              <li>🌊 Crystal-clear turquoise waters</li>
              <li>🐠 Rich marine life and coral reefs</li>
              <li>🌴 Lush tropical vegetation</li>
              <li>📸 Perfect spots for photography</li>
              <li>🌅 Stunning sunrise and sunset views</li>
            </ul>
          </section>

          <section className="detail-section">
            <h2>Best Time to Visit</h2>
            <div style={{ background: "#f0f9ff", border: "1px solid #0ea5e9", borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <h4 style={{ margin: "0 0 8px", color: "#0369a1" }}>Peak Season (October - May)</h4>
              <p style={{ margin: 0, fontSize: 14, color: "#0369a1" }}>Perfect weather with calm seas and clear skies. Ideal for water activities and beach exploration.</p>
            </div>
            <div style={{ background: "#fef3c7", border: "1px solid #f59e0b", borderRadius: 12, padding: 16 }}>
              <h4 style={{ margin: "0 0 8px", color: "#92400e" }}>Monsoon Season (June - September)</h4>
              <p style={{ margin: 0, fontSize: 14, color: "#92400e" }}>Heavy rainfall and rough seas. Limited water activities but lush green landscapes.</p>
            </div>
          </section>

          {Array.isArray(item.tags) && item.tags.length > 0 && (
            <section className="detail-section">
              <div className="detail-tags">
                {item.tags.map((t, i) => <span key={i} className="detail-tag">{t}</span>)}
              </div>
            </section>
          )}
        </div>

        <aside className="detail-sidebar">
          <div className="detail-card">
            <div className="detail-price-label">Island Experience</div>
            <div className="detail-price">Free to Explore</div>
            <div className="detail-price-sub">Natural Paradise</div>
            <div className="detail-divider" />
            <div className="detail-info-row">
              <span className="detail-info-label">Type</span>
              <span className="detail-info-value">Tropical Island</span>
            </div>
            <div className="detail-info-row">
              <span className="detail-info-label">Best For</span>
              <span className="detail-info-value">Beach Lovers</span>
            </div>
            <div className="detail-info-row">
              <span className="detail-info-label">Activities</span>
              <span className="detail-info-value">Swimming, Snorkeling</span>
            </div>
            <div className="detail-btn-group">
              <button className="cta block" onClick={() => window.location.href = "/#contact"}>Plan Visit</button>
              <button className="ghost" onClick={() => window.location.href = "/#contact"}>Get Packages</button>
            </div>
          </div>

          <div className="detail-card" style={{ marginTop: 20 }}>
            <h3 style={{ marginBottom: 12, fontSize: 16 }}>Travel Tips</h3>
            <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>
              <p>🚤 <strong>Ferry Services:</strong> Regular ferries connect major islands</p>
              <p>🏨 <strong>Accommodation:</strong> Book in advance during peak season</p>
              <p>💧 <strong>Water:</strong> Carry drinking water and stay hydrated</p>
              <p>🧴 <strong>Sun Protection:</strong> Use sunscreen and protective clothing</p>
            </div>
          </div>
        </aside>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-brand">
              <span className="brand-mark">AB</span>
              <div>
                <div className="brand-title">Andaman Treek Holidays</div>
                <div className="brand-sub">Tours and Experiences</div>
              </div>
            </div>
            <p className="footer-desc">Your trusted partner for unforgettable Andaman adventures.</p>
          </div>
          <div className="footer-section">
            <div className="footer-title">Quick Links</div>
            <a href="/activities" className="footer-link">Activities</a>
            <a href="/islands" className="footer-link">Islands</a>
            <a href="/ferries" className="footer-link">Ferry Services</a>
            <a href="/#contact" className="footer-link">Contact</a>
          </div>
          <div className="footer-section">
            <div className="footer-title">Packages</div>
            <a href="/honeymoon" className="footer-link">Honeymoon</a>
            <a href="/family" className="footer-link">Family</a>
            <a href="/group" className="footer-link">Group Tours</a>
            <a href="/ltc" className="footer-link">LTC Packages</a>
          </div>
          <div className="footer-section">
            <div className="footer-title">Contact Us</div>
            <a href="tel:+919000000000" className="footer-link">📞 +91-90000-00000</a>
            <a href="mailto:hello@andamantreekholidays.com" className="footer-link">✉️ hello@andamantreekholidays.com</a>
            <div className="footer-link">📍 Port Blair, Andaman</div>
          </div>
        </div>
        <div className="footer-bottom">
          <div>© 2026 Andaman Treek Holidays. All rights reserved.</div>
          <div>Built with ❤️ JR Technology</div>
        </div>
      </footer>
    </div>
  );
}