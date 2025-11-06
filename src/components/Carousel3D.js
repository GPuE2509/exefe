import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronLeft,
  faBook,
  faStar,
  faGift
} from "@fortawesome/free-solid-svg-icons";
import './Carousel3D.css';

const Carousel3D = ({ data, activeSlide = 0, autoSlide = true, slideInterval = 1000 }) => {
  const [currentSlide, setCurrentSlide] = useState(activeSlide);
  const [isPaused, setIsPaused] = useState(false);
  const [screenSize, setScreenSize] = useState(window.innerWidth);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Screen size detection
  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    if (!autoSlide || isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => 
        prevSlide === data.length - 1 ? 0 : prevSlide + 1
      );
    }, slideInterval);

    return () => clearInterval(interval);
  }, [autoSlide, slideInterval, isPaused, data.length]);

  const next = () =>
    currentSlide < data.length - 1 && setCurrentSlide(currentSlide + 1);

  const prev = () => currentSlide > 0 && setCurrentSlide(currentSlide - 1);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      next();
    } else if (isRightSwipe) {
      prev();
    }
  };

  const getResponsiveTransforms = () => {
    if (screenSize <= 360) {
      return {
        side1: { x: -140, z: -200 },
        side2: { x: 140, z: -200 },
        far1: { x: -280, z: -300 },
        far2: { x: 280, z: -300 }
      };
    } else if (screenSize <= 480) {
      return {
        side1: { x: -160, z: -250 },
        side2: { x: 160, z: -250 },
        far1: { x: -320, z: -350 },
        far2: { x: 320, z: -350 }
      };
    } else if (screenSize <= 768) {
      return {
        side1: { x: -200, z: -300 },
        side2: { x: 200, z: -300 },
        far1: { x: -400, z: -400 },
        far2: { x: 400, z: -400 }
      };
    } else if (screenSize <= 1024) {
      return {
        side1: { x: -250, z: -350 },
        side2: { x: 250, z: -350 },
        far1: { x: -500, z: -450 },
        far2: { x: 500, z: -450 }
      };
    } else {
      return {
        side1: { x: -280, z: -400 },
        side2: { x: 280, z: -400 },
        far1: { x: -560, z: -500 },
        far2: { x: 560, z: -500 }
      };
    }
  };

  const getStyles = (index) => {
    const transforms = getResponsiveTransforms();
    const isMobile = screenSize <= 768;
    const rotation = isMobile ? 25 : 35;
    const opacity = isMobile && Math.abs(index - currentSlide) > 1 ? 0.5 : 1;

    if (currentSlide === index)
      return {
        opacity: 1,
        transform: "translateX(0px) translateZ(0px) rotateY(0deg)",
        zIndex: 10
      };
    else if (currentSlide - 1 === index)
      return {
        opacity: opacity,
        transform: `translateX(${transforms.side1.x}px) translateZ(${transforms.side1.z}px) rotateY(${rotation}deg)`,
        zIndex: 9
      };
    else if (currentSlide + 1 === index)
      return {
        opacity: opacity,
        transform: `translateX(${transforms.side2.x}px) translateZ(${transforms.side2.z}px) rotateY(-${rotation}deg)`,
        zIndex: 9
      };
    else if (currentSlide - 2 === index)
      return {
        opacity: isMobile ? 0 : opacity,
        transform: `translateX(${transforms.far1.x}px) translateZ(${transforms.far1.z}px) rotateY(${rotation}deg)`,
        zIndex: 8
      };
    else if (currentSlide + 2 === index)
      return {
        opacity: isMobile ? 0 : opacity,
        transform: `translateX(${transforms.far2.x}px) translateZ(${transforms.far2.z}px) rotateY(-${rotation}deg)`,
        zIndex: 8
      };
    else if (index < currentSlide - 2)
      return {
        opacity: 0,
        transform: `translateX(${transforms.far1.x}px) translateZ(${transforms.far1.z}px) rotateY(${rotation}deg)`,
        zIndex: 7
      };
    else if (index > currentSlide + 2)
      return {
        opacity: 0,
        transform: `translateX(${transforms.far2.x}px) translateZ(${transforms.far2.z}px) rotateY(-${rotation}deg)`,
        zIndex: 7
      };
  };

  return (
    <>
      {/* carousel */}
      <div 
        className="slideC"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {data.map((item, i) => (
          <React.Fragment key={item.id}>
            <div
              className="slide"
              style={{
                background: item.bgColor,
                boxShadow: `0 5px 20px ${item.bgColor}30`,
                ...getStyles(i)
              }}
            >
              <SliderContent {...item} />
            </div>
            <div
              className="reflection"
              style={{
                background: `linear-gradient(to bottom, ${item.bgColor}40, transparent)`,
                ...getStyles(i)
              }}
            />
          </React.Fragment>
        ))}
      </div>
      {/* carousel */}

      <div className="btns">
        <FontAwesomeIcon
          className="btn"
          onClick={prev}
          icon={faChevronLeft}
          size={screenSize <= 480 ? "lg" : "2x"}
        />
        <FontAwesomeIcon
          className="btn"
          onClick={next}
          icon={faChevronRight}
          size={screenSize <= 480 ? "lg" : "2x"}
        />
      </div>

      {/* Mobile slide indicators */}
      {screenSize <= 768 && (
        <div className="slide-indicators">
          {data.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      )}
    </>
  );
};

const SliderContent = (props) => {
  return (
    <div className="sliderContent">
      {props.icon}
      <h2>{props.title}</h2>
      <p>{props.desc}</p>
    </div>
  );
};

export default Carousel3D;
