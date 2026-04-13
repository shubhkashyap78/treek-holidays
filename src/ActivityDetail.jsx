import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fallbackActivities } from "./fallbackData.js";

export default function ActivityDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || "https://andaman-treek-holidays-backend.onrender.com";
    
    console.log('Fetching activity with ID:', id);
    
    fetch(`${apiUrl}/api/activities/${id}`)
      .then((r) => {
        console.log('API Response status:', r.status);
        if (!r.ok) throw new Error(`HTTP ${r.status}: Not found`);
        return r.json();
      })
      .then((data) => { 
        console.log('Activity data received:', data);
        setItem(data); 
        setLoading(false); 
      })
      .catch((err) => { 
        console.error('API Error:', err);
        console.log('Trying fallback data for ID:', id);
        
        // Fallback to static data if API fails
        const fallbackItem = fallbackActivities.find(item => item._id === id);
        console.log('Fallback item found:', fallbackItem);
        
        if (fallbackItem) {
          setItem(fallbackItem);
          setLoading(false);
        } else {
          console.log('Available fallback IDs:', fallbackActivities.map(item => item._id));
          setError(`Activity not found. ID: ${id}`);
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
        <div>Available Activity IDs:</div>
        <ul style={{ marginTop: 8, paddingLeft: 20 }}>
          {fallbackActivities.map(item => (
            <li key={item._id}>
              <a href={`/activities/${item._id}`} style={{ color: "var(--accent)" }}>
                {item._id} - {item.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <a href="/activities" style={{ marginTop: 16, display: "inline-block" }}>← Go back to Activities</a>
    </div>
  );

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">AB</span>
          <div>
            <div className="brand-title">My Andaman Tour</div>
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
          <div className="pill" style={{ marginBottom: 12 }}>{item.category} Activity</div>
          <h1 className="detail-title">{item.title}</h1>
          <div className="detail-meta-row">
            {item.duration && <span className="detail-badge">⏱ {item.duration}</span>}
            {item.location && <span className="detail-badge">📍 {item.location}</span>}
            {item.priceFrom > 0 && <span className="detail-badge">💰 INR {item.priceFrom.toLocaleString("en-IN")}</span>}
          </div>
        </div>
      </div>

      <div className="detail-body">
        <div className="detail-main">
          <section className="detail-section">
            <h2>About this Activity</h2>
            <p>{item.description || "No description available."}</p>
          </section>

          <section className="detail-section">
            <h2>What's Included</h2>
            <ul className="detail-highlights">
              <li>✅ Professional instructor guidance</li>
              <li>✅ All safety equipment provided</li>
              <li>✅ Underwater photography (where applicable)</li>
              <li>✅ Transportation from hotel</li>
              <li>✅ Refreshments</li>
              <li>✅ Certificate of participation</li>
            </ul>
          </section>

          <section className="detail-section">
            <h2>Important Information</h2>
            <ul className="detail-highlights">
              <li>⚠️ Age limit: 10-60 years</li>
              <li>⚠️ Basic swimming knowledge required</li>
              <li>⚠️ Medical fitness certificate needed</li>
              <li>⚠️ Weather dependent activity</li>
              <li>⚠️ Advance booking recommended</li>
              <li>⚠️ Cancellation 24 hours prior</li>
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
            <div className="detail-price-sub">per person</div>
            <div className="detail-divider" />
            {item.duration && (
              <div className="detail-info-row">
                <span className="detail-info-label">Duration</span>
                <span className="detail-info-value">{item.duration}</span>
              </div>
            )}
            {item.location && (
              <div className="detail-info-row">
                <span className="detail-info-label">Location</span>
                <span className="detail-info-value">{item.location}</span>
              </div>
            )}
            {item.category && (
              <div className="detail-info-row">
                <span className="detail-info-label">Category</span>
                <span className="detail-info-value">{item.category}</span>
              </div>
            )}
            <div className="detail-btn-group">
              <button className="cta block" onClick={() => window.location.href = "/#contact"}>Book Now</button>
              <button className="ghost" onClick={() => window.location.href = "/#contact"}>Send Enquiry</button>
            </div>
          </div>

          <div className="detail-card" style={{ marginTop: 20 }}>
            <h3 style={{ marginBottom: 12, fontSize: 16 }}>Safety First</h3>
            <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>
              <p>All our water activities are conducted with highest safety standards. Our certified instructors ensure your safety while you enjoy the underwater world.</p>
              <p style={{ marginTop: 8 }}>Emergency medical support available at all locations.</p>
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
                <div className="brand-title">My Andaman Tour</div>
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
          <div>© 2026 My Andaman Tour. All rights reserved.</div>
          <div>Built with ❤️ JR Technology</div>
        </div>
      </footer>
    </div>
  );
}