import React from 'react';
import { Link } from 'react-router-dom';
import './BookCard.css';

const BookCard = ({ book }) => {
  const listPrice = Number(book.price) || 0;
  const salePrice = Number(book.salePrice) || 0;
  const hasDiscount = salePrice > 0 && salePrice < listPrice;

  return (
    <div className="book-item">
      <div className="book-image">
        <img src={book.image} alt={book.title} loading="lazy" decoding="async" />
        <div className="book-overlay">
          <Link to={`/book/${book.id}`} className="view-details-btn">
            View Details
          </Link>
        </div>
      </div>
      <div className="book-info">
        <h3>{book.title}</h3>
        <p className="book-author">Author: {book.author}</p>
        <div className="book-price-row">
          {hasDiscount ? (
            <>
              <p className="book-price book-price-old">{listPrice.toLocaleString('vi-VN')}đ</p>
              <p className="book-price book-price-sale">{salePrice.toLocaleString('vi-VN')}đ</p>
            </>
          ) : (
            <p className="book-price">{listPrice.toLocaleString('vi-VN')}đ</p>
          )}
        </div>
        <div className="book-rating">
          <span className="stars">★★★★★</span>
          <span className="rating-text">({book.reviews} reviews)</span>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
