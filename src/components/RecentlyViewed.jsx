import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { IMAGE_BASE_URL } from '../api/config';

// --- Brand Colors ---
const G = '#1A3C2E';
const A = '#B48253';   

const css = `
  .rv-section {
    font-family: 'Playfair Display', serif;
  }
  .luxury-serif {
    font-family: 'Playfair Display', serif;
  }
  .rv-grid {
    display: grid;
    gap: 20px;
    grid-template-columns: repeat(5, 1fr);
  }
  @media (max-width: 1199px) { .rv-grid { grid-template-columns: repeat(4, 1fr); } }
  @media (max-width: 991px)  { .rv-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (max-width: 767px)  { .rv-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 480px)  { .rv-grid { grid-template-columns: 1fr; } }

  .rv-card {
    display: flex; 
    flex-direction: column;
    background: transparent;
    text-decoration: none;
    transition: all 0.3s ease;
  }
  .rv-img-box {
    position: relative;
    width: 100%;
    padding-bottom: 100%;
    background: #fff;
    border: 1px solid #f0f0f0;
    overflow: hidden;
    margin-bottom: 12px;
  }
  .rv-img-box img {
    position: absolute; 
    inset: 0;
    width: 100%; 
    height: 100%;
    object-fit: contain;
    padding: 15%;
    transition: transform 0.5s ease;
  }
  .rv-card:hover img { transform: scale(1.05); }

  .rv-name {
    font-family: 'Playfair Display', serif;
    font-size: 0.9rem;
    font-weight: 600; 
    color: ${G};
    margin-bottom: 4px;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .rv-price {
    font-size: 0.85rem;
    font-weight: 700;
    color: ${A};
  }
`;

const RecentlyViewed = () => {
  const nav = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecentlyViewed = async () => {
    const saved = localStorage.getItem('recentlyViewed');
    if (!saved) {
      setItems([]);
      setLoading(false);
      return;
    }

    const ids = JSON.parse(saved);
    if (ids.length === 0) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // Fetch products by IDs
      const res = await api.get(`/products?ids=${ids.join(',')}`);
      if (res.data.success) {
        // Maintain the order from localStorage
        const allProducts = res.data.data;
        const ordered = ids.map(id => allProducts.find(p => p.id === id)).filter(Boolean);
        setItems(ordered.slice(0, 5));
      }
    } catch (err) {
      console.error("Failed to fetch recently viewed products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentlyViewed();
    
    const handleUpdate = () => fetchRecentlyViewed();
    window.addEventListener('recently-viewed-updated', handleUpdate);
    return () => window.removeEventListener('recently-viewed-updated', handleUpdate);
  }, []);

  if (!loading && items.length === 0) return null;

  return (
    <section className="pt-0 pb-12 bg-white rv-section">
      <style>{css}</style>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-16 px-4">
          <div className="max-w-2xl">
            <h6 className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-[#B48253] mb-4">Botanical Journey</h6>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1A3C2E] luxury-serif leading-tight">
              Recently <span className="text-gradient">Viewed</span>
            </h2>
            <p className="mt-4 text-gray-500 font-medium">
              Your recently viewed items. Revisit your favorite botanical selections and holistic rituals.
            </p>
            <button 
              onClick={() => {
                localStorage.removeItem('recentlyViewed');
                setItems([]);
              }}
              className="mt-6 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors"
            >
              Clear History
            </button>
          </div>
        </div>

        <div className="rv-grid">
          {loading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-100 aspect-square mb-4"></div>
                <div className="bg-gray-100 h-4 w-3/4 mb-2"></div>
                <div className="bg-gray-100 h-3 w-1/2"></div>
              </div>
            ))
          ) : (
            items.map((product) => (
              <Link key={product.id} to={`/product/${product.slug}`} className="rv-card">
                <div className="rv-img-box">
                  <img 
                    src={product.image ? (product.image.startsWith('http') ? product.image : `${IMAGE_BASE_URL}${product.image.startsWith('/') ? '' : '/'}${product.image}`) : '/placeholder-product.jpg'} 
                    alt={product.name} 
                  />
                </div>
                <h4 className="rv-name">{product.name}</h4>
                <p className="rv-price">₹{product.variants?.[0]?.price?.toLocaleString('en-IN') || product.price?.toLocaleString('en-IN')}</p>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default RecentlyViewed;
