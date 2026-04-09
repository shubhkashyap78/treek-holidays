import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchList } from "./api.js";
import { fallbackIslands } from "./fallbackData.js";

export default function IslandList() {
  const [islands, setIslands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ q: "" });

  async function loadIslands() {
    setLoading(true);
    // Temporarily using fallback data to avoid 404 errors
    // const data = await fetchList("/api/islands", filters, fallbackIslands);
    const data = fallbackIslands;
    setIslands(data);
    setLoading(false);
  }

  useEffect(() => { loadIslands(); }, []);

  const isAdmin = !!localStorage.getItem("admin_token");

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
          <Link to="/activities">Activities</Link>
          <Link to="/islands">Islands</Link>
          <Link to="/ferries">Ferry</Link>
          <a href="/#contact">Contact</a>
        </nav>
        <div style={{ display: "flex", gap: 8 }}>
          {isAdmin && <button className="ghost" onClick={() => window.location.href = "/admin"}>Admin</button>}
          <button className="cta" onClick={() => window.location.href = "/#contact"}>Book Now</button>
        </div>
      </header>

      <div className="list-hero">
        <div className="list-hero-content">
          <div className="pill">🏝️ Paradise Islands</div>
          <h1>Andaman Islands</h1>
          <p>Discover pristine beaches, crystal-clear waters, and untouched natural beauty across the stunning Andaman archipelago</p>
        </div>
      </div>

      <div className="list-body">
        <div className="list-filters">
          <input 
            className="input" 
            placeholder="Search islands..." 
            value={filters.q} 
            onChange={(e) => setFilters({ ...filters, q: e.target.value })} 
          />
          <button className="cta" onClick={loadIslands}>Search</button>
        </div>

        {loading ? (
          <div className="loading">Loading islands...</div>
        ) : (
          <div className="list-grid">
            {islands.map((island) => (
              <Link key={island._id} to={`/islands/${island._id}`} className="list-card">
                <div className="list-card-image" style={{ backgroundImage: `url(${island.image})` }} />
                <div className="list-card-body">
                  <div className="list-card-category">Island</div>
                  <h3 className="list-card-title">{island.name}</h3>
                  <p className="list-card-description">{island.description}</p>
                  <div className="list-card-meta">
                    <span>🏖️ {island.tagline}</span>
                  </div>
                  <div className="list-card-footer">
                    <div className="list-card-price">Explore</div>
                    <div className="list-card-button">View Details →</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && islands.length === 0 && (
          <div className="no-results">
            <h3>No islands found</h3>
            <p>Try adjusting your search filters</p>
          </div>
        )}
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
            <Link to="/activities" className="footer-link">Activities</Link>
            <Link to="/islands" className="footer-link">Islands</Link>
            <Link to="/ferries" className="footer-link">Ferry Services</Link>
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