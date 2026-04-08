import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { fetchList } from "./api.js";
import { fallbackActivities, fallbackFamily, fallbackGroup, fallbackHoneymoon, fallbackIslands, fallbackLtc, fallbackPackages, fallbackFerry } from "./fallbackData.js";
import HoneymoonList from "./HoneymoonList.jsx";
import HoneymoonDetail from "./HoneymoonDetail.jsx";
import FamilyList from "./FamilyList.jsx";
import FamilyDetail from "./FamilyDetail.jsx";
import LtcList from "./LtcList.jsx";
import LtcDetail from "./LtcDetail.jsx";
import GroupList from "./GroupList.jsx";
import GroupDetail from "./GroupDetail.jsx";
import AdminLogin from "./AdminLogin.jsx";
import AdminPanel from "./AdminPanel.jsx";

function formatPrice(value) {
  if (!value) return "On Request";
  return `INR ${value.toLocaleString("en-IN")}`;
}

function HomePage() {
  const [packages,   setPackages]   = useState([]);
  const [activities, setActivities] = useState([]);
  const [islands,    setIslands]    = useState([]);
  const [honeymoon,  setHoneymoon]  = useState([]);
  const [family,     setFamily]     = useState([]);
  const [ltc,        setLtc]        = useState([]);
  const [group,      setGroup]      = useState([]);
  const [ferry,      setFerry]      = useState([]);
  const [loading,    setLoading]    = useState(true);

  const [packageFilters,  setPackageFilters]  = useState({ q: "", category: "", minPrice: "", maxPrice: "" });
  const [activityFilters, setActivityFilters] = useState({ q: "", category: "", location: "", minPrice: "", maxPrice: "" });
  const [islandFilters,   setIslandFilters]   = useState({ q: "" });

  async function loadAll() {
    setLoading(true);
    const [p, a, i, h, f, l, g, fe] = await Promise.all([
      fetchList("/api/packages",  packageFilters,  fallbackPackages),
      fetchList("/api/activities", activityFilters, fallbackActivities),
      fetchList("/api/islands",   islandFilters,   fallbackIslands),
      fetchList("/api/honeymoon", {}, fallbackHoneymoon),
      fetchList("/api/family",    {}, fallbackFamily),
      fetchList("/api/ltc",       {}, fallbackLtc),
      fetchList("/api/group",     {}, fallbackGroup),
      fetchList("/api/ferry",     {}, fallbackFerry)
    ]);
    setPackages(p); setActivities(a); setIslands(i);
    setHoneymoon(h); setFamily(f); setLtc(l); setGroup(g); setFerry(fe);
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

  const [showPackageDropdown, setShowPackageDropdown] = useState(false);
  const [showActivityDropdown, setShowActivityDropdown] = useState(false);
  const [showIslandDropdown, setShowIslandDropdown] = useState(false);

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
          <a href="#home" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Home</a>
          <div 
            className="nav-dropdown"
            onMouseEnter={() => setShowPackageDropdown(true)}
            onMouseLeave={() => setShowPackageDropdown(false)}
          >
            <a href="#packages" className="nav-link">Packages ▾</a>
            {showPackageDropdown && (
              <div className="dropdown-menu">
                <div className="dropdown-section">
                  <div className="dropdown-title">Honeymoon</div>
                  <Link to="/honeymoon" className="dropdown-item">View All Packages</Link>
                  <Link to="/honeymoon" className="dropdown-item">3 Nights 4 Days</Link>
                  <Link to="/honeymoon" className="dropdown-item">4 Nights 5 Days</Link>
                  <Link to="/honeymoon" className="dropdown-item">5 Nights 6 Days</Link>
                </div>
                <div className="dropdown-section">
                  <div className="dropdown-title">Family</div>
                  <Link to="/family" className="dropdown-item">View All Packages</Link>
                  <Link to="/family" className="dropdown-item">6 Nights 7 Days</Link>
                  <Link to="/family" className="dropdown-item">7 Nights 8 Days</Link>
                  <Link to="/family" className="dropdown-item">8 Nights 9 Days</Link>
                </div>
                <div className="dropdown-section">
                  <div className="dropdown-title">LTC</div>
                  <Link to="/ltc" className="dropdown-item">View All Packages</Link>
                  <Link to="/ltc" className="dropdown-item">3 Nights 4 Days</Link>
                  <Link to="/ltc" className="dropdown-item">4 Nights 5 Days</Link>
                  <Link to="/ltc" className="dropdown-item">5 Nights 6 Days</Link>
                </div>
                <div className="dropdown-section">
                  <div className="dropdown-title">Group</div>
                  <Link to="/group" className="dropdown-item">View All Packages</Link>
                  <Link to="/group" className="dropdown-item">3 Nights 4 Days</Link>
                  <Link to="/group" className="dropdown-item">4 Nights 5 Days</Link>
                  <Link to="/group" className="dropdown-item">5 Nights 6 Days</Link>
                </div>
              </div>
            )}
          </div>
          <div 
            className="nav-dropdown"
            onMouseEnter={() => setShowActivityDropdown(true)}
            onMouseLeave={() => setShowActivityDropdown(false)}
          >
            <a href="#activities" className="nav-link">Activities ▾</a>
            {showActivityDropdown && activities.length > 0 && (
              <div className="dropdown-menu dropdown-menu-activities">
                {activities.slice(0, 12).map((activity) => (
                  <div key={activity._id} className="dropdown-section">
                    <a href="#activities" className="dropdown-item" onClick={(e) => { e.preventDefault(); document.getElementById('activities').scrollIntoView({ behavior: 'smooth' }); }}>{activity.title}</a>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div 
            className="nav-dropdown"
            onMouseEnter={() => setShowIslandDropdown(true)}
            onMouseLeave={() => setShowIslandDropdown(false)}
          >
            <a href="#islands" className="nav-link">Islands ▾</a>
            {showIslandDropdown && islands.length > 0 && (
              <div className="dropdown-menu dropdown-menu-islands">
                {islands.slice(0, 12).map((island) => (
                  <div key={island._id} className="dropdown-section">
                    <a href="#islands" className="dropdown-item" onClick={(e) => { e.preventDefault(); document.getElementById('islands').scrollIntoView({ behavior: 'smooth' }); }}>{island.name}</a>
                  </div>
                ))}
              </div>
            )}
          </div>
          <a href="#ferry" onClick={(e) => { e.preventDefault(); document.getElementById('ferry').scrollIntoView({ behavior: 'smooth' }); }}>Ferry</a>
          <a href="#about" onClick={(e) => { e.preventDefault(); document.getElementById('about').scrollIntoView({ behavior: 'smooth' }); }}>About</a>
          <a href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById('contact').scrollIntoView({ behavior: 'smooth' }); }}>Contact</a>
        </nav>
        <button className="cta" onClick={() => window.location.href = "/admin"}>Admin</button>
      </header>

      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="pill">🏝️ Trusted Andaman Tour Partner Since 2015</div>
          <h1>Discover Paradise in the Andaman Islands</h1>
          <p>Experience crystal-clear waters, pristine beaches, and unforgettable adventures. Your dream tropical escape awaits.</p>
          <div className="hero-actions">
            <button className="cta" onClick={() => document.getElementById('packages').scrollIntoView({ behavior: 'smooth' })}>Explore Packages</button>
            <button className="ghost" onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>Get Free Quote</button>
          </div>
          <div className="hero-stats">
            <div><div className="stat-value">{loading ? "..." : packages.length + honeymoon.length + family.length + ltc.length + group.length}+</div><div className="stat-label">Tour Packages</div></div>
            <div><div className="stat-value">{loading ? "..." : activities.length}+</div><div className="stat-label">Activities</div></div>
            <div><div className="stat-value">{loading ? "..." : islands.length}+</div><div className="stat-label">Islands</div></div>
            <div><div className="stat-value">4.9★</div><div className="stat-label">Customer Rating</div></div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <div className="feature-icon">✈️</div>
          <h3>Easy Booking</h3>
          <p>Simple & secure online booking process</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">💰</div>
          <h3>Best Prices</h3>
          <p>Competitive rates with no hidden charges</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🎯</div>
          <h3>Customizable</h3>
          <p>Tailor-made packages for your needs</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🛡️</div>
          <h3>24/7 Support</h3>
          <p>Round-the-clock customer assistance</p>
        </div>
      </section>

      <section id="packages" className="section">
        <div className="section-head">
          <h2>Popular Packages</h2>
          <p>Choose from our curated collection of tour packages designed for every traveler</p>
        </div>
        <div className="package-categories">
          <Link to="/honeymoon" className="category-card honeymoon-card">
            <div className="category-image" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80)' }}></div>
            <div className="category-content">
              <div className="category-icon">💑</div>
              <h3 className="category-title">Honeymoon Packages</h3>
              <p className="category-desc">Romantic escapes for couples with pristine beaches and luxury stays</p>
              <div className="category-features">
                <span>🏖️ Private Beaches</span>
                <span>🌅 Sunset Cruises</span>
                <span>🍽️ Candlelight Dinners</span>
              </div>
              <div className="category-footer">
                <span className="category-duration">3N - 8N Packages</span>
                <span className="category-arrow">→</span>
              </div>
            </div>
          </Link>

          <Link to="/family" className="category-card family-card">
            <div className="category-image" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80)' }}></div>
            <div className="category-content">
              <div className="category-icon">👨‍👩‍👧‍👦</div>
              <h3 className="category-title">Family Packages</h3>
              <p className="category-desc">Fun-filled adventures perfect for families with kids of all ages</p>
              <div className="category-features">
                <span>🏊 Water Activities</span>
                <span>🏝️ Island Hopping</span>
                <span>🎢 Adventure Sports</span>
              </div>
              <div className="category-footer">
                <span className="category-duration">6N - 11N Packages</span>
                <span className="category-arrow">→</span>
              </div>
            </div>
          </Link>

          <Link to="/group" className="category-card group-card">
            <div className="category-image" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800&q=80)' }}></div>
            <div className="category-content">
              <div className="category-icon">👥</div>
              <h3 className="category-title">Group Packages</h3>
              <p className="category-desc">Perfect for friends, corporate teams, and large group travels</p>
              <div className="category-features">
                <span>🎉 Group Activities</span>
                <span>🚤 Boat Rides</span>
                <span>🏕️ Beach Camping</span>
              </div>
              <div className="category-footer">
                <span className="category-duration">3N - 8N Packages</span>
                <span className="category-arrow">→</span>
              </div>
            </div>
          </Link>

          <Link to="/ltc" className="category-card ltc-card">
            <div className="category-image" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80)' }}></div>
            <div className="category-content">
              <div className="category-icon">🏛️</div>
              <h3 className="category-title">LTC Packages</h3>
              <p className="category-desc">Special packages for government employees with LTC benefits</p>
              <div className="category-features">
                <span>📋 LTC Documentation</span>
                <span>✈️ Flight Included</span>
                <span>🏨 Approved Hotels</span>
              </div>
              <div className="category-footer">
                <span className="category-duration">3N - 8N Packages</span>
                <span className="category-arrow">→</span>
              </div>
            </div>
          </Link>
        </div>
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

      <section id="ferry" className="section alt">
        <div className="section-head"><h2>Ferry Services</h2><p>Premium ferry services for comfortable island hopping</p></div>
        {loading ? <div className="loading">Loading ferries...</div> : (
          <div className="grid">
            {ferry.map((item) => (
              <article key={item._id} className="card ferry-card">
                <div className="card-image" style={{ backgroundImage: `url(${item.image})` }} />
                <div className="card-body">
                  <div className="card-title">{item.name}</div>
                  <div className="card-meta">{item.type}</div>
                  <p className="card-text">{item.description}</p>
                  <div className="ferry-features">
                    <span>⏱ {item.duration}</span>
                    {item.features && item.features.map((feature, idx) => (
                      <span key={idx}>✓ {feature}</span>
                    ))}
                  </div>
                  <div className="card-foot">
                    <span className="price">{formatPrice(item.priceFrom)}</span>
                    <button className="ghost">View Details</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section id="about" className="section about-section">
        <div className="about-container">
          <div className="about-content">
            <div className="pill" style={{ marginBottom: 16 }}>🌴 About Us</div>
            <h2 className="about-title">Your Trusted Partner for Andaman Adventures</h2>
            <p className="about-text">
              Welcome to Andaman Treek Holidays, your premier travel companion for exploring the breathtaking Andaman and Nicobar Islands. With over 8 years of experience in crafting unforgettable journeys, we specialize in creating personalized travel experiences that showcase the natural beauty, rich culture, and adventure opportunities of these pristine islands.
            </p>
            <p className="about-text">
              Our team of local experts is passionate about sharing the hidden gems and must-see attractions of the Andaman Islands. From romantic honeymoon getaways to thrilling family adventures, we ensure every trip is seamless, safe, and memorable.
            </p>
            <div className="about-stats">
              <div className="about-stat-card">
                <div className="about-stat-number">500+</div>
                <div className="about-stat-label">Happy Travelers</div>
              </div>
              <div className="about-stat-card">
                <div className="about-stat-number">8+</div>
                <div className="about-stat-label">Years Experience</div>
              </div>
              <div className="about-stat-card">
                <div className="about-stat-number">50+</div>
                <div className="about-stat-label">Tour Packages</div>
              </div>
              <div className="about-stat-card">
                <div className="about-stat-number">4.9★</div>
                <div className="about-stat-label">Customer Rating</div>
              </div>
            </div>
            <div className="about-features">
              <div className="about-feature">
                <span className="about-feature-icon">✓</span>
                <span>Expert Local Guides</span>
              </div>
              <div className="about-feature">
                <span className="about-feature-icon">✓</span>
                <span>24/7 Customer Support</span>
              </div>
              <div className="about-feature">
                <span className="about-feature-icon">✓</span>
                <span>Best Price Guarantee</span>
              </div>
              <div className="about-feature">
                <span className="about-feature-icon">✓</span>
                <span>Customizable Packages</span>
              </div>
            </div>
          </div>
          <div className="about-image">
            <img src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80" alt="Andaman Islands" />
          </div>
        </div>
      </section>

      <section id="testimonials" className="section alt">
        <div className="section-head">
          <h2>What Our Travelers Say</h2>
          <p>Real experiences from real travelers who explored Andaman with us</p>
        </div>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-rating">★★★★★</div>
            <p className="testimonial-text">
              "Amazing experience! The team at Andaman Treek Holidays made our honeymoon absolutely perfect. From the beautiful resorts to the exciting water activities, everything was well-organized and memorable."
            </p>
            <div className="testimonial-author">
              <div className="testimonial-avatar">R</div>
              <div>
                <div className="testimonial-name">Rahul & Priya</div>
                <div className="testimonial-location">Mumbai, India</div>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-rating">★★★★★</div>
            <p className="testimonial-text">
              "Our family trip was fantastic! The kids loved the water sports and beach activities. The itinerary was perfect for all age groups. Highly recommend for family vacations!"
            </p>
            <div className="testimonial-author">
              <div className="testimonial-avatar">S</div>
              <div>
                <div className="testimonial-name">Sharma Family</div>
                <div className="testimonial-location">Delhi, India</div>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-rating">★★★★★</div>
            <p className="testimonial-text">
              "Professional service and great value for money. The LTC package was exactly what we needed with all proper documentation. Will definitely book again!"
            </p>
            <div className="testimonial-author">
              <div className="testimonial-avatar">A</div>
              <div>
                <div className="testimonial-name">Amit Kumar</div>
                <div className="testimonial-location">Bangalore, India</div>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-rating">★★★★★</div>
            <p className="testimonial-text">
              "Best group tour ever! Our corporate team had an amazing time. The activities were well-planned and the accommodations were excellent. Thank you for the wonderful experience!"
            </p>
            <div className="testimonial-author">
              <div className="testimonial-avatar">M</div>
              <div>
                <div className="testimonial-name">Meera Reddy</div>
                <div className="testimonial-location">Hyderabad, India</div>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-rating">★★★★★</div>
            <p className="testimonial-text">
              "Scuba diving in Havelock was a dream come true! The instructors were professional and the entire experience was safe and thrilling. Can't wait to come back!"
            </p>
            <div className="testimonial-author">
              <div className="testimonial-avatar">V</div>
              <div>
                <div className="testimonial-name">Vikram Singh</div>
                <div className="testimonial-location">Pune, India</div>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-rating">★★★★★</div>
            <p className="testimonial-text">
              "The islands are paradise and this team made it even better! From airport pickup to hotel check-out, everything was smooth. Highly professional and friendly service."
            </p>
            <div className="testimonial-author">
              <div className="testimonial-avatar">N</div>
              <div>
                <div className="testimonial-name">Neha & Rohan</div>
                <div className="testimonial-location">Chennai, India</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-cta">
        <div className="contact-cta-content">
          <h2 className="contact-cta-title">Ready to Start Your Andaman Adventure?</h2>
          <p className="contact-cta-text">Get in touch with our travel experts and let us create your perfect island getaway</p>
          <div className="contact-cta-buttons">
            <button className="cta" onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>Plan My Trip</button>
            <a href="tel:+919000000000" className="ghost" style={{ textDecoration: 'none', display: 'inline-block' }}>📞 Call Us Now</a>
          </div>
        </div>
      </section>

      <section id="contact" className="section alt">
        <div className="section-head"><h2>Plan Your Trip</h2><p>Get a custom itinerary in under 24 hours</p></div>
        <div className="contact">
          <div className="contact-info">
            <div className="contact-title">Talk to our travel expert</div>
            <div className="contact-details">
              <div className="contact-detail-item">
                <span className="contact-icon">📞</span>
                <div>
                  <div className="contact-label">Phone</div>
                  <a href="tel:+919000000000" className="contact-value">+91-90000-00000</a>
                </div>
              </div>
              <div className="contact-detail-item">
                <span className="contact-icon">✉️</span>
                <div>
                  <div className="contact-label">Email</div>
                  <a href="mailto:hello@andamantreekholidays.com" className="contact-value">hello@andamantreekholidays.com</a>
                </div>
              </div>
              <div className="contact-detail-item">
                <span className="contact-icon">📍</span>
                <div>
                  <div className="contact-label">Office</div>
                  <div className="contact-value">Port Blair, Andaman & Nicobar Islands</div>
                </div>
              </div>
              <div className="contact-detail-item">
                <span className="contact-icon">⏰</span>
                <div>
                  <div className="contact-label">Working Hours</div>
                  <div className="contact-value">Mon - Sat: 9:00 AM - 7:00 PM</div>
                </div>
              </div>
            </div>
            <div className="contact-social">
              <a href="#" className="social-link">👍 Facebook</a>
              <a href="#" className="social-link">📷 Instagram</a>
              <a href="#" className="social-link">🐦 Twitter</a>
              <a href="#" className="social-link">📹 YouTube</a>
            </div>
          </div>
          <form className="form" onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = {
              name: formData.get('name'),
              email: formData.get('email'),
              phone: formData.get('phone'),
              packageType: formData.get('packageType'),
              travelMonth: formData.get('travelMonth'),
              numberOfTravelers: parseInt(formData.get('numberOfTravelers')) || 1,
              message: formData.get('message')
            };
            
            try {
              const response = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
              });
              
              if (response.ok) {
                alert('Thank you! Your enquiry has been submitted successfully. We will contact you soon.');
                e.target.reset();
              } else {
                alert('Sorry, there was an error submitting your enquiry. Please try again.');
              }
            } catch (error) {
              alert('Sorry, there was an error submitting your enquiry. Please try again.');
            }
          }}>
            <div className="form-title">Send us a message</div>
            <input className="input" name="name" placeholder="Your Name *" required />
            <input className="input" name="email" type="email" placeholder="Email Address *" required />
            <input className="input" name="phone" type="tel" placeholder="Phone Number *" required />
            <select className="input" name="packageType" required>
              <option value="">Select Package Type</option>
              <option value="honeymoon">Honeymoon</option>
              <option value="family">Family</option>
              <option value="group">Group</option>
              <option value="ltc">LTC</option>
              <option value="custom">Custom Package</option>
            </select>
            <input className="input" name="travelMonth" placeholder="Travel Month" />
            <input className="input" name="numberOfTravelers" type="number" placeholder="Number of Travelers" min="1" />
            <textarea className="input" name="message" rows="4" placeholder="Tell us about your travel plans..."></textarea>
            <button className="cta block" type="submit">Send Enquiry</button>
          </form>
        </div>
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
            <p className="footer-desc">Your trusted partner for unforgettable Andaman adventures. Creating memories since 2015.</p>
          </div>
          <div className="footer-section">
            <div className="footer-title">Quick Links</div>
            <a href="#packages" className="footer-link">Packages</a>
            <a href="#activities" className="footer-link">Activities</a>
            <a href="#islands" className="footer-link">Islands</a>
            <a href="#ferry" className="footer-link">Ferry Services</a>
          </div>
          <div className="footer-section">
            <div className="footer-title">Categories</div>
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
          <div>© 2024 Andaman Treek Holidays. All rights reserved.</div>
          <div>Built with ❤️ using React, Express & MongoDB</div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/honeymoon" element={<HoneymoonList />} />
        <Route path="/honeymoon/:id" element={<HoneymoonDetail />} />
        <Route path="/family" element={<FamilyList />} />
        <Route path="/family/:id" element={<FamilyDetail />} />
        <Route path="/ltc" element={<LtcList />} />
        <Route path="/ltc/:id" element={<LtcDetail />} />
        <Route path="/group" element={<GroupList />} />
        <Route path="/group/:id" element={<GroupDetail />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}
