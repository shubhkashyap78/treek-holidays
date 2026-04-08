import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchList } from "./api.js";
import { fallbackGroup } from "./fallbackData.js";

function formatPrice(value) {
  if (!value) return "On Request";
  return `INR ${value.toLocaleString("en-IN")}`;
}

export default function GroupList() {
  const [group, setGroup] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchList("/api/group", {}, fallbackGroup);
      setGroup(data);
      setLoading(false);
    }
    load();
  }, []);

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
          <Link to="/">Home</Link>
          <a href="/#packages">Packages</a>
          <a href="/#activities">Activities</a>
          <a href="/#islands">Islands</a>
          <a href="/#contact">Contact</a>
        </nav>
        <button className="cta" onClick={() => window.location.href = "/admin"}>Admin</button>
      </header>

      <section className="list-hero">
        <div className="list-hero-overlay">
          <div className="pill" style={{ marginBottom: 12 }}>👥 Group Tours</div>
          <h1 className="list-hero-title">Group Packages</h1>
          <p className="list-hero-desc">Perfect packages for friends, corporate teams, and large group travels</p>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>All Group Packages</h2>
          <p>Exciting adventures designed for groups of all sizes</p>
        </div>
        {loading ? (
          <div className="loading">Loading packages...</div>
        ) : (
          <div className="grid">
            {group.map((item) => (
              <Link to={`/group/${item._id}`} key={item._id} className="package-link">
                <article className="card">
                  <div className="card-image" style={{ backgroundImage: `url(${item.image})` }} />
                  <div className="card-body">
                    <div className="card-title">{item.title}</div>
                    <div className="card-meta">{item.subtitle || item.duration}</div>
                    <p className="card-text">{item.description}</p>
                    <div className="card-foot">
                      <span className="price">{formatPrice(item.priceFrom)}</span>
                      <button className="ghost">View Details</button>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>

      <footer className="footer">
        <div>Andaman Treek Holidays</div>
        <div><Link to="/" style={{ color: "var(--muted)" }}>← Back to Home</Link></div>
      </footer>
    </div>
  );
}
