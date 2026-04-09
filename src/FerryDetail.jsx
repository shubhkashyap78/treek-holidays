import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fallbackFerry } from "./fallbackData.js";

function formatPrice(value) {
  if (!value) return "On Request";
  return `INR ${value.toLocaleString("en-IN")}`;
}

export default function FerryDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || "https://andaman-treek-holidays-backend.onrender.com";
    fetch(`${apiUrl}/api/ferry/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data) => { setItem(data); setLoading(false); })
      .catch((err) => { 
        console.error('API Error:', err);
        // Fallback to static data if API fails
        const fallbackItem = fallbackFerry.find(item => item._id === id);
        if (fallbackItem) {
          setItem(fallbackItem);
          setLoading(false);
        } else {
          setError("Ferry not found."); 
          setLoading(false);
        }
      });
  }, [id]);

  const isAdmin = !!localStorage.getItem("admin_token");

  if (loading) return <div className="detail-loading">Loading...</div>;
  if (error) return <div className="detail-loading">{error} <a href="/ferries">← Go back</a></div>;

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
          <div className="pill" style={{ marginBottom: 12 }}>⛴️ {item.type} Ferry</div>
          <h1 className="detail-title">{item.name}</h1>
          <div className="detail-meta-row">
            <span className="detail-badge">⏱ {item.duration}</span>
            {item.priceFrom > 0 && <span className="detail-badge">💰 {formatPrice(item.priceFrom)}</span>}
          </div>
        </div>
      </div>

      <div className="detail-body">
        <div className="detail-main">
          <section className="detail-section">
            <h2>About {item.name}</h2>
            <p>{item.description || "No description available."}</p>
          </section>

          {Array.isArray(item.features) && item.features.length > 0 && (
            <section className="detail-section">
              <h2>Ferry Features</h2>
              <ul className="detail-highlights">
                {item.features.map((f, i) => <li key={i}>✅ {f}</li>)}
              </ul>
            </section>
          )}

          <section className="detail-section">
            <h2>What's Included</h2>
            <ul className="detail-highlights">
              <li>✅ Comfortable seating arrangements</li>
              <li>✅ Life jackets and safety equipment</li>
              <li>✅ Professional crew and captain</li>
              <li>✅ Weather updates and safety briefing</li>
              <li>✅ Onboard assistance</li>
              <li>✅ Scenic island views during journey</li>
            </ul>
          </section>

          <section className="detail-section">
            <h2>Ferry Routes & Schedule</h2>
            <div className="route-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 16 }}>
              <div style={{ background: "#f0f9ff", border: "1px solid #0ea5e9", borderRadius: 12, padding: 16 }}>
                <h4 style={{ margin: "0 0 8px", color: "#0369a1", display: "flex", alignItems: "center", gap: 8 }}>
                  🗺️ Popular Routes
                </h4>
                <ul style={{ margin: 0, paddingLeft: 20, color: "#0369a1" }}>
                  <li>Port Blair ↔ Havelock Island</li>
                  <li>Port Blair ↔ Neil Island</li>
                  <li>Havelock ↔ Neil Island</li>
                </ul>
              </div>
              <div style={{ background: "#fef3c7", border: "1px solid #f59e0b", borderRadius: 12, padding: 16 }}>
                <h4 style={{ margin: "0 0 8px", color: "#92400e", display: "flex", alignItems: "center", gap: 8 }}>
                  ⚠️ Important Notes
                </h4>
                <ul style={{ margin: 0, paddingLeft: 20, color: "#92400e", fontSize: 14 }}>
                  <li>Weather-dependent schedules</li>
                  <li>Advance booking recommended</li>
                  <li>Arrive 30 min early</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="detail-section">
            <h2>Safety Guidelines</h2>
            <ul className="detail-highlights">
              <li>⚠️ Follow crew instructions at all times</li>
              <li>⚠️ Keep life jackets accessible</li>
              <li>⚠️ No smoking or alcohol onboard</li>
              <li>⚠️ Secure all belongings during journey</li>
              <li>⚠️ Report any concerns to crew immediately</li>
              <li>⚠️ Children must be supervised by adults</li>
            </ul>
          </section>
        </div>

        <aside className="detail-sidebar">
          <div className="detail-card">
            <div className="detail-price-label">Starting From</div>
            <div className="detail-price">
              {item.priceFrom > 0 ? formatPrice(item.priceFrom) : "On Request"}
            </div>
            <div className="detail-price-sub">per person</div>
            <div className="detail-divider" />
            {item.duration && (
              <div className="detail-info-row">
                <span className="detail-info-label">Journey Time</span>
                <span className="detail-info-value">{item.duration}</span>
              </div>
            )}
            {item.type && (
              <div className="detail-info-row">
                <span className="detail-info-label">Ferry Type</span>
                <span className="detail-info-value">{item.type}</span>
              </div>
            )}
            <div className="detail-info-row">
              <span className="detail-info-label">Capacity</span>
              <span className="detail-info-value">200+ Passengers</span>
            </div>
            <div className="detail-btn-group">
              <button className="cta block" onClick={() => window.location.href = "/#contact"}>Book Ferry</button>
              <button className="ghost" onClick={() => window.location.href = "/#contact"}>Check Schedule</button>
            </div>
          </div>

          <div className="detail-card" style={{ marginTop: 20 }}>
            <h3 style={{ marginBottom: 12, fontSize: 16 }}>Booking Tips</h3>
            <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>
              <p>🎫 <strong>Advance Booking:</strong> Book 2-3 days ahead during peak season</p>
              <p>🌊 <strong>Weather Check:</strong> Monitor weather conditions before travel</p>
              <p>🎒 <strong>Pack Light:</strong> Limited luggage space available</p>
              <p>💊 <strong>Motion Sickness:</strong> Carry medication if prone to seasickness</p>
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