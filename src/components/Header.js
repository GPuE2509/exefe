import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';
import './Header.css';
const Header = () => {
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isShrunk, setIsShrunk] = useState(false);

  const handleLogout = () => {
    authService.logout();
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Handle scroll for shrinking header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 100) {
        setIsShrunk(true);
      } else if (currentScrollY < 50) {
        setIsShrunk(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('sidebar-open');
    };
  }, [isSidebarOpen]);

  return (
    <header className={`header ${isShrunk ? 'shrink' : ''}`}>
      {/* Mobile/Tablet Header - Simple Layout */}
      <div className="mobile-header">
        <button className="mobile-menu-toggle" onClick={toggleSidebar}>
          ☰
        </button>

        <div className="mobile-logo-section">
          <a href="/">
            <div className="logo">
              <img src="/img/logo.png" alt="BookStore Logo" />
            </div>
          </a>
          <div className="slogan">
            <span>Knowledge opens the future</span>
          </div>
        </div>
      </div>

      {/* Desktop Header - Full Layout */}
      <div className="desktop-header">
        <div className="top-bar">
          {/* Thanh tìm kiếm */}
          <div className="search-bar">
            <button className="menu-button">☰</button>
            <input type="text" className="search-input" placeholder="Search for books..." />
            <button className="search-button">🔍</button>
          </div>

          {/* Biểu tượng mạng xã hội */}
          <div className="social-icons">
            <a href="#" className="social-icon"><FaFacebook /></a>
            <a href="#" className="social-icon"><FaInstagram /></a>
            <a href="#" className="social-icon"><FaYoutube /></a>
          </div>

          {/* Đăng nhập & Giỏ hàng */}
          <div className="user-actions">
            {isAuthenticated ? (
              <>
                <span>Hello, {currentUser?.fullName || currentUser?.email}</span>
                <a href="/profile">Profile</a>
                {authService.isAdmin() && <a href="/admin">Admin</a>}
                <a href="#" onClick={handleLogout}>Logout</a>
              </>
            ) : (
              <>
                <a href="/login">Login</a>
                <a href="/register">Register</a>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Menu điều hướng và Logo */}
      <div className="nav-container">
        {/* Logo */}
        <a href="/">
          <div className="logo">
            <img src="/img/logo.png" width="150" alt="BookStore Logo" />
          </div>
        </a>
        <nav className="nav-links left">
          <a href="/">Home</a>
          <a href="/about">About</a>
        </nav>

        <nav className="nav-links right">
          <a href="/books">Books</a>
          <a href="/qr-scanner">QR Scan</a>
          {isAuthenticated && authService.isAdmin() && <a href="/admin">Admin</a>}
        </nav>
      </div>

      {/* Mobile Sidebar */}
      <div className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} onClick={closeSidebar}></div>
      <div className={`sidebar ${isSidebarOpen ? 'active' : ''}`}>
        <div className="sidebar-header">
          <h3>Menu</h3>
          <button className="sidebar-close" onClick={closeSidebar}>✕</button>
        </div>

        <div className="sidebar-content">
          {/* Search Bar */}
          <div className="sidebar-search">
            <div className="search-bar">
              <input type="text" className="search-input" placeholder="Search for books..." />
              <button className="search-button">🔍</button>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="sidebar-nav">
            <a href="/" onClick={closeSidebar}>Home</a>
            <a href="/about" onClick={closeSidebar}>About</a>
            <a href="/books" onClick={closeSidebar}>Books</a>
            <a href="/qr-scanner" onClick={closeSidebar}>QR Scan</a>
            {isAuthenticated && authService.isAdmin() && (
              <a href="/admin" onClick={closeSidebar}>Admin</a>
            )}
          </div>

          {/* User Actions */}
          <div className="sidebar-user">
            {isAuthenticated ? (
              <>
                <div className="user-info">
                  <span>Hello, {currentUser?.fullName || currentUser?.email}</span>
                </div>
                <a href="/profile" onClick={closeSidebar}>Profile</a>
                <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); closeSidebar(); }}>Logout</a>
              </>
            ) : (
              <>
                <a href="/login" onClick={closeSidebar}>Login</a>
                <a href="/register" onClick={closeSidebar}>Register</a>
              </>
            )}
          </div>

          {/* Social Icons */}
          <div className="sidebar-social">
            <h4>Follow us</h4>
            <div className="social-links">
              <a href="#" className="social-icon"><FaFacebook /></a>
              <a href="#" className="social-icon"><FaInstagram /></a>
              <a href="#" className="social-icon"><FaYoutube /></a>
            </div>
          </div>
        </div>
      </div>
    </header >
  );
};

export default Header;