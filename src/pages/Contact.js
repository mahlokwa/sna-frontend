import React, { useState, useEffect } from 'react';
import '../App3.css';
import { 
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Clock,
  Send
} from 'lucide-react';

const Contact = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Placeholder - replace with actual API call
    setFormStatus({ type: 'success', message: 'Message sent successfully! We\'ll get back to you soon.' });
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });

    setTimeout(() => {
      setFormStatus({ type: '', message: '' });
    }, 5000);
  };

  return (
    <div className="contact-page">
      {/* ==================== NAVBAR ==================== */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <a href="/Home" className="logo">
            <span>SNA</span> DRIVING
          </a>

          <ul className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/pricing">Pricing</a></li>
            <li><a href="/contact" className="active">Contact</a></li>
            <li><a href="/custlogin" className="cta-nav-btn">Book a slot</a></li>
          </ul>

          <div 
            className="menu-toggle" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </div>
        </div>
      </nav>

      {/* ==================== HERO SECTION ==================== */}
      <section className="contact-hero">
        <div className="hero-content">
          <h1>Get in <span>Touch</span></h1>
          <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>
      </section>

      {/* ==================== CONTACT SECTION ==================== */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Info */}
            <div className="contact-info-side">
              <h2>Contact Information</h2>
              <p>Reach out to us through any of these channels</p>

              <div className="contact-methods">
                <div className="contact-method">
                  <div className="method-icon">
                    <Phone size={24} />
                  </div>
                  <div className="method-content">
                    <h3>Phone</h3>
                    <p>+27 (0) 079 248 1203</p>
                    <p className="method-note">Mon-Fri, 8am-5pm</p>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="method-icon">
                    <Mail size={24} />
                  </div>
                  <div className="method-content">
                    <h3>Email</h3>
                    <p>Snadrivingschool888@gmail.com/</p>
                    <p className="method-note">We'll respond within 24 hours</p>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="method-icon">
                    <MapPin size={24} />
                  </div>
                  <div className="method-content">
                    <h3>Location</h3>
                    <p>Shop no 08 back opposite shoprite M house street</p>
                    <p>South Africa</p>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="method-icon">
                    <Clock size={24} />
                  </div>
                  <div className="method-content">
                    <h3>Business Hours</h3>
                    <p>Monday - Friday: 8:00 AM - 5:00 PM</p>
                    <p>Saturday: 8:00 AM - 1:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>

              <div className="social-section">
                <h3>Follow Us</h3>
                 <div className="social-links-large">
                   <a href="https://www.facebook.com/people/SNA-Driving-School/61555841217666/" className="social-link">
                     <Facebook size={24} />
                   </a>
                   <a href="https://www.tiktok.com/@sna.driving.schoo4?_r=1&_t=ZS-951DbFLCPFn" className="social-link">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/>
                      </svg>
                   </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-side">
              <div className="form-card">
                <h2>Send Us a Message</h2>

                {formStatus.message && (
                  <div className={`form-alert ${formStatus.type}`}>
                    {formStatus.message}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Your Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+27 123 456 7890"
                      />
                    </div>

                    <div className="form-group">
                      <label>Subject *</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="How can we help?"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="6"
                      placeholder="Tell us more about your inquiry..."
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="submit-btn">
                    <Send size={20} />
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== MAP SECTION (PLACEHOLDER) ==================== */}
         <section className="map-section">
           <iframe
               title="SNA Driving School Location"
               src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3718.123456789!2d29.7333!3d-23.8833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sMankweng%2C%20Limpopo!5e0!3m2!1sen!2sza!4v1234567890"
               width="100%"
               height="400"
               style={{ border: 0 }}
               allowFullScreen=""
               loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
         </section>
      {/* ==================== FOOTER ==================== */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>SNA Driving School</h3>
            <p style={{ color: '#666', lineHeight: '1.8' }}>
              Professional driver training with a focus on safety, confidence, and excellence.
            </p>
              <div className="social-links">
                <a href="https://www.facebook.com/people/SNA-Driving-School/61555841217666/"><Facebook size={18} /></a>
                <a href="https://www.tiktok.com/@sna.driving.schoo4?_r=1&_t=ZS-951DbFLCPFn">
                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                   <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/>
                 </svg>
                </a>
              </div>
          </div>

          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/services">Services</a></li>
              <li><a href="/pricing">Pricing</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Services</h3>
            <ul>
              <li><a href="/services/learners">Learner's License</a></li>
              <li><a href="/services/code8">Code 8 License</a></li>
              <li><a href="/services/code10">Code 10 License</a></li>
              <li><a href="/services/code14">Code 14 License</a></li>
            </ul>
          </div>

          <div className="footer-section">
                      <h3>Contact Us</h3>
                      <div className="contact-info">
                        <div className="contact-item">
                          <Phone size={18} />
                          <span>+27 (0) 079 248 1203</span>
                        </div>
                        <div className="contact-item">
                          <Mail size={18} />
                          <span>Snadrivingschool888@gmail.com</span>
                        </div>
                        <div className="contact-item">
                          <MapPin size={18} />
                          <span>Mankweng,Shop no 08, back opposite shoprite, M house street</span>
                        </div>
                      </div>
                    </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 SNA Driving School. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Contact;