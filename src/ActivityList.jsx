import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchList } from "./api.js";
import { fallbackActivities } from "./fallbackData.js";
import Navigation from "./Navigation.jsx";

function formatPrice(value) {
  if (!value) return "On Request";
  return `INR ${value.toLocaleString("en-IN")}`;
}

export default function ActivityList() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ q: "", category: "", location: "" });

  async function loadActivities() {
    setLoading(true);
    // Temporarily using fallback data to avoid 404 errors
    // const data = await fetchList("/api/activities", filters, fallbackActivities);
    const data = fallbackActivities;
    setActivities(data);
    setLoading(false);
  }

  useEffect(() => { loadActivities(); }, []);

  const isAdmin = !!localStorage.getItem("admin_token");

  return (
    <div className="page">
      <Navigation isAdmin={isAdmin} />

      <section className="list-hero">
        <div className="list-hero-overlay">
          <div className="pill" style={{ marginBottom: 12 }}>🤿 Water Adventures</div>
          <h1 className="list-hero-title">Andaman Water Activities</h1>
          <p className="list-hero-desc">Dive into crystal-clear waters and experience the underwater paradise of Andaman Islands</p>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>All Water Activities</h2>
          <p>Choose from our exciting collection of water sports and adventures</p>
        </div>
        
        <div className="filters">
          <input 
            className="input" 
            placeholder="Search activities..." 
            value={filters.q} 
            onChange={(e) => setFilters({ ...filters, q: e.target.value })} 
          />
          <input 
            className="input" 
            placeholder="Category (Scuba, Kayaking, etc.)" 
            value={filters.category} 
            onChange={(e) => setFilters({ ...filters, category: e.target.value })} 
          />
          <input 
            className="input" 
            placeholder="Location" 
            value={filters.location} 
            onChange={(e) => setFilters({ ...filters, location: e.target.value })} 
          />
          <button className="ghost" onClick={loadActivities}>Search</button>
        </div>

        {loading ? (
          <div className="loading">Loading activities...</div>
        ) : (
          <div className="grid">
            {activities.map((activity) => (
              <Link key={activity._id} to={`/activities/${activity._id}`} className="card">
                <div className="card-image" style={{ backgroundImage: `url(${activity.image})` }} />
                <div className="card-body">
                  <div className="card-title">{activity.title}</div>
                  <div className="card-meta">{activity.category}</div>
                  <p className="card-text">{activity.description}</p>
                  <div className="activity-meta">
                    {activity.duration && <span>⏱ {activity.duration}</span>}
                    {activity.location && <span>📍 {activity.location}</span>}
                  </div>
                  <div className="card-foot">
                    <span className="price">{formatPrice(activity.priceFrom)}</span>
                    <span className="card-link">View Details →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && activities.length === 0 && (
          <div className="no-results">
            <h3>No activities found</h3>
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