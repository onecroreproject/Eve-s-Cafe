import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api, { IMAGE_BASE_URL } from '../api/config';
import { Container, Typography, Box, Grid, IconButton, Skeleton } from '@mui/material';
import CustomButton from '../components/Button';
import { 
    DeleteOutlined as DeleteOutlineIcon, 
    ShoppingBagOutlined as ShoppingBagOutlinedIcon,
    Favorite as FavoriteIcon 
} from '@mui/icons-material';

const skeletonCss = `
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
    border: 1px solid #e4dfd4;
    border-radius: 12px;
    padding: 0;
  }
`;

const Wishlist = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('favoriteProducts');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        fetchWishlistItems();
    }, [favorites]);

    const fetchWishlistItems = async () => {
        if (favorites.length === 0) {
            setProducts([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await api.get(`/products?ids=${favorites.join(',')}`);
            if (response.data.success) {
                setProducts(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching wishlist:", error);
        } finally {
            setLoading(false);
        }
    };

    const removeFromWishlist = (id) => {
        const updatedFavorites = favorites.filter(favId => favId !== id);
        setFavorites(updatedFavorites);
        localStorage.setItem('favoriteProducts', JSON.stringify(updatedFavorites));
    };

    const formatImg = (path) => {
        if (!path || typeof path !== 'string') return 'https://placehold.co/400x400?text=Product';
        if (path.startsWith('http')) return path;
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        return `${IMAGE_BASE_URL}${cleanPath}`;
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 10 }}>
                <style>{skeletonCss}</style>
                <Typography variant="h4" sx={{ mb: 4, fontFamily: 'Playfair Display', fontWeight: 700, color: '#1A3C2E' }}>My Wishlist</Typography>
                <Grid container spacing={4}>
                    {[1, 2, 3].map((i) => (
                        <Grid item xs={12} sm={6} md={4} key={i}>
                            <div className="skeleton-card" style={{ height: '100%', minHeight: '400px' }}>
                                {/* Image Area */}
                                <div className="skeleton-item" style={{ width: '100%', height: '280px', borderRadius: '12px 12px 0 0' }} />
                                {/* Content Area */}
                                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1, gap: '12px' }}>
                                    {/* Category */}
                                    <div className="skeleton-item" style={{ width: '35%', height: '10px' }} />
                                    {/* Name */}
                                    <div className="skeleton-item" style={{ width: '85%', height: '14px' }} />
                                    <div className="skeleton-item" style={{ width: '55%', height: '14px', marginBottom: '6px' }} />
                                    {/* Price */}
                                    <div className="skeleton-item" style={{ width: '40%', height: '18px', marginBottom: '12px' }} />
                                    {/* Button */}
                                    <div className="skeleton-item" style={{ width: '100%', height: '38px', borderRadius: '8px' }} />
                                </div>
                            </div>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        );
    }

    return (
        <Box sx={{ bgcolor: '#FAFAF7', minHeight: '80vh', py: { xs: 6, md: 10 } }}>
            <Container maxWidth="lg">
                <Box sx={{ mb: 6, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <FavoriteIcon sx={{ color: '#BF211E', fontSize: 32 }} />
                    <Typography variant="h3" sx={{ 
                        fontFamily: 'Playfair Display', 
                        fontWeight: 800, 
                        color: '#1A3C2E' 
                    }}>
                        My Wishlist
                    </Typography>
                </Box>

                {products.length === 0 ? (
                    <Box sx={{ 
                        textAlign: 'center', 
                        py: 10, 
                        bgcolor: 'white', 
                        borderRadius: 8, 
                        border: '1px dashed #E4DFD4' 
                    }}>
                        <FavoriteIcon sx={{ fontSize: 64, color: '#E4DFD4', mb: 2 }} />
                        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>Your wishlist is empty</Typography>
                        <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
                            Add items that you love to your wishlist and they will appear here.
                        </Typography>
                        <div className="mt-8">
                            <CustomButton 
                                onClick={() => navigate('/shop')}
                                variant="primary"
                                icon="arrow-right"
                            >
                                Explore Collection
                            </CustomButton>
                        </div>
                    </Box>
                ) : (
                    <Grid container spacing={4}>
                        {products.map((product) => (
                            <Grid item xs={12} sm={6} md={4} key={product.id}>
                                <Box sx={{ 
                                    bgcolor: 'white', 
                                    borderRadius: 6, 
                                    overflow: 'hidden',
                                    border: '1px solid #E4DFD4',
                                    transition: 'all 0.3s ease',
                                    position: 'relative',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: '0 12px 30px rgba(0,0,0,0.08)'
                                    }
                                }}>
                                    {/* Image */}
                                    <Box 
                                        onClick={() => navigate(`/product/${product.slug}`)}
                                        sx={{ 
                                            height: 280, 
                                            bgcolor: '#F5F5F0', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            p: 4
                                        }}
                                    >
                                        <img 
                                            src={formatImg(product.image)} 
                                            alt={product.name}
                                            style={{ 
                                                maxWidth: '100%', 
                                                maxHeight: '100%', 
                                                objectFit: 'contain',
                                                mixBlendMode: 'multiply'
                                            }}
                                        />
                                    </Box>

                                    {/* Remove Button */}
                                    <IconButton 
                                        onClick={() => removeFromWishlist(product.id)}
                                        sx={{ 
                                            position: 'absolute', 
                                            top: 12, right: 12, 
                                            bgcolor: 'white',
                                            '&:hover': { bgcolor: '#FFF5F5', color: '#BF211E' }
                                        }}
                                    >
                                        <DeleteOutlineIcon fontSize="small" />
                                    </IconButton>

                                    {/* Content */}
                                    <Box sx={{ p: 3 }}>
                                        <Typography sx={{ 
                                            fontSize: 12, 
                                            color: '#A8862E', 
                                            fontWeight: 700, 
                                            textTransform: 'uppercase',
                                            letterSpacing: 1,
                                            mb: 0.5
                                        }}>
                                            {product.category?.name}
                                        </Typography>
                                        <Typography variant="h6" sx={{ 
                                            fontWeight: 700, 
                                            mb: 1,
                                            fontFamily: 'Playfair Display',
                                            cursor: 'pointer',
                                            '&:hover': { color: '#5C6B2E' }
                                        }} onClick={() => navigate(`/product/${product.slug}`)}>
                                            {product.name}
                                        </Typography>
                                        <Typography variant="h6" sx={{ color: '#1A3C2E', fontWeight: 800, mb: 2 }}>
                                            Rs. {product.price}
                                        </Typography>
                                        
                                        <CustomButton 
                                            fullWidth
                                            variant="outline"
                                            onClick={() => navigate(`/product/${product.slug}`)}
                                        >
                                            View Details
                                        </CustomButton>
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </Box>
    );
};

export default Wishlist;
