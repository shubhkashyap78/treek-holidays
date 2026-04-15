import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { fetchList } from "./api.js";
import { fallbackActivities, fallbackFamily, fallbackGroup, fallbackHoneymoon, fallbackIslands, fallbackLtc, fallbackPackages, fallbackFerry } from "./fallbackData.js";
import Navigation from "./Navigation.jsx";
import HoneymoonList from "./HoneymoonList.jsx";
import HoneymoonDetail from "./HoneymoonDetail.jsx";
import FamilyList from "./FamilyList.jsx";
import FamilyDetail from "./FamilyDetail.jsx";
import LtcList from "./LtcList.jsx";
import LtcDetail from "./LtcDetail.jsx";
import GroupList from "./GroupList.jsx";
import GroupDetail from "./GroupDetail.jsx";
import ActivityList from "./ActivityList.jsx";
import ActivityDetail from "./ActivityDetail.jsx";
import IslandList from "./IslandList.jsx";
import IslandDetail from "./IslandDetail.jsx";
import FerryList from "./FerryList.jsx";
import FerryDetail from "./FerryDetail.jsx";
import ContactPage from "./ContactPage.jsx";
import AboutPage from "./AboutPage.jsx";
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
  const [currentSlide, setCurrentSlide] = useState(0);

  const [packageFilters,  setPackageFilters]  = useState({ q: "", category: "", minPrice: "", maxPrice: "" });
  const [activityFilters, setActivityFilters] = useState({ q: "", category: "", location: "", minPrice: "", maxPrice: "" });
  const [islandFilters,   setIslandFilters]   = useState({ q: "" });

  // Hero carousel images
  const heroImages = [
    "/assests/andaman1.jpg",
    "/assests/andaman2.jpg", 
    "/assests/andaman3.jpg",
    "/assests/Elephant-beach-2.jpg",
    "/assests/honeymoon1.jpeg",
    "/assests/family1.jpeg"
  ];

  // Auto-slide carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval);
  }, [heroImages.length]);

  async function loadAll() {
    setLoading(true);
    const [p, a, i, h, f, l, g, fe] = await Promise.all([
      fetchList("/api/packages",  packageFilters,  fallbackPackages),
      // Using fallback activities to avoid 404 errors
      Promise.resolve(fallbackActivities),
      // Using fallback islands to avoid 404 errors
      Promise.resolve(fallbackIslands),
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

  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <div className="page">
      <Navigation isAdmin={false} />

      <section className="hero">
        {/* Hero Carousel */}
        <div className="hero-carousel">
          {heroImages.map((image, index) => (
            <div 
              key={index}
              className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${image})` }}
            />
          ))}
          
          {/* Carousel Navigation Dots */}
          <div className="hero-carousel-dots">
            {heroImages.map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
        
        <div className="hero-overlay"></div>
        <div className="hero-content-wrapper">
          <div className="hero-content">
            <div className="pill">🏝️ Trusted Andaman Tour Partner Since 2015</div>
            <h1>Discover Paradise in the Andaman Islands</h1>
            <p>Experience crystal-clear waters, pristine beaches, and unforgettable adventures. Your dream tropical escape awaits.</p>
            <div className="hero-actions">
              <button className="cta" onClick={() => document.getElementById('packages').scrollIntoView({ behavior: 'smooth' })}>Explore Packages</button>
              <a href="https://wa.me/919531944080" className="ghost" style={{ textDecoration: 'none', display: 'inline-block' }}>WhatsApp Us</a>
            </div>
            <div className="hero-stats">
              <div><div className="stat-value">{loading ? "..." : packages.length + honeymoon.length + family.length + ltc.length + group.length}+</div><div className="stat-label">Tour Packages</div></div>
              <div><div className="stat-value">{loading ? "..." : activities.length}+</div><div className="stat-label">Activities</div></div>
              <div><div className="stat-value">{loading ? "..." : islands.length}+</div><div className="stat-label">Islands</div></div>
              <div><div className="stat-value">4.9★</div><div className="stat-label">Customer Rating</div></div>
            </div>
          </div>
          
          {/* Hero Enquiry Form */}
          <div className="hero-enquiry-form">
            <div className="hero-form-header">
              <h3>🌴 Plan Your Dream Trip</h3>
              <p>Get personalized itinerary in 24 hours</p>
            </div>
            <form className="hero-form" onSubmit={async (e) => {
              e.preventDefault();
              const submitButton = e.target.querySelector('button[type="submit"]');
              const originalText = submitButton.textContent;
              
              try {
                submitButton.textContent = 'Sending...';
                submitButton.disabled = true;
                
                const formData = new FormData(e.target);
                const data = {
                  name: formData.get('name'),
                  email: formData.get('email'),
                  phone: formData.get('phone'),
                  packageType: formData.get('packageType'),
                  travelMonth: formData.get('travelMonth'),
                  numberOfTravelers: parseInt(formData.get('numberOfTravelers')) || 1,
                  message: formData.get('message') || 'Enquiry from hero section form'
                };
                
                const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/contact`, {
                  method: 'POST',
                  headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                  },
                  body: JSON.stringify(data)
                });
                
                if (response.ok) {
                  alert('✅ Thank you! Your enquiry has been submitted successfully. We will contact you within 24 hours.');
                  e.target.reset();
                } else {
                  const errorData = await response.json().catch(() => ({}));
                  throw new Error(errorData.error || `Server error: ${response.status}`);
                }
              } catch (error) {
                console.error('Hero form error:', error);
                alert('❌ Sorry, there was an error submitting your enquiry. Please try again or call us directly.');
              } finally {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
              }
            }}>
              <input className="hero-input" name="name" placeholder="Your Name *" required />
              <input className="hero-input" name="email" type="email" placeholder="Email Address *" required />
              <input className="hero-input" name="phone" type="tel" placeholder="Phone Number *" required />
              <select className="hero-input" name="packageType" required>
                <option value="">Select Package Type</option>
                <option value="honeymoon">Honeymoon</option>
                <option value="family">Family</option>
                <option value="group">Group</option>
                <option value="ltc">LTC</option>
                <option value="custom">Custom Package</option>
              </select>
              <div className="hero-input-row">
                <input className="hero-input" name="travelMonth" type="date" placeholder="Travel Date" />
                <input className="hero-input" name="numberOfTravelers" type="number" placeholder="Travelers" min="1" />
              </div>
              <textarea className="hero-input" name="message" rows="3" placeholder="Tell us about your dream trip..."></textarea>
              <button className="hero-submit" type="submit">Get Free Quote</button>
              <div className="hero-form-note">
                🔒 Your information is safe with us
              </div>
            </form>
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
            <div className="category-image" style={{ backgroundImage: 'url(/assests/honeymoon1.jpeg)' }}></div>
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
            <div className="category-image" style={{ backgroundImage: 'url(/assests/family1.jpeg)' }}></div>
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
            <div className="category-image" style={{ backgroundImage: 'url(/assests/andaman1.jpg)' }}></div>
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
            <div className="category-image" style={{ backgroundImage: 'url(/assests/andaman2.jpg)' }}></div>
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
        <div className="section-head">
          <h2>Water Activities</h2>
          <p>Scuba, kayaking, sea walk, and more adventures await you.</p>
          <Link to="/activities" className="section-link">View All Activities →</Link>
        </div>
        <div className="filters">
          <input className="input" placeholder="Search title" value={activityFilters.q} onChange={(e) => setActivityFilters({ ...activityFilters, q: e.target.value })} />
          <input className="input" placeholder="Category" value={activityFilters.category} onChange={(e) => setActivityFilters({ ...activityFilters, category: e.target.value })} />
          <input className="input" placeholder="Location" value={activityFilters.location} onChange={(e) => setActivityFilters({ ...activityFilters, location: e.target.value })} />
          <button className="ghost" onClick={loadAll}>Apply</button>
        </div>
        {loading ? <div className="loading">Loading activities...</div> : (
          <div className="grid">
            {activities.slice(0, 6).map((item) => (
              <Link key={item._id} to={`/activities/${item._id}`} className="card">
                <div className="card-image" style={{ backgroundImage: `url(${item.image})` }} />
                <div className="card-body">
                  <div className="card-title">{item.title}</div>
                  <div className="card-meta">{item.category}</div>
                  <p className="card-text">{item.description}</p>
                  <div className="card-foot">
                    <span className="price">{formatPrice(item.priceFrom)}</span>
                    <span className="card-link">View Details →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section id="islands" className="section">
        <div className="section-head">
          <h2>Top Islands</h2>
          <p>Explore pristine beaches and crystal-clear waters of Andaman's most beautiful islands.</p>
          <Link to="/islands" className="section-link">View All Islands →</Link>
        </div>
        <div className="filters">
          <input className="input" placeholder="Search island" value={islandFilters.q} onChange={(e) => setIslandFilters({ ...islandFilters, q: e.target.value })} />
          <button className="ghost" onClick={loadAll}>Apply</button>
        </div>
        {loading ? <div className="loading">Loading islands...</div> : (
          <div className="grid">
            {islands.map((item) => (
              <Link key={item._id} to={`/islands/${item._id}`} className="card">
                <div className="card-image" style={{ backgroundImage: `url(${item.image})` }} />
                <div className="card-body">
                  <div className="card-title">{item.name}</div>
                  <div className="card-meta">{item.tagline}</div>
                  <p className="card-text">{item.description}</p>
                  <div className="card-foot">
                    <span className="price">Explore</span>
                    <span className="card-link">View Island →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section id="ferry" className="section alt">
        <div className="section-head">
          <h2>Ferry Services</h2>
          <p>Premium ferry services for comfortable island hopping with modern amenities.</p>
          <Link to="/ferries" className="section-link">View All Ferries →</Link>
        </div>
        {loading ? <div className="loading">Loading ferries...</div> : (
          <div className="grid">
            {ferry.map((item) => (
              <Link key={item._id} to={`/ferries/${item._id}`} className="card ferry-card">
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
                    <span className="card-link">View Details →</span>
                  </div>
                </div>
              </Link>
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
              Welcome to My Andaman Tour, your premier travel companion for exploring the breathtaking Andaman and Nicobar Islands. With over 8 years of experience in crafting unforgettable journeys, we specialize in creating personalized travel experiences that showcase the natural beauty, rich culture, and adventure opportunities of these pristine islands.
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
            <img src="/assests/aboutus.jpg" alt="About My Andaman Tour" />
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
              "We had lovely time at Andaman Islands. Andaman is a must visit place. We would like to thanks Mr. Vikash from My Andaman Tour for conducting our package. He has taken at most care of us. In case we come to Andaman again, we would like to opt for My Andaman Tour only."
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
              "My Andaman Tour" made our trip so memorable and Happy. Mainly i would like to thank Vikas bhai for Guiding anf Helping us through out the trip. For sure i will recommend my friends and relatives to opt "My Andaman Tour" for their future trips to Andaman."
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
              "It was a nice experience with this company, and Vikashji coordinating the entire tour and making it hassle free for us, despite the pandemic imposed restrictions. Our tour was planned between 2nd Jan 2021 to 8th Jan 2021, for a short span of 6 nights and 7 days, for a family of 2 adults and one kid. We had Portblair, North Bay, Ross Island visit, Havelock Island Neil Island in our itenary. All transfers were taken well care of (this included govt. operated cruises this time since Mackruzz and Green ocean private cruises weren't yet operational post lockdowns, but it was nevertheless an experience in itself with an open to sky deck and helpful crew on board); the package was customised exactly as per our requirement.."
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
              "We had a very good time at Andaman. Our travel agent Mr. Vikass of My Andaman Tour gave a great support. Thanks My Andaman Tour for the lovely memories."
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
              Vikash bhai, thank you for your services at Andaman.Aapne humara tour bahot hi badiya karaya. Halanki Covid-19 ki wajah se hum Makruzz ka maza nahi utha paaye Candle Light Dinner Havelock mein bahot badiya tha. Humne jaisa socha tha usse dugna maza aya humein. Jaise mujhe mere NCDC office mein suggest kiya gaya tha aapke bare mein, mai wada karta hoon ki mai bhi apko refer karoonga apne NCDC Delhi ke branch mein. Aur Haan apke My Andaman Kitchen ka Khana Lajawaab tha..
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
              
I along with my wife really had a blast at Andaman.I thank My Andaman Tour for well planed tour.The whole team of My Andaman Tour deserves Kudos!

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
            <a href="https://wa.me/919531944080" className="ghost" style={{ textDecoration: 'none', display: 'inline-block' }}>💬 WhatsApp Us</a>
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
                  <a href="tel:+919679527880" className="contact-value">+91-96795-27880</a>
                  <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>
                    <a href="tel:+919531944080" style={{ color: "inherit", textDecoration: "none" }}>+91-95319-44080</a> | 
                    <a href="tel:+917063967678" style={{ color: "inherit", textDecoration: "none" }}>+91-70639-67678</a>
                  </div>
                </div>
              </div>
              <div className="contact-detail-item">
                <span className="contact-icon">💬</span>
                <div>
                  <div className="contact-label">WhatsApp</div>
                  <a href="https://wa.me/919531944080" className="contact-value">+91-95319-44080</a>
                  <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>
                    <a href="https://wa.me/919679527880" style={{ color: "inherit", textDecoration: "none" }}>+91-96795-27880</a>
                  </div>
                </div>
              </div>
              <div className="contact-detail-item">
                <span className="contact-icon">☎️</span>
                <div>
                  <div className="contact-label">Landline</div>
                  <a href="tel:+91319223263" className="contact-value">+91-03192-233263</a>
                </div>
              </div>
              <div className="contact-detail-item">
                <span className="contact-icon">✉️</span>
                <div>
                  <div className="contact-label">Email</div>
                  <a href="mailto:myandamantour@gmail.com" className="contact-value">myandamantour@gmail.com</a>
                  <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>
                    <a href="mailto:info@myandamantour.com" style={{ color: "inherit", textDecoration: "none" }}>info@myandamantour.com</a>
                  </div>
                </div>
              </div>
              <div className="contact-detail-item">
                <span className="contact-icon">📍</span>
                <div>
                  <div className="contact-label">Office</div>
                  <div className="contact-value">22/4, Church Lane, Goalghar<br/>Port Blair, South Andaman - 744103</div>
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
            const submitButton = e.target.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            try {
              submitButton.textContent = 'Sending...';
              submitButton.disabled = true;
              
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
              
              const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/contact`, {
                method: 'POST',
                headers: { 
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                },
                body: JSON.stringify(data)
              });
              
              console.log('Contact form response:', response.status, response.statusText);
              
              if (response.ok) {
                const result = await response.json();
                console.log('Contact saved successfully:', result);
                alert('✅ Thank you! Your enquiry has been submitted successfully. We will contact you within 24 hours.');
                e.target.reset();
              } else {
                const errorData = await response.json().catch(() => ({}));
                console.error('Contact form error response:', errorData);
                throw new Error(errorData.error || `Server error: ${response.status}`);
              }
            } catch (error) {
              console.error('Contact form error:', error);
              alert('❌ Sorry, there was an error submitting your enquiry. Please try again or call us directly at +91-90000-00000');
            } finally {
              submitButton.textContent = originalText;
              submitButton.disabled = false;
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
            <input className="input" name="travelMonth" type="date" placeholder="Travel Date" />
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
              <img src="/assests/logo tour.png" alt="My Andaman Tour" style={{ height: 44, width: 'auto', borderRadius: 8 }} />
              <div>
                <div className="brand-title">My Andaman Tour</div>
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
            <a href="tel:+919679527880" className="footer-link">📞 +91-96795-27880</a>
            <a href="tel:+919531944080" className="footer-link">📞 +91-95319-44080</a>
            <a href="https://wa.me/919531944080" className="footer-link">💬 WhatsApp: +91-95319-44080</a>
            <a href="mailto:myandamantour@gmail.com" className="footer-link">✉️ myandamantour@gmail.com</a>
            <div className="footer-link">📍 22/4, Church Lane, Goalghar, Port Blair</div>
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

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/activities" element={<ActivityList />} />
        <Route path="/activities/:id" element={<ActivityDetail />} />
        <Route path="/islands" element={<IslandList />} />
        <Route path="/islands/:id" element={<IslandDetail />} />
        <Route path="/ferries" element={<FerryList />} />
        <Route path="/ferries/:id" element={<FerryDetail />} />
        <Route path="/honeymoon" element={<HoneymoonList />} />
        <Route path="/honeymoon/:id" element={<HoneymoonDetail />} />
        <Route path="/family" element={<FamilyList />} />
        <Route path="/family/:id" element={<FamilyDetail />} />
        <Route path="/ltc" element={<LtcList />} />
        <Route path="/ltc/:id" element={<LtcDetail />} />
        <Route path="/group" element={<GroupList />} />
        <Route path="/group/:id" element={<GroupDetail />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}
