import React from 'react';
import './Footer.css';
import { FaFacebook, FaInstagram, FaYoutube, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left Column: Brand & About */}
        <div className="footer-column brand-column">
          <div className="footer-logo">
            <img src="/img/logo.png" alt="BookStore Logo" className="footer-logo-img" />
          </div>
          <h3 className="footer-brand-name">EssGENIUS BOOKSTORE</h3>
          <p className="footer-quote">"Knowledge opens the future"</p>
          <p className="company-description">
            We provide high-quality books with modern audio technology,
            helping you explore knowledge in an exciting and effective way.
          </p>

          <div className="social-links-row">
            <a href="#" className="social-icon"><FaFacebook /></a>
            <a href="#" className="social-icon"><FaInstagram /></a>
            <a href="#" className="social-icon"><FaYoutube /></a>
          </div>
        </div>

        {/* Right Column: Contact & Support */}
        <div className="footer-column contact-column">
          <h4 className="column-title">Contact Us</h4>
          <div className="contact-list">
            <div className="contact-item">
              <FaMapMarkerAlt className="contact-icon" />
              <span>123 Book Street, Dist 1, HCMC</span>
            </div>
            <div className="contact-item">
              <FaPhoneAlt className="contact-icon" />
              <span>1900 0152 (Hotline)</span>
            </div>
            <div className="contact-item">
              <FaEnvelope className="contact-icon" />
              <span>support@essgenius.com</span>
            </div>
            <div className="contact-item">
              <FaClock className="contact-icon" />
              <span>8:00 - 22:00 (Daily)</span>
            </div>
          </div>

          <div className="footer-policies-row">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 EssGenius BookStore. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
