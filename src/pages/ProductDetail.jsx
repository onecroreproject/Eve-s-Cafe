import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import CustomButton from '../components/Button';
import { useMediaQuery, useTheme, Skeleton, Snackbar, Alert, Container, Typography, Box, Grid, Stack, Button } from '@mui/material';
import api, { IMAGE_BASE_URL } from '../api/config';

/* ─────────────────────────────────────────
   DESIGN TOKENS (Matching other pages)
───────────────────────────────────────── */
const G = '#1A3C2E';   // Dark Green
const G2 = '#0f2419';  // Darker Green
const A = '#B48253';   // Gold Accent
const SAGE = '#F4F5F2'; // Light background
const WHITE = '#FFFFFF';
const BLACK = '#000000';
const RED = '#e74c3c';
const GREEN = '#1B5E20';

const F = {
  display: '"Playfair Display", serif',
  serif: '"Playfair Display", serif',
  sans: '"Playfair Display", serif',
};

/* ─────────────────────────────────────────
   GLOBAL STYLES & REVEAL HOOK
───────────────────────────────────────── */
const GLOBAL = `
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.2); }
  }
  @keyframes spinSlow{from{transform:rotate(0)}to{transform:rotate(360deg)}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(30px);}to{opacity:1;transform:translateY(0);}}
  .rv{opacity:0;transform:translateY(30px);transition:opacity .7s ease,transform .7s ease;}
  .rv.in{opacity:1;transform:translateY(0);}
  html { scroll-behavior: smooth; }

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

const useReveal = () => {
  useEffect(() => {
    const all = document.querySelectorAll('.rv');
    const io = new IntersectionObserver(
      e => e.forEach(x => { if (x.isIntersecting) x.target.classList.add('in'); }),
      { threshold: 0.1 }
    );
    all.forEach(el => io.observe(el));
    return () => io.disconnect();
  });
};

/* ─── Placeholder images ─── */
const PLACEHOLDER_IMGS = [
  'https://placehold.co/480x480/1a2406/white?text=Front+View',
];

/* ─────────────────────────────────────────
   SHARED SUB-COMPONENTS
───────────────────────────────────────── */
const CustomChip = ({ children, gold = false }) => (
  <Box sx={{
    display: 'inline-flex', alignItems: 'center', gap: 1,
    px: 1.8, py: 0.8, borderRadius: '40px',
    bgcolor: gold ? `${A}10` : SAGE,
    border: `1px solid ${gold ? A : '#e0e0e0'}`,
  }}>
    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: gold ? A : G, animation: 'pulse 2s infinite' }} />
    <Typography sx={{ fontFamily: F.sans, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: gold ? A : G }}>
      {children}
    </Typography>
  </Box>
);

const Dash = ({ w = 32 }) => (
  <Box sx={{ width: w, height: 1.5, bgcolor: A, borderRadius: 1, mb: 3, mx: 'auto' }} />
);

const AccordionItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <Box sx={{ borderBottom: `1px solid #f0f0f0`, bgcolor: open ? SAGE : WHITE, transition: 'all 0.3s' }}>
      <Box
        onClick={() => setOpen(!open)}
        sx={{
          p: { xs: 2, md: 3 }, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          '&:hover': { bgcolor: SAGE }
        }}
      >
        <Typography sx={{ fontFamily: F.sans, fontWeight: 700, fontSize: { xs: '0.9rem', md: '1rem' }, color: BLACK }}>
          {question}
        </Typography>
        <Typography sx={{ fontSize: '1.3rem', color: G, transform: open ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform 0.3s' }}>
          +
        </Typography>
      </Box>
      <Box sx={{
        maxHeight: open ? 500 : 0, overflow: 'hidden', transition: 'max-height 0.4s ease',
        px: { xs: 2, md: 3 }, pb: open ? { xs: 2, md: 3 } : 0
      }}>
        <Typography sx={{ color: '#666', fontSize: { xs: '0.85rem', md: '0.95rem' }, lineHeight: 1.7 }}>
          {answer}
        </Typography>
      </Box>
    </Box>
  );
};

/* ─── Robust Parsers for Backend Data Fallbacks ─── */
const parseIngredients = (ingredients) => {
  if (!ingredients) return null;
  if (typeof ingredients === 'string') {
    const trimmed = ingredients.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.map(item => {
            if (typeof item === 'string') return { name: item, pct: '' };
            if (item && typeof item === 'object') return { name: item.name || '', pct: item.pct || '' };
            return { name: String(item), pct: '' };
          });
        }
      } catch (e) {}
    }
    return trimmed.split(',').map(item => ({ name: item.trim(), pct: '' })).filter(item => item.name);
  }
  if (Array.isArray(ingredients)) {
    return ingredients.map(item => {
      if (typeof item === 'string') return { name: item, pct: '' };
      if (item && typeof item === 'object') return { name: item.name || '', pct: item.pct || '' };
      return { name: String(item), pct: '' };
    });
  }
  if (typeof ingredients === 'object') {
    return [{ name: ingredients.name || '', pct: ingredients.pct || '' }];
  }
  return null;
};

const parseHowToUse = (howToUse) => {
  if (!howToUse) return null;
  if (typeof howToUse === 'string') {
    const trimmed = howToUse.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed.map(String);
      } catch (e) {}
    }
    const delimiter = trimmed.includes('\n') ? '\n' : ',';
    return trimmed.split(delimiter).map(item => item.trim()).filter(Boolean);
  }
  if (Array.isArray(howToUse)) return howToUse.map(String);
  return [String(howToUse)];
};

const parseHighlights = (highlights) => {
  if (!highlights) return null;
  if (typeof highlights === 'string') {
    const trimmed = highlights.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.map(item => {
            if (typeof item === 'string') return item;
            if (item && typeof item === 'object') return item;
            return String(item);
          });
        }
      } catch (e) {}
    }
    return trimmed.split(',').map(item => item.trim()).filter(Boolean);
  }
  if (Array.isArray(highlights)) {
    return highlights.map(item => {
      if (typeof item === 'string') return item;
      if (item && typeof item === 'object') return item;
      return String(item);
    });
  }
  return null;
};

