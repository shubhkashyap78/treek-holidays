import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function LtcDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || "https://andaman-treek-holidays-backend.onrender.com";
    fetch(`${apiUrl}/api/ltc/${id}`)
      .then((r) => { if (!r.ok) throw new Error("Not found"); return r.json(); })
      .then((data) => { setItem(data); setLoading(false); })
      .catch((err) => { 
        console.error('API Error:', err);
        setError("Package not found."); 
        setLoading(false); 
      });
  }, [id]);

  const isAdmin = !!localStorage.getItem("admin_token");

  if (loading) return <div className="detail-loading">Loading...</div>;
  if (error)   return <div className="detail-loading">{error} <a href="/#ltc">← Go back</a></div>;

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">AB</span>
          <div>
            <div className="brand-title">Andaman Bliss</div>
            <div className="brand-sub">Tours and Experiences</div>
          </div>
        </div>
        <nav className="nav">
          <a href="/">Home</a>
          <a href="/#packages">Packages</a>
          <a href="/#activities">Activities</a>
          <a href="/#islands">Islands</a>
          <a href="/#honeymoon">Honeymoon</a>
          <a href="/#family">Family</a>
          <a href="/#ltc">LTC</a>
          <a href="/#contact">Contact</a>
        </nav>
        <div style={{ display: "flex", gap: 8 }}>
          {isAdmin && <button className="ghost" onClick={() => window.location.href = "/admin"}>Admin</button>}
          <button className="cta" onClick={() => window.location.href = "/#contact"}>Book Now</button>
        </div>
      </header>

      <div className="detail-hero" style={{ backgroundImage: `url(${item.image})` }}>
        <div className="detail-hero-overlay">
          <div className="pill" style={{ marginBottom: 12 }}>LTC Package</div>
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
              <li>✅ Return airfare (as per LTC entitlement)</li>
              <li>✅ Hotel accommodation (LTC-approved)</li>
              <li>✅ Daily breakfast & dinner</li>
              <li>✅ All transfers by private AC vehicle</li>
              <li>✅ Ferry tickets (Port Blair ↔ Havelock ↔ Neil)</li>
              <li>✅ Sightseeing as per itinerary</li>
              <li>✅ LTC billing & documentation support</li>
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
              <span className="detail-info-value">LTC</span>
            </div>
            <div className="detail-btn-group">
              <button className="cta block" onClick={() => window.location.href = "/#contact"}>Book Now</button>
              <button className="ghost" onClick={() => window.location.href = "/#contact"}>Send Enquiry</button>
            </div>
          </div>
        </aside>
      </div>

      <footer className="footer">
        <div>Andaman Bliss</div>
        <div><a href="/#ltc" style={{ color: "var(--muted)" }}>← All LTC Packages</a></div>
      </footer>
    </div>
  );
}
