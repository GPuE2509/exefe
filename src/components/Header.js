import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import './Header.css';
const Header = () => {
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    authService.logout();
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

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
    <header className="header">
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
            <span>Tri thức mở ra tương lai</span>
          </div>
        </div>
      </div>

      {/* Desktop Header - Full Layout */}
      <div className="desktop-header">
        <div className="top-bar">
          {/* Thanh tìm kiếm */}
          <div className="search-bar">
            <button className="menu-button">☰</button>
            <input type="text" className="search-input" placeholder="Tìm kiếm sách..." />
            <button className="search-button">🔍</button>
          </div>

          {/* Biểu tượng mạng xã hội */}
          <div className="social-icons">
            <a href="#"><img src="/img/face.png" alt="Facebook" /></a>
            <a href="#"><img src="/img/insta.png" alt="Instagram" /></a>
            <a href="#"><img src="/img/ytb.png" alt="YouTube" /></a>
          </div>

          {/* Đăng nhập & Giỏ hàng */}
          <div className="user-actions">
            {isAuthenticated ? (
              <>
                <span>Xin chào, {currentUser?.fullName || currentUser?.email}</span>
                <a href="/profile">Hồ sơ</a>
                {authService.isAdmin() && <a href="/admin">Admin</a>}
                <a href="#" onClick={handleLogout}>Đăng xuất</a>
              </>
            ) : (
              <>
                <a href="/login">Đăng nhập</a>
                <a href="/register">Đăng ký</a>
              </>
            )}
            <a href="/cart">🛒</a>
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
          <a href="/">Trang chủ</a>               
          <a href="/about">Giới thiệu</a>
        </nav>
        
        <nav className="nav-links right">
          <a href="/books">Sách</a>
          <a href="/qr-scanner">Quét QR</a>
          {isAuthenticated && authService.isAdmin() && <a href="/admin">Admin</a>}
          <a href="/reviews">Đánh giá</a>
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
              <input type="text" className="search-input" placeholder="Tìm kiếm sách..." />
              <button className="search-button">🔍</button>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="sidebar-nav">
            <a href="/" onClick={closeSidebar}>Trang chủ</a>
            <a href="/about" onClick={closeSidebar}>Giới thiệu</a>
            <a href="/books" onClick={closeSidebar}>Sách</a>
            <a href="/qr-scanner" onClick={closeSidebar}>Quét QR</a>
            {isAuthenticated && authService.isAdmin() && (
              <a href="/admin" onClick={closeSidebar}>Admin</a>
            )}
            <a href="/reviews" onClick={closeSidebar}>Đánh giá</a>
          </div>

          {/* User Actions */}
          <div className="sidebar-user">
            {isAuthenticated ? (
              <>
                <div className="user-info">
                  <span>Xin chào, {currentUser?.fullName || currentUser?.email}</span>
                </div>
                <a href="/profile" onClick={closeSidebar}>Hồ sơ</a>
                <a href="/cart" onClick={closeSidebar}>🛒 Giỏ hàng</a>
                <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); closeSidebar(); }}>Đăng xuất</a>
              </>
            ) : (
              <>
                <a href="/login" onClick={closeSidebar}>Đăng nhập</a>
                <a href="/register" onClick={closeSidebar}>Đăng ký</a>
                <a href="/cart" onClick={closeSidebar}>🛒 Giỏ hàng</a>
              </>
            )}
          </div>

          {/* Social Icons */}
          <div className="sidebar-social">
            <h4>Theo dõi chúng tôi</h4>
            <div className="social-links">
              <a href="#"><img src="/img/face.png" alt="Facebook" /></a>
              <a href="#"><img src="/img/insta.png" alt="Instagram" /></a>
              <a href="#"><img src="/img/ytb.png" alt="YouTube" /></a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;