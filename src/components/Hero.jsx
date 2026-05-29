import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import banner1 from '../assets/banner/banner1.jpg';
import banner2 from '../assets/banner/banner2.jpg';
import banner3 from '../assets/banner/banner3.jpg';

const Hero = () => {
  const slides = [
    {
      image: banner1,
      title: "Nature's Purest Apothecary",
      subtitle: "Experience the wisdom of ancient Ayurveda through our handcrafted botanical rituals.",
      cta: "Shop The Collection",
      link: "/shop"
    },
    {
      image: banner2,
      title: "Bloom Into Wellness",
      subtitle: "Discover ethically sourced ingredients that honor your skin and our planet.",
      cta: "Explore Our Story",
      link: "/about"
    },
    {
      image: banner3,
      title: "Radiate Natural Glow",
      subtitle: "Unlock your inner light with forest-derived essences and sustainable skincare.",
      cta: "New Arrivals",
      link: "/shop"
    }
  ];

  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleNext = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 1000);
  }, [isAnimating, slides.length]);

  const handlePrev = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 1000);
  }, [isAnimating, slides.length]);

  // Auto-slide every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [current, handleNext]);

  return (
    <section
      className="relative w-full overflow-hidden bg-[rgb(var(--surface))]"
    >
      <div className="relative w-full h-auto group/banner">
        {/* Spacer image to maintain natural aspect ratio without cropping */}
        <img
          src={slides[0].image}
          className="w-full h-auto invisible pointer-events-none"
          alt="spacer"
        />

        <div className="absolute inset-0">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
                }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
                loading="eager"
              />

              {/* Elegant botanical overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent sm:bg-gradient-to-r sm:from-black/60 sm:via-black/10 sm:to-transparent" />

              <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 lg:px-24 items-center text-center sm:items-start sm:text-left">
                <div className={`max-w-3xl transform transition-all duration-1000 ${index === current ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                  }`}>
                  <span className="inline-block px-4 py-1 mb-4 text-[10px] sm:text-xs font-bold tracking-[0.3em] text-white/90 uppercase border border-white/30 rounded-full backdrop-blur-md">
                    Botanical Rituals
                  </span>

                  <h1 className="text-2xl sm:text-4xl lg:text-7xl font-serif font-black text-white mb-2 sm:mb-6 leading-[1.1]">
                    {slide.title.split(' ').map((word, i) => (
                      <React.Fragment key={i}>
                        {word} {i === 1 ? <br className="hidden sm:block" /> : ''}
                      </React.Fragment>
                    ))}
                  </h1>

                  <p className="text-[10px] sm:text-base lg:text-lg text-white/90 mb-4 sm:mb-10 max-w-xl leading-relaxed font-light hidden sm:block">
                    {slide.subtitle}
                  </p>

                  <div className="flex flex-wrap gap-2 sm:gap-4 justify-center sm:justify-start">
                    <Link
                      to={slide.link}
                      className="px-6 sm:px-10 py-2.5 sm:py-4 bg-white text-[rgb(var(--primary))] text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase rounded-full hover:bg-[rgb(var(--primary))] hover:text-white transition-all duration-300 shadow-xl"
                    >
                      {slide.cta}
                    </Link>
                    <Link
                      to="/about"
                      className="px-6 sm:px-10 py-2.5 sm:py-4 bg-transparent border border-white/50 text-white text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase rounded-full hover:bg-white hover:text-[rgb(var(--primary))] transition-all duration-300 backdrop-blur-sm"
                    >
                      Our Story
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <div className="absolute inset-0 flex items-center justify-between px-6 sm:px-12 pointer-events-none z-10">
          <button onClick={handlePrev} className="w-12 sm:w-16 h-12 sm:h-16 border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-500 backdrop-blur-md pointer-events-auto shadow-2xl group/btn">

            <svg className="w-6 h-6 sm:w-8 sm:h-8 transition-transform duration-300 group-hover/btn:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={handleNext} className="w-12 sm:w-16 h-12 sm:h-16 border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-500 backdrop-blur-md pointer-events-auto shadow-2xl group/btn">

            <svg className="w-6 h-6 sm:w-8 sm:h-8 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Automatic Slide Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/10 z-20">
          <div
            key={current}
            className="h-full bg-white/80 shadow-[0_0_15px_rgba(255,255,255,0.8)]"
            style={{
              animation: 'heroProgress 6s linear forwards'
            }}
          />
        </div>

        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes heroProgress {
              from { width: 0%; }
              to { width: 100%; }
            }
          `}} />
      </div>
    </section>
  );
};

export default Hero;