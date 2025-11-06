import React, { useState } from 'react';
import BookCard from '../components/BookCard';
import { booksData, categories } from '../data/booksData';
import './BooksPage.css';

const BooksPage = () => {
  const [selectedCategories, setSelectedCategories] = useState(['all']);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('default');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const filteredBooks = booksData.filter(book => {
    const matchesCategory = selectedCategories.includes('all') || selectedCategories.includes(book.category);
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = book.price >= priceRange.min && book.price <= priceRange.max;
    const matchesRating = book.rating >= minRating;
    
    return matchesCategory && matchesSearch && matchesPrice && matchesRating;
  });

  // Sort books
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'title':
        return a.title.localeCompare(b.title);
      case 'author':
        return a.author.localeCompare(b.author);
      default:
        return 0;
    }
  });

  const resetFilters = () => {
    setSelectedCategories(['all']);
    setSearchTerm('');
    setPriceRange({ min: 0, max: 1000000 });
    setMinRating(0);
    setSortBy('default');
  };

  const handleCategoryChange = (category) => {
    if (category === 'all') {
      setSelectedCategories(['all']);
    } else {
      setSelectedCategories(prev => {
        const newCategories = prev.filter(cat => cat !== 'all');
        if (newCategories.includes(category)) {
          return newCategories.filter(cat => cat !== category);
        } else {
          return [...newCategories, category];
        }
      });
    }
  };

  const closeMobileFilters = () => {
    setShowMobileFilters(false);
  };

  return (
    <div className="books-page">
      <div className="container">
        <div className="page-header">
          <h1>Danh sách sách</h1>
          <button 
            className="mobile-filter-toggle"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            🔍 Bộ lọc
          </button>
        </div>
        
        <div className="page-content">
          {/* Filter Sidebar */}
          <div className={`filter-sidebar ${showMobileFilters ? 'mobile-open' : ''}`}>
            <div className="sidebar-header">
              <h3>Bộ lọc</h3>
              <button className="close-mobile-filters" onClick={closeMobileFilters}>
                ✕
              </button>
            </div>
            
            <div className="sidebar-content">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Tìm kiếm sách theo tên hoặc tác giả..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="search-icon">🔍</span>
              </div>
              
              <div className="filter-section">
                <h4>Thể loại</h4>
                <div className="category-filters">
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes('all')}
                      onChange={() => handleCategoryChange('all')}
                    />
                    <span className="checkmark"></span>
                    <span className="checkbox-label">Tất cả</span>
                  </label>
                  {categories.map(category => (
                    <label key={category.id} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.name)}
                        onChange={() => handleCategoryChange(category.name)}
                      />
                      <span className="checkmark"></span>
                      <span className="checkbox-label">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                <h4>Khoảng giá</h4>
                <div className="price-range">
                  <input
                    type="number"
                    placeholder="Từ"
                    value={priceRange.min || ''}
                    onChange={(e) => setPriceRange({...priceRange, min: parseInt(e.target.value) || 0})}
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Đến"
                    value={priceRange.max === 1000000 ? '' : priceRange.max}
                    onChange={(e) => setPriceRange({...priceRange, max: parseInt(e.target.value) || 1000000})}
                  />
                  <span>đ</span>
                </div>
              </div>

              <div className="filter-section">
                <h4>Đánh giá tối thiểu</h4>
                <select 
                  value={minRating} 
                  onChange={(e) => setMinRating(parseFloat(e.target.value))}
                >
                  <option value={0}>Tất cả</option>
                  <option value={4}>4 sao trở lên</option>
                  <option value={4.5}>4.5 sao trở lên</option>
                  <option value={4.8}>4.8 sao trở lên</option>
                </select>
              </div>

              <div className="filter-section">
                <h4>Sắp xếp theo</h4>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="default">Mặc định</option>
                  <option value="price-low">Giá thấp đến cao</option>
                  <option value="price-high">Giá cao đến thấp</option>
                  <option value="rating">Đánh giá cao nhất</option>
                  <option value="title">Tên A-Z</option>
                  <option value="author">Tác giả A-Z</option>
                </select>
              </div>

              <div className="filter-actions">
                <button className="reset-btn" onClick={resetFilters}>
                  Đặt lại 🔄
                </button>
              </div>

              <div className="results-info">
                <span>Tìm thấy {sortedBooks.length} cuốn sách</span>
              </div>
            </div>
          </div>

          {/* Mobile Overlay */}
          {showMobileFilters && (
            <div className="mobile-overlay" onClick={closeMobileFilters}></div>
          )}

          {/* Books Content */}
          <div className="books-content">
            <div className="books-grid">
              {sortedBooks.length > 0 ? (
                sortedBooks.map(book => (
                  <BookCard key={book.id} book={book} />
                ))
              ) : (
                <div className="no-results">
                  <p>Không tìm thấy sách nào phù hợp với tiêu chí tìm kiếm.</p>
                  <button className="reset-btn" onClick={resetFilters}>
                    Đặt lại bộ lọc
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BooksPage;
