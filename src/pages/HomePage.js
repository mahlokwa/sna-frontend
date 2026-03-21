import React, { useState, useEffect } from 'react';
import "../App3.css";

// Import icons (using Lucide React - you'll need to install it)
// npm install lucide-react
import { 
  Users, 
  Car, 
  Calendar, 
  Shield, 
  CheckCircle, 
  UserCheck, 
  Clock,
  DollarSign,
  Trophy,
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter
} from 'lucide-react';

const Homepage = () => {
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
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="homepage">
      {/* ==================== NAVBAR ==================== */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <a href="/" className="logo">
            <span>SNA</span> DRIVING
          </a>

          <ul className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
            <li><a href="/" className= "active">Home</a></li>
            <li><a href="/about">About</a></li>
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
      <section className="hero" id="home">
        <div className="hero-content">
          <div className="hero-text">
            <h1>
              Learn to Drive <span>Confidently.</span><br />
              Pass Your Test with Ease.
            </h1>
            <p>
              Professional instructors, flexible schedules, modern vehicles. 
              Start your driving journey today with South Africa's most trusted driving school.
            </p>
            <div className="hero-buttons">
              <a href="#" className="btn btn-primary">Book Your Lesson</a>
              <a onClick={() => scrollToSection('courses')} className="btn btn-secondary">
                View Courses
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== ABOUT SECTION ==================== */}
      <section className="about-section" id="about">
        <div className="container">
          <div className="section-header">
            <h2>About SNA Driving School</h2>
            <p>Your trusted partner in professional driver training</p>
          </div>

          <div className="about-content">
            <p>
              At SNA Driving School, we're committed to providing the highest quality 
              driver education in South Africa. With years of experience and a team of 
              certified instructors, we've helped thousands of students achieve their 
              driving goals safely and confidently.
            </p>
            <p>
              Our modern fleet of vehicles and proven teaching methods ensure you're 
              fully prepared for both your test and the road ahead. We believe in 
              building confident, responsible drivers who prioritize safety above all.
            </p>
          </div>

          <div className="about-stats">
            <StatItem 
              icon={<Users />} 
              title="Certified Instructors" 
              description="Experienced, patient, and professional" 
            />
            <StatItem 
              icon={<Car />} 
              title="Modern Vehicles" 
              description="Well-maintained, safe fleet" 
            />
            <StatItem 
              icon={<Calendar />} 
              title="Flexible Scheduling" 
              description="Lessons at your convenience" 
            />
            <StatItem 
              icon={<Shield />} 
              title="Safety Focused" 
              description="Your safety is our priority" 
            />
          </div>
        </div>
      </section>

      {/* ==================== WHY CHOOSE US ==================== */}
      <section className="why-choose-us">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose SNA Driving School</h2>
            <p>Experience the difference with professional driver training</p>
          </div>

          <div className="features-grid">
            <FeatureCard
              icon={<CheckCircle />}
              title="High Pass Rates"
              description="Our proven teaching methods result in excellent first-time pass rates for both learner's and driver's license tests."
            />
            <FeatureCard
              icon={<Car />}
              title="Modern Fleet"
              description="Learn in well-maintained, modern vehicles equipped with dual controls for maximum safety during training."
            />
            <FeatureCard
              icon={<UserCheck />}
              title="Expert Instructors"
              description="All our instructors are fully certified, experienced, and dedicated to helping you become a confident driver."
            />
            <FeatureCard
              icon={<Clock />}
              title="Flexible Hours"
              description="Book lessons at times that suit your schedule, including evenings and weekends."
            />
            <FeatureCard
              icon={<DollarSign />}
              title="Personalized Training"
              description="Each lesson is tailored to your skill level and learning pace, ensuring optimal progress."
            />
            <FeatureCard
              icon={<Trophy />}
              title="Proven Track Record"
              description="Years of experience and thousands of successful students speak to our commitment to excellence."
            />
          </div>
        </div>
      </section>

      {/* ==================== COURSES SECTION ==================== */}
      <section className="courses-section" id="courses">
        <div className="container">
          <div className="section-header">
            <h2>Our Driving Courses</h2>
            <p>Comprehensive training programs for all license types</p>
          </div>

          <div className="courses-grid">
           <div className="courses-grid">
  <CourseCard
    title="Code 8 License"
    description="..."
    imageUrl="https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800"
  />
  
  <CourseCard
    title="Code 10 License"
    description="..."
    imageUrl="https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800"
  />
  
  <CourseCard
    title="Code 14 License"
    description="..."
    imageUrl="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600"
  />
  
  <CourseCard
    title="Learner's License"
    description="..."
    imageUrl="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&fit=crop"
  />
</div>
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
            <h3>Courses</h3>
            <ul>
              <li><a href="#">Code 8 License</a></li>
              <li><a href="#">Code 10 License</a></li>
              <li><a href="#">Code 14 License</a></li>
              <li><a href="#">Learner's License</a></li>
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

// ==================== SUB COMPONENTS ====================

const StatItem = ({ icon, title, description }) => (
  <div className="stat-item">
    <div className="stat-icon">
      {icon}
    </div>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

const FeatureCard = ({ icon, title, description }) => (
  <div className="feature-card">
    <div className="feature-icon">
      {icon}
    </div>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

const CourseCard = ({ title, description, emoji, imageUrl }) => (
  <div className="course-card">
    <div 
      className="course-image"
      style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : {}}
    >
      {!imageUrl && <div className="course-image-placeholder">{emoji}</div>}
    </div>
    <div className="course-content">
      <h3>{title}</h3>
      <p>{description}</p>
      <a href="#" className="course-btn">View Details →</a>
    </div>
  </div>
);

export default Homepage;