import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Import pages
import HomePage from './pages/HomePage';
import BooksPage from './pages/BooksPage';
import BookDetailPage from './pages/BookDetailPage';
import AboutPage from './pages/AboutPage';
import AuthPage from './pages/AuthPage';
import QRScannerPage from './pages/QRScannerPage';

// Import admin pages
import DashboardPage from './pages/admin/DashboardPage';
import BooksManagementPage from './pages/admin/BooksManagementPage';
import AudioManagementPage from './pages/admin/AudioManagementPage';
import ImageManagementPage from './pages/admin/ImageManagementPage';
import GenreManagementPage from './pages/admin/GenreManagementPage';

// Import 404 pages
import NotFoundPage from './pages/NotFoundPage';
import AdminNotFoundPage from './pages/admin/AdminNotFoundPage';

import 'antd/dist/reset.css';
import './App.css';

function App() {
  return (
    <Router>
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
          <Route path="*" element={<AdminNotFoundPage />} />
        </Route>

        {/* Catch all route - 404 Page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
