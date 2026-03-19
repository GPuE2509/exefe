import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookCard from '../components/BookCard';
import bookService from '../services/bookService';
import './BookDetailPage.css';

const BookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [thumbStartIndex, setThumbStartIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const renderStars = (rating = 0) => {
    const rounded = Math.round(rating);
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={index < rounded ? 'star-filled' : 'star-empty'}>
        ★
      </span>
    ));
  };

  useEffect(() => {
    const fetchBookData = async () => {
      setLoading(true);
      try {
        // Fetch book details
        const bookResponse = await bookService.getBookDetail(id);
        if (bookResponse.success) {
          const bookData = bookResponse.data;

          const subImages = (bookData.subImages || []).slice(0, 6);
          const fallbackImage = bookData.image || '/img/default-book.png';

          const mappedBook = {
            ...bookData,
            author: bookData.authors ? bookData.authors.join(', ') : 'Unknown',
            price: bookData.price ? bookData.price.list : 0,
            salePrice: bookData.price?.sale || null,
            currency: bookData.price?.currency || 'VND',
            categories: (bookData.genres || []).map((g) => g.name).join(', ') || 'General',
            publisher: bookData.publisher || '-',
            description: bookData.description || 'Chua co mo ta cho sach nay.',
            image: fallbackImage,
            subImages,
            hasAudioSupport: !!bookData.hasAudioSupport,
            rating: bookData.ratingAvg || 0,
            reviews: bookData.ratingCount || 0,
            hasDiscount: Number(bookData.price?.sale) > 0 && Number(bookData.price?.sale) < Number(bookData.price?.list)
          };

          setBook(mappedBook);
          setSelectedImage(fallbackImage);
          setThumbStartIndex(0);

          // Fetch related books
          const relatedResponse = await bookService.getRelatedBooks(id, { limit: 3 });
          if (relatedResponse.success) {
            const mappedRelatedBooks = relatedResponse.data.map(b => ({
              id: b._id,
              title: b.title,
              author: b.authors ? b.authors.join(', ') : 'Unknown',
              price: b.price ? b.price.list : 0,
              salePrice: b.price?.sale || null,
              category: b.genres && b.genres.length > 0 ? b.genres[0].name : 'General',
              image: b.image || '/img/default-book.png',
              rating: b.ratingAvg,
              reviews: b.ratingCount
            }));
            setRelatedBooks(mappedRelatedBooks.slice(0, 3));
          }
        } else {
          setError(bookResponse.message || 'Không thể tải thông tin sách');
        }
      } catch (err) {
        console.error("Error fetching book details:", err);
        setError('Đã xảy ra lỗi khi tải thông tin sách');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBookData();
      // Scroll to top when id changes
      window.scrollTo(0, 0);
    }
  }, [id]);



  if (loading) {
    return (
      <div className="book-detail-page">
        <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="book-detail-page">
        <div className="container">
          <div className="not-found">
            <h2>Book not found</h2>
            <p>{error || 'The book you are looking for does not exist.'}</p>
            <button className="back-btn" onClick={() => navigate('/')}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const thumbnailImages = book.subImages || [];
  const visibleThumbCount = 3;
  const maxThumbStart = Math.max(0, thumbnailImages.length - visibleThumbCount);
  const visibleThumbnails = thumbnailImages.slice(thumbStartIndex, thumbStartIndex + visibleThumbCount);

  const handlePrevThumbs = () => {
    setThumbStartIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextThumbs = () => {
    setThumbStartIndex((prev) => Math.min(maxThumbStart, prev + 1));
  };

  return (
    <div className="book-detail-page">
      <div className="container">
        <h1 className="book-title">{book.title}</h1>

        <div className="book-detail-container">
          <div className="image-section">
            <div className="main-image-wrapper">
              <button
                type="button"
                className="main-image"
                onClick={() => {
                  setPreviewImage(selectedImage || book.image);
                  setPreviewOpen(true);
                }}
                aria-label="View image"
              >
                <img src={selectedImage || book.image} alt={book.title} />
              </button>
            </div>

            <div className="sub-images-panel">
              {thumbnailImages.length > 0 && (
                <div className="sub-images-carousel">
                  <div className="sub-images-grid carousel-mode">
                    {visibleThumbnails.map((img) => (
                      <button
                        key={img._id}
                        className={`sub-image-item ${(selectedImage || book.image) === img.url ? 'active' : ''}`}
                        type="button"
                        onClick={() => {
                          setPreviewImage(img.url);
                          setPreviewOpen(true);
                        }}
                      >
                        <img src={img.url} alt={`${book.title} sub`} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {thumbnailImages.length === 0 && (
                <div className="sub-images-empty">
                  <span>No additional images for this book</span>
                </div>
              )}

              {thumbnailImages.length > visibleThumbCount && (
                <div className="sub-images-nav">
                  <button
                      type="button"
                    className="image-nav-btn"
                    onClick={handlePrevThumbs}
                    disabled={thumbStartIndex === 0}
                  aria-label="Previous image"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="image-nav-btn"
                  onClick={handleNextThumbs}
                  disabled={thumbStartIndex >= maxThumbStart}
                  aria-label="Next image"
                >
                  ›
                </button>
              </div>
              )}
            </div>
          </div>

          <div className="book-info">
            <div className="book-meta">
              <p><strong>Author:</strong> {book.author}</p>
              <p><strong>Publisher:</strong> {book.publisher}</p>
              <p><strong>Category:</strong> {book.categories}</p>
              <p><strong>Audio Support:</strong> {book.hasAudioSupport ? 'Supported' : 'Not supported'}</p>
            </div>

            <div className="book-rating">
              <span className="stars">{renderStars(book.rating)}</span>
              <span className="rating-text">{book.rating.toFixed(1)}/5 ({book.reviews} reviews)</span>
            </div>

            <div className="book-price">
              {book.hasDiscount ? (
                <>
                  <span className="old-price">{book.price.toLocaleString('vi-VN')}đ</span>
                  <span className="sale-price">{book.salePrice.toLocaleString('vi-VN')}đ</span>
                  <span className="discount-badge">
                    -{Math.round(((book.price - book.salePrice) / book.price) * 100)}%
                  </span>
                </>
              ) : (
                <span className="price">{book.price.toLocaleString('vi-VN')}đ</span>
              )}
            </div>

            <div className="book-description">
              <h3>Book Description</h3>
              <p>{book.description}</p>
            </div>

            <div className="book-actions">
              <button className="back-btn" onClick={() => navigate(-1)}>
                Back
              </button>
            </div>
          </div>
        </div>

        {relatedBooks.length > 0 && (
          <div className="related-books">
            <h3>Related Books</h3>
            <div className="related-books-grid">
              {relatedBooks.map(relatedBook => (
                <BookCard key={relatedBook.id} book={relatedBook} />
              ))}
            </div>
          </div>
        )}

        {previewOpen && (
          <div className="image-preview-overlay" onClick={() => setPreviewOpen(false)}>
            <button
              type="button"
              className="preview-close-btn"
              onClick={() => setPreviewOpen(false)}
              aria-label="Close preview"
            >
              ×
            </button>
            <img
              className="preview-image"
              src={previewImage || selectedImage || book.image}
              alt={book.title}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetailPage;
