import React, { useState, useEffect } from 'react';
import '../App3.css';
import { 
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Users,
  Car,
  Shield,
  Award,
  Calendar,
  CheckCircle
} from 'lucide-react';

const About = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const instructors = [
    {
      name: "Instructor Name",
      role: "Senior Driving Instructor",
      experience: "10+ years",
      specialty: "Code 8 & 10"
    },
    {
      name: "Instructor Name",
      role: "Driving Instructor",
      experience: "7+ years",
      specialty: "Code 14 & Heavy Vehicles"
    },
    {
      name: "Instructor Name",
      role: "Driving Instructor",
      experience: "5+ years",
      specialty: "Learner's & Code 8"
    }
  ];

  const stats = [
    { icon: <Users />, number: "500+", label: "Students Trained" },
    { icon: <Car />, number: "95%", label: "Pass Rate" },
    { icon: <Calendar />, number: "15+", label: "Years Experience" },
    { icon: <Award />, number: "100%", label: "Certified Instructors" }
  ];

  const values = [
    {
      icon: <Shield />,
      title: "Safety First",
      description: "Your safety is our top priority. All our vehicles are equipped with dual controls and regularly maintained."
    },
    {
      icon: <Users />,
      title: "Professional Instructors",
      description: "Our instructors are certified, experienced, and patient. We focus on building your confidence behind the wheel."
    },
    {
      icon: <CheckCircle />,
      title: "Proven Success",
      description: "With a 95% pass rate, our comprehensive training program ensures you're fully prepared for your test."
    }
  ];

  return (
    <div className="about-page">
      {/* ==================== NAVBAR ==================== */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <a href="/" className="logo">
            <span>SNA</span> DRIVING
          </a>

          <ul className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
            <li><a href="/">Home</a></li>
            <li><a href="/About" className="active">About</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/pricing">Pricing</a></li>
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
      <section className="about-hero">
        <div className="hero-content">
          <h1>About <span>SNA Driving School</span></h1>
          <p>Empowering safe, confident drivers in Polokwane and beyond</p>
        </div>
      </section>

      {/* ==================== STORY SECTION ==================== */}
      <section className="story-section">
        <div className="container">
          <div className="story-content">
            <h2>Our Story</h2>
            <p>
              SNA Driving School has been a trusted name in driver education for over 15 years. 
              We started with a simple mission: to provide professional, patient, and comprehensive 
              driver training that builds confidence and promotes road safety.
            </p>
            <p>
              Today, we've helped hundreds of students earn their licenses and become safe, 
              responsible drivers. Our experienced instructors are passionate about teaching and 
              committed to your success.
            </p>
            <p>
              Whether you're getting your learner's license or training for heavy vehicles, 
              we provide personalized instruction tailored to your learning style and pace.
            </p>
          </div>
        </div>
      </section>

      {/* ==================== STATS SECTION ==================== */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-box">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== VALUES SECTION ==================== */}
      <section className="values-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose Us</h2>
            <p>We're committed to excellence in driver education</p>
          </div>

          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <div className="value-icon">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== TEAM SECTION ==================== */}
      <section className="team-section">
        <div className="container">
          <div className="section-header">
            <h2>Meet Our Team</h2>
            <p>Professional, certified, and passionate instructors</p>
          </div>

          <div className="team-grid">
            {instructors.map((instructor, index) => (
              <div key={index} className="instructor-card">
                <div className="instructor-avatar">
                  <Users size={48} />
                </div>
                <h3>{instructor.name}</h3>
                <p className="instructor-role">{instructor.role}</p>
                <div className="instructor-details">
                  <div className="detail-item">
                    <Calendar size={16} />
                    <span>{instructor.experience}</span>
                  </div>
                  <div className="detail-item">
                    <Award size={16} />
                    <span>{instructor.specialty}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Start Your Journey?</h2>
          <p>Join hundreds of satisfied students who've earned their licenses with us</p>
          <div className="cta-buttons">
            <a href="/pricing" className="btn btn-primary">View Pricing</a>
            <a href="/contact" className="btn btn-secondary">Contact Us</a>
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

export default About;