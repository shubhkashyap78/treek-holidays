import Navigation from "./Navigation.jsx";

export default function AboutPage() {
  return (
    <div className="page">
      <Navigation isAdmin={false} />
      
      {/* About Hero Section */}
      <section className="about-hero">
        <div className="about-hero-overlay">
          <div className="about-hero-content">
            <div className="pill">🌴 About My Andaman Tour</div>
            <h1 className="about-hero-title">Your Trusted Partner for Andaman Adventures</h1>
            <p className="about-hero-desc">
              With over 8 years of experience in crafting unforgettable journeys, we specialize in creating personalized travel experiences that showcase the natural beauty, rich culture, and adventure opportunities of the pristine Andaman Islands.
            </p>
            <div className="about-hero-stats">
              <div className="about-hero-stat">
                <div className="stat-number">500+</div>
                <div className="stat-label">Happy Travelers</div>
              </div>
              <div className="about-hero-stat">
                <div className="stat-number">8+</div>
                <div className="stat-label">Years Experience</div>
              </div>
              <div className="about-hero-stat">
                <div className="stat-number">50+</div>
                <div className="stat-label">Tour Packages</div>
              </div>
              <div className="about-hero-stat">
                <div className="stat-number">4.9★</div>
                <div className="stat-label">Customer Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="section">
        <div className="about-story-container">
          <div className="about-story-content">
            <div className="pill" style={{ marginBottom: 16 }}>📖 Our Story</div>
            <h2 className="about-story-title">Crafting Memories Since 2015</h2>
            <p className="about-story-text">
              My Andaman Tour was born from a passion for sharing the incredible beauty and unique experiences that the Andaman and Nicobar Islands have to offer. What started as a small local initiative has grown into one of the most trusted travel partners in the region.
            </p>
            <p className="about-story-text">
              Our journey began when our founder, a local Andaman resident, realized that visitors needed more than just basic tour packages – they needed authentic experiences, local insights, and personalized attention that only true island experts could provide.
            </p>
            <p className="about-story-text">
              Today, we're proud to have helped thousands of travelers discover the magic of these pristine islands, from romantic honeymoon getaways to thrilling family adventures and corporate group expeditions.
            </p>
            
            <div className="about-highlights">
              <div className="about-highlight">
                <div className="highlight-icon">🏆</div>
                <div>
                  <h4>Award-Winning Service</h4>
                  <p>Recognized for excellence in customer service and sustainable tourism practices</p>
                </div>
              </div>
              <div className="about-highlight">
                <div className="highlight-icon">🌱</div>
                <div>
                  <h4>Eco-Friendly Tourism</h4>
                  <p>Committed to preserving the natural beauty of Andaman for future generations</p>
                </div>
              </div>
              <div className="about-highlight">
                <div className="highlight-icon">👥</div>
                <div>
                  <h4>Local Expertise</h4>
                  <p>Our team of local guides knows every hidden gem and secret spot on the islands</p>
                </div>
              </div>
            </div>
          </div>
          <div className="about-story-image">
            <img src="/assests/aboutus.jpg" alt="About My Andaman Tour" />
            <div className="image-overlay">
              <div className="overlay-content">
                <h3>🏝️ Discover Paradise</h3>
                <p>Experience the untouched beauty of Andaman Islands with expert local guidance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section alt">
        <div className="section-head">
          <h2>Why Choose My Andaman Tour?</h2>
          <p>We go beyond ordinary travel services to create extraordinary experiences</p>
        </div>
        <div className="why-choose-grid">
          <div className="why-choose-card">
            <div className="why-choose-icon">🎯</div>
            <h3>Personalized Itineraries</h3>
            <p>Every trip is customized to match your interests, budget, and travel style. No cookie-cutter packages here!</p>
          </div>
          <div className="why-choose-card">
            <div className="why-choose-icon">🛡️</div>
            <h3>24/7 Support</h3>
            <p>Our dedicated support team is available round-the-clock to assist you throughout your journey.</p>
          </div>
          <div className="why-choose-card">
            <div className="why-choose-icon">💰</div>
            <h3>Best Price Guarantee</h3>
            <p>We offer competitive rates with transparent pricing and no hidden charges. Value for money guaranteed!</p>
          </div>
          <div className="why-choose-card">
            <div className="why-choose-icon">🏝️</div>
            <h3>Local Insights</h3>
            <p>Access to exclusive locations, local experiences, and insider tips that only locals know about.</p>
          </div>
          <div className="why-choose-card">
            <div className="why-choose-icon">✈️</div>
            <h3>Hassle-Free Booking</h3>
            <p>Simple online booking process with instant confirmation and flexible payment options.</p>
          </div>
          <div className="why-choose-card">
            <div className="why-choose-icon">🌟</div>
            <h3>Quality Assurance</h3>
            <p>Carefully selected accommodations, reliable transportation, and verified activity partners.</p>
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="section">
        <div className="section-head">
          <h2>Our Comprehensive Services</h2>
          <p>Everything you need for a perfect Andaman vacation, all in one place</p>
        </div>
        <div className="services-grid">
          <div className="service-card">
            <div className="service-image" style={{ backgroundImage: 'url(/assests/honeymoon1.jpeg)' }}></div>
            <div className="service-content">
              <h3>🌹 Honeymoon Packages</h3>
              <p>Romantic getaways with private beaches, candlelight dinners, and luxury accommodations for couples.</p>
              <ul>
                <li>Private beach access</li>
                <li>Sunset cruise experiences</li>
                <li>Romantic dining setups</li>
                <li>Couple spa treatments</li>
              </ul>
            </div>
          </div>
          <div className="service-card">
            <div className="service-image" style={{ backgroundImage: 'url(/assests/family1.jpeg)' }}></div>
            <div className="service-content">
              <h3>👨‍👩‍👧‍👦 Family Adventures</h3>
              <p>Fun-filled packages designed for families with activities suitable for all age groups.</p>
              <ul>
                <li>Kid-friendly activities</li>
                <li>Family accommodation</li>
                <li>Educational island tours</li>
                <li>Safe water sports</li>
              </ul>
            </div>
          </div>
          <div className="service-card">
            <div className="service-image" style={{ backgroundImage: 'url(/assests/scubadiving.jpg)' }}></div>
            <div className="service-content">
              <h3>🤿 Adventure Activities</h3>
              <p>Thrilling water sports and adventure activities for adrenaline seekers and nature lovers.</p>
              <ul>
                <li>Scuba diving & snorkeling</li>
                <li>Sea walking experiences</li>
                <li>Jet skiing & parasailing</li>
                <li>Deep sea fishing</li>
              </ul>
            </div>
          </div>
          <div className="service-card">
            <div className="service-image" style={{ backgroundImage: 'url(/assests/andaman hotels1.jpg)' }}></div>
            <div className="service-content">
              <h3>🏨 Accommodation</h3>
              <p>Carefully selected hotels and resorts ranging from budget-friendly to luxury properties.</p>
              <ul>
                <li>Beach-front resorts</li>
                <li>Budget accommodations</li>
                <li>Luxury hotel partnerships</li>
                <li>Unique stay experiences</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="section alt">
        <div className="mission-vision-container">
          <div className="mission-card">
            <div className="mission-icon">🎯</div>
            <h3>Our Mission</h3>
            <p>To provide exceptional travel experiences that create lasting memories while promoting sustainable tourism and supporting local communities in the Andaman Islands.</p>
          </div>
          <div className="vision-card">
            <div className="vision-icon">🌟</div>
            <h3>Our Vision</h3>
            <p>To be the leading travel partner for Andaman tourism, known for our commitment to quality, sustainability, and authentic local experiences.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="contact-cta">
        <div className="contact-cta-content">
          <h2 className="contact-cta-title">Ready to Explore Andaman with Us?</h2>
          <p className="contact-cta-text">Let our experienced team help you plan the perfect island adventure tailored just for you</p>
          <div className="contact-cta-buttons">
            <a href="/contact" className="cta" style={{ textDecoration: 'none', display: 'inline-block' }}>Plan My Trip</a>
            <a href="https://wa.me/919679527880" className="ghost" style={{ textDecoration: 'none', display: 'inline-block' }}>💬 WhatsApp Us</a>
          </div>
        </div>
      </section>

      {/* Footer */}
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
            <a href="/#packages" className="footer-link">Packages</a>
            <a href="/#activities" className="footer-link">Activities</a>
            <a href="/#islands" className="footer-link">Islands</a>
            <a href="/#ferry" className="footer-link">Ferry Services</a>
          </div>
          <div className="footer-section">
            <div className="footer-title">Categories</div>
            <a href="/honeymoon" className="footer-link">Honeymoon</a>
            <a href="/family" className="footer-link">Family</a>
            <a href="/group" className="footer-link">Group Tours</a>
            <a href="/ltc" className="footer-link">LTC Packages</a>
          </div>
          <div className="footer-section">
            <div className="footer-title">Contact Us</div>
            <a href="tel:+919679527880" className="footer-link">📞 +91-96795-27880</a>
            <a href="tel:+919531944080" className="footer-link">📞 +91-95319-44080</a>
            <a href="https://wa.me/919679527880" className="footer-link">💬 WhatsApp: +91-95319-44080</a>
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