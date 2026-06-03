import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from './Button';
import api, { IMAGE_BASE_URL } from '../api/config';

// --- Updated Brand Colors ---
const G = '#1A3C2E';
const G2 = '#0f2419';
const A = '#B48253';   // Updated Accent Color
const SAGE = '#F4F5F2'; // Updated Image Background

const css = `
  .bestseller-section, .toast {
    font-family: 'Playfair Display', serif;
  }
  .luxury-serif {
    font-family: 'Playfair Display', serif;
  }
  .p-grid {
    display: grid;
    gap: clamp(10px, 1.5vw, 16px);
    grid-template-columns: repeat(4, 1fr);
  }
  @media (max-width: 1199px) { .p-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (max-width: 767px)  { .p-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 600px)  { .p-grid { grid-template-columns: 1fr; } }

  /* --- Product Card --- */
  .p-card {
    display: flex; 
    flex-direction: column;
    background: #fff;
    overflow: hidden;
    height: 100%;
    text-decoration: none;
    position: relative;
    border: 1px solid #f0f0f0;
    transition: transform 0.3s, box-shadow 0.3s;
  }
  .p-card:hover { 
    transform: translateY(-5px); 
    box-shadow: 0 12px 30px rgba(26,60,46,0.08); 
  }

  .p-img {
    position: relative;
    width: 100%;
    padding-bottom: 110%; /* Harmonized aspect ratio */
    background: ${SAGE};
    overflow: hidden;
    flex-shrink: 0;
  }
  .p-img img {
    position: absolute; 
    inset: 0;
    width: 100%; 
    height: 100%;
    object-fit: contain;
    mix-blend-mode: multiply;
    padding: 10%;
    transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
  }
  .p-card:hover .p-img img { 
    transform: scale(1.08); 
  }

  .p-badge {
    position: absolute; 
    top: 12px; 
    left: 12px; 
    z-index: 2;
    background: #fff; 
    color: #555;
    font-size: 0.55rem; 
    font-weight: 700; 
    letter-spacing: 0.15em;
    text-transform: uppercase; 
    padding: 6px 10px;
    border-radius: 2px;
  }

  /* Favorite Button */
  .fav-btn {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 10;
    background: #fff;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    transition: all 0.2s ease;
  }
  .fav-btn:hover { transform: scale(1.1); }
  .fav-btn svg { width: 14px; height: 14px; transition: all 0.2s ease; }
  .fav-btn .heart-outline { fill: none; stroke: #777; stroke-width: 2; }
  .fav-btn .heart-filled { fill: #e74c3c; stroke: #e74c3c; stroke-width: 2; }
  .fav-btn:hover .heart-outline { stroke: #e74c3c; }

  /* Card Body */
  .p-body {
    padding: 1rem;
    display: flex; 
    flex-direction: column; 
    flex: 1;
    text-align: left;
  }
  .p-cat {
    font-size: 0.55rem; 
    font-weight: 700; 
    letter-spacing: 0.2em;
    text-transform: uppercase; 
    color: ${A}; 
    margin-bottom: 6px;
    overflow: hidden; 
    white-space: nowrap; 
    text-overflow: ellipsis;
  }
  .p-name {
    font-family: 'Playfair Display', serif;
    font-size: 1.1rem;
    font-weight: 600; 
    color: ${G};
    line-height: 1.3; 
    text-decoration: none;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin-bottom: 8px; 
    transition: color 0.2s;
    min-height: 2.6em;
  }
  .p-name:hover { color: ${A}; }

  /* Stars */
  .p-stars { 
    display: flex; 
    align-items: center; 
    gap: 2px; 
    margin-bottom: 12px; 
  }
  .p-stars svg { 
    width: 10px; 
    height: 10px; 
    fill: ${A}; 
  }
  .p-review-count { 
    font-size: 0.65rem; 
    color: #999; 
    margin-left: 6px; 
    font-weight: 500; 
  }

  /* Card Footer (Price & Cart) */
  .p-foot {
    display: flex; 
    align-items: center;
    justify-content: space-between; 
    gap: 8px; 
    margin-top: auto;
    padding-top: 12px;
    border-top: 1px dashed rgba(26,60,46,0.08);
  }
  .p-price-wrap {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
  }
  .p-price {
    font-size: 1.1rem;
    font-weight: 700; 
    color: #1A1A14; 
    font-family: 'Playfair Display', serif;
  }
  .p-mrp {
    font-size: 0.75rem;
    color: #a0a0a0;
    text-decoration: line-through;
    margin-left: 6px;
    font-weight: 500;
    font-family: 'Playfair Display', serif;
  }
  .p-cart {
    font-size: 0.55rem; 
    font-weight: 700; 
    letter-spacing: 0.05em;
    text-transform: uppercase; 
    background: ${G}; 
    color: #fff;
    border: none; 
    cursor: pointer; 
    padding: 8px 10px;
    transition: all 0.3s ease; 
    border-radius: 3px;
    white-space: nowrap;
  }
  .p-cart:hover { 
    background: ${G2}; 
    transform: scale(1.05); 
  }



  /* Toast notification */
  .toast {
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%) translateY(100px);
    background: ${G};
    color: white;
    padding: 12px 24px;
    border-radius: 50px;
    font-size: 0.85rem;
    font-weight: 500;
    z-index: 1000;
    opacity: 0;
    transition: all 0.3s ease;
    pointer-events: none;
  /* Skeleton Loading Styles */
  @keyframes skeletonShimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  .skeleton-item {
    background: linear-gradient(90deg, #f9fafb 25%, #f3f4f6 37%, #f9fafb 63%);
    background-size: 400% 100%;
    animation: skeletonShimmer 1.4s ease infinite;
    border-radius: 4px;
  }
  .skeleton-card {
    display: flex;
    flex-direction: column;
    background: #fff;
    overflow: hidden;
    height: 100%;
    border: 1px solid #f3f4f6;
    border-radius: 12px;
    padding: 0;
  }
`;

