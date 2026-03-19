import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'antd/dist/reset.css';
import './App.css';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Lazy load pages
const HomePage = React.lazy(() => import('./pages/HomePage'));
const BooksPage = React.lazy(() => import('./pages/BooksPage'));
const BookDetailPage = React.lazy(() => import('./pages/BookDetailPage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const AuthPage = React.lazy(() => import('./pages/AuthPage'));
const QRScannerPage = React.lazy(() => import('./pages/QRScannerPage'));
const PrivacyPolicyPage = React.lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsOfServicePage = React.lazy(() => import('./pages/TermsOfServicePage'));
const ForumPage = React.lazy(() => import('./pages/ForumPage'));

// Lazy load admin pages
const DashboardPage = React.lazy(() => import('./pages/admin/DashboardPage'));
const BooksManagementPage = React.lazy(() => import('./pages/admin/BooksManagementPage'));
const AudioManagementPage = React.lazy(() => import('./pages/admin/AudioManagementPage'));
const ImageManagementPage = React.lazy(() => import('./pages/admin/ImageManagementPage'));
const GenreManagementPage = React.lazy(() => import('./pages/admin/GenreManagementPage'));
const BannerManagementPage = React.lazy(() => import('./pages/admin/BannerManagementPage'));

// Lazy load 404 pages
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));
const AdminNotFoundPage = React.lazy(() => import('./pages/admin/AdminNotFoundPage'));

// Loading component
const PageLoader = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '20px',
    color: '#666'
  }}>
    Đang tải...
  </div>
);

function App() {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes with MainLayout */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="books" element={<BooksPage />} />
            <Route path="book/:id" element={<BookDetailPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="qr-scanner" element={<QRScannerPage />} />
            <Route path="login" element={<AuthPage />} />
            <Route path="register" element={<AuthPage />} />
            <Route path="privacy" element={<PrivacyPolicyPage />} />
            <Route path="privacy" element={<PrivacyPolicyPage />} />
            <Route path="terms" element={<TermsOfServicePage />} />
            <Route path="forum" element={<ForumPage />} />
          </Route>

          {/* Auth Routes without MainLayout */}


          {/* Admin Routes with AdminLayout */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="books" element={<BooksManagementPage />} />
            <Route path="audios" element={<AudioManagementPage />} />
            <Route path="images" element={<ImageManagementPage />} />
            <Route path="genres" element={<GenreManagementPage />} />
            <Route path="banners" element={<BannerManagementPage />} />
            <Route path="*" element={<AdminNotFoundPage />} />
          </Route>

          {/* Catch all route - 404 Page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
