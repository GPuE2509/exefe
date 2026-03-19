import React, { useState, useEffect } from 'react';
import BookCard from '../components/BookCard';
import bookService from '../services/bookService';
import './BooksPage.css';

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState(['all']);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });
  const [debouncedPrice, setDebouncedPrice] = useState({ min: 0, max: 1000000 });
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('default');
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 1 });

  // Debounce search term and price
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setDebouncedPrice(priceRange);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, priceRange]);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await bookService.getGenres();
        if (response.success) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Books
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const params = {
          page: pagination.page,
          limit: pagination.limit,
          search: debouncedSearch,
          category: selectedCategories.includes('all') ? 'all' : selectedCategories[0], // API only handles one category for now based on current logic but UI allows multiple. Let's send the first one or 'all'
          minPrice: debouncedPrice.min,
          maxPrice: debouncedPrice.max,
          minRating,
          sort: sortBy
        };

        const response = await bookService.getBooks(params);
        if (response.success) {
          const mappedBooks = response.data.books.map(book => ({
            id: book._id,
            title: book.title,
            author: book.authors ? book.authors.join(', ') : 'Unknown',
            price: book.price ? book.price.list : 0,
            salePrice: book.price?.sale || null,
            category: book.genres && book.genres.length > 0 ? book.genres[0].name : 'General',
            image: book.image || '/img/default-book.png',
            rating: book.ratingAvg,
            reviews: book.ratingCount
          }));

          setBooks(mappedBooks);
          setPagination(prev => ({
            ...prev,
            total: response.data.pagination.total,
            totalPages: response.data.pagination.totalPages
          }));
        }
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [debouncedSearch, selectedCategories, debouncedPrice, minRating, sortBy, pagination.page]);

  const resetFilters = () => {
    setSelectedCategories(['all']);
    setSearchTerm('');
    setPriceRange({ min: 0, max: 1000000 });
    setMinRating(0);
    setSortBy('default');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleCategoryChange = (categoryName) => {
    if (categoryName === 'all') {
      setSelectedCategories(['all']);
    } else {
      // Backend currently supports single category filter better in this simple implementation
      // So let's switch to single selection behavior for now, or just replace the array
      setSelectedCategories([categoryName]);
    }
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const closeMobileFilters = () => {
    setShowMobileFilters(false);
  };

  return (
    <div className="books-page">
      <div className="container">
        <div className="page-header">
          <h1>Book List</h1>
          <button
            className="mobile-filter-toggle"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            🔍 Filters
          </button>
        </div>

        <div className="page-content">
          {/* Filter Sidebar */}
          <div className={`filter-sidebar ${showMobileFilters ? 'mobile-open' : ''}`}>
            <div className="sidebar-header">
              <h3>Filters</h3>
              <button className="close-mobile-filters" onClick={closeMobileFilters}>
                ✕
              </button>
            </div>

            <div className="sidebar-content">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search for books by title or author..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="search-icon">🔍</span>
              </div>

              <div className="filter-section">
                <h4>Categories</h4>
                <div className="category-filters">
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes('all')}
                      onChange={() => handleCategoryChange('all')}
                    />
                    <span className="checkmark"></span>
                    <span className="checkbox-label">All</span>
                  </label>
                  {categories.map(category => (
                    <label key={category._id} className="checkbox-item">
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
                <h4>Price Range</h4>
                <div className="price-range">
                  <input
                    type="number"
                    placeholder="From"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) || 0 }))}
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="To"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) || 0 }))}
                  />
                  <span>đ</span>
                </div>
              </div>

              <div className="filter-section">
                <h4>Minimum Rating</h4>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(parseFloat(e.target.value))}
                >
                  <option value={0}>All</option>
                  <option value={4}>4 stars & up</option>
                  <option value={4.5}>4.5 stars & up</option>
                  <option value={4.8}>4.8 stars & up</option>
                </select>
              </div>

              <div className="filter-section">
                <h4>Sort by</h4>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="default">Default (Newest)</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="title">Title A-Z</option>
                  <option value="author">Author A-Z</option>
                </select>
              </div>

              <div className="filter-actions">
                <button className="reset-btn" onClick={resetFilters}>
                  Reset 🔄
                </button>
              </div>

              <div className="results-info">
                <span>Found {pagination.total} books</span>
              </div>
            </div>
          </div>

          {/* Mobile Overlay */}
          {showMobileFilters && (
            <div className="mobile-overlay" onClick={closeMobileFilters}></div>
          )}

          {/* Books Content */}
          <div className="books-content">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>
            ) : (
              <>
                <div className="books-grid">
                  {books.length > 0 ? (
                    books.map(book => (
                      <BookCard key={book.id} book={book} />
                    ))
                  ) : (
                    <div className="no-results" style={{ width: '100%', colSpan: 3 }}>
                      <p>No books found matching your search criteria.</p>
                      <button className="reset-btn" onClick={resetFilters}>
                        Reset Filters
                      </button>
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="pagination" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <button
                      disabled={pagination.page === 1}
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                      style={{ padding: '5px 10px', cursor: 'pointer', disabled: pagination.page === 1 }}
                    >
                      &lt; Prev
                    </button>
                    <span>Page {pagination.page} / {pagination.totalPages}</span>
                    <button
                      disabled={pagination.page === pagination.totalPages}
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                      style={{ padding: '5px 10px', cursor: 'pointer' }}
                    >
                      Next &gt;
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BooksPage;
