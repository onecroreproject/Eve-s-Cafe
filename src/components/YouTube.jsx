import React, { useState } from 'react';
import StoryPlayer from './StoryPlayer';
import Button from './Button';
import img1 from '../assets/recentproducts/537.jpg';
import img2 from '../assets/recentproducts/538.jpg';
import img3 from '../assets/recentproducts/539.jpg';
import img4 from '../assets/recentproducts/540.jpg';
import img5 from '../assets/recentproducts/542.jpg';

const YouTube = () => {
  const [currentIndex, setCurrentIndex] = useState(2); // Start with middle video
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [storyOpen, setStoryOpen] = useState(false);

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const videos = [
    { id: 1, thumbnail: img1, title: "Radiant Skin Ritual" },
    { id: 2, thumbnail: img2, title: "Botanical Cleansing" },
    { id: 3, thumbnail: img3, title: "Herb-Infused Magic" },
    { id: 4, thumbnail: img4, title: "Nature's Glow Guide" },
    { id: 5, thumbnail: img5, title: "Apothecary Secrets" },
  ];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % videos.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  return (
    <section className="pt-0 pb-12 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 px-4 py-4">
    
          <h2 className="text-4xl md:text-5xl font-bold text-[#1A3C2E] leading-tight mb-4 luxury-serif">
            Our Story <span className="text-gradient">Reels</span>
          </h2>
          <p className="text-[rgb(var(--muted))] max-w-lg mx-auto">Short, immersive glimpses into the world of botanical beauty and ancient Ayurvedic secrets.</p>
        </div>

        {/* 3D Carousel Container */}
        <div className="relative h-[650px] flex items-center justify-center">
          
          {/* Navigation Arrows */}
          <button 
            onClick={handlePrev}
            className="absolute left-4 md:left-10 z-40 p-4 rounded-full bg-white shadow-xl text-[rgb(var(--primary))] hover:bg-[rgb(var(--primary))] hover:text-white transition-all active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button 
            onClick={handleNext}
            className="absolute right-4 md:right-10 z-40 p-4 rounded-full bg-white shadow-xl text-[rgb(var(--primary))] hover:bg-[rgb(var(--primary))] hover:text-white transition-all active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Videos Wrapper */}
          <div className="relative w-full max-w-[1200px] h-full flex items-center justify-center pointer-events-none">
            {videos.map((video, index) => {
              let position = index - currentIndex;
              if (position > 2) position -= videos.length;
              if (position < -2) position += videos.length;

              const isActive = position === 0;
              const isSide = Math.abs(position) === 1;
              const isFarSide = Math.abs(position) === 2;

              let zIndex = 0;
              let scale = 0.6;
              let opacity = 0;
              let translateX = 0;

              if (isActive) {
                zIndex = 30;
                scale = 1.15;
                opacity = 1;
                translateX = 0;
              } else if (isSide) {
                zIndex = 20;
                scale = 0.85;
                opacity = 0.9;
                translateX = position * (windowWidth < 640 ? 120 : windowWidth < 1024 ? 200 : 250);
              } else if (isFarSide) {
                zIndex = 10;
                scale = 0.7;
                opacity = 0.4;
                translateX = position * (windowWidth < 640 ? 100 : windowWidth < 1024 ? 180 : 230);
              }

              return (
                <div 
                  key={video.id}
                  className={`absolute w-[280px] md:w-[320px] aspect-[9/16] transition-all duration-700 ease-in-out pointer-events-auto shadow-2xl rounded-2xl overflow-hidden group cursor-pointer ${isActive ? 'ring-2 ring-[rgb(var(--primary)/0.2)] ring-offset-8' : ''}`}
                  onClick={() => isActive && setStoryOpen(true)}
                  style={{
                    zIndex,
                    opacity,
                    transform: `translateX(${translateX}px) scale(${scale})`,
                    filter: isActive ? 'none' : 'brightness(0.5)'
                  }}
                >
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Story-like Progress Indicators at Top */}
                  {isActive && (
                    <div className="absolute top-4 left-4 right-4 flex gap-1 z-50">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                          {i === 1 && <div className="h-full bg-white w-1/2 animate-pulse"></div>}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Overlay for center video */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
                      <h3 className="text-white text-xl font-bold mb-6 text-center" style={{ fontFamily: '"Playfair Display", serif' }}>{video.title}</h3>
                      <button className="bg-white text-black py-4 rounded-full font-bold text-[0.65rem] uppercase tracking-[0.2em] hover:bg-[rgb(var(--primary))] hover:text-white transition-all shadow-lg active:scale-95">
                        Watch Story
                      </button>
                    </div>
                  )}

                  {/* Play icon overlay on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[2px]">
                    <div className="w-20 h-20 rounded-full border-2 border-white/50 flex items-center justify-center">
                      <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Global Story Player */}
        <StoryPlayer 
          open={storyOpen} 
          onClose={() => setStoryOpen(false)} 
          stories={videos} 
          initialIndex={currentIndex} 
        />

        <div className="text-center mt-12">
          <Button
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
          >
            Explore Full Wisdom
          </Button>
        </div>
      </div>
    </section>
  );
};

export default YouTube;

