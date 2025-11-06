import React from 'react';
import Carousel3D from '../components/Carousel3D';
import BookCard from '../components/BookCard';
import { featuredBooks } from '../data/booksData';
import carouselData from '../data/carouselData';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      {/* 3D Carousel */}
      <div className="carousel-container">
        <Carousel3D 
          data={carouselData} 
          activeSlide={2} 
          autoSlide={true}
          slideInterval={4000}
        />
      </div>
      
      {/* Featured Books Section */}
      <section className="featured-section">
        <div className="container">
          <h2>Tri thức bắt đầu từ mỗi trang sách</h2>
          <div className="books-grid">
            {featuredBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h3>Mỗi cuốn sách không chỉ là sự kết hợp hoàn hảo của tri thức mà còn là món quà tinh thần của niềm vui và hạnh phúc. Thưởng thức từng trang sách được thấm đẫm những câu chuyện đầy cảm xúc, làm cho mỗi khoảnh khắc với những người thân yêu trở nên đặc biệt hơn!</h3>
              <h4>Từ tiểu thuyết kinh điển đến khoa học viễn tưởng, từ sách self-help đến tài chính – cuốn sách nào sẽ là lựa chọn của bạn hôm nay?</h4>
            </div>
            <div className="about-images">
              <div className="image-grid">
                <div className="large-image">
                  <img src="/img/MATCHA/M1.jpg" alt="Sách nổi bật" />
                </div>
                <div className="small-images">
                  <img src="/img/SOCOLA/S3.jpg" alt="Sách mới" />
                  <img src="/img/TIRAMINSU/T13.jpg" alt="Sách hay" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
