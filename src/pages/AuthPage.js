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
      toast.error("Please enter email and password");
      return;
    }
    if (!validateEmail(email)) {
      toast.error("Invalid email format");
      return;
    }

    setLoading(true);

    try {
      const result = await authService.login({ email, password });

      if (result.success) {
        toast.success("Login successful!");
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
      setError('An error occurred during login');
      toast.error('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName || !phone || !email || !password || !confirmPassword) {
      toast.error("Please enter all information");
      return;
    }
    if (!validateEmail(email)) {
      toast.error("Invalid email format");
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      toast.error("Phone number must be 10 digits");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const result = await authService.register({ fullName, email, phone, password });

      if (result.success) {
        toast.success("Account created successfully! Please login.");
        setIsActive(false); // Switch to login form
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
      setError('An error occurred during registration');
      toast.error('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter email");
      return;
    }
    if (!validateEmail(email)) {
      toast.error("Invalid email format");
      return;
    }
    toast.success("Password reset request sent");
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
              <h1>FORGOT PASSWORD</h1>
              <div className="input-box">
                <input
                  type="text"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <i className="bx bxs-envelope"></i>
              </div>
              <button type="submit" className="btn-auth">
                Send Request
              </button>
              <div className="forgot-link">
                <a href="#" onClick={handleBackToLoginClick}>
                  Back to Login
                </a>
              </div>
            </form>
          </div>
        ) : (
          <div className="form-box login">
            <form onSubmit={handleLogin}>
              <h1>LOGIN</h1>
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
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span className="password-toggle" onClick={togglePasswordVisibility}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <button type="submit" className="btn-auth" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
              <div className="forgot-link">
                <a href="#" onClick={handleForgotPasswordClick}>
                  Forgot Password?
                </a>
              </div>
            </form>
          </div>
        )}

        <div className="form-box register">
          <form onSubmit={handleRegister}>
            <h1>REGISTER</h1>
            <div className="input-box">
              <input
                type="text"
                placeholder="Full Name"
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
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
              />
            </div>
            <div className="input-box">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
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
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span className="password-toggle" onClick={togglePasswordVisibility}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <button type="submit" className="btn-auth" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>

        <div className="toggle-box">
          <div className="toggle-panel toggle-left">
            <h1>Welcome Back!</h1>
            <p>Don't have an account?</p>
            <button className="btn-auth" onClick={handleRegisterClick}>
              Register
            </button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Hello, Friend!</h1>
            <p>Already have an account?</p>
            <button className="btn-auth" onClick={handleLoginClick}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

