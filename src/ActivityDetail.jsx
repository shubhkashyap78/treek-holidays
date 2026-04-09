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
    fetch(`${apiUrl}/api/activities/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data) => { setItem(data); setLoading(false); })
      .catch((err) => { 
        console.error('API Error:', err);
        // Fallback to static data if API fails
        const fallbackItem = fallbackActivities.find(item => item._id === id);
        if (fallbackItem) {
          setItem(fallbackItem);
          setLoading(false);
        } else {
          setError("Activity not found."); 
          setLoading(false);
        }
      });
  }, [id]);

  const isAdmin = !!localStorage.getItem("admin_token");

  if (loading) return <div className="detail-loading">Loading...</div>;
  if (error) return <div className="detail-loading">{error} <a href="/activities">← Go back</a></div>;

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
          <a href="/#islands">Islands</a>
          <a href="/#ferry">Ferry</a>
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
        <div>Andaman Treek Holidays</div>
        <div><a href="/activities" style={{ color: "var(--muted)" }}>← All Water Activities</a></div>
      </footer>
    </div>
  );
}