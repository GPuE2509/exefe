import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      {/* Footer Main Content */}
      <div className="footer-content">
        <div className="footer-container">
          {/* Company Info Section */}
          <div className="footer-section company-info">
            <div className="footer-logo">
              <img src="/img/logo.png" alt="BookStore Logo" />
            </div>
            <div className="company-details">
              <h3>EssGENIUS BOOKSTORE</h3>
              <p className="slogan">Tri thức mở ra tương lai</p>
              <p className="description">
                Chúng tôi cung cấp những cuốn sách chất lượng cao với công nghệ audio hiện đại, 
                giúp bạn khám phá kiến thức một cách thú vị và hiệu quả.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-title">Liên kết nhanh</h4>
            <ul className="footer-links">
              <li><a href="/">🏠 Trang chủ</a></li>
              <li><a href="/about">ℹ️ Giới thiệu</a></li>
              <li><a href="/books">📚 Sách</a></li>
              <li><a href="/qr-scanner">📱 Quét QR</a></li>
              <li><a href="/reviews">⭐ Đánh giá</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-section">
            <h4 className="footer-title">Dịch vụ</h4>
            <ul className="footer-links">
              <li><a href="/books">📖 Sách giấy</a></li>
              <li><a href="/books">🎧 Audio Books</a></li>
              <li><a href="/qr-scanner">🔊 QR Audio</a></li>
              <li><a href="/support">🛠️ Hỗ trợ</a></li>
              <li><a href="/delivery">🚚 Giao hàng</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section contact-section">
            <h4 className="footer-title">Liên hệ</h4>
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <div className="contact-details">
                  <p>123 Đường Sách, Quận 1</p>
                  <p>TP. Hồ Chí Minh, Việt Nam</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <div className="contact-details">
                  <p>Hotline: 1900 0152</p>
                  <p>Support: 1900 7070</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">✉️</span>
                <div className="contact-details">
                  <p>info@essgenius.com</p>
                  <p>support@essgenius.com</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">🕒</span>
                <div className="contact-details">
                  <p>T2-T6: 8:00 - 18:00</p>
                  <p>T7-CN: 9:00 - 17:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media & Map Section */}
      <div className="footer-extra">
        <div className="footer-container">
          <div className="extra-content">
            {/* Social Media */}
            <div className="social-section">
              <h4>Kết nối với chúng tôi</h4>
              <div className="social-links">
                <a href="#" className="social-link facebook">
                  <img src="/img/face.png" alt="Facebook" />
                  <span>Facebook</span>
                </a>
                <a href="#" className="social-link instagram">
                  <img src="/img/insta.png" alt="Instagram" />
                  <span>Instagram</span>
                </a>
                <a href="#" className="social-link youtube">
                  <img src="/img/ytb.png" alt="YouTube" />
                  <span>YouTube</span>
                </a>
              </div>
            </div>

            {/* Map */}
            <div className="map-section">
              <h4>Tìm chúng tôi</h4>
              <div className="footer-map">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.325123456789!2d106.70000000000001!3d10.776944444444444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4b90b6dd01%3A0x243c066f1552c4d1!2sHo%20Chi%20Minh%20City%2C%20Vietnam!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus" 
                  width="100%" 
                  height="100%" 
                  style={{border:0}} 
                  allowFullScreen
                  title="BookStore Location">
                </iframe>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom - Copyright */}
      <div className="footer-bottom">
        <div className="footer-container">
          <div className="footer-bottom-content">
            <div className="copyright">
              <p>&copy; 2025 EssGenius BookStore. All rights reserved.</p>
              <p>Thiết kế bởi EssGenius Team</p>
            </div>
            <div className="footer-policies">
              <a href="/privacy">Chính sách bảo mật</a>
              <a href="/terms">Điều khoản sử dụng</a>
              <a href="/cookie">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
