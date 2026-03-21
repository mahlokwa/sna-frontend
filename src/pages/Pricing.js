import React, { useState, useEffect } from 'react';
import '../App.css';

// Import icons
import { 
  Check,
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  BookOpen,
  Car,
  Truck,
  Package
} from 'lucide-react';

const Pricing = () => {
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

  return (
    <div className="pricing-page">
      {/* ==================== NAVBAR ==================== */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <a href="/" className="logo">
            <span>SNA</span> DRIVING
          </a>

          <ul className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/pricing" className="active">Pricing</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/custlogin" className="cta-nav-btn">Start Now</a></li>
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
      <section className="pricing-hero">
        <div className="hero-content">
          <h1>Simple, Transparent <span>Pricing</span></h1>
          <p>Choose the program that fits your needs. No hidden fees, no surprises.</p>
        </div>
      </section>

      {/* ==================== PRICING SECTION ==================== */}
      <section className="pricing-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Packages</h2>
            <p>Professional training programs at competitive prices</p>
          </div>

          <div className="pricing-grid">
            {/* Learner's License */}
            <PricingCard
              icon={<BookOpen />}
              title="Learner's License"
              price="500"
              popular={false}
              features={[
                "Comprehensive theory classes",
                "All road rules & regulations",
                "Road signs training",
                "Practice tests & mock exams",
                "Accompany to traffic dept",
                "Support on test day"
              ]}
              buttonText="Get Started"
              buttonLink="/bookings"
            />

            {/* Code 8 */}
            <PricingCard
              icon={<Car />}
              title="Code 8 License"
              price="3,000"
              popular={false}
              features={[
                "20 comprehensive lessons",
                "Professional instructors",
                "Modern dual-control vehicles",
                "Flexible scheduling",
                "Test route preparation",
                "Accompany to traffic dept",
                "Support on test day"
              ]}
              buttonText="Get Started"
              buttonLink="/bookings"
            />

            {/* Code 10 */}
            <PricingCard
              icon={<Truck />}
              title="Code 10 License"
              price="3,000"
              popular={false}
              features={[
                "20 comprehensive lessons",
                "Light commercial vehicle training",
                "Professional instructors",
                "Flexible scheduling",
                "Commercial driving techniques",
                "Accompany to traffic dept",
                "Support on test day"
              ]}
              buttonText="Get Started"
              buttonLink="/bookings"
            />

            {/* Code 14 */}
            <PricingCard
              icon={<Truck />}
              title="Code 14 License"
              price="3,000"
              popular={false}
              features={[
                "20 comprehensive lessons",
                "Heavy vehicle training",
                "Expert instructors",
                "Flexible scheduling",
                "Advanced handling techniques",
                "Accompany to traffic dept",
                "Support on test day"
              ]}
              buttonText="Get Started"
              buttonLink="/bookings"
            />
          </div>

          {/* Combo Packages */}
          <div className="combo-section">
            <div className="combo-header">
              <h2>🎉 Combo Packages</h2>
              <p>Save money by bundling Learner's License with your driver training</p>
            </div>

            <div className="combos-grid">
              {/* Learner's + Code 8 */}
              <div className="combo-card-small">
                <div className="combo-badge-small">SAVE R500</div>
                
                <div className="combo-icon-small">
                  <Package size={36} />
                </div>

                <h3>Learner's + Code 8</h3>
                <p className="combo-description">Complete package for standard vehicles</p>

                <div className="combo-price-box">
                  <div className="combo-price-small">
                    <span className="currency">R</span>
                    <span className="amount">3,500</span>
                  </div>
                </div>

                <ul className="combo-includes">
                  <li><Check size={16} /> Full Learner's training</li>
                  <li><Check size={16} /> Code 8 - 20 lessons</li>
                  <li><Check size={16} /> All test accompaniments</li>
                </ul>
              </div>

              {/* Learner's + Code 10 */}
              <div className="combo-card-small popular-combo">
                <div className="combo-badge-small">SAVE R500</div>
                <div className="popular-badge-small">POPULAR</div>
                
                <div className="combo-icon-small">
                  <Package size={36} />
                </div>

                <h3>Learner's + Code 10</h3>
                <p className="combo-description">Perfect for commercial vehicle careers</p>

                <div className="combo-price-box">
                  <div className="combo-price-small">
                    <span className="currency">R</span>
                    <span className="amount">3,500</span>
                  </div>
                </div>

                <ul className="combo-includes">
                  <li><Check size={16} /> Full Learner's training</li>
                  <li><Check size={16} /> Code 10 - 20 lessons</li>
                  <li><Check size={16} /> All test accompaniments</li>
                </ul>
              </div>

              {/* Learner's + Code 14 */}
              <div className="combo-card-small">
                <div className="combo-badge-small">SAVE R500</div>
                
                <div className="combo-icon-small">
                  <Package size={36} />
                </div>

                <h3>Learner's + Code 14</h3>
                <p className="combo-description">Professional heavy vehicle training</p>

                <div className="combo-price-box">
                  <div className="combo-price-small">
                    <span className="currency">R</span>
                    <span className="amount">3,500</span>
                  </div>
                </div>

                <ul className="combo-includes">
                  <li><Check size={16} /> Full Learner's training</li>
                  <li><Check size={16} /> Code 14 - 20 lessons</li>
                  <li><Check size={16} /> All test accompaniments</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="pricing-info">
            <h3>What's Included in All Packages</h3>
            <div className="info-grid">
              <div className="info-item">
                <Check size={24} />
                <div>
                  <h4>Professional Instructors</h4>
                  <p>Certified, experienced, and patient instructors</p>
                </div>
              </div>
              <div className="info-item">
                <Check size={24} />
                <div>
                  <h4>Modern Vehicles</h4>
                  <p>Well-maintained, safe, dual-control vehicles</p>
                </div>
              </div>
              <div className="info-item">
                <Check size={24} />
                <div>
                  <h4>Flexible Scheduling</h4>
                  <p>Book lessons at times that suit you</p>
                </div>
              </div>
              <div className="info-item">
                <Check size={24} />
                <div>
                  <h4>Test Day Support</h4>
                  <p>We accompany you to book and take your test</p>
                </div>
              </div>
            </div>
          </div>
        </div>
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
              <a href="#"><Facebook size={18} /></a>
              <a href="#"><Instagram size={18} /></a>
              <a href="#"><Twitter size={18} /></a>
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
                <span>+27 (0) 123 456 7890</span>
              </div>
              <div className="contact-item">
                <Mail size={18} />
                <span>info@snadrivingschool.co.za</span>
              </div>
              <div className="contact-item">
                <MapPin size={18} />
                <span>Polokwane, Limpopo, South Africa</span>
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

// ==================== PRICING CARD COMPONENT ====================
const PricingCard = ({ icon, title, price, popular, features, buttonText, buttonLink }) => (
  <div className={`pricing-card ${popular ? 'popular' : ''}`}>
    {popular && <div className="popular-badge">MOST POPULAR</div>}
    
    <div className="pricing-card-header">
      <div className="pricing-icon">{icon}</div>
      <h3>{title}</h3>
    </div>

    <div className="pricing-card-price">
      <span className="currency">R</span>
      <span className="amount">{price}</span>
    </div>

    <ul className="pricing-features">
      {features.map((feature, index) => (
        <li key={index}>
          <Check size={18} />
          <span>{feature}</span>
        </li>
      ))}
    </ul>

    <a href={buttonLink} className="pricing-btn">
      {buttonText} →
    </a>
  </div>
);

export default Pricing;