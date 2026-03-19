import React, { useState, useEffect } from 'react';
import Carousel3D from '../components/Carousel3D';
import BookCard from '../components/BookCard';
import homepageService from '../services/homepageService';
import './HomePage.css';

const HomePage = () => {
  const [banners, setBanners] = useState([]);
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await homepageService.getHomepageData();
        if (response.success) {
          const { banners, featuredBooks } = response.data;

          // Map banners to Carousel3D format
          const mappedBanners = banners.map((banner) => ({
            id: banner._id,
            imageUrl: banner.imageUrl,
            title: banner.title,
            desc: banner.description || "Discover the best books at BookStore"
          }));
          setBanners(mappedBanners);

          // Map books to BookCard format
          const mappedBooks = featuredBooks.map(book => ({
            id: book._id,
            title: book.title,
            author: book.authors ? book.authors.join(', ') : 'Unknown',
            price: book.price ? book.price.list : 0,
            salePrice: book.price?.sale || null,
            category: book.genres && book.genres.length > 0 ? book.genres[0].name : 'General',
            image: book.image,
            rating: book.ratingAvg,
            reviews: book.ratingCount
          }));
          setFeaturedBooks(mappedBooks);
        }
      } catch (error) {
        console.error("Error fetching homepage data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading-container" style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
  }

  return (
    <div className="home-page">
      {/* 3D Carousel */}
      <div className="carousel-container">
        {banners.length > 0 && (
          <Carousel3D
            data={banners}
            activeSlide={Math.floor(banners.length / 2)}
            autoSlide={true}
            slideInterval={4000}
          />
        )}
      </div>

      {/* Featured Books Section */}
      <section className="featured-section">
        <div className="container">
          <h2>Knowledge begins with every page</h2>
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
              <h3>Every book is not just a perfect combination of knowledge but also a spiritual gift of joy and happiness. Enjoy every page soaked in emotional stories, making every moment with loved ones more special!</h3>
              <h4>From classic novels to sci-fi, from self-help to finance – which book will be your choice today?</h4>
            </div>
            <div className="about-images">
              <div className="image-grid">
                <div className="large-image">
                  <img src="/img/MATCHA/M1.jpg" alt="Featured Book" loading="lazy" />
                </div>
                <div className="small-images">
                  <img src="/img/SOCOLA/S3.jpg" alt="New Book" loading="lazy" />
                  <img src="/img/TIRAMINSU/T13.jpg" alt="Good Book" loading="lazy" />
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
