import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api, { IMAGE_BASE_URL } from '../api/config';
import { Container, Typography, Box, Grid, Button, IconButton, Skeleton } from '@mui/material';
import { 
    DeleteOutlined as DeleteOutlineIcon, 
    ShoppingBagOutlined as ShoppingBagOutlinedIcon,
    Favorite as FavoriteIcon 
} from '@mui/icons-material';

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
                <Typography variant="h4" sx={{ mb: 4, fontFamily: 'Playfair Display', fontWeight: 700 }}>My Wishlist</Typography>
                <Grid container spacing={3}>
                    {[1, 2, 3].map((i) => (
                        <Grid item xs={12} sm={6} md={4} key={i}>
                            <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 4 }} />
                            <Skeleton variant="text" sx={{ mt: 2 }} />
                            <Skeleton variant="text" width="60%" />
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
                        <Button 
                            variant="contained" 
                            onClick={() => navigate('/shop')}
                            sx={{ 
                                bgcolor: '#1A3C2E', 
                                px: 4, py: 1.5, 
                                borderRadius: 50,
                                '&:hover': { bgcolor: '#064E3B' }
                            }}
                        >
                            Explore Collection
                        </Button>
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
                                        
                                        <Button 
                                            fullWidth
                                            variant="outlined"
                                            startIcon={<ShoppingBagOutlinedIcon />}
                                            onClick={() => navigate(`/product/${product.slug}`)}
                                            sx={{ 
                                                borderColor: '#1A3C2E', 
                                                color: '#1A3C2E',
                                                borderRadius: 2,
                                                py: 1,
                                                '&:hover': { bgcolor: '#1A3C2E', color: 'white' }
                                            }}
                                        >
                                            View Details
                                        </Button>
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
