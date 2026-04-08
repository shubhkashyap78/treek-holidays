import { useEffect, useState } from "react";
import { fetchList } from "./api.js";
import { fallbackActivities, fallbackFamily, fallbackHoneymoon, fallbackIslands, fallbackLtc, fallbackPackages } from "./fallbackData.js";

function formatPrice(value) {
  if (!value) return "On Request";
  return `INR ${value.toLocaleString("en-IN")}`;
}

export default function App() {
  const [packages,   setPackages]   = useState([]);
  const [activities, setActivities] = useState([]);
  const [islands,    setIslands]    = useState([]);
  const [honeymoon,  setHoneymoon]  = useState([]);
  const [family,     setFamily]     = useState([]);
  const [ltc,        setLtc]        = useState([]);
  const [loading,    setLoading]    = useState(true);

  const [packageFilters,  setPackageFilters]  = useState({ q: "", category: "", minPrice: "", maxPrice: "" });
  const [activityFilters, setActivityFilters] = useState({ q: "", category: "", location: "", minPrice: "", maxPrice: "" });
  const [islandFilters,   setIslandFilters]   = useState({ q: "" });

  async function loadAll() {
    setLoading(true);
    const [p, a, i, h, f, l] = await Promise.all([
      fetchList("/api/packages",  packageFilters,  fallbackPackages),
      fetchList("/api/activities", activityFilters, fallbackActivities),
      fetchList("/api/islands",   islandFilters,   fallbackIslands),
      fetchList("/api/honeymoon", {}, fallbackHoneymoon),
      fetchList("/api/family",    {}, fallbackFamily),
      fetchList("/api/ltc",       {}, fallbackLtc)
    ]);
    setPackages(p); setActivities(a); setIslands(i);
    setHoneymoon(h); setFamily(f); setLtc(l);
    setLoading(false);
  }

  useEffect(() => { loadAll(); }, []);

  function CardGrid({ items, nameKey = "title", metaKey }) {
    return (
      <div className="grid">
        {items.map((item) => (
          <article key={item._id} className="card">
            <div className="card-image" style={{ backgroundImage: `url(${item.image})` }} />
            <div className="card-body">
              <div className="card-title">{item[nameKey] || item.name}</div>
              <div className="card-meta">{metaKey ? item[metaKey] : (item.subtitle || item.duration || item.category || item.tagline)}</div>
              <p className="card-text">{item.description}</p>
              <div className="card-foot">
                <span className="price">{formatPrice(item.priceFrom)}</span>
                <button className="ghost">View Details</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    );
  }

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">AB</span>
          <div>
            <div className="brand-title">Andaman Treek Holidays </div>
            <div className="brand-sub">Tours and Experiences</div>
          </div>
        </div>
        <nav className="nav">
          <a href="#packages">Packages</a>
          <a href="#activities">Activities</a>
          <a href="#islands">Islands</a>
          <a href="#honeymoon">Honeymoon</a>
          <a href="#family">Family</a>
          <a href="#ltc">LTC</a>
          <a href="#contact">Contact</a>
        </nav>
        <button className="cta" onClick={() => window.location.href = "/admin"}>Admin</button>
      </header>

      <section className="hero">
        <div className="hero-content">
          <div className="pill">Trusted Andaman tour partner</div>
          <h1>Plan a dynamic Andaman escape with real-time packages and activities</h1>
          <p>Inspired by your reference site, this setup pulls live data from MongoDB and lets you manage content easily.</p>
          <div className="hero-actions">
            <button className="cta">View Packages</button>
            <button className="ghost">Talk to an Expert</button>
          </div>
          <div className="hero-stats">
            <div><div className="stat-value">120+</div><div className="stat-label">Curated Packages</div></div>
            <div><div className="stat-value">35+</div><div className="stat-label">Water Activities</div></div>
            <div><div className="stat-value">12</div><div className="stat-label">Islands Covered</div></div>
          </div>
        </div>
        <div className="hero-card">
          <div className="search-title">Quick Search</div>
          <input className="input" placeholder="Search packages or islands" />
          <select className="input">
            <option>Choose category</option>
            <option>Family</option>
            <option>Honeymoon</option>
            <option>Adventure</option>
            <option>LTC</option>
          </select>
          <button className="cta block">Search</button>
          <div className="search-note">Wire it to your MongoDB filters later.</div>
        </div>
      </section>

      <section id="packages" className="section">
        <div className="section-head"><h2>Popular Packages</h2><p>Dynamic list loaded from MongoDB. Use filters to refine.</p></div>
        <div className="filters">
          <input className="input" placeholder="Search title" value={packageFilters.q} onChange={(e) => setPackageFilters({ ...packageFilters, q: e.target.value })} />
          <input className="input" placeholder="Category" value={packageFilters.category} onChange={(e) => setPackageFilters({ ...packageFilters, category: e.target.value })} />
          <input className="input" placeholder="Min price" value={packageFilters.minPrice} onChange={(e) => setPackageFilters({ ...packageFilters, minPrice: e.target.value })} />
          <input className="input" placeholder="Max price" value={packageFilters.maxPrice} onChange={(e) => setPackageFilters({ ...packageFilters, maxPrice: e.target.value })} />
          <button className="ghost" onClick={loadAll}>Apply</button>
        </div>
        {loading ? <div className="loading">Loading packages...</div> : <CardGrid items={packages} />}
      </section>

      <section id="activities" className="section alt">
        <div className="section-head"><h2>Water Activities</h2><p>Scuba, kayaking, sea walk, and more.</p></div>
        <div className="filters">
          <input className="input" placeholder="Search title" value={activityFilters.q} onChange={(e) => setActivityFilters({ ...activityFilters, q: e.target.value })} />
          <input className="input" placeholder="Category" value={activityFilters.category} onChange={(e) => setActivityFilters({ ...activityFilters, category: e.target.value })} />
          <input className="input" placeholder="Location" value={activityFilters.location} onChange={(e) => setActivityFilters({ ...activityFilters, location: e.target.value })} />
          <button className="ghost" onClick={loadAll}>Apply</button>
        </div>
        {loading ? <div className="loading">Loading activities...</div> : <CardGrid items={activities} metaKey="category" />}
      </section>

      <section id="islands" className="section">
        <div className="section-head"><h2>Top Islands</h2><p>Search islands by name or tag.</p></div>
        <div className="filters">
          <input className="input" placeholder="Search island" value={islandFilters.q} onChange={(e) => setIslandFilters({ ...islandFilters, q: e.target.value })} />
          <button className="ghost" onClick={loadAll}>Apply</button>
        </div>
        {loading ? <div className="loading">Loading islands...</div> : (
          <div className="grid">
            {islands.map((item) => (
              <article key={item._id} className="card">
                <div className="card-image" style={{ backgroundImage: `url(${item.image})` }} />
                <div className="card-body">
                  <div className="card-title">{item.name}</div>
                  <div className="card-meta">{item.tagline}</div>
                  <p className="card-text">{item.description}</p>
                  <div className="card-foot"><span className="price">Explore</span><button className="ghost">View Island</button></div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section id="honeymoon" className="section alt">
        <div className="section-head"><h2>Honeymoon Packages</h2><p>Curated romantic escapes for couples.</p></div>
        {loading ? <div className="loading">Loading...</div> : (
          <div className="grid">
            {honeymoon.map((item) => (
              <article key={item._id} className="card">
                <div className="card-image" style={{ backgroundImage: `url(${item.image})` }} />
                <div className="card-body">
                  <div className="card-title">{item.title}</div>
                  <div className="card-meta">{item.subtitle || item.duration}</div>
                  <p className="card-text">{item.description}</p>
                  <div className="card-foot">
                    <span className="price">{formatPrice(item.priceFrom)}</span>
                    <button className="ghost" onClick={() => window.location.href = `/honeymoon/${item._id}`}>View Details</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section id="family" className="section">
        <div className="section-head"><h2>Family Packages</h2><p>Fun-filled trips designed for the whole family.</p></div>
        {loading ? <div className="loading">Loading...</div> : (
          <div className="grid">
            {family.map((item) => (
              <article key={item._id} className="card">
                <div className="card-image" style={{ backgroundImage: `url(${item.image})` }} />
                <div className="card-body">
                  <div className="card-title">{item.title}</div>
                  <div className="card-meta">{item.subtitle || item.duration}</div>
                  <p className="card-text">{item.description}</p>
                  <div className="card-foot">
                    <span className="price">{formatPrice(item.priceFrom)}</span>
                    <button className="ghost" onClick={() => window.location.href = `/family/${item._id}`}>View Details</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section id="ltc" className="section alt">
        <div className="section-head"><h2>LTC Packages</h2><p>Leave Travel Concession packages for government employees.</p></div>
        {loading ? <div className="loading">Loading...</div> : <CardGrid items={ltc} />}
      </section>

      <section id="contact" className="section alt">
        <div className="section-head"><h2>Plan Your Trip</h2><p>Get a custom itinerary in under 24 hours.</p></div>
        <div className="contact">
          <div>
            <div className="contact-title">Talk to our travel expert</div>
            <div className="contact-text">Phone: +91-90000-00000</div>
            <div className="contact-text">Email: hello@andamanbliss.com</div>
            <div className="contact-text">Office: Port Blair, Andaman</div>
          </div>
          <form className="form">
            <input className="input" placeholder="Name" />
            <input className="input" placeholder="Phone" />
            <input className="input" placeholder="Travel Month" />
            <textarea className="input" rows="4" placeholder="Tell us your plan"></textarea>
            <button className="cta block" type="button">Send Enquiry</button>
          </form>
        </div>
      </section>

      <footer className="footer">
        <div>Andaman Treek Holidays  Dynamic Site</div>
        <div>Built with Vite, React, Express, and MongoDB</div>
      </footer>
    </div>
  );
}
