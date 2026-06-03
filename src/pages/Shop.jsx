import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import api, { IMAGE_BASE_URL } from '../api/config';
import CustomButton from '../components/Button';

// --- Constants (brand colors) ---
const G = '#1A3C2E';   // Dark Green Background
const G2 = '#0f2419';  // Darker Green for hover states
const A = '#B48253';   // Gold/Brown Accent
const SAGE = '#F4F5F2'; // Light Image Background

// --- CSS (inline for self-contained styling) ---
const css = `
  .shop-page {
    background: #fff;
    font-family: 'Playfair Display', serif;
  }
  
  /* --- Hero Banner (Enhanced without bg image) --- */
  .shop-hero {
    background: linear-gradient(135deg, ${G} 0%, ${G2} 100%);
    padding: 4rem 2rem 5rem;
    margin-bottom: 2rem;
    position: relative;
    overflow: hidden;
  }
  
  /* Decorative elements */
  .shop-hero::before {
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
  
  .shop-hero::after {
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
  
  .hero-content {
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
  
  .hero-left {
    display: flex;
    flex-direction: column;
  }
  
  .hero-badge {
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
  .hero-badge span {
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
  .hero-badge p {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.9);
    margin: 0;
  }
  
  .hero-subtitle {
    color: ${A};
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.3em;
    margin-bottom: 1rem;
    text-transform: uppercase;
  }
  
  .hero-title {
    color: #fff;
    font-size: clamp(2.5rem, 5vw, 4.8rem);
    font-family: 'Playfair Display', serif;
    font-weight: 600;
    line-height: 1.1;
    margin: 0 0 0.5rem 0;
  }
  .hero-title-script {
    font-family: 'Playfair Display', serif;
    color: ${A};
    font-weight: 600;
    display: inline-block;
    margin-left: 0.2em;
  }
  .hero-desc {
    color: #c0c8c3;
    font-size: 1rem;
    margin-top: 1rem;
    max-width: 500px;
    line-height: 1.6;
  }

  /* Stats Card */
  .hero-stats {
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
  .hero-stats-item {
    text-align: center;
  }
  .hero-stats-number {
    font-size: 1.5rem;
    font-weight: 700;
    color: ${A};
    font-family: 'Playfair Display', serif;
    line-height: 1;
  }
  .hero-stats-label {
    font-size: 0.6rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.7);
    margin-top: 4px;
  }
  .hero-stats-divider {
    width: 1px;
    height: 30px;
    background: rgba(255,255,255,0.2);
  }

  /* --- Category Pills --- */
  .hero-filters {
    display: flex;
    gap: 0.8rem;
    flex-wrap: wrap;
    margin-top: 1rem;
  }
  .cat-pill {
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: rgba(255, 255, 255, 0.8);
    padding: 0.6rem 1.4rem;
    border-radius: 40px;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
  }
  .cat-pill:hover {
    background: rgba(255,255,255,0.15);
    border-color: rgba(255, 255, 255, 0.4);
    color: #fff;
    transform: translateY(-2px);
  }
  .cat-pill.active {
    background: ${A};
    border-color: ${A};
    color: #fff;
  }
  .cat-count {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 20px;
    padding: 2px 8px;
    font-size: 0.6rem;
    font-weight: 600;
  }
  .cat-pill.active .cat-count {
    background: rgba(255, 255, 255, 0.25);
  }

  /* --- Main Container --- */
  .shop-container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 1.5rem 5rem;
  }
  .results-count {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.85rem;
    color: #888;
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #f0f0f0;
  }
  .results-count strong {
    color: ${G};
    font-weight: 700;
  }
  .clear-search {
    background: none;
    border: none;
    color: ${A};
    font-weight: 700;
    cursor: pointer;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: color 0.2s ease;
  }
  .clear-search:hover {
    color: ${G};
  }

  /* --- Product Grid --- */
  .p-grid {
    display: grid;
    gap: clamp(20px, 2.2vw, 30px);
    grid-template-columns: repeat(4, 1fr);
  }
  @media (max-width: 1024px) { .p-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (max-width: 768px)  { .p-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 480px)  { .p-grid { grid-template-columns: 1fr; } }

  /* --- Product Card (Enhanced) --- */
  .p-card {
    display: flex; 
    flex-direction: column;
    background: #fff;
    overflow: hidden;
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

  .p-img {
    position: relative;
    width: 100%;
    padding-bottom: 110%;
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
    padding: 12%;
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
    background: ${G};
    color: #fff;
    font-size: 0.55rem; 
    font-weight: 600; 
    letter-spacing: 0.15em;
    text-transform: uppercase; 
    padding: 6px 12px;
    border-radius: 20px;
  }

  /* Favorite Button */
  .fav-btn {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 10;
    background: rgba(255,255,255,0.95);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
    backdrop-filter: blur(4px);
    transition: all 0.3s ease;
  }
  .fav-btn:hover { 
    transform: scale(1.15);
    background: #fff;
  }
  .fav-btn svg { 
    width: 16px; 
    height: 16px; 
    transition: all 0.2s ease; 
  }
  .fav-btn .heart-outline { 
    fill: none; 
    stroke: #999; 
    stroke-width: 2; 
  }
  .fav-btn .heart-filled { 
    fill: #e74c3c; 
    stroke: #e74c3c; 
    stroke-width: 2; 
  }
  .fav-btn:hover .heart-outline { 
    stroke: #e74c3c; 
  }

  /* Card Body */
  .p-body {
    padding: 1.25rem;
    display: flex; 
    flex-direction: column; 
    flex: 1;
    text-align: left;
  }
  .p-cat {
    font-size: 0.6rem; 
    font-weight: 600; 
    letter-spacing: 0.2em;
    text-transform: uppercase; 
    color: ${A}; 
    margin-bottom: 8px;
    overflow: hidden; 
    white-space: nowrap; 
    text-overflow: ellipsis;
  }
  .p-name {
    font-family: 'Playfair Display', serif;
    font-size: 1.05rem;
    font-weight: 600; 
    color: ${G};
    line-height: 1.35; 
    text-decoration: none;
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
  .p-stars { 
    display: flex; 
    align-items: center; 
    gap: 3px; 
    margin-bottom: 14px; 
  }
  .p-stars svg { 
    width: 12px; 
    height: 12px; 
    fill: ${A}; 
  }
  .p-review-count { 
    font-size: 0.7rem; 
    color: #999; 
    margin-left: 6px; 
    font-weight: 500; 
  }

  /* Card Footer (Price & Cart) */
  .p-foot {
    display: flex; 
    align-items: center;
    justify-content: space-between; 
    gap: 10px; 
    margin-top: auto;
    padding-top: 14px;
    border-top: 1px solid rgba(26,60,46,0.08);
  }
  .p-price-wrap {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 6px;
  }
  .p-price {
    font-size: 1.2rem;
    font-weight: 700; 
    color: ${G}; 
    font-family: 'Playfair Display', serif;
  }
  .p-mrp {
    font-size: 0.8rem;
    color: #bbb;
    text-decoration: line-through;
    font-weight: 500;
  }
  .p-cart {
    font-size: 0.65rem; 
    font-weight: 700; 
    letter-spacing: 0.1em;
    text-transform: uppercase; 
    background: ${G}; 
    color: #fff;
    border: none; 
    cursor: pointer; 
    padding: 8px 14px;
    transition: all 0.3s ease; 
    border-radius: 30px;
    white-space: nowrap;
  }
  .p-cart:hover { 
    background: ${A}; 
    transform: scale(1.02); 
  }

  /* Scroll Animation */
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .p-card-wrapper {
    animation: fadeInUp 0.6s ease-out forwards;
    opacity: 0;
  }

  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
    color: #666;
  }
  .empty-state h3 {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    color: ${G};
    margin-bottom: 1rem;
  }

  /* Toast notification */
  .toast {
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%) translateY(100px);
    background: ${G};
    color: white;
    padding: 12px 28px;
    border-radius: 50px;
    font-size: 0.85rem;
    font-weight: 500;
    z-index: 1000;
    opacity: 0;
    transition: all 0.3s ease;
    pointer-events: none;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    white-space: nowrap;
  }
  .toast.show {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .shop-hero { padding: 2rem 1rem 3rem; }
    .hero-content { flex-direction: column; align-items: flex-start; }
    .hero-stats { align-self: flex-start; }
    .shop-container { padding: 0 1rem 3rem; }
    .results-count { flex-direction: column; gap: 1rem; align-items: flex-start; }
    .toast { white-space: normal; text-align: center; max-width: 90%; }
  }
  @media (max-width: 480px) {
    .shop-hero { padding: 1.5rem 1rem 2rem; }
    .shop-container { padding: 0 0.75rem 2rem; }
    .hero-filters { gap: 0.5rem; }
    .cat-pill { padding: 0.4rem 1rem; font-size: 0.55rem; }
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

const Shop = () => {
  const navigate = useNavigate();
  const { cat } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQueryParam = searchParams.get('search') || '';
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [listLoading, setListLoading] = useState(false);

  // Favorite/Wishlist state - load from localStorage
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favoriteProducts');
    return saved ? JSON.parse(saved) : [];
  });

  // Toast notification state
  const [toast, setToast] = useState({ show: false, message: '' });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        api.get('/products', { params: { search: searchQueryParam } }),
        api.get('/categories')
      ]);

      if (prodRes.data.success) {
        setProducts(prodRes.data.data);
      }
      if (catRes.data.success) {
        setCategories(catRes.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch shop data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchQueryParam]);

  useEffect(() => {
    if (cat) {
      setActiveCategory(cat.toUpperCase());
    } else {
      setActiveCategory('ALL');
    }
    
    // Smooth loading spinner overlay on category change
    setListLoading(true);
    const timer = setTimeout(() => {
      setListLoading(false);
    }, 350);
    return () => clearTimeout(timer);
  }, [cat]);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('favoriteProducts', JSON.stringify(favorites));
    window.dispatchEvent(new Event('wishlist-updated'));
  }, [favorites]);

  // Check if product is favorited
  const isFavorited = (productId) => favorites.includes(productId);

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
      if (isFavorited) {
        showToast(`Removed ${productName} from favorites`);
        return prev.filter(id => id !== productId);
      } else {
        showToast(`Added ${productName} to favorites`);
        return [...prev, productId];
      }
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

  // Filter products by Active Category
  const filteredProducts = useMemo(() => {
    if (activeCategory === 'ALL') return products;
    return products.filter(p => p.category?.slug.toUpperCase() === activeCategory || p.category?.name.toUpperCase() === activeCategory);
  }, [activeCategory, products]);

  return (
    <div className="shop-page">
      <style>{css}</style>

      {/* Hero Banner Area - Without BG Image */}
      <div className="shop-hero">
        <div className="hero-content">
          <div className="hero-left">
            <div className="hero-badge">
              <span></span>
              <p>Handcrafted · Botanical · Organic</p>
            </div>
            <h1 className="hero-title">
              {searchQueryParam ? 'Search' : 'Botanical'}
              <span className="hero-title-script">
                {searchQueryParam ? `"${searchQueryParam}"` : 'Collection'}
              </span>
            </h1>
            <p className="hero-desc">
              {searchQueryParam
                ? `Discovering essentials for your quest...`
                : 'Artisan essentials, thoughtfully curated for your ritual'}
            </p>

            {/* Category Pills */}
            <div className="hero-filters">
              <button
                className={`cat-pill ${activeCategory === 'ALL' ? 'active' : ''}`}
                onClick={() => {
                  setActiveCategory('ALL');
                  navigate('/shop');
                }}
              >
                ALL
              </button>
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`cat-pill ${activeCategory === category.slug.toUpperCase() ? 'active' : ''}`}
                  onClick={() => navigate(`/shop/${category.slug}`)}
                >
                  {category.name}
                  <span className="cat-count">
                    {products.filter(p => p.category_id === category.id).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Stats Card */}
          {!loading && products.length > 0 && (
            <div className="hero-stats">
              <div className="hero-stats-item">
                <div className="hero-stats-number">{filteredProducts.length}</div>
                <div className="hero-stats-label">Products</div>
              </div>
              <div className="hero-stats-divider"></div>
              <div className="hero-stats-item">
                <div className="hero-stats-number">100%</div>
                <div className="hero-stats-label">Natural</div>
              </div>
              <div className="hero-stats-divider"></div>
              <div className="hero-stats-item">
                <div className="hero-stats-number">⭐ 4.8</div>
                <div className="hero-stats-label">Rating</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Shop Container */}
      <div className="shop-container">

        <div className="results-count">
          <span>
            {loading ? 'Refreshing botanical library...' : <span>Showing <strong>{filteredProducts.length}</strong> products</span>}
          </span>
          {searchQueryParam && (
            <button
              onClick={() => navigate('/shop')}
              className="clear-search"
            >
              Clear Search
            </button>
          )}
        </div>

        {/* Product Grid / Loading State */}
        {(loading || listLoading) ? (
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
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state">
            <h3>No products found</h3>
            <p>{searchQueryParam ? `We couldn't find anything matching "${searchQueryParam}"` : 'Try selecting a different category.'}</p>
            {searchQueryParam && (
              <div className="mt-6">
                <CustomButton to="/shop" variant="primary">
                  View All Products
                </CustomButton>
              </div>
            )}
          </div>
        ) : (
          <div className="p-grid">
            {filteredProducts.map((product, index) => (
              <div 
                key={product.id} 
                className="p-card-wrapper"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="p-card">
                  <div
                    className="p-img"
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/product/${product.slug}`)}
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
                      <span className="p-review-count">(24 Reviews)</span>
                    </div>

                    <div className="p-foot">
                      <div className="p-price-wrap">
                        <span className="p-price">₹{(product.variants?.[0]?.price || product.price)?.toLocaleString('en-IN')}</span>
                        {(product.variants?.[0]?.mrp || product.mrp) && (
                          <span className="p-mrp">₹{(product.variants?.[0]?.mrp || product.mrp).toLocaleString('en-IN')}</span>
                        )}
                      </div>
                      <button
                        className="p-cart"
                        onClick={(e) => addToCart(product, e)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Toast Notification */}
      <div className={`toast ${toast.show ? 'show' : ''}`}>
        {toast.message}
      </div>
    </div>
  );
};

export default Shop;