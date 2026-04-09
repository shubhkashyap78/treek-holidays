import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchList } from "./api.js";
import { fallbackLtc } from "./fallbackData.js";

function formatPrice(value) {
  if (!value) return "On Request";
  return `INR ${value.toLocaleString("en-IN")}`;
}

export default function LtcList() {
  const [ltc, setLtc] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchList("/api/ltc", {}, fallbackLtc);
      setLtc(data);
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
          <Link to="/activities">Activities</Link>
          <Link to="/islands">Islands</Link>
          <Link to="/ferries">Ferry</Link>
          <a href="/#contact">Contact</a>
        </nav>
        <button className="cta" onClick={() => window.location.href = "/admin"}>Admin</button>
      </header>

      <section className="list-hero">
        <div className="list-hero-overlay">
          <div className="pill" style={{ marginBottom: 12 }}>🏛️ Government LTC</div>
          <h1 className="list-hero-title">LTC Packages</h1>
          <p className="list-hero-desc">Special packages for government employees with complete LTC documentation support</p>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>All LTC Packages</h2>
          <p>LTC-approved packages with complete billing and documentation support</p>
        </div>
        {loading ? (
          <div className="loading">Loading packages...</div>
        ) : (
          <div className="grid">
            {ltc.map((item) => (
              <Link to={`/ltc/${item._id}`} key={item._id} className="package-link">
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
            <Link to="/honeymoon" className="footer-link">Honeymoon</Link>
            <Link to="/family" className="footer-link">Family</Link>
            <Link to="/group" className="footer-link">Group Tours</Link>
            <Link to="/ltc" className="footer-link">LTC Packages</Link>
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
