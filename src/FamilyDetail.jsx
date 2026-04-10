import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fallbackFamily } from "./fallbackData.js";

export default function FamilyDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fallback = fallbackFamily.find(f => f._id === id);
    if (fallback) { setItem(fallback); setLoading(false); }

    const apiUrl = import.meta.env.VITE_API_URL || "https://andaman-treek-holidays-backend.onrender.com";
    fetch(`${apiUrl}/api/family/${id}`)
      .then((r) => { if (!r.ok) throw new Error("Not found"); return r.json(); })
      .then((data) => { setItem(data); setLoading(false); })
      .catch(() => {
        if (!fallback) { setError("Package not found."); setLoading(false); }
      });
  }, [id]);

  const isAdmin = !!localStorage.getItem("admin_token");

  if (loading) return <div className="detail-loading">Loading...</div>;
  if (error)   return <div className="detail-loading">{error} <a href="/#family">← Go back</a></div>;

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">AB</span>
          <div>
            <div className="brand-title">Andaman Treek Holidays </div>
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
          {isAdmin && (
            <button className="ghost" onClick={() => window.location.href = "/admin"}>Admin</button>
          )}
          <button className="cta" onClick={() => window.location.href = "/#contact"}>Book Now</button>
        </div>
      </header>

      <div className="detail-hero" style={{ backgroundImage: `url(${item.image})` }}>
        <div className="detail-hero-overlay">
          <div className="pill" style={{ marginBottom: 12 }}>Family Package</div>
          <h1 className="detail-title">{item.title}</h1>
          {item.subtitle && <p className="detail-subtitle">{item.subtitle}</p>}
          <div className="detail-meta-row">
            {item.duration && <span className="detail-badge">🕐 {item.duration}</span>}
            {item.priceFrom > 0 && <span className="detail-badge">💰 INR {item.priceFrom.toLocaleString("en-IN")}</span>}
          </div>
        </div>
      </div>

      <div className="detail-body">
        <div className="detail-main">
          <section className="detail-section">
            <h2>About this Package</h2>
            <p>{item.description || "No description available."}</p>
          </section>

          {Array.isArray(item.highlights) && item.highlights.length > 0 && (
            <section className="detail-section">
              <h2>Highlights</h2>
              <ul className="detail-highlights">
                {item.highlights.map((h, i) => <li key={i}>✅ {h}</li>)}
              </ul>
            </section>
          )}

          <section className="detail-section">
            <h2>Inclusions</h2>
            <ul className="detail-highlights">
              <li>✅ Return airfare (Delhi / Mumbai to Port Blair)</li>
              <li>✅ Hotel accommodation (as per package)</li>
              <li>✅ Daily breakfast & dinner</li>
              <li>✅ All transfers by private AC vehicle</li>
              <li>✅ Ferry tickets (Port Blair ↔ Havelock ↔ Neil)</li>
              <li>✅ Sightseeing as per itinerary</li>
              <li>✅ Welcome drink on arrival</li>
              <li>✅ All applicable taxes</li>
            </ul>
          </section>

          <section className="detail-section">
            <h2>Exclusions</h2>
            <ul className="detail-highlights">
              <li>❌ Personal expenses & tips</li>
              <li>❌ Water sports & adventure activities</li>
              <li>❌ Travel insurance</li>
              <li>❌ Any meals not mentioned in inclusions</li>
              <li>❌ Entry fees to monuments</li>
              <li>❌ Anything not mentioned in inclusions</li>
            </ul>
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
            <div className="detail-price-label">Starting From</div>
            <div className="detail-price">
              {item.priceFrom > 0 ? `INR ${item.priceFrom.toLocaleString("en-IN")}` : "On Request"}
            </div>
            <div className="detail-price-sub">per person (approx)</div>
            <div className="detail-divider" />
            {item.duration && (
              <div className="detail-info-row">
                <span className="detail-info-label">Duration</span>
                <span className="detail-info-value">{item.duration}</span>
              </div>
            )}
            {item.subtitle && (
              <div className="detail-info-row">
                <span className="detail-info-label">Type</span>
                <span className="detail-info-value">{item.subtitle}</span>
              </div>
            )}
            <div className="detail-info-row">
              <span className="detail-info-label">Category</span>
              <span className="detail-info-value">Family</span>
            </div>
            <div className="detail-btn-group">
              <button className="cta block" onClick={() => window.location.href = "/#contact"}>Book Now</button>
              <button className="ghost" onClick={() => window.location.href = "/#contact"}>Send Enquiry</button>
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