const parseFaqs = (faqs) => {
  if (!faqs) return null;
  if (typeof faqs === 'string') {
    const trimmed = faqs.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.map(item => {
            if (typeof item === 'string') return { question: item, answer: '' };
            if (item && typeof item === 'object') {
              return { question: item.question || item.q || '', answer: item.answer || item.a || '' };
            }
            return { question: String(item), answer: '' };
          });
        }
      } catch (e) {}
    }
    return [{ question: trimmed, answer: '' }];
  }
  if (Array.isArray(faqs)) {
    return faqs.map(item => {
      if (typeof item === 'string') return { question: item, answer: '' };
      if (item && typeof item === 'object') {
        return { question: item.question || item.q || '', answer: item.answer || item.a || '' };
      }
      return { question: String(item), answer: '' };
    });
  }
  return null;
};

const ProductDetail = () => {
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useReveal();

  const reviewsSectionRef = useRef(null);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [packages, setPackages] = useState([]);
  const [pkgIdx, setPkgIdx] = useState(0);
  const [activeImg, setActiveImg] = useState(0);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favoriteProducts');
    return saved ? JSON.parse(saved) : [];
  });
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [selectingPackFor, setSelectingPackFor] = useState(null);
  const [showSticky, setShowSticky] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [descModalOpen, setDescModalOpen] = useState(false);
  const [botanicalsOpen, setBotanicalsOpen] = useState(false);
  const [howToUseOpen, setHowToUseOpen] = useState(false);
  const [reviewsOpen, setReviewsOpen] = useState(() => window.location.hash === '#reviews');
  const [addReviewOpen, setAddReviewOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, name: '', comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSnackbar, setReviewSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/products/${id}`);
      if (res.data.success) {
        const p = res.data.data;
        setProduct(p);
        setPackages(p.variants || []);
        setPkgIdx(0);
        setActiveImg(0);

        const saved = localStorage.getItem('recentlyViewed');
        let viewed = saved ? JSON.parse(saved) : [];
        viewed = viewed.filter(vId => vId !== p.id);
        viewed.unshift(p.id);
        viewed = viewed.slice(0, 10);
        localStorage.setItem('recentlyViewed', JSON.stringify(viewed));
        window.dispatchEvent(new Event('recently-viewed-updated'));
        
        const relatedRes = await api.get(`/products?category=${p.category?.slug}`);
        if (relatedRes.data.success) {
          setRelatedProducts(relatedRes.data.data.filter(item => item.slug !== p.slug).slice(0, 4));
        }
      }
    } catch (err) {
      console.error("Failed to fetch product:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [fetchProduct]);

  useEffect(() => {
    const handleScroll = () => setShowSticky(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToReviews = useCallback(() => {
    if (reviewsSectionRef.current) {
      if (!reviewsOpen) setReviewsOpen(true);
      setTimeout(() => {
        reviewsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [reviewsOpen]);

  const handleSubmitReview = async () => {
    if (!reviewForm.name || !reviewForm.comment) {
      setReviewSnackbar({ open: true, message: 'Please fill in all fields', severity: 'error' });
      return;
    }
    try {
      setSubmittingReview(true);
      const res = await api.post('/reviews', {
        product_id: product.id,
        rating: reviewForm.rating,
        reviewer_name: reviewForm.name,
        comment: reviewForm.comment
      });
      if (res.data.success) {
        setReviewSnackbar({ open: true, message: res.data.message, severity: 'success' });
        setAddReviewOpen(false);
        setReviewForm({ rating: 5, name: '', comment: '' });
        fetchProduct();
      }
    } catch (err) {
      console.error("Failed to submit review:", err);
      setReviewSnackbar({ open: true, message: 'Failed to share your story. Please try again.', severity: 'error' });
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleWriteReview = (e) => {
    if (e) e.stopPropagation();
    const token = localStorage.getItem('token');
    if (!token) {
      window.dispatchEvent(new Event('open-login-modal'));
      return;
    }
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user && user.name) setReviewForm(prev => ({ ...prev, name: user.name }));
      } catch (err) {}
    }
    setAddReviewOpen(true);
  };

  const handleAddToCart = () => {
    const pkg = packages[pkgIdx] || { price: 0 };
    const cartItem = {
      id: product.id,
      variant_id: pkg.id || (product.variants && product.variants[0]?.id),
      quantity: 1,
      name: product.name,
      price: pkg.price,
      image: product.image
    };
    const savedCart = localStorage.getItem('cartItems');
    let cart = savedCart ? JSON.parse(savedCart) : [];
    const existingIndex = cart.findIndex(item => item.id === cartItem.id && item.variant_id === cartItem.variant_id);
    if (existingIndex > -1) cart[existingIndex].quantity += 1;
    else cart.push(cartItem);
    localStorage.setItem('cartItems', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const toggleWishlist = (e) => {
    if (e) e.stopPropagation();
    if (!product) return;
    const token = localStorage.getItem('token');
    if (!token) {
      window.dispatchEvent(new Event('open-login-modal'));
      return;
    }
    setFavorites(prev => {
      const favorited = prev.includes(product.id);
      const updated = favorited ? prev.filter(id => id !== product.id) : [...prev, product.id];
      localStorage.setItem('favoriteProducts', JSON.stringify(updated));
      window.dispatchEvent(new Event('wishlist-updated'));
      return updated;
    });
  };

  const formatImg = (path) => {
    if (!path || typeof path !== 'string') return PLACEHOLDER_IMGS[0];
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${IMAGE_BASE_URL}${cleanPath}`;
  };

  // Add to cart from related products
  const handleRelatedAddToCartClick = (product, e) => {
    if (e) e.stopPropagation();
    if (e) e.preventDefault();
    if (product.variants && product.variants.length > 1) {
      if (selectingPackFor === product.id) {
        setSelectingPackFor(null);
      } else {
        setSelectingPackFor(product.id);
      }
    } else {
      handleRelatedAddToCart(product, product.variants?.[0] || {});
    }
  };

  const handleRelatedPackSelect = (product, variantId, e) => {
    if (e) e.stopPropagation();
    if (e) e.preventDefault();
    const variant = product.variants.find(v => v.id === parseInt(variantId)) || product.variants[0];
    handleRelatedAddToCart(product, variant);
    setSelectingPackFor(null);
  };

  const handleRelatedAddToCart = (product, variant) => {
    const cartItem = {
      id: product.id,
      variant_id: variant?.id,
      quantity: 1,
      name: product.name,
      price: variant?.price || product.price,
      image: product.image
    };
    const savedCart = localStorage.getItem('cartItems');
    let cart = savedCart ? JSON.parse(savedCart) : [];
    const idx = cart.findIndex(c => c.id === cartItem.id && c.variant_id === cartItem.variant_id);
    if (idx > -1) cart[idx].quantity += 1;
    else cart.push(cartItem);
    localStorage.setItem('cartItems', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));
    showToast(`Added ${product.name} to cart`);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Skeleton variant="rectangular" height={500} sx={{ borderRadius: 3 }} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Skeleton variant="text" width="40%" height={30} />
            <Skeleton variant="text" width="100%" height={80} />
            <Skeleton variant="text" width="60%" height={40} />
            <Skeleton variant="rectangular" height={200} sx={{ mt: 4, borderRadius: 2 }} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (!product) {
    return (
      <Box sx={{ py: 20, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontFamily: F.display, mb: 2, color: G }}>Botanical Treasure Not Found</Typography>
        <Link to="/shop" style={{ color: A, fontWeight: 700 }}>Return to Library</Link>
      </Box>
    );
  }

  const pkg = packages[pkgIdx] || { price: 0, mrp: 0, label: 'Standard' };
  const images = [product.image, ...(Array.isArray(product.images) ? product.images : [])]
    .filter(path => path && path !== '')
    .map(formatImg);
  if (images.length === 0) images.push(PLACEHOLDER_IMGS[0]);
  const disc = pkg.mrp > 0 ? Math.round(((pkg.mrp - pkg.price) / pkg.mrp) * 100) : 0;
  const isFavorited = product ? favorites.includes(product.id) : false;

  const highlights = parseHighlights(product.highlights) || [
    '21 active nutrients including Biotin, Zinc & Iron for hair growth support',
    'Amino acids & folic acid for scalp health and reduced hair fall',
    '100% Ayurvedic & Nutraceutical — no harmful chemicals or fillers',
    'Clinically tested formula trusted by over 1,400+ customers',
  ];

  const trustBadges = [
    { icon: '🌿', label: 'Botanical' },
    { icon: '🐾', label: 'Cruelty Free' },
    { icon: '✅', label: 'Ayurvedic' },
    { icon: '🔬', label: 'Clinically Tested' },
  ];

  return (
    <>
      <style>{GLOBAL}</style>
      <Box sx={{ bgcolor: WHITE, minHeight: '100vh', fontFamily: F.sans, color: BLACK, pb: { xs: '80px', md: '96px' } }}>

        {/* ── Breadcrumb ── */}
        <Box sx={{ bgcolor: SAGE, borderBottom: `1px solid #f0f0f0`, py: 2 }}>
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', fontSize: '0.8rem', color: '#666' }}>
              <Link to="/" style={{ color: '#666', textDecoration: 'none' }}>Home</Link>
              <span>/</span>
              <Link to="/shop" style={{ color: '#666', textDecoration: 'none' }}>Shop</Link>
              <span>/</span>
              <span style={{ color: G, fontWeight: 600 }}>{product.name}</span>
            </Box>
          </Container>
        </Box>

        {/* ── Main Product Section ── */}
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
          <Grid container spacing={{ xs: 4, md: 6 }}>
            
            {/* LEFT: Visuals */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column-reverse' : 'row', gap: 2 }}>
                {/* Thumbnails */}
                <Box sx={{
                  display: 'flex',
                  flexDirection: isMobile ? 'row' : 'column',
                  gap: 1,
                  overflowX: isMobile ? 'auto' : 'visible',
                  flexShrink: 0,
                }}>
                  {images.slice(0, 5).map((img, idx) => (
                    <Box
                      key={idx}
                      onClick={() => setActiveImg(idx)}
                      sx={{
                        width: 70, height: 70, flexShrink: 0,
                        border: `2px solid ${activeImg === idx ? A : '#e0e0e0'}`,
                        borderRadius: 2, overflow: 'hidden', cursor: 'pointer',
                        bgcolor: SAGE, transition: 'all 0.2s',
                        '&:hover': { borderColor: G }
                      }}
                    >
                      <img src={img} alt={`view ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 8 }} />
                    </Box>
                  ))}
                </Box>

                {/* Main image */}
                <Box sx={{
                  flex: 1, position: 'relative',
                  bgcolor: SAGE, borderRadius: 3, overflow: 'hidden',
                  border: `1px solid #f0f0f0`,
                  minHeight: isMobile ? 350 : 500,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Box sx={{
                    position: 'absolute', top: 16, left: 16, zIndex: 2,
                    bgcolor: RED, color: WHITE, fontSize: '0.7rem', fontWeight: 700,
                    px: 1.5, py: 0.5, borderRadius: 20, letterSpacing: '0.5px',
                  }}>SAVE {disc}%</Box>

                  <button
                    onClick={toggleWishlist}
                    style={{
                      position: 'absolute', top: 16, right: 16, zIndex: 2,
                      width: 40, height: 40, borderRadius: '50%',
                      background: isFavorited ? '#FFF5F5' : WHITE,
                      border: `1px solid ${isFavorited ? RED : '#e0e0e0'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}
                  >
                    <svg viewBox="0 0 24 24" width={20} height={20} fill={isFavorited ? RED : 'none'} stroke={RED} strokeWidth="1.8">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>

                  <img
                    src={images[activeImg]}
                    alt={product.name}
                    onClick={() => setLightboxOpen(true)}
                    style={{
                      width: '100%', height: '100%', objectFit: 'contain',
                      padding: isMobile ? 20 : 40, cursor: 'zoom-in',
                      transition: 'transform 0.3s',
                    }}
                  />
                </Box>
              </Box>
            </Grid>

            {/* RIGHT: Details */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box>
                <Typography sx={{ fontSize: '0.7rem', letterSpacing: '2px', textTransform: 'uppercase', color: A, fontWeight: 600, mb: 1 }}>
                  {product.category?.name}
                </Typography>

                <Typography sx={{
                  fontFamily: F.display, fontWeight: 700,
                  fontSize: { xs: '1.8rem', md: '2.5rem' }, lineHeight: 1.2, color: BLACK, mb: 2,
                }}>
                  {product.name}
                </Typography>

                <Typography sx={{ fontSize: '0.9rem', color: '#666', mb: 2, lineHeight: 1.6 }}>
                  {product.subtitle || product.description?.slice(0, 120) + '...'}
                </Typography>

                {/* Rating */}
                <Box onClick={scrollToReviews} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, cursor: 'pointer' }}>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} viewBox="0 0 24 24" width={16} height={16} fill={i < (product.rating || 5) ? A : 'none'} stroke={A} strokeWidth="2">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </Box>
                  <Typography sx={{ fontSize: '0.8rem', color: '#666', textDecoration: 'underline' }}>
                    {product.rating || 5.0} ({product.review_count?.toLocaleString() || '0'} Reviews)
                  </Typography>
                </Box>

                {/* Social proof */}
                <Box sx={{
                  display: 'flex', alignItems: 'center', gap: 1,
                  px: 2, py: 1.5, bgcolor: SAGE, borderRadius: 2, mb: 3,
                }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: RED, animation: 'pulse 2s infinite' }} />
                  <Typography sx={{ fontSize: '0.85rem', color: G, fontWeight: 500 }}>
                    <strong style={{ color: RED }}>1,432</strong> customers buying this right now
                  </Typography>
                </Box>

                {/* Price */}
                <Box sx={{ mb: 3 }}>
                  <Typography sx={{
                    fontFamily: F.display, fontWeight: 700,
                    fontSize: { xs: '2rem', md: '2.5rem' }, color: G,
                  }}>
                    ₹{pkg.price?.toLocaleString('en-IN')}
                  </Typography>
                  {pkg.mrp > 0 && (
                    <Typography sx={{ fontSize: '1rem', color: '#999', textDecoration: 'line-through', ml: 1 }}>
                      ₹{pkg.mrp?.toLocaleString('en-IN')}
                    </Typography>
                  )}
                </Box>

                {/* Pack selector */}
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, mb: 2, color: BLACK }}>
                  Select Pack:
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
                  {packages.map((p, i) => {
                    const isActive = pkgIdx === i;
                    const pkgSave = p.mrp - p.price;
                    const isPopular = i === 1;
                    return (
                      <Box
                        key={i}
                        onClick={() => setPkgIdx(i)}
                        sx={{
                          display: 'flex', alignItems: 'center', gap: 2,
                          p: 2, border: `2px solid ${isActive ? G : '#e0e0e0'}`,
                          borderRadius: 2, bgcolor: isActive ? SAGE : WHITE,
                          cursor: 'pointer', position: 'relative', transition: 'all 0.2s',
                        }}
                      >
                        {isPopular && (
                          <Box sx={{
                            position: 'absolute', top: -10, right: 16,
                            bgcolor: A, color: WHITE, fontSize: '0.6rem',
                            fontWeight: 700, px: 1.5, py: 0.5, borderRadius: 20,
                          }}>Popular</Box>
                        )}
                        <Box sx={{ width: 24, height: 24, borderRadius: '50%', border: `2px solid ${isActive ? G : '#ccc'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {isActive && <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: G }} />}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: BLACK }}>{p.label}</Typography>
                          {pkgSave > 0 && <Typography sx={{ fontSize: '0.7rem', color: A }}>Save ₹{pkgSave.toLocaleString('en-IN')}</Typography>}
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: G }}>₹{p.price?.toLocaleString('en-IN')}</Typography>
                          <Typography sx={{ fontSize: '0.7rem', color: '#999', textDecoration: 'line-through' }}>₹{p.mrp?.toLocaleString('en-IN')}</Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>

                {/* CTA Buttons */}
                <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                  <CustomButton
                    onClick={handleAddToCart}
                    variant={added ? 'outline' : 'primary'}
                    className="flex-1"
                  >
                    {added ? '✓ Added to Cart' : 'Add to Cart'}
                  </CustomButton>
                  <button
                    onClick={toggleWishlist}
                    style={{
                      width: 52, height: 52,
                      border: `1.5px solid ${isFavorited ? RED : '#e0e0e0'}`,
                      background: isFavorited ? '#FFF5F5' : WHITE,
                      borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <svg viewBox="0 0 24 24" width={22} height={22} fill={isFavorited ? RED : 'none'} stroke={RED} strokeWidth="1.8">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                </Box>

                {/* Divider */}
                <Box sx={{ height: 1, bgcolor: '#f0f0f0', mb: 3 }} />

                {/* Trust badges */}
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, mb: 4 }}>
                  {trustBadges.map((b, i) => (
                    <Box key={i} sx={{ textAlign: 'center', p: 1 }}>
                      <Typography sx={{ fontSize: '1.5rem', mb: 0.5 }}>{b.icon}</Typography>
                      <Typography sx={{ fontSize: '0.6rem', fontWeight: 700, color: '#666', textTransform: 'uppercase' }}>{b.label}</Typography>
                    </Box>
                  ))}
                </Box>

                {/* Highlights */}
                <Box sx={{ bgcolor: SAGE, borderRadius: 2, p: 3 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: A, mb: 2 }}>
                    Why It Works
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {highlights.map((h, i) => (
                      <Box key={i} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: G, mt: 1 }} />
                        <Typography sx={{ fontSize: '0.85rem', color: '#555', lineHeight: 1.5 }}>{typeof h === 'object' ? `${h.title}: ${h.desc}` : h}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>

        {/* ─── Accordion Sections ─── */}
        <Container maxWidth="lg" disableGutters sx={{ borderTop: `1px solid #f0f0f0`, mt: 4 }}>
          {/* Product Description */}
          <Box sx={{ borderBottom: `1px solid #f0f0f0` }}>
            <Box onClick={() => setDescModalOpen(!descModalOpen)} sx={{ py: 3, cursor: 'pointer', bgcolor: WHITE, '&:hover': { bgcolor: SAGE } }}>
              <Container maxWidth="lg">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontFamily: F.sans, fontSize: '0.8rem', fontWeight: 700, letterSpacing: 2, color: G, textTransform: 'uppercase' }}>Product Description</Typography>
                  <Typography sx={{ fontSize: '1.5rem', color: G, transform: descModalOpen ? 'rotate(45deg)' : 'rotate(0)' }}>+</Typography>
                </Box>
              </Container>
            </Box>
            <Box sx={{ maxHeight: descModalOpen ? 800 : 0, overflow: 'hidden', transition: 'max-height 0.4s ease', bgcolor: WHITE }}>
              <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
                  <CustomChip>Ancestral Wisdom</CustomChip>
                  <Typography sx={{ fontFamily: F.display, fontWeight: 700, fontSize: { xs: '1.8rem', md: '2.5rem' }, color: G, mt: 3, mb: 3 }}>
                    {product.botanical_tale || `The Botanical Tale of ${product.name}`}
                  </Typography>
                  <Typography sx={{ fontSize: '1rem', color: '#666', lineHeight: 1.8 }}>
                    {product.description}
                  </Typography>
                </Box>
              </Container>
            </Box>
          </Box>

          {/* Key Botanicals */}
          <Box sx={{ borderBottom: `1px solid #f0f0f0` }}>
            <Box onClick={() => setBotanicalsOpen(!botanicalsOpen)} sx={{ py: 3, cursor: 'pointer', bgcolor: WHITE, '&:hover': { bgcolor: SAGE } }}>
              <Container maxWidth="lg">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontFamily: F.sans, fontSize: '0.8rem', fontWeight: 700, letterSpacing: 2, color: G, textTransform: 'uppercase' }}>Key Botanicals</Typography>
                  <Typography sx={{ fontSize: '1.5rem', color: G, transform: botanicalsOpen ? 'rotate(45deg)' : 'rotate(0)' }}>+</Typography>
                </Box>
              </Container>
            </Box>
            <Box sx={{ maxHeight: botanicalsOpen ? 600 : 0, overflow: 'hidden', transition: 'max-height 0.4s ease', bgcolor: WHITE }}>
              <Container maxWidth="lg" sx={{ py: 4 }}>
                {(parseIngredients(product.ingredients) || [
                  { name: 'Brahmi Extract', pct: '15%' },
                  { name: 'Bringraj Oil', pct: '20%' },
                  { name: 'Virgin Coconut Oil', pct: '40%' },
                ]).map((ing, i) => (
                  <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', py: 2, borderBottom: `1px solid #f0f0f0` }}>
                    <Typography sx={{ fontWeight: 600, color: BLACK }}>{ing.name}</Typography>
                    <Typography sx={{ color: A, fontWeight: 600 }}>{ing.pct}</Typography>
                  </Box>
                ))}
              </Container>
            </Box>
          </Box>

          {/* How to Use */}
          <Box sx={{ borderBottom: `1px solid #f0f0f0` }}>
            <Box onClick={() => setHowToUseOpen(!howToUseOpen)} sx={{ py: 3, cursor: 'pointer', bgcolor: WHITE, '&:hover': { bgcolor: SAGE } }}>
              <Container maxWidth="lg">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontFamily: F.sans, fontSize: '0.8rem', fontWeight: 700, letterSpacing: 2, color: G, textTransform: 'uppercase' }}>How to Use</Typography>
                  <Typography sx={{ fontSize: '1.5rem', color: G, transform: howToUseOpen ? 'rotate(45deg)' : 'rotate(0)' }}>+</Typography>
                </Box>
              </Container>
            </Box>
            <Box sx={{ maxHeight: howToUseOpen ? 800 : 0, overflow: 'hidden', transition: 'max-height 0.4s ease', bgcolor: WHITE }}>
              <Container maxWidth="lg" sx={{ py: 4 }}>
                <Grid container spacing={3}>
                  {(parseHowToUse(product.how_to_use) || [
                    "Cleanse your face thoroughly.",
                    "Apply 2-3 drops to your palms.",
                    "Massage gently in upward strokes.",
                    "Use daily for luminous results.",
                  ]).map((step, i) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                      <Box sx={{ p: 3, bgcolor: SAGE, borderRadius: 2, textAlign: 'center', height: '100%' }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: A, mb: 1 }}>STEP 0{i + 1}</Typography>
                        <Typography sx={{ fontSize: '0.85rem', color: BLACK }}>{step}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Container>
            </Box>
          </Box>

          {/* FAQ */}
          <Box sx={{ borderBottom: `1px solid #f0f0f0` }}>
            <Box onClick={() => setFaqOpen(!faqOpen)} sx={{ py: 3, cursor: 'pointer', bgcolor: WHITE, '&:hover': { bgcolor: SAGE } }}>
              <Container maxWidth="lg">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontFamily: F.sans, fontSize: '0.8rem', fontWeight: 700, letterSpacing: 2, color: G, textTransform: 'uppercase' }}>Ritual Questions (FAQ)</Typography>
                  <Typography sx={{ fontSize: '1.5rem', color: G, transform: faqOpen ? 'rotate(45deg)' : 'rotate(0)' }}>+</Typography>
                </Box>
              </Container>
            </Box>
            <Box sx={{ maxHeight: faqOpen ? 800 : 0, overflow: 'hidden', transition: 'max-height 0.4s ease', bgcolor: WHITE }}>
              <Container maxWidth="lg" sx={{ py: 4 }}>
                {(parseFaqs(product.faqs) || [
                  { question: "Is this 100% Botanical and Safe?", answer: "Absolutely. We use zero synthetic fillers, parabens, or artificial fragrances." },
                  { question: "How long does delivery take?", answer: "Standard delivery takes 3-5 business days depending on your location." },
                  { question: "What is the best way to use this product?", answer: "Consistency is key — use daily for at least 21 days to see transformative results." },
                ]).map((faq, i) => (
                  <AccordionItem key={i} question={faq.question} answer={faq.answer} />
                ))}
              </Container>
            </Box>
          </Box>

          {/* Community Reviews */}
          <Box ref={reviewsSectionRef} sx={{ borderBottom: `1px solid #f0f0f0`, scrollMarginTop: '100px' }}>
            <Box onClick={() => setReviewsOpen(!reviewsOpen)} sx={{ py: 3, cursor: 'pointer', bgcolor: WHITE, '&:hover': { bgcolor: SAGE } }}>
              <Container maxWidth="lg">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                    <Typography sx={{ fontFamily: F.sans, fontSize: '0.8rem', fontWeight: 700, letterSpacing: 2, color: G, textTransform: 'uppercase' }}>Community Reviews</Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: A }}>★ {product.rating || 5.0}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: '1.5rem', color: G, transform: reviewsOpen ? 'rotate(45deg)' : 'rotate(0)' }}>+</Typography>
                </Box>
              </Container>
            </Box>
            <Box sx={{ maxHeight: reviewsOpen ? 800 : 0, overflow: 'hidden', transition: 'max-height 0.4s ease', bgcolor: WHITE }}>
              <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                  <Typography sx={{ fontFamily: F.display, fontWeight: 700, fontSize: '1.5rem', color: BLACK }}>Luminous Stories</Typography>
                  <button onClick={handleWriteReview} style={{ padding: '10px 24px', background: G, color: WHITE, border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: '0.75rem' }}>Write a Review</button>
                </Box>
                <Grid container spacing={3}>
                  {(product.reviews?.length ? product.reviews.map(r => ({
                    name: r.reviewer_name, rating: r.rating, date: new Date(r.created_at).toLocaleDateString(), text: r.comment
                  })) : [
                    { name: 'Aditi V.', rating: 5, date: '15 Apr 2025', text: 'This has become a staple in my daily ritual. The scent is incredibly calming.' },
                    { name: 'Rahul S.', rating: 4, date: '22 Mar 2025', text: 'Very effective and natural. You can feel the quality of the ingredients.' },
                  ]).map((rev, i) => (
                    <Grid size={{ xs: 12, md: 6 }} key={i}>
                      <Box sx={{ p: 3, bgcolor: SAGE, borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', gap: 0.5, mb: 2 }}>
                          {[...Array(5)].map((_, si) => (
                            <svg key={si} viewBox="0 0 24 24" width={14} height={14} fill={si < rev.rating ? A : 'none'} stroke={A}>
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          ))}
                        </Box>
                        <Typography sx={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.6, mb: 2 }}>"{rev.text}"</Typography>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', color: BLACK }}>{rev.name}</Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: '#999' }}>{rev.date}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Container>
            </Box>
          </Box>
        </Container>

        {/* Related Products */}
        <Box sx={{ py: 6, bgcolor: SAGE }}>
          <style>{`
            .rt-card {
              display: flex;
              flex-direction: column;
              background: #fff;
              overflow: hidden;
              height: 100%;
              text-decoration: none;
              position: relative;
              border: 1px solid #f0f0f0;
              border-radius: 12px;
              transition: transform 0.3s cubic-bezier(0.165,0.84,0.44,1), box-shadow 0.3s;
            }
            .rt-card:hover {
              transform: translateY(-5px);
              box-shadow: 0 12px 30px rgba(26,60,46,0.08);
              border-color: transparent;
            }
            .rt-img-wrap {
              position: relative;
              width: 100%;
              padding-bottom: 110%;
              background: ${WHITE};
              overflow: hidden;
              flex-shrink: 0;
            }
            .rt-img-wrap img {
              position: absolute;
              inset: 0;
              width: 100%;
              height: 100%;
              object-fit: contain;
              mix-blend-mode: multiply;
              padding: 10%;
              transition: transform 0.6s cubic-bezier(0.165,0.84,0.44,1);
            }
            .rt-card:hover .rt-img-wrap img {
              transform: scale(1.08);
            }
            .rt-badge {
              position: absolute;
              top: 10px;
              left: 10px;
              z-index: 2;
              background: ${G};
              color: #fff;
              font-size: 0.52rem;
              font-weight: 700;
              letter-spacing: 0.12em;
              text-transform: uppercase;
              padding: 5px 10px;
              border-radius: 20px;
            }
            .rt-fav {
              position: absolute;
              top: 10px;
              right: 10px;
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
              box-shadow: 0 2px 8px rgba(0,0,0,0.07);
              transition: all 0.2s ease;
            }
            .rt-fav:hover { transform: scale(1.12); }
            .rt-fav svg { width: 14px; height: 14px; transition: all 0.2s; }
            .rt-body {
              padding: 1rem;
              display: flex;
              flex-direction: column;
              flex: 1;
              text-align: left;
            }
            .rt-cat {
              font-size: 0.55rem;
              font-weight: 700;
              letter-spacing: 0.2em;
              text-transform: uppercase;
              color: ${A};
              margin-bottom: 5px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            .rt-name {
              font-family: 'Playfair Display', serif;
              font-size: 1rem;
              font-weight: 600;
              color: ${G};
              line-height: 1.3;
              text-decoration: none;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
              margin-bottom: 8px;
              min-height: 2.6em;
            }
            .rt-stars {
              display: flex;
              align-items: center;
              gap: 2px;
              margin-bottom: 10px;
            }
            .rt-stars svg { width: 10px; height: 10px; fill: ${A}; }
            .rt-review { font-size: 0.65rem; color: #999; margin-left: 5px; font-weight: 500; }
            .rt-foot {
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 8px;
              margin-top: auto;
              padding-top: 10px;
              border-top: 1px dashed rgba(26,60,46,0.08);
            }
            .rt-price-wrap { display: flex; align-items: baseline; flex-wrap: wrap; gap: 4px; }
            .rt-price { font-size: 1.05rem; font-weight: 700; color: ${G}; font-family: 'Playfair Display', serif; }
            .rt-mrp { font-size: 0.73rem; color: #aaa; text-decoration: line-through; font-weight: 500; }
            .rt-cart {
              font-size: 0.55rem;
              font-weight: 700;
              letter-spacing: 0.05em;
              text-transform: uppercase;
              background: ${WHITE};
              color: #fff;
              border: none;
              cursor: pointer;
              padding: 7px 10px;
              border-radius: 3px;
              white-space: nowrap;
              transition: all 0.3s ease;
            }
            .rt-cart:hover { background: ${G2}; transform: scale(1.05); }
          `}</style>
          <Container maxWidth="lg">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '4rem', padding: '0 1rem' }}>
              <h6 style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', color: A, marginBottom: '1rem', fontFamily: '"Playfair Display", serif' }}>You May Also Love</h6>
              <h2 style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 700,
                fontFamily: '"Playfair Display", serif',
                color: G,
                lineHeight: 1.1,
                letterSpacing: '-0.01em',
                marginBottom: '1rem'
              }}>
                Related{' '}
                <span style={{
                  background: 'linear-gradient(to right, #D4B28C, #B48253)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>Treasures</span>
              </h2>
              <p style={{ color: '#6b7280', maxWidth: '36rem', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Handpicked from the same botanical family — products your ritual deserves.
              </p>
            </div>
            <Grid container spacing={3}>
              {relatedProducts.length === 0 ? (
                [...Array(4)].map((_, i) => (
                  <Grid size={{ xs: 6, sm: 6, md: 3 }} key={i}>
                    <div className="skeleton-card" style={{ height: '100%', minHeight: '320px' }}>
                      {/* Image Area */}
                      <div className="skeleton-item" style={{ width: '100%', paddingBottom: '110%', borderRadius: '12px 12px 0 0' }} />
                      {/* Body Area */}
                      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '8px' }}>
                        {/* Category */}
                        <div className="skeleton-item" style={{ width: '40%', height: '8px' }} />
                        {/* Name */}
                        <div className="skeleton-item" style={{ width: '90%', height: '12px' }} />
                        <div className="skeleton-item" style={{ width: '60%', height: '12px', marginBottom: '4px' }} />
                        {/* Stars */}
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {[...Array(5)].map((_, starIdx) => (
                            <div key={starIdx} className="skeleton-item" style={{ width: '8px', height: '8px', borderRadius: '50%' }} />
                          ))}
                        </div>
                        {/* Divider */}
                        <div style={{ height: '1px', background: 'rgba(26,60,46,0.08)', margin: '6px 0 2px' }} />
                        {/* Footer (Price & Button) */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                          <div className="skeleton-item" style={{ width: '45px', height: '14px' }} />
                          <div className="skeleton-item" style={{ width: '65px', height: '22px', borderRadius: '30px' }} />
                        </div>
                      </div>
                    </div>
                  </Grid>
                ))
              ) : (
                relatedProducts.map((item) => {
                  const itemFavorited = favorites.includes(item.id);
                  const itemPrice = item.variants?.[0]?.price || item.price;
                  const itemMrp = item.variants?.[0]?.mrp || item.mrp;
                  return (
                    <Grid size={{ xs: 6, sm: 6, md: 3 }} key={item.slug}>
                      <div className="rt-card" style={{ position: 'relative', zIndex: selectingPackFor === item.id ? 50 : 1 }}>
                        {/* Image area */}
                        <div
                          className="rt-img-wrap"
                          style={{ cursor: 'pointer' }}
                          onClick={() => window.location.href = `/product/${item.slug}`}
                        >
                          <img src={formatImg(item.image)} alt={item.name} loading="lazy" />
                          {item.tag && <span className="rt-badge">{item.tag}</span>}
                          {/* Favourite button */}
                          <button
                            className="rt-fav"
                            onClick={(e) => {
                              e.stopPropagation();
                              const token = localStorage.getItem('token');
                              if (!token) { window.dispatchEvent(new Event('open-login-modal')); return; }
                              setFavorites(prev => {
                                const faved = prev.includes(item.id);
                                const updated = faved ? prev.filter(id => id !== item.id) : [...prev, item.id];
                                localStorage.setItem('favoriteProducts', JSON.stringify(updated));
                                window.dispatchEvent(new Event('wishlist-updated'));
                                return updated;
                              });
                            }}
                            aria-label="Add to wishlist"
                          >
                            {itemFavorited ? (
                              <svg viewBox="0 0 24 24" fill="#e74c3c" stroke="#e74c3c" strokeWidth="2">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                              </svg>
                            ) : (
                              <svg viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                              </svg>
                            )}
                          </button>
                        </div>

                        {/* Card body */}
                        <div className="rt-body">
                          <span className="rt-cat">{item.category?.name || 'Botanical'}</span>
                          <Link to={`/product/${item.slug}`} className="rt-name">{item.name}</Link>
                          <div className="rt-stars">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                            ))}
                            <span className="rt-review">(32)</span>
                          </div>
                          <div className="rt-foot">
                            <div className="rt-price-wrap">
                              <span className="rt-price">₹{itemPrice?.toLocaleString('en-IN')}</span>
                              {itemMrp && <span className="rt-mrp">₹{itemMrp?.toLocaleString('en-IN')}</span>}
                            </div>
                            <button
                              className="rt-cart"
                              onClick={(e) => handleRelatedAddToCartClick(item, e)}
                            >
                              Add to Cart
                            </button>
                          </div>

                          {selectingPackFor === item.id && (
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
                            }} onClick={e => { e.preventDefault(); e.stopPropagation(); }}>
                              <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '1px' }}>Select Pack:</div>
                              {item.variants.map(v => (
                                <button
                                  key={v.id}
                                  onClick={(e) => handleRelatedPackSelect(item, v.id, e)}
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
                    </Grid>
                  );
                })
              )}
            </Grid>
          </Container>
        </Box>
      </Box>

      {/* Add Review Modal */}
      {addReviewOpen && (
        <Box sx={{ position: 'fixed', inset: 0, zIndex: 5000, bgcolor: WHITE, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid #f0f0f0`, position: 'sticky', top: 0, bgcolor: WHITE }}>
            <Typography sx={{ fontSize: '0.7rem', color: '#666', textTransform: 'uppercase', letterSpacing: 1 }}>Share Your Ritual Story</Typography>
            <button onClick={() => setAddReviewOpen(false)} style={{ fontSize: '1.5rem', border: 'none', background: 'none', cursor: 'pointer' }}>×</button>
          </Box>
          <Box sx={{ flex: 1, py: 6 }}>
            <Container maxWidth="sm">
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <CustomChip>Community</CustomChip>
                <Typography sx={{ fontFamily: F.display, fontWeight: 700, fontSize: '2rem', color: G, mt: 2 }}>Share Your Story</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#666', mb: 1 }}>Rating</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button key={s} onClick={() => setReviewForm(prev => ({ ...prev, rating: s }))} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <svg viewBox="0 0 24 24" width={28} height={28} fill={s <= reviewForm.rating ? A : 'none'} stroke={A} strokeWidth="1.5">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      </button>
                    ))}
                  </Box>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#666', mb: 1 }}>Your Name</Typography>
                  <input value={reviewForm.name} onChange={(e) => setReviewForm(prev => ({ ...prev, name: e.target.value }))} placeholder="Enter your name" style={{ width: '100%', padding: '12px 16px', border: `1px solid #e0e0e0`, borderRadius: 8, fontFamily: F.sans }} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#666', mb: 1 }}>Your Review</Typography>
                  <textarea value={reviewForm.comment} onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))} placeholder="Tell us about your experience..." rows={5} style={{ width: '100%', padding: '12px 16px', border: `1px solid #e0e0e0`, borderRadius: 8, fontFamily: F.sans, resize: 'none' }} />
                </Box>
                <button onClick={handleSubmitReview} disabled={submittingReview} style={{ padding: '14px', background: G, color: WHITE, border: 'none', borderRadius: 8, fontWeight: 700, cursor: submittingReview ? 'not-allowed' : 'pointer' }}>
                  {submittingReview ? 'Sharing...' : 'Submit Story'}
                </button>
              </Box>
            </Container>
          </Box>
        </Box>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <Box sx={{ position: 'fixed', inset: 0, zIndex: 3000, bgcolor: WHITE, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid #f0f0f0` }}>
            <Typography sx={{ fontSize: '0.7rem', color: '#666' }}>{activeImg + 1} / {images.length}</Typography>
            <button onClick={() => setLightboxOpen(false)} style={{ fontSize: '1.5rem', border: 'none', background: 'none', cursor: 'pointer' }}>×</button>
          </Box>
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4, position: 'relative' }}>
            <button onClick={() => setActiveImg((activeImg - 1 + images.length) % images.length)} style={{ position: 'absolute', left: 20, width: 48, height: 48, borderRadius: '50%', border: `1px solid #e0e0e0`, background: WHITE, cursor: 'pointer' }}>‹</button>
            <button onClick={() => setActiveImg((activeImg + 1) % images.length)} style={{ position: 'absolute', right: 20, width: 48, height: 48, borderRadius: '50%', border: `1px solid #e0e0e0`, background: WHITE, cursor: 'pointer' }}>›</button>
            <img src={images[activeImg]} alt="" style={{ maxWidth: '90%', maxHeight: '80vh', objectFit: 'contain' }} />
          </Box>
        </Box>
      )}

      {/* Sticky Bar */}
      <Box sx={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        bgcolor: WHITE, borderTop: `1px solid #f0f0f0`,
        zIndex: 1200, transform: showSticky ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.3s',
      }}>
        <Container maxWidth="lg" sx={{ py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: 48, height: 48, bgcolor: SAGE, borderRadius: 2, p: 1 }}>
              <img src={images[activeImg]} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: BLACK }}>{product.name.length > 30 ? product.name.slice(0, 30) + '...' : product.name}</Typography>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: G }}>₹{pkg.price?.toLocaleString('en-IN')}</Typography>
            </Box>
          </Box>
          <CustomButton onClick={handleAddToCart} variant={added ? 'outline' : 'primary'}>
            {added ? 'Added' : 'Add to Cart'}
          </CustomButton>
        </Container>
      </Box>

      {/* Snackbar */}
      <Snackbar open={reviewSnackbar.open} autoHideDuration={6000} onClose={() => setReviewSnackbar(prev => ({ ...prev, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setReviewSnackbar(prev => ({ ...prev, open: false }))} severity={reviewSnackbar.severity} sx={{ width: '100%' }}>
          {reviewSnackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProductDetail;