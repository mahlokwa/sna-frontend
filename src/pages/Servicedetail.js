import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../App3.css';

// Import icons
import { 
  CheckCircle, 
  FileText, 
  User, 
  Shield, 
  Clock, 
  Calendar, 
  Award, 
  MapPin,
  ArrowLeft,
  Menu,
  X,
  Phone,
  Mail,
  MapPin as MapPinIcon,
  Facebook,
  Instagram,
  Twitter
} from 'lucide-react';

// Service data
const servicesData = {
  learners: {
    title: "Learner's License Training",
    tagline: "Your first step to becoming a licensed driver",
    description: "Our comprehensive learner's license program prepares you for success on your first try. We cover all the theory, road rules, signs, and regulations required to pass your learner's license test with confidence.",
    imageUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200",
    includes: [
      "Comprehensive theory classes covering all road rules and regulations",
      "Road signs and markings training",
      "Rules of the road and traffic laws",
      "Practice tests and mock exams",
      "Accompaniment to traffic department to book your test date",
      "Accompaniment on the day of your test"
    ],
    requirements: [
      { icon: <FileText />, text: "Certified ID copy" },
      { icon: <User />, text: "ID photos (2 copies)" },
      { icon: <Shield />, text: "Eye test certificate" }
    ]
  },
  code8: {
    title: "Code 8 License",
    tagline: "Learn to drive cars and light vehicles confidently",
    description: "Our Code 8 program teaches you to drive light motor vehicles including cars and bakkies under 3,500kg. With experienced instructors, we ensure you're fully prepared for your driver's license test and real-world driving situations.",
    imageUrl: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800",
    includes: [
      "20 comprehensive one-hour driving lessons",
      "Professional instruction in modern, dual-control vehicles",
      "Flexible scheduling - book slots at your convenience",
      "Practical driving skills and road confidence building",
      "Test route familiarization and preparation",
      "Accompaniment to traffic department to book your test date",
      "Accompaniment and support on the day of your driving test"
    ],
    features: [
      { icon: <Clock />, title: "20 Lessons", text: "Comprehensive training program" },
      { icon: <Calendar />, title: "Flexible Slots", text: "Book at your convenience" },
      { icon: <Award />, title: "Test Ready", text: "Full preparation included" },
      { icon: <MapPin />, title: "Full Support", text: "From booking to test day" }
    ],
    note: "Slots are available for registered customers only. Create an account to start booking your lessons."
  },
  code10: {
    title: "Code 10 License",
    tagline: "Professional training for light commercial vehicles",
    description: "Our Code 10 program trains you to operate light commercial vehicles and trucks up to 16,000kg GVM. Perfect for those pursuing careers in delivery, logistics, or commercial driving. Our expert instructors provide professional training to ensure you're job-ready.",
    imageUrl: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800",
    includes: [
      "20 comprehensive one-hour driving lessons",
      "Training in light commercial vehicles with professional controls",
      "Flexible scheduling - book slots at your convenience",
      "Commercial driving techniques and safety protocols",
      "Vehicle handling and maneuvering skills",
      "Accompaniment to traffic department to book your test date",
      "Accompaniment and support on the day of your driving test"
    ],
    features: [
      { icon: <Clock />, title: "20 Lessons", text: "Professional training program" },
      { icon: <Calendar />, title: "Flexible Slots", text: "Book at your convenience" },
      { icon: <Award />, title: "Career Ready", text: "Job-focused training" },
      { icon: <MapPin />, title: "Full Support", text: "From booking to test day" }
    ],
    note: "Slots are available for registered customers only. Create an account to start booking your lessons."
  },
  code14: {
    title: "Code 14 License",
    tagline: "Expert training for heavy commercial vehicles",
    description: "Our Code 14 program provides professional training for operating heavy vehicles and trucks over 16,000kg GVM. Designed for aspiring professional truck drivers and commercial operators, this comprehensive program ensures you master the skills needed for a successful career in heavy vehicle operation.",
    imageUrl: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800",
    includes: [
      "20 comprehensive one-hour driving lessons",
      "Training in heavy commercial vehicles with expert instructors",
      "Flexible scheduling - book slots at your convenience",
      "Heavy vehicle operation and advanced handling techniques",
      "Safety protocols and commercial driving regulations",
      "Accompaniment to traffic department to book your test date",
      "Accompaniment and support on the day of your driving test"
    ],
    features: [
      { icon: <Clock />, title: "20 Lessons", text: "Expert training program" },
      { icon: <Calendar />, title: "Flexible Slots", text: "Book at your convenience" },
      { icon: <Award />, title: "Professional", text: "Industry-standard training" },
      { icon: <MapPin />, title: "Full Support", text: "From booking to test day" }
    ],
    note: "Slots are available for registered customers only. Create an account to start booking your lessons."
  }
};

const ServiceDetail = () => {
  const { serviceType } = useParams();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const service = servicesData[serviceType];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [serviceType]);

  if (!service) {
    return <div>Service not found</div>;
  }

  return (
    <div className="service-detail-page">
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
      <section 
        className="detail-hero"
        style={{ backgroundImage: `url(${service.imageUrl})` }}
      >
        <div className="detail-hero-overlay">
          <div className="container">
            <button className="back-btn" onClick={() => navigate('/services')}>
              <ArrowLeft size={20} /> Back to Services
            </button>
            <h1>{service.title}</h1>
            <p>{service.tagline}</p>
          </div>
        </div>
      </section>

      {/* ==================== CONTENT SECTION ==================== */}
      <section className="detail-content">
        <div className="container">
          {/* Description */}
          <div className="content-block">
            <h2>What We Offer</h2>
            <p>{service.description}</p>
          </div>

          {/* Includes */}
          <div className="content-block">
            <h2>Program Includes</h2>
            <ul className="includes-list">
              {service.includes.map((item, index) => (
                <li key={index}>
                  <CheckCircle size={20} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Requirements (Learners only) */}
          {service.requirements && (
            <div className="content-block">
              <h2>Requirements to Book</h2>
              <div className="requirements-grid">
                {service.requirements.map((req, index) => (
                  <div key={index} className="requirement-item">
                    <div className="requirement-icon">{req.icon}</div>
                    <span>{req.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Features (Code 8, 10, 14 only) */}
          {service.features && (
            <div className="content-block">
              <h2>Key Features</h2>
              <div className="features-grid">
                {service.features.map((feature, index) => (
                  <div key={index} className="feature-box">
                    <div className="feature-icon">{feature.icon}</div>
                    <h4>{feature.title}</h4>
                    <p>{feature.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Note */}
          {service.note && (
            <div className="service-note">
              <p><strong>Note:</strong> {service.note}</p>
            </div>
          )}

          {/* CTA */}
          <div className="detail-cta">
            <a href="/bookings" className="btn btn-primary">Book This Service</a>
            <a href="/services" className="btn btn-secondary">View All Services</a>
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
                <MapPinIcon size={18} />
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

export default ServiceDetail;