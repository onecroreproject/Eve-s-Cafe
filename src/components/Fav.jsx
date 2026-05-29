// Fav.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IconButton, Badge, Tooltip } from '@mui/material';
import { FavoriteBorder as FavoriteBorderIcon } from '@mui/icons-material';

const GREEN = '#064E3B';

const Fav = () => {
    const [totalItems, setTotalItems] = useState(0);

    const updateCount = () => {
        const saved = localStorage.getItem('favoriteProducts');
        const ids = saved ? JSON.parse(saved) : [];
        setTotalItems(ids.length);
    };

    useEffect(() => {
        updateCount();

        // Listen for storage changes
        const handleStorage = () => {
            updateCount();
        };

        window.addEventListener('storage', handleStorage);
        // Custom event for same-window updates
        window.addEventListener('wishlist-updated', handleStorage);
        
        return () => {
            window.removeEventListener('storage', handleStorage);
            window.removeEventListener('wishlist-updated', handleStorage);
        };
    }, []);

    return (
        <Tooltip title="Wishlist">
            <IconButton
                component={Link}
                to="/wishlist"
                sx={{ color: 'text.primary', '&:hover': { color: GREEN } }}
            >
                <Badge
                    badgeContent={totalItems}
                    sx={{
                        '& .MuiBadge-badge': {
                            bgcolor: GREEN,
                            color: '#fff',
                            fontSize: '0.65rem',
                            minWidth: 18,
                            height: 18
                        }
                    }}
                >
                    <FavoriteBorderIcon sx={{ fontSize: 24 }} />
                </Badge>
            </IconButton>
        </Tooltip>
    );
};

export default Fav;
