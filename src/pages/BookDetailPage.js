import React from 'react';
import { useParams } from 'react-router-dom';
import BookCard from '../components/BookCard';
import { booksData } from '../data/booksData';
import './BookDetailPage.css';

const BookDetailPage = () => {
  const { id } = useParams();
  const book = booksData.find(b => b.id === parseInt(id));
  
  if (!book) {
    return (
      <div className="book-detail-page">
        <div className="container">
          <div className="not-found">
            <h2>Không tìm thấy sách</h2>
            <p>Sách bạn đang tìm kiếm không tồn tại.</p>
          </div>
        </div>
      </div>
    );
  }

  const relatedBooks = booksData
    .filter(b => b.category === book.category && b.id !== book.id)
    .slice(0, 3);

  const addToCart = () => {
    // Logic thêm vào giỏ hàng sẽ được implement sau
    console.log('Thêm vào giỏ hàng:', book.title);
    alert(`Đã thêm "${book.title}" vào giỏ hàng!`);
  };

  return (
    <div className="book-detail-page">
      <div className="container">
        <h1 className="book-title">{book.title}</h1>
        
        <div className="book-detail-container">
          <div className="main-image">
            <img src={book.image} alt={book.title} />
          </div>

          <div className="book-info">
            <div className="book-meta">
              <p><strong>Tác giả:</strong> {book.author}</p>
              <p><strong>Nhà xuất bản:</strong> {book.publisher}</p>
              <p><strong>Năm xuất bản:</strong> {book.publishYear}</p>
              <p><strong>Số trang:</strong> {book.pages}</p>
              <p><strong>Ngôn ngữ:</strong> {book.language}</p>
              <p><strong>Thể loại:</strong> {book.category}</p>
            </div>
            
            <div className="book-rating">
              <span className="stars">★★★★★</span>
              <span className="rating-text">({book.reviews} đánh giá)</span>
            </div>
            
            <div className="book-price">
              <span className="price">{book.price.toLocaleString('vi-VN')}đ</span>
            </div>
            
            <div className="book-description">
              <h3>Mô tả sách</h3>
              <p>{book.description}</p>
            </div>
            
            <div className="book-actions">
              <button className="back-btn" onClick={() => window.history.back()}>
                Quay lại
              </button>
              <button className="add-to-cart-btn" onClick={addToCart}>
                Thêm vào giỏ hàng
              </button>
            </div>
          </div>
        </div>

        {relatedBooks.length > 0 && (
          <div className="related-books">
            <h3>Sách liên quan</h3>
            <div className="related-books-grid">
              {relatedBooks.map(relatedBook => (
                <BookCard key={relatedBook.id} book={relatedBook} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetailPage;
