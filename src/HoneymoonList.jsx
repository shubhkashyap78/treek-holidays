import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchList } from "./api.js";
import { fallbackHoneymoon } from "./fallbackData.js";

function formatPrice(value) {
  if (!value) return "On Request";
  return `INR ${value.toLocaleString("en-IN")}`;
}

export default function HoneymoonList() {
  const [honeymoon, setHoneymoon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPackageDropdown, setShowPackageDropdown] = useState(false);
  const [showActivityDropdown, setShowActivityDropdown] = useState(false);
  const [showIslandDropdown, setShowIslandDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchList("/api/honeymoon", {}, fallbackHoneymoon);
      setHoneymoon(data);
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
            <div className="brand-title">My Andaman Tour</div>
            <div className="brand-sub">Tours and Experiences</div>
          </div>
        </div>
        <button 
          className="mobile-menu-toggle"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          ☰
        </button>
        <nav className={`nav ${showMobileMenu ? 'mobile-open' : ''}`}>
          <Link to="/" onClick={() => setShowMobileMenu(false)}>Home</Link>
          <div 
            className="nav-dropdown"
            onMouseEnter={() => !showMobileMenu && setShowPackageDropdown(true)}
            onMouseLeave={() => !showMobileMenu && setShowPackageDropdown(false)}
            onClick={() => showMobileMenu && setShowPackageDropdown(!showPackageDropdown)}
          >
            <a href="/#packages" className="nav-link">Packages ▾</a>
            {(showPackageDropdown || (showMobileMenu && showPackageDropdown)) && (
              <div className="dropdown-menu">
                <div className="dropdown-section">
                  <div className="dropdown-title">Honeymoon</div>
                  <Link to="/honeymoon" className="dropdown-item" onClick={() => setShowMobileMenu(false)}>View All Packages</Link>
                </div>
                <div className="dropdown-section">
                  <div className="dropdown-title">Family</div>
                  <Link to="/family" className="dropdown-item" onClick={() => setShowMobileMenu(false)}>View All Packages</Link>
                </div>
                <div className="dropdown-section">
                  <div className="dropdown-title">LTC</div>
                  <Link to="/ltc" className="dropdown-item" onClick={() => setShowMobileMenu(false)}>View All Packages</Link>
                </div>
                <div className="dropdown-section">
                  <div className="dropdown-title">Group</div>
                  <Link to="/group" className="dropdown-item" onClick={() => setShowMobileMenu(false)}>View All Packages</Link>
                </div>
              </div>
            )}
          </div>
          <div 
            className="nav-dropdown"
            onMouseEnter={() => !showMobileMenu && setShowActivityDropdown(true)}
            onMouseLeave={() => !showMobileMenu && setShowActivityDropdown(false)}
            onClick={() => showMobileMenu && setShowActivityDropdown(!showActivityDropdown)}
          >
            <Link to="/activities" className="nav-link">Activities ▾</Link>
            {(showActivityDropdown || (showMobileMenu && showActivityDropdown)) && (
              <div className="dropdown-menu dropdown-menu-activities">
                <div className="dropdown-section">
                  <Link to="/activities" className="dropdown-item" onClick={() => setShowMobileMenu(false)}>View All Activities</Link>
                </div>
              </div>
            )}
          </div>
          <div 
            className="nav-dropdown"
            onMouseEnter={() => !showMobileMenu && setShowIslandDropdown(true)}
            onMouseLeave={() => !showMobileMenu && setShowIslandDropdown(false)}
            onClick={() => showMobileMenu && setShowIslandDropdown(!showIslandDropdown)}
          >
            <Link to="/islands" className="nav-link">Islands ▾</Link>
            {(showIslandDropdown || (showMobileMenu && showIslandDropdown)) && (
              <div className="dropdown-menu dropdown-menu-islands">
                <div className="dropdown-section">
                  <Link to="/islands" className="dropdown-item" onClick={() => setShowMobileMenu(false)}>View All Islands</Link>
                </div>
              </div>
            )}
          </div>
          <Link to="/ferries" onClick={() => setShowMobileMenu(false)}>Ferry</Link>
          <a href="/#about" onClick={(e) => { e.preventDefault(); window.location.href = '/#about'; setShowMobileMenu(false); }}>About</a>
          <a href="/#contact" onClick={(e) => { e.preventDefault(); window.location.href = '/#contact'; setShowMobileMenu(false); }}>Contact</a>
        </nav>
        <button className="cta" onClick={() => window.location.href = "/admin"}>Admin</button>
      </header>

      <section className="list-hero">
        <div className="list-hero-overlay">
          <div className="pill" style={{ marginBottom: 12 }}>💑 Romantic Getaways</div>
          <h1 className="list-hero-title">Honeymoon Packages</h1>
          <p className="list-hero-desc">Celebrate your love with our specially curated romantic escapes in the Andaman Islands</p>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>All Honeymoon Packages</h2>
          <p>Choose the perfect romantic escape for your special journey together</p>
        </div>
        {loading ? (
          <div className="loading">Loading packages...</div>
        ) : (
          <div className="grid">
            {honeymoon.map((item) => (
              <Link to={`/honeymoon/${item._id}`} key={item._id} className="package-link">
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
          <div>© 2026 My Andaman Tour. All rights reserved.</div>
          <div>Built with ❤️ JR Technology</div>
        </div>
      </footer>
    </div>
  );
}
