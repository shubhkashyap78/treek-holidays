import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchList } from "./api.js";
import { fallbackActivities } from "./fallbackData.js";

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
    const data = await fetchList("/api/activities", filters, fallbackActivities);
    setActivities(data);
    setLoading(false);
  }

  useEffect(() => { loadActivities(); }, []);

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
          <a href="/#activities">Activities</a>
          <a href="/#islands">Islands</a>
          <a href="/#ferry">Ferry</a>
          <a href="/#contact">Contact</a>
        </nav>
        <div style={{ display: "flex", gap: 8 }}>
          {isAdmin && <button className="ghost" onClick={() => window.location.href = "/admin"}>Admin</button>}
          <button className="cta" onClick={() => window.location.href = "/#contact"}>Book Now</button>
        </div>
      </header>

      <div className="list-hero">
        <div className="list-hero-content">
          <div className="pill">🤿 Water Adventures</div>
          <h1>Andaman Water Activities</h1>
          <p>Dive into crystal-clear waters and experience the underwater paradise of Andaman Islands</p>
        </div>
      </div>

      <div className="list-body">
        <div className="list-filters">
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
          <button className="cta" onClick={loadActivities}>Search</button>
        </div>

        {loading ? (
          <div className="loading">Loading activities...</div>
        ) : (
          <div className="list-grid">
            {activities.map((activity) => (
              <Link key={activity._id} to={`/activities/${activity._id}`} className="list-card">
                <div className="list-card-image" style={{ backgroundImage: `url(${activity.image})` }} />
                <div className="list-card-body">
                  <div className="list-card-category">{activity.category}</div>
                  <h3 className="list-card-title">{activity.title}</h3>
                  <p className="list-card-description">{activity.description}</p>
                  <div className="list-card-meta">
                    {activity.duration && <span>⏱ {activity.duration}</span>}
                    {activity.location && <span>📍 {activity.location}</span>}
                  </div>
                  <div className="list-card-footer">
                    <div className="list-card-price">{formatPrice(activity.priceFrom)}</div>
                    <div className="list-card-button">View Details →</div>
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
      </div>

      <footer className="footer">
        <div>Andaman Treek Holidays</div>
        <div><a href="/" style={{ color: "var(--muted)" }}>← Back to Home</a></div>
      </footer>
    </div>
  );
}