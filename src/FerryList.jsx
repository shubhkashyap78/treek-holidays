import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchList } from "./api.js";
import { fallbackFerry } from "./fallbackData.js";

function formatPrice(value) {
  if (!value) return "On Request";
  return `INR ${value.toLocaleString("en-IN")}`;
}

export default function FerryList() {
  const [ferries, setFerries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ q: "", type: "" });

  async function loadFerries() {
    setLoading(true);
    const data = await fetchList("/api/ferry", filters, fallbackFerry);
    setFerries(data);
    setLoading(false);
  }

  useEffect(() => { loadFerries(); }, []);

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

      <div className="list-hero">
        <div className="list-hero-content">
          <div className="pill">⛴️ Ferry Services</div>
          <h1>Andaman Ferry Services</h1>
          <p>Comfortable and safe ferry rides connecting the beautiful islands of Andaman with premium amenities</p>
        </div>
      </div>

      <div className="list-body">
        <div className="list-filters">
          <input 
            className="input" 
            placeholder="Search ferries..." 
            value={filters.q} 
            onChange={(e) => setFilters({ ...filters, q: e.target.value })} 
          />
          <input 
            className="input" 
            placeholder="Type (Luxury, Budget, etc.)" 
            value={filters.type} 
            onChange={(e) => setFilters({ ...filters, type: e.target.value })} 
          />
          <button className="cta" onClick={loadFerries}>Search</button>
        </div>

        {loading ? (
          <div className="loading">Loading ferries...</div>
        ) : (
          <div className="list-grid">
            {ferries.map((ferry) => (
              <Link key={ferry._id} to={`/ferries/${ferry._id}`} className="list-card">
                <div className="list-card-image" style={{ backgroundImage: `url(${ferry.image})` }} />
                <div className="list-card-body">
                  <div className="list-card-category">{ferry.type}</div>
                  <h3 className="list-card-title">{ferry.name}</h3>
                  <p className="list-card-description">{ferry.description}</p>
                  <div className="list-card-meta">
                    <span>⏱ {ferry.duration}</span>
                    {ferry.features && ferry.features.length > 0 && (
                      <span>✓ {ferry.features[0]}</span>
                    )}
                  </div>
                  <div className="list-card-footer">
                    <div className="list-card-price">{formatPrice(ferry.priceFrom)}</div>
                    <div className="list-card-button">View Details →</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && ferries.length === 0 && (
          <div className="no-results">
            <h3>No ferries found</h3>
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