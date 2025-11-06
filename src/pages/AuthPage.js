import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "../services/authService";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import "./AuthPage.css";

// Hàm kiểm tra định dạng email đơn giản
const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Set initial state based on the current route
  const [isActive, setIsActive] = useState(location.pathname === '/register');
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Update active state when route changes
  useEffect(() => {
    setIsActive(location.pathname === '/register');
  }, [location.pathname]);

  // Check if already authenticated
  useEffect(() => {
    const token = authService.getToken();
    if (token) {
      if (authService.isAdmin()) {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [navigate]);

  const handleLoginClick = () => {
    setIsActive(false);
    navigate('/login', { replace: true });
  };
  const handleRegisterClick = () => {
    setIsActive(true);
    navigate('/register', { replace: true });
  };
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      toast.error("Vui lòng nhập đầy đủ email và mật khẩu");
      return;
    }
    if (!validateEmail(email)) {
      toast.error("Định dạng email không hợp lệ");
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await authService.login({ email, password });
      
      if (result.success) {
        toast.success("Đăng nhập thành công!");
        const from = location.state?.from?.pathname || '/';
        
        if (authService.isAdmin()) {
          navigate('/admin', { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      } else {
        setError(result.message);
        toast.error(result.message);
      }
    } catch (error) {
      setError('Đã xảy ra lỗi khi đăng nhập');
      toast.error('Đã xảy ra lỗi khi đăng nhập');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!fullName || !phone || !email || !password || !confirmPassword) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    if (!validateEmail(email)) {
      toast.error("Định dạng email không hợp lệ");
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      toast.error("Số điện thoại phải gồm 10 chữ số");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await authService.register({ fullName, email, phone, password });
      
      if (result.success) {
        toast.success("Tạo tài khoản thành công! Vui lòng đăng nhập.");
        setIsActive(false); // chuyển về form đăng nhập
        // Reset form
        setFullName("");
        setPhone("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      } else {
        setError(result.message);
        toast.error(result.message);
      }
    } catch (error) {
      setError('Đã xảy ra lỗi khi đăng ký');
      toast.error('Đã xảy ra lỗi khi đăng ký');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Vui lòng nhập email");
      return;
    }
    if (!validateEmail(email)) {
      toast.error("Định dạng email không hợp lệ");
      return;
    }
    toast.success("Yêu cầu đặt lại mật khẩu đã được gửi");
  };

  const handleForgotPasswordClick = () => {
    setIsForgotPassword(true);
  };

  const handleBackToLoginClick = () => {
    setIsForgotPassword(false);
  };

  return (
    <div className="page-wrapper">
      <div className={`container-auth ${isActive ? "active" : ""}`}>
      {isForgotPassword ? (
        <div className="form-box forgot-password">
          <form onSubmit={handleForgotSubmit}>
            <h1>QUÊN MẬT KHẨU</h1>
            <div className="input-box">
              <input 
                type="text" 
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <i className="bx bxs-envelope"></i>
            </div>
            <button type="submit" className="btn-auth">
              Gửi yêu cầu
            </button>
            <div className="forgot-link">
              <a href="#" onClick={handleBackToLoginClick}>
                Quay lại trang đăng nhập
              </a>
            </div>
          </form>
        </div>
      ) : (
        <div className="form-box login">
          <form onSubmit={handleLogin}>
            <h1>ĐĂNG NHẬP</h1>
            <div className="input-box">
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input-box">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="password-toggle" onClick={togglePasswordVisibility}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <button type="submit" className="btn-auth" disabled={loading}>
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
            <div className="forgot-link">
              <a href="#" onClick={handleForgotPasswordClick}>
                Quên mật khẩu?
              </a>
            </div>
          </form>
        </div>
      )}

      <div className="form-box register">
        <form onSubmit={handleRegister}>
          <h1>ĐĂNG KÝ</h1>
          <div className="input-box">
            <input 
              type="text" 
              placeholder="Họ và tên" 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)}  
            />
          </div>
          <div className="input-box">
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}  
            />
          </div>
          <div className="input-box">
            <input 
              type="tel" 
              inputMode="numeric" 
              pattern="[0-9]*" 
              placeholder="Số điện thoại" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}  
            />
          </div>
          <div className="input-box">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Mật khẩu" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}  
            />
            <span className="password-toggle" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <div className="input-box">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Xác nhận mật khẩu" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)}  
            />
            <span className="password-toggle" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>
      </div>

      <div className="toggle-box">
        <div className="toggle-panel toggle-left">
          <h1>Chào mừng bạn!</h1>
          <p>Chưa có tài khoản?</p>
          <button className="btn-auth" onClick={handleRegisterClick}>
            Đăng ký
          </button>
        </div>
        <div className="toggle-panel toggle-right">
          <h1>Chào mừng trở lại!</h1>
          <p>Bạn đã có tài khoản?</p>
          <button className="btn-auth" onClick={handleLoginClick}>
            Đăng nhập
          </button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default AuthPage;

