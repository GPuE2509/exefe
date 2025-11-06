import React from 'react';
import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-page">
      {/* Welcome Section */}
      <section className="welcome-section">
        <div className="container">
          <h1 className="welcome-title">Welcome, Everyone!</h1>
          <p className="welcome-text">
            Fluffy Flakes is a place for creating sweet cakes, light and airy, fluffy breads. 
            We believe in love and care, sweet moments, and happiness in every bite.
          </p>
          
          <div className="image-gallery">
            <div className="main-image">
              <div className="image-placeholder">
                <span>Main Image</span>
              </div>
            </div>
            <div className="small-images">
              <div className="image-placeholder">
                <span>Image 1</span>
              </div>
              <div className="image-placeholder">
                <span>Image 2</span>
              </div>
              <div className="image-placeholder">
                <span>Image 3</span>
              </div>
              <div className="image-placeholder">
                <span>Image 4</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Goal Section */}
      <section className="goal-section">
        <div className="container">
          <h2 className="section-title">Goal</h2>
          <div className="goal-content">
            <div className="goal-text">
              <p>
                Actually, we believe that every cake is not just cake but also a moment of happiness. 
                We create delicious and visually appealing cakes with our special recipe, friendly service, 
                and unique shopping experiences that make every customer feel special.
              </p>
              <a href="#" className="read-more">Read more</a>
            </div>
            <div className="goal-image">
              <div className="image-placeholder">
                <span>Goal Image</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-card">
            <h2 className="contact-title">CONTACT US</h2>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <h2 className="section-title">FAQ</h2>
          <div className="faq-decorations">
            <div className="decoration decoration-1"></div>
            <div className="decoration decoration-2"></div>
            <div className="decoration decoration-3"></div>
            <div className="decoration decoration-4"></div>
          </div>
        </div>
      </section>

      {/* Subscription Form Section */}
      <section className="subscription-section">
        <div className="container">
          <div className="subscription-card">
            <h2 className="subscription-title">Want more deliciousness?</h2>
            <p className="subscription-desc">
              Subscribe here and we'll send you an email as new recipes are published. 
              Also our fan favorites reload!
            </p>
            
            <form className="subscription-form">
              <div className="form-row">
                <input 
                  type="text" 
                  placeholder="John Carter" 
                  className="form-input"
                />
                <input 
                  type="email" 
                  placeholder="example@email.com" 
                  className="form-input"
                />
              </div>
              <textarea 
                placeholder="Please type your message here..."
                className="form-textarea"
              ></textarea>
              <button type="submit" className="submit-btn">Send</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;