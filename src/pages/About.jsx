import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import banner1 from '../assets/banner/banner1.jpg';
import banner3 from '../assets/banner/banner3.jpg';
import heritageImg from '../assets/generated/herbal_powders_botanical_science_1776410840471.png';

/* ─────────────────────────────────────────
   DESIGN TOKENS (Matching other pages)
───────────────────────────────────────── */
const G = '#1A3C2E';   // Dark Green
const G2 = '#0f2419';  // Darker Green
const A = '#B48253';   // Gold Accent
const SAGE = '#F4F5F2'; // Light background
const WHITE = '#FFFFFF';
const BLACK = '#000000';

/* ─────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────── */
const GLOBAL = `
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.2); }
  }
  @keyframes spinSlow { from { transform: rotate(0); } to { transform: rotate(360deg); } }
  @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  .rv { opacity: 0; transform: translateY(30px); transition: opacity .7s ease, transform .7s ease; }
  .rv.in { opacity: 1; transform: translateY(0); }
  .rv-l { opacity: 0; transform: translateX(-30px); transition: opacity .7s ease, transform .7s ease; }
  .rv-l.in { opacity: 1; transform: translateX(0); }
  .rv-r { opacity: 0; transform: translateX(30px); transition: opacity .7s ease, transform .7s ease; }
  .rv-r.in { opacity: 1; transform: translateX(0); }

  .ab-hero-title {
    color: #fff;
    font-size: clamp(2.5rem, 5vw, 4.8rem);
    font-family: 'Playfair Display', serif;
    font-weight: 700;
    line-height: 1.1;
    margin: 0 0 1.5rem;
    letter-spacing: -0.01em;
  }
  .ab-hero-title span {
    color: ${A};
    font-weight: 700;
    display: inline-block;
    margin-left: 0.2em;
  }
  .luxury-serif { font-family: 'Playfair Display', serif; }
  .text-gradient {
    background: linear-gradient(to right, #D4B28C, ${A});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const useReveal = () => {
  useEffect(() => {
    const all = document.querySelectorAll('.rv,.rv-l,.rv-r');
    const io = new IntersectionObserver(
      e => e.forEach(x => { if (x.isIntersecting) x.target.classList.add('in'); }),
      { threshold: 0.1 }
    );
    all.forEach(el => io.observe(el));
    return () => io.disconnect();
  });
};

/* Chip Component */
const Chip = ({ children, gold = false }) => (
  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-full border transition-all duration-300 ${
    gold 
      ? 'bg-[rgba(180,130,83,0.1)] border-[#B48253]' 
      : 'bg-[#F4F5F2] border-gray-200'
  }`}>
    <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${gold ? 'bg-[#B48253]' : 'bg-[#1A3C2E]'}`} />
    <span className={`font-sans text-[0.6rem] md:text-[0.7rem] font-bold tracking-[0.2em] uppercase ${
      gold ? 'text-[#B48253]' : 'text-[#1A3C2E]'
    }`}>
      {children}
    </span>
  </div>
);

/* Dash Divider */
const Dash = () => (
  <div className="w-8 md:w-10 h-[1.5px] bg-[#B48253] rounded-full mb-4 md:mb-6 mx-auto md:mx-0" />
);

/* Section Grid Component - Equal Height */
const SectionGrid = ({ children, reverse = false, bgcolor = WHITE, borderBottom = true }) => (
  <div className={`py-12 md:py-20 ${borderBottom ? 'border-b border-gray-100' : ''}`} style={{ backgroundColor: bgcolor }}>
    <div className="max-w-[1300px] mx-auto px-4 sm:px-6 md:px-8">
      <div className={`flex flex-col md:flex-row md:flex-nowrap gap-6 md:gap-8 items-stretch ${reverse ? 'md:flex-row-reverse' : ''}`}>
        {children}
      </div>
    </div>
  </div>
);

/* Image Column Component - Full View */
const ImageCol = ({ src, alt, badge = null }) => (
  <div className="w-full md:w-5/12 flex items-stretch">
    <div className="relative w-full flex flex-col h-full">
      <div className="relative w-full rounded-2xl overflow-hidden shadow-xl border border-gray-100 h-full">
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-[#1A3C2E]/5 mix-blend-multiply pointer-events-none" />
      </div>

      {/* Spinning ring decoration */}
      <div className="absolute -top-3 md:-top-5 -right-3 md:-right-5 w-[60px] md:w-[100px] h-[60px] md:h-[100px] rounded-full border border-dashed border-[#F4F5F2] animate-spin-slow pointer-events-none z-0" />

      {badge && (
        <div className="absolute -bottom-2.5 md:-bottom-4 -left-2.5 md:-left-4 w-12 md:w-[85px] h-12 md:h-[85px] bg-white rounded-full flex items-center justify-center shadow-lg z-10 border border-[#1A3C2E]/20">
          <div className="w-full h-full rounded-full flex flex-col items-center justify-center text-center md:border md:border-dashed md:border-[#1A3C2E]/35">
            <span className="text-[#1A3C2E] font-black text-[0.55rem] md:text-[0.9rem] leading-none">{badge.value}</span>
            <span className="text-black font-extrabold text-[0.18rem] md:text-[0.35rem] uppercase tracking-wider">{badge.label}</span>
          </div>
        </div>
      )}
    </div>
  </div>
);

/* Text Column Component - Home Page Section Title Design */
const TextCol = ({ eyebrow, title, titleItalic, body, pillars = [], cta = null, gold = false }) => (
  <div className="w-full md:w-7/12 flex items-stretch">
    <div className="p-2 md:p-3 text-left flex flex-col justify-center h-full w-full">
      {eyebrow && (
        <h6 className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-[#B48253] mb-4">
          {eyebrow}
        </h6>
      )}

      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold luxury-serif leading-tight mb-4" style={{ color: '#1A3C2E' }}>
        {title}{titleItalic && (
          <>{' '}<span className="text-gradient">{titleItalic}</span></>
        )}
      </h2>

      <p className="text-gray-500 text-[0.85rem] md:text-[0.95rem] leading-relaxed mb-4 md:mb-6 max-w-[550px]">
        {body}
      </p>

      {/* Pillars */}
      {pillars.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 w-full mb-4 md:mb-6">
          {pillars.map((item, i) => (
            <div key={i} className="pt-2" style={{ borderTop: `2px solid ${gold ? A : G}` }}>
              <p className="font-extrabold text-[0.65rem] md:text-[0.7rem] text-black mb-1 uppercase tracking-wide">{item.title}</p>
              <p className="text-[0.65rem] md:text-[0.75rem] text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      )}

      {cta && (
        <Link
          to={cta.to || '#'}
          className={`inline-flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-lg font-bold text-[0.7rem] md:text-[0.85rem] tracking-wide transition-all duration-300 hover:-translate-y-0.5 ${
            gold 
              ? 'bg-[#1A3C2E] text-white hover:bg-[#0f2419]' 
              : 'bg-black text-white hover:bg-[#333]'
          }`}
        >
          {cta.label}
          {cta.arrow && (
            <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          )}
        </Link>
      )}
    </div>
  </div>
);

/* ══════════════════════════════════════════
   MAIN ABOUT COMPONENT
══════════════════════════════════════════ */
const About = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  useReveal();
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 80); return () => clearTimeout(t); }, []);

  return (
    <div 
      className="bg-white min-h-screen font-sans text-black overflow-x-hidden transition-opacity duration-800"
      style={{ opacity: loaded ? 1 : 0 }}
    >
      <style>{GLOBAL}</style>

      {/* ══ HERO SECTION ══ */}
      <div className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${G} 0%, ${G2} 100%)` }}>
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-[300px] h-[300px] rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, rgba(180,130,83,0.15) 0%, transparent 70%)` }} />
        <div className="absolute -bottom-10 -left-10 w-[250px] h-[250px] rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, rgba(180,130,83,0.1) 0%, transparent 70%)` }} />

        <div className="relative z-10 max-w-[1300px] mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-20">
          <div className="flex flex-col md:flex-row md:flex-nowrap gap-8 md:gap-12 items-stretch">
            
            {/* Left - Text */}
            <div className="w-full md:w-1/2 flex items-stretch">
              <div className="w-full flex flex-col justify-center">
                <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full mb-6 w-fit">
                  <div className="w-2 h-2 rounded-full bg-[#B48253] animate-pulse" />
                  <span className="text-white/90 font-semibold tracking-[0.2em] uppercase text-[0.65rem]">Our Botanical Story</span>
                </div>

                <h1 className="ab-hero-title luxury-serif">
                  Rooted in <span className="text-gradient">Wisdom</span>
                </h1>

                <p className="text-white/80 max-w-[500px] text-[0.85rem] md:text-[0.95rem] leading-relaxed mb-6">
                  A journey back to nature's most potent remedies — crafted for the modern soul seeking authentic botanical rituals rooted in 5,000 years of Ayurvedic science.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/blog"
                    className="bg-[#B48253] text-white rounded-lg px-6 md:px-8 py-2.5 md:py-3 font-bold text-[0.7rem] md:text-[0.75rem] tracking-wider text-center transition-all duration-300 hover:bg-[#9a6d40] hover:-translate-y-0.5"
                  >
                    Explore Our Story
                  </Link>
                  <Link
                    to="/shop"
                    className="border border-white/30 text-white rounded-lg px-6 md:px-8 py-2.5 md:py-3 font-semibold text-[0.7rem] md:text-[0.75rem] tracking-wider text-center transition-all duration-300 hover:border-white hover:bg-white/10 hover:-translate-y-0.5"
                  >
                    Our Rituals
                  </Link>
                </div>
              </div>
            </div>

            {/* Right - Image Full View */}
            <div className="w-full md:w-1/2 flex items-stretch">
              <div className="relative w-full h-full">
                <div className="absolute -top-5 -right-5 w-[100px] h-[100px] rounded-full border border-dashed border-white/20 animate-spin-slow pointer-events-none" />
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 h-full">
                  <img src={banner1} alt="Botanical Heritage" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border border-[#1A3C2E]/20">
                  <div className="text-center">
                    <span className="text-[#1A3C2E] font-black text-[0.8rem] leading-none">5000</span>
                    <span className="text-black font-extrabold text-[0.3rem] uppercase tracking-wider block">Years</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ══ TICKER ══ */}
      <div className="bg-[#1A3C2E] py-3 overflow-hidden">
        <div className="flex w-max animate-[ticker_25s_linear_infinite]">
          {[...Array(2)].flatMap((_, a) =>
            ['100% Organic', 'Vegan Friendly', 'Cruelty Free', 'Paraben Free', 'Artisanal Craft', 'Ayurvedic', 'Small Batch', 'Ethically Sourced'].map((t, i) => (
              <span key={`${a}-${i}`} className="font-sans text-[0.7rem] font-semibold tracking-[0.2rem] uppercase text-white/80 whitespace-nowrap px-6">
                ✦ {t}
              </span>
            ))
          )}
        </div>
      </div>

      {/* ══ GENESIS — image left, text right with equal height ══ */}
      <SectionGrid bgcolor={WHITE}>
        <ImageCol src={banner1} alt="Genesis" badge={{ value: '5000', label: 'Years' }} />
        <TextCol
          eyebrow="Our Genesis"
          title="Ancient Rituals"
          titleItalic="for the Modern Glow"
          body="EvesCafe was founded on the belief that true beauty is cultivated, not manufactured. We spent years deep inside sacred Ayurvedic manuscripts — studying ancient apothecaries and learning from lineage keepers in Kerala and Rajasthan. Each formula is a meditation — a slow conversation between botanist, alchemist, and the living earth."
          pillars={[
            { title: 'Kerala Roots', desc: 'Sourced from ancient apothecary lineages.' },
            { title: 'Manuscripts', desc: 'Formulas rooted in 5,000-year-old texts.' },
            { title: 'Meditation', desc: 'Every drop crafted with intention.' },
          ]}
          cta={{ label: 'Read Our Story', to: '/blog', arrow: true }}
        />
      </SectionGrid>

      {/* ══ HERITAGE — image left, text right with equal height ══ */}
      <SectionGrid bgcolor={SAGE}>
        <ImageCol src={heritageImg} alt="Botanical Heritage Ritual" badge={{ value: '100%', label: 'Pure' }} />
        <TextCol
          eyebrow="The EveCafe Heritage"
          title="Rooted in Nature,"
          titleItalic="Crafted with Soul"
          body="Founded on the belief that true beauty is a reflection of well-being, EveCafe was born from a passion for authentic Ayurvedic traditions and the healing power of botanicals. We honour the earth that gives us life."
          pillars={[
            { title: 'Pure Sourcing', desc: 'Ethically harvested organic botanicals.' },
            { title: 'Ancient Wisdom', desc: 'Time-tested formulations.' },
            { title: 'Artisanal Craft', desc: 'Small-batch techniques.' },
          ]}
          cta={{ label: 'Learn Our Rituals', to: '/blog', arrow: true }}
        />
      </SectionGrid>

      {/* ══ FOUNDER QUOTE ══ */}
      <div className="bg-white py-16 md:py-24 text-center">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 md:px-8">
          <div className="font-serif text-[4rem] md:text-[8rem] text-[#1A3C2E] opacity-8 leading-none mb-2">"</div>
          <p className="rv font-serif font-normal text-xl sm:text-2xl md:text-3xl text-black leading-relaxed mb-12 max-w-[850px] mx-auto">
            "Nature doesn't rush, yet everything is accomplished. We created EvesCafe to bring that same patient, potent wisdom to your daily ritual — one sacred drop at a time."
          </p>
          <div className="flex items-center justify-center gap-6">
            <div className="w-12 h-px bg-[#B48253]" />
            <span className="font-sans text-[0.7rem] font-bold tracking-[0.2rem] uppercase text-[#B48253]">Founder's Note</span>
            <div className="w-12 h-px bg-[#B48253]" />
          </div>
        </div>
      </div>

      {/* ══ VISION — image left, text right with equal height ══ */}
      <SectionGrid bgcolor={WHITE} borderBottom={false}>
        <ImageCol src={banner3} alt="Vision" badge={{ value: '2030', label: 'Zero' }} />
        <TextCol
          eyebrow="Our Vision"
          title="The Future of"
          titleItalic="Natural Luxury"
          body="Luxury shouldn't come at the cost of the environment. Our goal is to redefine high-end skincare as something exquisitely effective and deeply responsible — beauty that gives back to the earth it takes from."
          pillars={[
            { title: 'Zero Waste', desc: 'Fully recyclable packaging by 2026.' },
            { title: 'Regenerative', desc: 'Carbon-positive supply chain.' },
            { title: 'Ethical Trade', desc: 'Fair pay at every step.' },
          ]}
          gold
          cta={{ label: 'Start Your Ritual', arrow: false }}
        />
      </SectionGrid>

      {/* ══ CERTIFICATIONS ══ */}
      <div className="bg-[#F4F5F2] py-12 md:py-16 text-center">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 md:px-8">
          <span className="font-sans text-[0.65rem] text-[#B48253] tracking-[0.3rem] mb-8 uppercase font-semibold block">Proven Responsible</span>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {[
              { label: 'USDA Organic', sub: 'Certified' },
              { label: 'Leaping Bunny', sub: 'Cruelty Free' },
              { label: 'Vegan Society', sub: 'Accredited' },
              { label: 'B Corp', sub: 'Pending' },
            ].map((c, i) => (
              <div key={i} className="flex-0 min-w-[80px] md:min-w-[100px] text-center">
                <div className="w-12 md:w-[60px] h-12 md:h-[60px] rounded-full mx-auto mb-3 bg-white border-2 border-gray-200 flex items-center justify-center">
                  <span className="font-sans text-base md:text-xl text-[#1A3C2E]">✦</span>
                </div>
                <p className="font-bold text-[0.6rem] md:text-[0.65rem] tracking-[0.15rem] uppercase text-black">{c.label}</p>
                <p className="text-[0.55rem] md:text-[0.6rem] text-gray-500">{c.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ CTA FOOTER ══ */}
      <div className="relative overflow-hidden text-center py-16 md:py-24" style={{ background: `linear-gradient(135deg, ${G} 0%, ${G2} 100%)` }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:28px_28px]" />
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <div className="inline-block px-6 py-2 border border-white/20 rounded-full mb-6">
            <span className="font-sans text-[0.65rem] font-semibold tracking-[0.2rem] uppercase text-white/80">Join the Sanctuary</span>
          </div>
          <h2 className="rv font-serif font-bold text-white text-3xl sm:text-4xl md:text-5xl mb-2">Begin Your</h2>
          <h2 className="rv font-serif font-bold text-[#B48253] text-3xl sm:text-4xl md:text-5xl mb-8">Ritual</h2>
          <p className="rv text-white/70 mb-10 max-w-[500px] mx-auto text-base leading-relaxed">
            Stay connected with botanical insights, moon-cycle rituals, and exclusive sacred herb announcements delivered to your sanctuary.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <Link
              to="/blog"
              className="bg-[#B48253] text-white rounded-lg px-8 md:px-12 py-3 md:py-4 font-bold text-[0.75rem] tracking-[0.15rem] uppercase transition-all duration-300 hover:bg-[#9a6d40] hover:-translate-y-0.5"
            >
              Sign Up for Journal
            </Link>
            <Link
              to="/contact"
              className="border border-white/30 text-white rounded-lg px-8 md:px-12 py-3 md:py-4 font-semibold text-[0.75rem] tracking-[0.15rem] uppercase transition-all duration-300 hover:border-white hover:bg-white/10 hover:-translate-y-0.5"
            >
              Talk to Specialist
            </Link>
          </div>
          <p className="font-sans text-[0.7rem] text-white/50 tracking-wider">✦ 12,000+ members in the botanical sanctuary ✦</p>
        </div>
      </div>

      <style>{`
        .animate-spin-slow {
          animation: spinSlow 40s linear infinite;
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default About;