const Bestsellers = () => {
  const nav = useNavigate();
  const [bestsellerItems, setBestsellerItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Favorite/Wishlist state
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favoriteProducts');
    return saved ? JSON.parse(saved) : [];
  });

  // Toast notification state
  const [toast, setToast] = useState({ show: false, message: '' });

  const fetchBestsellers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products?bestseller=1');
      if (res.data.success) {
        setBestsellerItems(res.data.data.slice(0, 4));
      }
    } catch (err) {
      console.error("Failed to fetch bestsellers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBestsellers();
  }, []);

  // Sync favorites with other components
  useEffect(() => {
    const handleStorage = () => {
      const saved = localStorage.getItem('favoriteProducts');
      setFavorites(saved ? JSON.parse(saved) : []);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Toggle favorite function
  const toggleFavorite = (productId, productName, e) => {
    if (e) e.stopPropagation();
    
    const token = localStorage.getItem('token');
    if (!token) {
      window.dispatchEvent(new Event('open-login-modal'));
      return;
    }

    setFavorites(prev => {
      const isFavorited = prev.includes(productId);
      let updated;
      if (isFavorited) {
        showToast(`Removed ${productName} from favorites`);
        updated = prev.filter(id => id !== productId);
      } else {
        showToast(`Added ${productName} to favorites`);
        updated = [...prev, productId];
      }
      localStorage.setItem('favoriteProducts', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('wishlist-updated'));
      return updated;
    });
  };

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 2000);
  };

  const addToCart = (product, e) => {
    if (e) e.stopPropagation();
    const variant = product.variants?.[0] || {};
    const cartItem = {
      id: product.id,
      variant_id: variant.id,
      quantity: 1,
      name: product.name,
      price: variant.price || product.price,
      image: product.image
    };

    const savedCart = localStorage.getItem('cartItems');
    let cart = savedCart ? JSON.parse(savedCart) : [];
    const existingIndex = cart.findIndex(item => item.id === cartItem.id && item.variant_id === cartItem.variant_id);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push(cartItem);
    }
    localStorage.setItem('cartItems', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));
    showToast(`Added ${product.name} to ritual`);
  };

  const isFavorited = (productId) => favorites.includes(productId);

  return (
    <section className="pt-0 pb-12 bg-white relative overflow-hidden">
      <style>{css}</style>

      {/* Decorative leaf backgrounds */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[rgba(30,70,50,0.03)] rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[rgba(30,70,50,0.03)] rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 bestseller-section">
        <div className="flex flex-col items-center text-center mb-16 px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1A3C2E] leading-tight mb-4 luxury-serif">
            Best <span style={{ background: 'linear-gradient(to right, #D4B28C, #B48253)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', color: 'transparent' }}>Sellers</span>
          </h2>
          <p className="text-gray-500 max-w-xl">
            Our most-loved botanical rituals, as chosen by our beautiful community.
          </p>
        </div>

        <div className="p-grid">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="skeleton-card" style={{ height: '100%', minHeight: '400px' }}>
                {/* Image Area */}
                <div className="skeleton-item" style={{ width: '100%', paddingBottom: '110%', borderRadius: '12px 12px 0 0' }} />
                {/* Body Area */}
                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '12px' }}>
                  {/* Category */}
                  <div className="skeleton-item" style={{ width: '40%', height: '10px', borderRadius: '4px' }} />
                  {/* Name (multiline) */}
                  <div className="skeleton-item" style={{ width: '90%', height: '14px', borderRadius: '4px' }} />
                  <div className="skeleton-item" style={{ width: '70%', height: '14px', borderRadius: '4px', marginBottom: '8px' }} />
                  {/* Stars */}
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    {[...Array(5)].map((_, starIdx) => (
                      <div key={starIdx} className="skeleton-item" style={{ width: '10px', height: '10px', borderRadius: '50%' }} />
                    ))}
                    <div className="skeleton-item" style={{ width: '50px', height: '8px', borderRadius: '4px', marginLeft: '6px' }} />
                  </div>
                  {/* Divider */}
                  <div style={{ height: '1px', background: 'rgba(26,60,46,0.08)', margin: '8px 0 4px' }} />
                  {/* Footer (Price & Button) */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                    <div className="skeleton-item" style={{ width: '60px', height: '18px', borderRadius: '4px' }} />
                    <div className="skeleton-item" style={{ width: '90px', height: '28px', borderRadius: '30px' }} />
                  </div>
                </div>
              </div>
            ))
          ) : (
            bestsellerItems.map((product) => (
              <div key={product.id} className="p-card-wrapper">
                <div className="p-card">
                <div
                  className="p-img"
                  style={{ cursor: 'pointer' }}
                  onClick={() => nav(`/product/${product.slug}`)}
                >
                  <img 
                    src={product.image ? (product.image.startsWith('http') ? product.image : `${IMAGE_BASE_URL}${product.image.startsWith('/') ? '' : '/'}${product.image}`) : '/placeholder-product.jpg'} 
                    alt={product.name} 
                    loading="lazy" 
                  />
                  {product.tag && <span className="p-badge">{product.tag}</span>}

                  {/* Favorite Button */}
                  <button
                    className="fav-btn"
                    onClick={(e) => toggleFavorite(product.id, product.name, e)}
                  >
                    {isFavorited(product.id) ? (
                      <svg className="heart-filled" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    ) : (
                      <svg className="heart-outline" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    )}
                  </button>
                </div>

                <div className="p-body">
                  <span className="p-cat">{product.category?.name}</span>
                  <Link to={`/product/${product.slug}`} className="p-name">{product.name}</Link>

                  <div className="p-stars">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                    ))}
                    <span className="p-review-count">(32)</span>
                  </div>

                  <div className="p-foot">
                    <div className="p-price-wrap">
                      <span className="p-price">Rs. {product.variants?.[0]?.price?.toLocaleString('en-IN') || product.price?.toLocaleString('en-IN')}</span>
                      {(product.variants?.[0]?.mrp || product.mrp) && (
                        <span className="p-mrp">Rs. {(product.variants?.[0]?.mrp || product.mrp).toLocaleString('en-IN')}</span>
                      )}
                    </div>
                    <button className="p-cart" onClick={(e) => addToCart(product, e)}>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )))}
        </div>

        {/* View All Products Button at bottom */}
        <div className="text-center mt-16">
          <Button to="/shop" variant="outline" icon="arrow-right">
            Explore Full Shop
          </Button>
        </div>
      </div>

      {/* Toast Notification */}
      <div className={`toast ${toast.show ? 'show' : ''}`}>
        {toast.message}
      </div>
    </section>
  );
};

export default Bestsellers;
