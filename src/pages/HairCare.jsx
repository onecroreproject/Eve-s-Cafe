import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  Card,
  CardMedia,
  CardContent,
  Chip,
  IconButton,
} from '@mui/material';
import CustomButton from '../components/Button';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ShoppingBagOutlined as CartIcon,
  ChevronRight,
  FiberManualRecord
} from '@mui/icons-material';
import { allProducts } from '../data/products';
import banner1 from '../assets/banner/banner1.jpg';
import banner3 from '../assets/banner/banner3.jpg';

const GREEN = '#1E4632';
const GREEN_LIGHT = '#F1F8E9';
const ACCENT = '#8B5A2B';

const HairCare = () => {
  const navigate = useNavigate();
  
  // Filter products by category
  const hairProducts = allProducts.filter(p => p.category === 'Hair Care');

  // Favorite/Wishlist state
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favoriteProducts');
    return saved ? JSON.parse(saved) : [];
  });

  // Toast notification state
  const [toast, setToast] = useState({ show: false, message: '' });

  // Sync favorites with other components
  useEffect(() => {
    const handleStorage = () => {
      const saved = localStorage.getItem('favoriteProducts');
      setFavorites(saved ? JSON.parse(saved) : []);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const toggleFavorite = (productId, productName, e) => {
    e.preventDefault();
    e.stopPropagation();
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
      return updated;
    });
  };

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 2000);
  };

  const isFavorited = (productId) => favorites.includes(productId);

  return (
    <Box sx={{ bgcolor: 'white', minHeight: '100vh', pt: { xs: 8, md: 10 } }}>
      <style>{`
        .toast {
          position: fixed;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%) translateY(100px);
          background: ${GREEN};
          color: white;
          padding: 12px 24px;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 500;
          z-index: 1000;
          opacity: 0;
          transition: all 0.3s ease;
          pointer-events: none;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .toast.show {
          transform: translateX(-50%) translateY(0);
          opacity: 1;
        }
      `}</style>

      {/* ── Hero Section ─────────────────────────────── */}
      <Box sx={{
        position: 'relative',
        height: { xs: 400, md: 550 },
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        mb: 8
      }}>
        {/* Background Overlay */}
        <Box sx={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Box component="img" src={banner1} alt="Hair Care Background" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(255,255,255,0.9) 30%, rgba(255,255,255,0.2) 100%)' }} />
        </Box>

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ maxWidth: 600 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{ height: 1, width: 40, bgcolor: ACCENT }} />
              <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: '.2em', color: ACCENT }}>Premium Rituals</Typography>
            </Box>
            <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '4.5rem' }, fontWeight: 300, color: GREEN, lineHeight: 1.1, mb: 3, fontFamily: "'Playfair Display', serif" }}>
              Hair Care <br /><Box component="span" sx={{ fontWeight: 700 }}>Apothecary</Box>
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 5, fontSize: '1.1rem', lineHeight: 1.8 }}>
              Harnessing the power of cold-pressed botanicals and ancient ayurvedic oils to restore your hair's natural vitality and crown-like luster.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <CustomButton to="/shop/hair-care" variant="primary">
                Explore Collection
              </CustomButton>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ── Featured Products ────────────────────────── */}
      <Box sx={{ bgcolor: '#F9FBF6', py: 8 }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 6 }}>
            <Box>
              <Typography variant="overline" sx={{ fontWeight: 700, color: ACCENT, letterSpacing: '.1em' }}>Artisan Crafted</Typography>
              <Typography variant="h3" sx={{ color: GREEN, fontWeight: 700 }}>Hair Care Essentials</Typography>
            </Box>
            <Button onClick={() => navigate('/shop/hair-care')} endIcon={<ChevronRight />} sx={{ color: GREEN, fontWeight: 700 }}>View All</Button>
          </Box>

          <Grid container spacing={4}>
            {hairProducts.map((prod) => (
              <Grid item xs={12} sm={6} lg={3} key={prod.id}>
                <Card 
                  component={Link}
                  to={`/product/${prod.id}`}
                  elevation={0} 
                  sx={{ 
                    bgcolor: 'transparent', 
                    borderRadius: 0, 
                    textDecoration: 'none',
                    display: 'block',
                    position: 'relative',
                    '&:hover .product-img': { transform: 'scale(1.1)' },
                    '&:hover .product-card-container': { boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }
                  }}
                >
                  <Box className="product-card-container" sx={{ position: 'relative', overflow: 'hidden', height: 300, transition: 'all .3s', bgcolor: '#F4F5F2' }}>
                    <CardMedia
                      component="img"
                      image={prod.image}
                      alt={prod.name}
                      className="product-img"
                      sx={{ height: '100%', objectFit: 'contain', p: 4, mixBlendMode: 'multiply', transition: 'transform .8s cubic-bezier(0.4, 0, 0.2, 1)' }}
                    />
                    
                    {/* Favorite Button */}
                    <IconButton
                      onClick={(e) => toggleFavorite(prod.id, prod.name, e)}
                      sx={{
                        position: 'absolute',
                        top: 15,
                        right: 15,
                        zIndex: 10,
                        bgcolor: 'white',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        '&:hover': { bgcolor: 'white', transform: 'scale(1.1)' }
                      }}
                    >
                      {isFavorited(prod.id) ? (
                        <FavoriteIcon sx={{ color: '#e74c3c', fontSize: 20 }} />
                      ) : (
                        <FavoriteBorderIcon sx={{ color: '#777', fontSize: 20 }} />
                      )}
                    </IconButton>

                    {prod.tag && (
                      <Chip label={prod.tag} size="small" sx={{ position: 'absolute', top: 20, left: 20, bgcolor: 'rgba(255,255,255,0.9)', color: GREEN, fontWeight: 700, borderRadius: 1, fontSize: '0.65rem' }} />
                    )}
                  </Box>
                  <CardContent sx={{ px: 0, pt: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: GREEN, mb: 0.5, minHeight: '3em', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{prod.name}</Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} viewBox="0 0 24 24" width="12" height="12" fill={ACCENT} style={{ opacity: 0.8 }}>
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                      <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', ml: 0.5 }}>({prod.reviewCount || 15})</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                      <Typography variant="body1" sx={{ color: '#1A1A14', fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>{prod.price}</Typography>
                      {prod.mrp && (
                        <Typography variant="body2" sx={{ color: 'text.secondary', textDecoration: 'line-through', fontSize: '0.8rem' }}>{prod.mrp}</Typography>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── Botanical Benefits ──────────────────────── */}
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Grid container spacing={8} alignItems="center">
          <Grid item xs={12} lg={6}>
            <Box sx={{ position: 'relative' }}>
              <Box component="img" src={banner3} sx={{ width: '100%', height: 600, objectFit: 'cover', borderRadius: '100px 0 100px 0' }} />
              <Box sx={{ position: 'absolute', bottom: -40, right: -40, bgcolor: GREEN, p: 5, color: 'white', maxWidth: 300, display: { xs: 'none', md: 'block' } }}>
                <Typography variant="h2" sx={{ fontSize: '4rem', fontWeight: 300, mb: 1 }}>03</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Steps to Lustre</Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>Our patented extraction method preserves 98% of botanical nutrients.</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Typography variant="h3" sx={{ color: GREEN, fontWeight: 700, mb: 4, fontSize: { xs: '1.5rem', md: '2rem' } }}>The Eve's Cafe <br /> Hair Philosophy</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[
                { title: "No Harsh Sulfates", desc: "Cleanse without stripping your hair's natural defensive oils." },
                { title: "Ayurvedic Wisdom", desc: "Formulated using the Sarivasava and Neelibringadi traditions." },
                { title: "Micro-Batch Freshness", desc: "Every bottle is dated and shipped within 14 days of creation." }
              ].map((benefit, idx) => (
                <Box key={idx} sx={{ display: 'flex', gap: 3 }}>
                  <FiberManualRecord sx={{ color: ACCENT, fontSize: 14, mt: 1 }} />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: GREEN }}>{benefit.title}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>{benefit.desc}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
            <Box sx={{ mt: 6 }}>
              <CustomButton to="/about" variant="outline">
                Read Our Science
              </CustomButton>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Toast Notification */}
      <div className={`toast ${toast.show ? 'show' : ''}`}>
        {toast.message}
      </div>
    </Box>
  );
};

export default HairCare;

