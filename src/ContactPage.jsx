import { useState } from "react";
import Navigation from "./Navigation.jsx";

export default function ContactPage() {
  const [formSubmitting, setFormSubmitting] = useState(false);

  return (
    <div className="page">
      <Navigation isAdmin={false} />
      
      {/* Contact Hero Section */}
      <section className="list-hero">
        <div className="list-hero-overlay">
          <div className="pill">📞 Get In Touch</div>
          <h1 className="list-hero-title">Contact Us</h1>
          <p className="list-hero-desc">
            Ready to plan your dream Andaman adventure? Our travel experts are here to help you create the perfect island getaway.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="section">
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
                  <div className="contact-value">Mon - Sat: 9:00 AM - 7:00 PM<br/>Sunday: 10:00 AM - 4:00 PM</div>
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
            setFormSubmitting(true);
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
              
              if (response.ok) {
                alert('✅ Thank you! Your enquiry has been submitted successfully. We will contact you within 24 hours.');
                e.target.reset();
              } else {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Server error: ${response.status}`);
              }
            } catch (error) {
              console.error('Contact form error:', error);
              alert('❌ Sorry, there was an error submitting your enquiry. Please try again or call us directly.');
            } finally {
              submitButton.textContent = originalText;
              submitButton.disabled = false;
              setFormSubmitting(false);
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
            <button className="cta block" type="submit" disabled={formSubmitting}>
              {formSubmitting ? 'Sending...' : 'Send Enquiry'}
            </button>
          </form>
        </div>
      </section>

      {/* Office Location Map */}
      <section className="section alt">
        <div className="section-head">
          <h2>Visit Our Office</h2>
          <p>Find us at Church Lane, Goalghar, Port Blair - Your gateway to Andaman adventures</p>
        </div>
        <div className="map-container">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3890.8234567890123!2d92.7265!3d11.6667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDQwJzAwLjEiTiA5MsKwNDMnMzUuNCJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
            width="100%" 
            height="400" 
            style={{ border: 0, borderRadius: '16px' }}
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="My Andaman Tour Office Location"
          ></iframe>
          <div className="map-overlay">
            <div className="map-info">
              <h3>📍 My Andaman Tour</h3>
              <p>22/4, Church Lane, Goalghar<br/>Port Blair, South Andaman - 744103</p>
              <div className="map-actions">
                <a href="https://maps.google.com/?q=22/4,+Church+Lane,+Goalghar,+Port+Blair,+South+Andaman+744103" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="cta"
                   style={{ textDecoration: 'none', display: 'inline-block' }}>
                  🗺️ Get Directions
                </a>
                <a href="tel:+919679527880" 
                   className="ghost" 
                   style={{ textDecoration: 'none', display: 'inline-block' }}>
                  📞 Call Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Contact Actions */}
      <section className="contact-cta">
        <div className="contact-cta-content">
          <h2 className="contact-cta-title">Need Immediate Assistance?</h2>
          <p className="contact-cta-text">Our travel experts are available to help you plan your perfect Andaman getaway</p>
          <div className="contact-cta-buttons">
            <a href="https://wa.me/919531944080" className="cta" style={{ textDecoration: 'none', display: 'inline-block' }}>💬 WhatsApp Now</a>
            <a href="tel:+919679527880" className="ghost" style={{ textDecoration: 'none', display: 'inline-block' }}>📞 Call Now</a>
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