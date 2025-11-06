import React from 'react';
import { Link } from 'react-router-dom';
import './BookCard.css';

const BookCard = ({ book }) => {
  return (
    <div className="book-item">
      <div className="book-image">
        <img src={book.image} alt={book.title} />
        <div className="book-overlay">
          <Link to={`/book/${book.id}`} className="view-details-btn">
            Xem chi tiết
          </Link>
        </div>
      </div>
      <div className="book-info">
        <h3>{book.title}</h3>
        <p className="book-author">Tác giả: {book.author}</p>
        <p className="book-price">{book.price.toLocaleString('vi-VN')}đ</p>
        <div className="book-rating">
          <span className="stars">★★★★★</span>
          <span className="rating-text">({book.reviews} đánh giá)</span>
        </div>
        <button 
          className="add-to-cart-btn"
          onClick={() => {
            // Thêm vào giỏ hàng logic sẽ được implement sau
            console.log('Thêm vào giỏ hàng:', book.title);
          }}
        >
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
};

export default BookCard;
