import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchList } from "./api.js";
import { fallbackFerry } from "./fallbackData.js";
import Navigation from "./Navigation.jsx";

function formatPrice(value) {
  if (!value) return "On Request";
  return `INR ${value.toLocaleString("en-IN")}`;
}

export default function FerryList() {
  const [ferries, setFerries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ q: "", type: "", route: "" });

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
      <Navigation isAdmin={isAdmin} />

      <section className="list-hero">
        <div className="list-hero-overlay">
          <div className="pill" style={{ marginBottom: 12 }}>⛴️ Ferry Services</div>
          <h1 className="list-hero-title">Andaman Ferry Services</h1>
          <p className="list-hero-desc">Comfortable and safe ferry rides connecting the beautiful islands of Andaman with premium amenities</p>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>All Ferry Services</h2>
          <p>Choose from our reliable and comfortable ferry services</p>
        </div>
        
        <div className="filters">
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
          <input 
            className="input" 
            placeholder="Route" 
            value={filters.route} 
            onChange={(e) => setFilters({ ...filters, route: e.target.value })} 
          />
          <button className="ghost" onClick={loadFerries}>Search</button>
        </div>

        {loading ? (
          <div className="loading">Loading ferries...</div>
        ) : (
          <div className="grid">
            {ferries.map((ferry) => (
              <Link key={ferry._id} to={`/ferries/${ferry._id}`} className="card">
                <div className="card-image" style={{ backgroundImage: `url(${ferry.image})` }} />
                <div className="card-body">
                  <div className="card-title">{ferry.name}</div>
                  <div className="card-meta">{ferry.type}</div>
                  <p className="card-text">{ferry.description}</p>
                  <div className="activity-meta">
                    {ferry.duration && <span>⏱ {ferry.duration}</span>}
                    {ferry.features && ferry.features.length > 0 && (
                      <span>✓ {ferry.features.slice(0, 2).join(", ")}</span>
                    )}
                  </div>
                  <div className="card-foot">
                    <span className="price">{formatPrice(ferry.priceFrom)}</span>
                    <span className="card-link">View Details →</span>
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
      </section>

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