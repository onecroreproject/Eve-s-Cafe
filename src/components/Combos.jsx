import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { IMAGE_BASE_URL } from '../api/config';

// --- Brand Colors ---
const G = '#1A3C2E';
const G2 = '#0f2419';
const A = '#B48253';   
const COMBO_BG = '#F9F7F2'; // Subtle warm background for combos

const css = `
  .combo-section, .toast {
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
    padding-bottom: 110%;
    background: #fff;
    overflow: hidden;
    flex-shrink: 0;
  }
  .p-img img {
    position: absolute; 
    inset: 0;
    width: 100%; 
    height: 100%;
    object-fit: contain;
    padding: 10%;
    transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
  }
  .p-card:hover .p-img img { 
    transform: scale(1.08); 
  }

  .combo-badge {
    position: absolute; 
    top: 12px; 
    left: 12px; 
    z-index: 2;
    background: ${A}; 
    color: #fff;
    font-size: 0.6rem; 
    font-weight: 800; 
    letter-spacing: 0.1em;
    text-transform: uppercase; 
    padding: 6px 12px;
    border-radius: 2px;
    box-shadow: 0 4px 10px rgba(180, 130, 83, 0.3);
  }

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

  .p-body {
    padding: 1.25rem;
    display: flex; 
    flex-direction: column; 
    flex: 1;
    text-align: left;
  }
  .p-name {
    font-family: 'Playfair Display', serif;
    font-size: 1.15rem;
    font-weight: 600; 
    color: ${G};
    line-height: 1.3; 
    text-decoration: none;
    margin-bottom: 8px; 
    min-height: 2.6em;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .p-desc {
    font-size: 0.8rem;
    color: #777;
    margin-bottom: 12px;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .p-foot {
    display: flex; 
    align-items: center;
    justify-content: space-between; 
    margin-top: auto;
    padding-top: 12px;
    border-top: 1px dashed rgba(26,60,46,0.08);
  }
  .p-price {
    font-size: 1.2rem;
    font-weight: 700; 
    color: ${G}; 
    font-family: 'Playfair Display', serif;
  }
  .p-mrp {
    font-size: 0.8rem;
    color: #a0a0a0;
    text-decoration: line-through;
    margin-left: 6px;
    font-weight: 500;
  }

  .p-cart {
    background: ${G}; 
    color: #fff;
    border: none; 
    padding: 10px 16px;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    cursor: pointer; 
    transition: all 0.3s ease; 
    border-radius: 4px;
  }
  .p-cart:hover { background: ${G2}; transform: scale(1.02); }

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

const Combos = () => {
  const nav = useNavigate();
  const [comboItems, setComboItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favoriteProducts');
    return saved ? JSON.parse(saved) : [];
  });
  const [toast, setToast] = useState({ show: false, message: '' });
  const [selectingPackFor, setSelectingPackFor] = useState(null);

  useEffect(() => {
    const fetchCombos = async () => {
      try {
        setLoading(true);
        const res = await api.get('/products?combo=1');
        if (res.data.success) {
          setComboItems(res.data.data.slice(0, 4));
        }
      } catch (err) {
        console.error("Failed to fetch combos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCombos();
  }, []);

  useEffect(() => {
    const handleStorage = () => {
      const saved = localStorage.getItem('favoriteProducts');
      setFavorites(saved ? JSON.parse(saved) : []);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

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
    showToast(`Added ${product.name} to cart`);
  };

  const isFavorited = (productId) => favorites.includes(productId);

  if (!loading && comboItems.length === 0) return null;

  return (
    <section className="pt-4 pb-12 bg-[#FDFCF9] relative overflow-hidden combo-section" onClick={() => setSelectingPackFor(null)}>
      <style>{css}</style>
      
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[rgba(180,130,83,0.03)] rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-16 px-4">
          <div className="max-w-2xl">
            <h6 className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-[#B48253] mb-4">Botanical Pairings</h6>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1A3C2E] luxury-serif leading-tight">
              Exclusive <span className="text-gradient">Combos</span>
            </h2>
            <p className="mt-4 text-gray-500 font-medium">
              Carefully curated sets designed to work in harmony for your skin and soul. Save more when you choose our holistic pairings.
            </p>
          </div>
        </div>

        <div className="p-grid">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="skeleton-card" style={{ height: '100%', minHeight: '400px' }}>
                {/* Image Area */}
                <div className="skeleton-item" style={{ width: '100%', paddingBottom: '110%', borderRadius: '12px 12px 0 0' }} />
                {/* Body Area */}
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '12px' }}>
                  {/* Name (multiline) */}
                  <div className="skeleton-item" style={{ width: '85%', height: '14px', borderRadius: '4px' }} />
                  <div className="skeleton-item" style={{ width: '60%', height: '14px', borderRadius: '4px', marginBottom: '4px' }} />
                  {/* Desc */}
                  <div className="skeleton-item" style={{ width: '90%', height: '10px', borderRadius: '4px' }} />
                  <div className="skeleton-item" style={{ width: '80%', height: '10px', borderRadius: '4px', marginBottom: '8px' }} />
                  {/* Divider */}
                  <div style={{ height: '1px', background: 'rgba(26,60,46,0.08)', margin: '8px 0 4px' }} />
                  {/* Footer (Price & Button) */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                    <div className="skeleton-item" style={{ width: '60px', height: '18px', borderRadius: '4px' }} />
                    <div className="skeleton-item" style={{ width: '90px', height: '28px', borderRadius: '4px' }} />
                  </div>
                </div>
              </div>
            ))
          ) : (
            comboItems.map((product) => (
              <div key={product.id} className="p-card" style={{ zIndex: selectingPackFor === product.id ? 50 : 1 }}>
                <div className="p-img" onClick={() => nav(`/product/${product.slug}`)} style={{ cursor: 'pointer' }}>
                  <img 
                    src={product.image ? (product.image.startsWith('http') ? product.image : `${IMAGE_BASE_URL}${product.image.startsWith('/') ? '' : '/'}${product.image}`) : '/placeholder-product.jpg'} 
                    alt={product.name} 
                  />
                  <span className="combo-badge">Combo Set</span>
                  
                  <button className="fav-btn" onClick={(e) => toggleFavorite(product.id, product.name, e)}>
                    {isFavorited(product.id) ? (
                      <svg className="heart-filled" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                    ) : (
                      <svg className="heart-outline" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                    )}
                  </button>
                </div>

                <div className="p-body">
                  <Link to={`/product/${product.slug}`} className="p-name">{product.name}</Link>
                  <p className="p-desc">{product.subtitle || 'Perfectly matched botanical pairing.'}</p>
                  
                  <div className="p-foot">
                    <div className="flex items-baseline">
                      <span className="p-price">₹{product.variants?.[0]?.price?.toLocaleString('en-IN') || product.price?.toLocaleString('en-IN')}</span>
                      {(product.variants?.[0]?.mrp || product.mrp) && (
                        <span className="p-mrp">₹{(product.variants?.[0]?.mrp || product.mrp).toLocaleString('en-IN')}</span>
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
                            background: '#F4F5F2', cursor: 'pointer', transition: 'all 0.2s',
                            fontSize: '0.85rem', fontFamily: "'Playfair Display', serif", color: '#1A3C2E'
                          }}
                          onMouseOver={e => e.currentTarget.style.borderColor = '#1A3C2E'}
                          onMouseOut={e => e.currentTarget.style.borderColor = '#f0f0f0'}
                        >
                          <span style={{ fontWeight: 600 }}>{v.label}</span>
                          <span style={{ fontWeight: 700, color: '#B48253' }}>₹{v.price.toLocaleString('en-IN')}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className={`toast ${toast.show ? 'show' : ''}`}>
        {toast.message}
      </div>
    </section>
  );
};

export default Combos;
