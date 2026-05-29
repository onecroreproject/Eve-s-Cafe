import React from 'react';
import banner1 from '../assets/banner/banner1.jpg';

const OurStory = () => {
  const [showMore, setShowMore] = React.useState(false);

  return (
    <section className="py-10 bg-[rgb(var(--surface))] relative overflow-hidden">
      {/* Decorative Blur Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[rgb(var(--primary)/0.03)] rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[rgb(var(--primary)/0.03)] rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Image Side */}
          <div className="relative group">
            <div className="relative aspect-[4/3] rounded-tl-[100px] rounded-br-[100px] overflow-hidden shadow-2xl">
              <img 
                src={banner1} 
                alt="Natural apothecary process" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[rgb(var(--primary)/0.1)] mix-blend-multiply"></div>
            </div>
            
            {/* Floating Badge */}
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-white p-2 rounded-full shadow-2xl hidden md:flex items-center justify-center animate-pulse-slow">
              <div className="w-full h-full rounded-full border-2 border-dashed border-[rgb(var(--primary)/0.3)] flex flex-col items-center justify-center text-center p-4">
                <span className="text-[rgb(var(--primary))] font-black text-2xl leading-tight">100%</span>
                <span className="text-[rgb(var(--foreground))] text-[0.65rem] font-bold uppercase tracking-widest">Organic Formulation</span>
              </div>
            </div>
          </div>

          {/* Text Side */}
          <div className="flex flex-col">
            <span className="text-[rgb(var(--primary))] font-bold uppercase tracking-[0.3em] text-xs mb-6 block">
              The EveCafe Heritage
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1A3C2E] leading-tight mb-8 tracking-tight luxury-serif">
              Rooted in Nature, <br />
              <span className="text-gradient">Crafted with Soul</span>
            </h2>
            
            <div className="space-y-6 text-[rgb(var(--muted))] leading-relaxed text-[1.05rem]">
              <p>
                Founded on the belief that true beauty is a reflection of well-being, EveCafe was born from a passion for authentic Ayurvedic traditions and the healing power of botanicals.
              </p>
              <div className={`space-y-6 overflow-hidden transition-all duration-700 ${showMore ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 md:max-h-none md:opacity-100'}`}>
                <p>
                  Every product in our collection is a labor of love hand picked ingredients, small-batch formulations, and a commitment to purity that goes beyond the surface. We don't just create skincare; we cultivate rituals that reconnect you with the earth's vital energy.
                </p>
                {showMore && (
                  <>
                    <p>
                      Our journey began in the lush landscapes of South India, where our founder rediscovered the profound intelligence of nature. We've spent years perfecting the balance between traditional maceration techniques and modern extraction science.
                    </p>
                    <p>
                      Choosing EveCafe means supporting a community of organic growers, prioritizing sustainable glass packaging, and embracing a beauty routine that honors both your skin and the environment.
                    </p>
                  </>
                )}
              </div>
            </div>

            <button 
              onClick={() => setShowMore(!showMore)}
              className="self-start mt-12 px-10 py-4 bg-[rgb(var(--primary))] text-white font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-[rgb(var(--primary-dark))] transition-all duration-300 shadow-xl shadow-[rgb(var(--primary)/0.2)]"
            >
              {showMore ? 'Show Less' : 'Read Our Full Story'}
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default OurStory;

