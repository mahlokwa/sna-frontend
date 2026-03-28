import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App3.css';

// Import icons
import { 
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  Facebook,
} from 'lucide-react';

const Services = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll function
  /*const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };*/  

  const handleViewDetails = (serviceType) => {
    navigate(`/services/${serviceType}`);
  };

  return (
    <div className="services-page">
      {/* ==================== NAVBAR ==================== */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <a href="/" className="logo">
            <span>SNA</span> DRIVING
          </a>

          <ul className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/services" className="active">Services</a></li>
            <li><a href="/pricing">Pricing</a></li>
            <li><a href="/contact">Contact</a></li>
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
      <section className="services-hero" id="services">
        <div className="hero-content">
          <h1>Our <span>Services</span></h1>
          <p>Professional driving training programs tailored to your needs</p>
        </div>
      </section>

      {/* ==================== SERVICES GRID ==================== */}
      <section className="services-grid-section">
        <div className="container">
          <div className="section-header">
            <h2>Choose Your Program</h2>
             <p>Click "View Details" to learn more about each service</p>
          </div>

          <div className="services-grid">
            {/* Learner's License */}
            <ServiceCard
              title="Learner's License"
              description="Comprehensive theory training covering all road rules, signs, and regulations. We accompany you to book your test and support you on test day."
              
              imageUrl="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800"
              onViewDetails={() => handleViewDetails('learners')}
            />

            {/* Code 8 */}
            <ServiceCard
              title="Code 8 License"
              description="Learn to drive light motor vehicles with 20 comprehensive lessons. Flexible scheduling for registered customers with full test preparation."
              
              imageUrl="https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800"
              onViewDetails={() => handleViewDetails('code8')}
            />

            {/* Code 10 */}
            <ServiceCard
              title="Code 10 License"
              description="Professional training for light commercial vehicles up to 16,000kg. 20 lessons with flexible booking and career-focused instruction."
              
              imageUrl="https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800"
              onViewDetails={() => handleViewDetails('code10')}
            />

            {/* Code 14 */}
            <ServiceCard
              title="Code 14 License"
              description="Expert training for heavy vehicles over 16,000kg. 20 comprehensive lessons preparing you for a professional driving career."
              
              imageUrl="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800"
              onViewDetails={() => handleViewDetails('code14')}
            />
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="footer" id="contact">
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

// ==================== SERVICE CARD COMPONENT ====================
const ServiceCard = ({ title, description, icon, imageUrl, onViewDetails }) => (
  <div className="service-card">
    <div 
      className="service-image"
      style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : {}}
    >
      <div className="service-icon-overlay">
        {icon}
      </div>
    </div>
    <div className="service-content">
      <h3>{title}</h3>
      <p>{description}</p>
      <button onClick={onViewDetails} className="service-btn">
        View Details →
      </button>
    </div>
  </div>
);

export default Services;