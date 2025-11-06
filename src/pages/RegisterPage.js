import React, { useState } from 'react';
import './RegisterPage.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }
    
    if (!formData.agreeTerms) {
      alert('Vui lòng đồng ý với điều khoản sử dụng!');
      return;
    }
    
    // Logic đăng ký sẽ được implement sau
    console.log('Register data:', formData);
    alert('Đăng ký thành công!');
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="register-page">
      <div className="container">
        <section className="register-section">
          <div className="register-container">
            <h2>ĐĂNG KÝ TÀI KHOẢN</h2>
            
            <form onSubmit={handleSubmit}>
              <input 
                type="text" 
                name="username"
                className="input-field" 
                placeholder="Tên đăng nhập"
                value={formData.username}
                onChange={handleInputChange}
                required
              />

              <input 
                type="email" 
                name="email"
                className="input-field" 
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />

              <div className="password-container">
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  className="input-field" 
                  placeholder="Mật khẩu"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <span className="toggle-password" onClick={togglePassword}>
                  {showPassword ? '🙈' : '👁️'}
                </span>
              </div>

              <div className="password-container">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  name="confirmPassword"
                  className="input-field" 
                  placeholder="Xác nhận mật khẩu"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
                <span className="toggle-password" onClick={toggleConfirmPassword}>
                  {showConfirmPassword ? '🙈' : '👁️'}
                </span>
              </div>
              
              <div className="terms">
                <input 
                  type="checkbox" 
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                />
                <label htmlFor="agreeTerms">Tôi đồng ý với <a href="#">điều khoản sử dụng</a></label>
              </div>
              
              <button type="submit" className="register-btn">ĐĂNG KÝ</button>
            </form>
            
            <div className="login-link">
              <p>Đã có tài khoản? <a href="/login">Đăng nhập ngay</a></p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default RegisterPage;
