import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import api, { IMAGE_BASE_URL } from '../api/config';

// --- Brand constants (mirrors Shop.jsx exactly) ---
const G = '#1A3C2E';   // Dark Green
const G2 = '#0f2419';   // Darker Green (hover)
const A = '#B48253';   // Gold Accent
const SAGE = '#F4F5F2';   // Light image background

// ─── CSS ────────────────────────────────────────────────────────────────────
const css = `
  .bs-root {
    background: #fff;
    font-family: 'Playfair Display', serif;
    min-height: 100vh;
  }

  /* ── Hero (Better UI without bg image) ─────────────────────────── */
  .bs-hero {
    background: linear-gradient(135deg, ${G} 0%, ${G2} 100%);
    padding: 4rem 2rem 5rem;
    margin-bottom: 2rem;
    position: relative;
    overflow: hidden;
  }
  
  /* Decorative elements */
  .bs-hero::before {
    content: '';
    position: absolute;
    top: -40%;
    right: -10%;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(180,130,83,0.15) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }
  
  .bs-hero::after {
    content: '';
    position: absolute;
    bottom: -30%;
    left: -5%;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(180,130,83,0.1) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }
  
  .bs-hero-content {
    position: relative;
    z-index: 2;
    max-width: 1280px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    flex-wrap: wrap;
    gap: 2rem;
  }
  
  .bs-hero-left { display: flex; flex-direction: column; }
  
  .bs-hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(255,255,255,0.1);
    backdrop-filter: blur(10px);
    padding: 6px 16px;
    border-radius: 40px;
    width: fit-content;
    margin-bottom: 1.5rem;
  }
  .bs-hero-badge span {
    width: 8px;
    height: 8px;
    background: ${A};
    border-radius: 50%;
    display: inline-block;
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.2); }
  }
  .bs-hero-badge p {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.9);
    margin: 0;
  }
  
  .bs-hero-subtitle {
    color: ${A};
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.3em;
    margin-bottom: 1rem;
    text-transform: uppercase;
  }
  
  .bs-hero-title {
    color: #fff;
    font-size: clamp(2.5rem, 5vw, 4.8rem);
    font-family: 'Playfair Display', serif;
    font-weight: 600;
    line-height: 1.1;
    margin: 0 0 0.5rem;
  }
  .bs-hero-title span {
    color: ${A};
    font-weight: 600;
    display: inline-block;
  }
  
  .bs-hero-desc {
    color: #c0c8c3;
    font-size: 1rem;
    margin-top: 1rem;
    max-width: 500px;
    line-height: 1.6;
  }
  
  .bs-hero-stats {
    align-self: flex-end;
    background: rgba(255,255,255,0.08);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 60px;
    padding: 0.75rem 1.75rem;
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  .bs-hero-stats-item {
    text-align: center;
  }
  .bs-hero-stats-number {
    font-size: 1.5rem;
    font-weight: 700;
    color: ${A};
    font-family: 'Playfair Display', serif;
    line-height: 1;
  }
  .bs-hero-stats-label {
    font-size: 0.6rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.7);
    margin-top: 4px;
  }
  .bs-hero-stats-divider {
    width: 1px;
    height: 30px;
    background: rgba(255,255,255,0.2);
  }

  /* ── Main container ────────────────────────────────────────────── */
  .bs-container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 1.5rem 5rem;
  }
  .bs-results-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.85rem;
    color: #888;
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #f0f0f0;
  }
  .bs-results-bar strong { color: ${G}; font-weight: 700; }
  .bs-filter-chip {
    display: flex;
    gap: 0.5rem;
  }
  .bs-chip {
    padding: 4px 12px;
    border-radius: 20px;
    background: ${SAGE};
    font-size: 0.7rem;
    color: #666;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .bs-chip:hover {
    background: ${A};
    color: #fff;
  }

  /* ── Product Grid ──────────────────────────────────────────────── */
  .p-grid {
    display: grid;
    gap: clamp(20px, 2.2vw, 30px);
    grid-template-columns: repeat(4, 1fr);
  }
  @media (max-width: 1024px) { .p-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (max-width: 768px)  { .p-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 480px)  { .p-grid { grid-template-columns: 1fr; } }

  /* ── Product Card (Enhanced) ───────────────────────────────────── */
  .p-card {
    display: flex;
    flex-direction: column;
    background: #fff;
    height: 100%;
    text-decoration: none;
    position: relative;
    border: 1px solid #f0f0f0;
    border-radius: 12px;
    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  }
  .p-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(26,60,46,0.12);
    border-color: transparent;
  }

  /* Image area */
  .p-img {
    position: relative;
    width: 100%;
    padding-bottom: 110%;
    background: ${SAGE};
    overflow: hidden;
    flex-shrink: 0;
    border-radius: 11px 11px 0 0;
  }
  .p-img img {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    object-fit: contain;
    mix-blend-mode: multiply;
    padding: 12%;
    transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
  }
  .p-card:hover .p-img img { transform: scale(1.08); }

  /* Badge */
  .p-badge {
    position: absolute; top: 12px; left: 12px; z-index: 2;
    background: ${G}; color: #fff;
    font-size: 0.55rem; font-weight: 600; letter-spacing: 0.15em;
    text-transform: uppercase; padding: 6px 12px; border-radius: 20px;
  }

  /* Favourite button */
  .fav-btn {
    position: absolute; top: 12px; right: 12px; z-index: 10;
    background: rgba(255,255,255,0.95);
    width: 36px; height: 36px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    border: none; cursor: pointer;
    backdrop-filter: blur(4px);
    transition: all 0.3s ease;
  }
  .fav-btn:hover { transform: scale(1.15); background: #fff; }
  .fav-btn svg { width: 16px; height: 16px; transition: all 0.2s ease; }
  .fav-btn .heart-outline { fill: none; stroke: #999; stroke-width: 2; }
  .fav-btn .heart-filled  { fill: #e74c3c; stroke: #e74c3c; stroke-width: 2; }
  .fav-btn:hover .heart-outline { stroke: #e74c3c; }

  /* Card body */
  .p-body {
    padding: 1.25rem;
    display: flex; flex-direction: column; flex: 1;
    text-align: left;
  }
  .p-cat {
    font-size: 0.6rem; font-weight: 600; letter-spacing: 0.2em;
    text-transform: uppercase; color: ${A}; margin-bottom: 8px;
    overflow: hidden; white-space: nowrap; text-overflow: ellipsis;
  }
  .p-name {
    font-family: 'Playfair Display', serif;
    font-size: 1.05rem; font-weight: 600; color: ${G};
    line-height: 1.35; text-decoration: none;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin-bottom: 10px;
    transition: color 0.2s;
    min-height: 2.8em;
  }
  .p-name:hover { color: ${A}; }

  /* Stars */
  .p-stars { display: flex; align-items: center; gap: 3px; margin-bottom: 14px; }
  .p-stars svg { width: 12px; height: 12px; fill: ${A}; }
  .p-review-count { font-size: 0.7rem; color: #999; margin-left: 6px; font-weight: 500; }

  /* Card footer */
  .p-foot {
    display: flex; align-items: center;
    justify-content: space-between; gap: 10px;
    margin-top: auto; padding-top: 14px;
    border-top: 1px solid rgba(26,60,46,0.08);
  }
  .p-price-wrap { display: flex; align-items: baseline; flex-wrap: wrap; gap: 6px; }
  .p-price {
    font-size: 1.2rem; font-weight: 700; color: ${G};
    font-family: 'Playfair Display', serif;
  }
  .p-mrp {
    font-size: 0.8rem; color: #bbb;
    text-decoration: line-through; font-weight: 500;
  }
  .p-cart {
    font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; background: ${G}; color: #fff;
    border: none; cursor: pointer; padding: 8px 14px;
    transition: all 0.3s ease; border-radius: 30px; white-space: nowrap;
  }
  .p-cart:hover { background: ${A}; transform: scale(1.02); }

  /* ── Scroll-reveal ─────────────────────────────────────────────── */
  .rv { opacity: 0; transform: translateY(30px); transition: opacity 0.7s ease, transform 0.7s ease; }
  .rv.in { opacity: 1; transform: translateY(0); }

  /* ── Empty state ───────────────────────────────────────────────── */
  .empty-state {
    text-align: center; padding: 4rem 2rem; color: #666;
  }
  .empty-state h3 {
    font-family: 'Playfair Display', serif;
    font-size: 2rem; color: ${G}; margin-bottom: 1rem;
  }

  /* ── Toast ─────────────────────────────────────────────────────── */
  .toast {
    position: fixed; bottom: 30px; left: 50%;
    transform: translateX(-50%) translateY(100px);
    background: ${G}; color: #fff;
    padding: 12px 28px; border-radius: 50px;
    font-size: 0.85rem; font-weight: 500;
    z-index: 1000; opacity: 0;
    transition: all 0.3s ease; pointer-events: none;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    white-space: nowrap;
  }
  .toast.show { transform: translateX(-50%) translateY(0); opacity: 1; }

  /* ── Responsive hero tweaks ────────────────────────────────────── */
  @media (max-width: 768px) {
    .bs-hero { padding: 2rem 1rem 3rem; }
    .bs-hero-content { flex-direction: column; align-items: flex-start; }
    .bs-hero-stats { align-self: flex-start; }
    .bs-container { padding: 0 1rem 3rem; }
    .bs-results-bar { flex-direction: column; gap: 1rem; align-items: flex-start; }
  }
  @media (max-width: 480px) {
    .bs-hero { padding: 1.5rem 1rem 2rem; }
    .bs-container { padding: 0 0.75rem 2rem; }
    .toast { white-space: normal; text-align: center; max-width: 90%; }
  }

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

// ─── Component ───────────────────────────────────────────────────────────────
const Bestsellers = () => {
  const navigate = useNavigate();
  const [bestsellers, setBestsellers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favoriteProducts');
    return saved ? JSON.parse(saved) : [];
  });

  const [toast, setToast] = useState({ show: false, message: '' });
  const [selectingPackFor, setSelectingPackFor] = useState(null);

  // ── Helpers ──────────────────────────────────────────────────────
  const formatImg = (path) => {
    if (!path || typeof path !== 'string')
      return 'https://placehold.co/400x400?text=Product';
    if (path.startsWith('http')) return path;
    const clean = path.startsWith('/') ? path : `/${path}`;
    return `${IMAGE_BASE_URL}${clean}`;
  };

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 2000);
  };

  const isFavorited = (id) => favorites.includes(id);

  const toggleFavorite = (productId, productName, e) => {
    e.stopPropagation();
    const token = localStorage.getItem('token');
    if (!token) {
      window.dispatchEvent(new Event('open-login-modal'));
      return;
    }
    setFavorites((prev) => {
      const already = prev.includes(productId);
      showToast(already ? `Removed ${productName} from favorites` : `Added ${productName} to favorites`);
      const updated = already ? prev.filter((id) => id !== productId) : [...prev, productId];
      localStorage.setItem('favoriteProducts', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('wishlist-updated'));
      return updated;
    });
  };

  const handleAddToCartClick = (product, e) => {
    if (e) e.stopPropagation();
    if (product.variants && product.variants.length > 1) {
      if (selectingPackFor === product.id) {
        setSelectingPackFor(null);
      } else {
        setSelectingPackFor(product.id);
      }
    } else {
      addToCart(product, product.variants?.[0] || {});
    }
  };

  const handlePackSelect = (product, variantId, e) => {
    if (e) e.stopPropagation();
    const variant = product.variants.find(v => v.id === parseInt(variantId)) || product.variants[0];
    addToCart(product, variant);
    setSelectingPackFor(null);
  };

  const addToCart = (product, variant) => {
    const cartItem = {
      id: product.id,
      variant_id: variant?.id,
      quantity: 1,
      name: product.name,
      price: variant?.price || product.price,
      image: product.image,
    };
    const savedCart = localStorage.getItem('cartItems');
    let cart = savedCart ? JSON.parse(savedCart) : [];
    const idx = cart.findIndex(
      (item) => item.id === cartItem.id && item.variant_id === cartItem.variant_id
    );
    if (idx > -1) {
      cart[idx].quantity += 1;
    } else {
      cart.push(cartItem);
    }
    localStorage.setItem('cartItems', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));
    showToast(`Added ${product.name} to ritual`);
  };

  // ── Data fetch ───────────────────────────────────────────────────
  useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        setLoading(true);
        const res = await api.get('/products?bestseller=1');
        if (res.data.success) setBestsellers(res.data.data);
      } catch (err) {
        console.error('Failed to fetch bestsellers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBestsellers();
  }, []);

  // ── Scroll-reveal observer ───────────────────────────────────────
  useEffect(() => {
    if (loading) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('in')),
      { threshold: 0.08 }
    );
    document.querySelectorAll('.rv').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [bestsellers, loading]);

  // ── Render ───────────────────────────────────────────────────────
  return (
    <>
      <style>{css}</style>
      <div className="bs-root">

        {/* ── Hero Without BG Image ── */}
        <div className="bs-hero">
          <div className="bs-hero-content">
            <div className="bs-hero-left">
              <div className="bs-hero-badge">
                <span></span>
                <p>Community Chosen · Botanical · Organic</p>
              </div>
              <h1 className="bs-hero-title">
                Best <span className="text-gradient">Sellers</span>
              </h1>
              <p className="bs-hero-desc">
                {loading
                  ? 'Curating your favourites…'
                  : `Discover our most-loved botanical rituals, crafted with ancient wisdom`}
              </p>
            </div>

            {!loading && bestsellers.length > 0 && (
              <div className="bs-hero-stats">
                <div className="bs-hero-stats-item">
                  <div className="bs-hero-stats-number">{bestsellers.length}</div>
                  <div className="bs-hero-stats-label">Products</div>
                </div>
                <div className="bs-hero-stats-divider"></div>
                <div className="bs-hero-stats-item">
                  <div className="bs-hero-stats-number">100%</div>
                  <div className="bs-hero-stats-label">Natural</div>
                </div>
                <div className="bs-hero-stats-divider"></div>
                <div className="bs-hero-stats-item">
                  <div className="bs-hero-stats-number">⭐ 4.8</div>
                  <div className="bs-hero-stats-label">Rating</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Main ── */}
        <div className="bs-container">
          <div className="bs-results-bar">
            <span>
              {loading ? (
                'Refreshing botanical library…'
              ) : (
                <span>
                  Showing <strong>{bestsellers.length}</strong> bestselling products
                </span>
              )}
            </span>
            <div className="bs-filter-chip">
              <span className="bs-chip">All Time</span>
              <span className="bs-chip">This Month</span>
              <span className="bs-chip">This Week</span>
            </div>
          </div>

          {loading ? (
            <div className="p-grid" style={{ width: '100%', gridColumn: '1 / -1' }}>
              {[...Array(8)].map((_, i) => (
                <div key={i} className="skeleton-card" style={{ height: '100%', minHeight: '400px' }}>
                  {/* Image Area */}
                  <div className="skeleton-item" style={{ width: '100%', paddingBottom: '110%', borderRadius: '12px 12px 0 0' }} />
                  {/* Body Area */}
                  <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '12px' }}>
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
              ))}
            </div>
          ) : bestsellers.length === 0 ? (
            <div className="empty-state">
              <h3>Awaiting the Harvest</h3>
              <p>Our bestsellers are currently being prepared. Check back soon for fresh batches.</p>
              <div className="mt-6">
                <Button to="/shop" variant="outline" icon="arrow-right">
                  Explore Full Collection
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-grid">
              {bestsellers.map((product, index) => (
                <div key={product.id} className="p-card-wrapper rv" style={{ transitionDelay: `${index * 0.05}s`, position: 'relative', zIndex: selectingPackFor === product.id ? 50 : 1 }}>
                  <div className="p-card">

                    {/* Image */}
                    <div
                      className="p-img"
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/product/${product.slug}`)}
                    >
                      <img src={formatImg(product.image)} alt={product.name} loading="lazy" />
                      {product.tag && <span className="p-badge">{product.tag}</span>}

                      {/* Favourite */}
                      <button
                        className="fav-btn"
                        onClick={(e) => toggleFavorite(product.id, product.name, e)}
                        aria-label="Add to wishlist"
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

                    {/* Body */}
                    <div className="p-body">
                      <span className="p-cat">{product.category?.name || 'Botanical'}</span>

                      <Link to={`/product/${product.slug}`} className="p-name">
                        {product.name}
                      </Link>

                      <div className="p-stars">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        ))}
                        <span className="p-review-count">({product.reviewCount || 24} Reviews)</span>
                      </div>

                      <div className="p-foot">
                        <div className="p-price-wrap">
                          <span className="p-price">
                            ₹{(product.variants?.[0]?.price || product.price)?.toLocaleString('en-IN')}
                          </span>
                          {(product.variants?.[0]?.mrp || product.mrp) && (
                            <span className="p-mrp">
                              ₹{(product.variants?.[0]?.mrp || product.mrp).toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                        <button className="p-cart" onClick={(e) => handleAddToCartClick(product, e)}>
                          Add to Cart
                        </button>
                      </div>

                      {selectingPackFor === product.id && (
                        <div style={{
                          position: 'absolute',
                          top: '100%',
                          left: '-1px',
                          right: '-1px',
                          background: '#fff',
                          border: '1px solid #f0f0f0',
                          borderTop: 'none',
                          borderRadius: '0 0 12px 12px',
                          boxShadow: '0 20px 40px rgba(26,60,46,0.12)',
                          padding: '14px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                          zIndex: 100,
                          cursor: 'default'
                        }} onClick={e => e.stopPropagation()}>
                          <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '1px' }}>Select Pack:</div>
                          {product.variants.map(v => (
                            <button
                              key={v.id}
                              onClick={(e) => handlePackSelect(product, v.id, e)}
                              style={{ 
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '8px 12px', border: '1px solid #f0f0f0', borderRadius: '6px',
                                background: SAGE, cursor: 'pointer', transition: 'all 0.2s',
                                fontSize: '0.85rem', fontFamily: "'Playfair Display', serif", color: G
                              }}
                              onMouseOver={e => e.currentTarget.style.borderColor = G}
                              onMouseOut={e => e.currentTarget.style.borderColor = '#f0f0f0'}
                            >
                              <span style={{ fontWeight: 600 }}>{v.label}</span>
                              <span style={{ fontWeight: 700, color: A }}>₹{v.price.toLocaleString('en-IN')}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>



      {/* Toast */}
      <div className={`toast ${toast.show ? 'show' : ''}`}>{toast.message}</div>
    </>
  );
};

export default Bestsellers;