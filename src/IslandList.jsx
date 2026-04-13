import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchList } from "./api.js";
import { fallbackIslands } from "./fallbackData.js";
import Navigation from "./Navigation.jsx";

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
      <Navigation isAdmin={isAdmin} />

      <section className="list-hero">
        <div className="list-hero-overlay">
          <div className="pill" style={{ marginBottom: 12 }}>🏝️ Paradise Islands</div>
          <h1 className="list-hero-title">Andaman Islands</h1>
          <p className="list-hero-desc">Discover pristine beaches, crystal-clear waters, and untouched natural beauty across the stunning Andaman archipelago</p>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>All Islands</h2>
          <p>Explore the most beautiful islands of Andaman & Nicobar</p>
        </div>
        
        <div className="filters">
          <input 
            className="input" 
            placeholder="Search islands..." 
            value={filters.q} 
            onChange={(e) => setFilters({ ...filters, q: e.target.value })} 
          />
          <button className="ghost" onClick={loadIslands}>Search</button>
        </div>

        {loading ? (
          <div className="loading">Loading islands...</div>
        ) : (
          <div className="grid">
            {islands.map((island) => (
              <Link key={island._id} to={`/islands/${island._id}`} className="card">
                <div className="card-image" style={{ backgroundImage: `url(${island.image})` }} />
                <div className="card-body">
                  <div className="card-title">{island.name}</div>
                  <div className="card-meta">{island.tagline}</div>
                  <p className="card-text">{island.description}</p>
                  <div className="card-foot">
                    <span className="price">Explore</span>
                    <span className="card-link">View Island →</span>
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
      </section>

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
          <div>© 2026 My Andaman Tour. All rights reserved.</div>
          <div>Built with ❤️ JR Technology</div>
        </div>
      </footer>
    </div>
  );
}