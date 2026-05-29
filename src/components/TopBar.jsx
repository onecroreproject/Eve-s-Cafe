// TopBar.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Typography, Fade, IconButton } from '@mui/material';
import { KeyboardArrowDown as ArrowDownIcon, Close as CloseIcon } from '@mui/icons-material';
import api from '../api/config';

const TopBar = ({ showTopBar, setShowTopBar }) => {
    const [messages, setMessages] = useState([]);
    const [topBarIndex, setTopBarIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await api.get('/top-bar-messages');
                if (res.data.success && res.data.data.length > 0) {
                    setMessages(res.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch top bar messages:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMessages();
    }, []);

    useEffect(() => {
        if (messages.length === 0) return;
        const timer = setInterval(() => {
            setTopBarIndex((prev) => (prev + 1) % messages.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [messages]);

    if (!showTopBar || messages.length === 0) return null;

    return (
        <Box
            sx={{
                bgcolor: '#FBF1D5',
                py: 1,
                px: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                zIndex: 1200,
                borderBottom: '1px solid rgba(0,0,0,0.05)'
            }}
        >
            <Container maxWidth="xl" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', px: { xs: 1, sm: 2, md: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0, sm: 2 } }}>
                    <IconButton
                        size="small"
                        onClick={() => setTopBarIndex((prev) => (prev - 1 + messages.length) % messages.length)}
                        sx={{ color: '#C2A161', display: { xs: 'none', sm: 'flex' } }}
                    >
                        <ArrowDownIcon sx={{ transform: 'rotate(90deg)', fontSize: 16 }} />
                    </IconButton>

                    <Fade key={topBarIndex} in={true} timeout={500}>
                        <Typography
                            variant="body2"
                            sx={{
                                fontSize: { xs: '0.65rem', sm: '0.8rem' },
                                color: '#8B6B3A',
                                fontWeight: 700,
                                textAlign: 'center',
                                minWidth: { xs: '70vw', sm: 400 },
                                letterSpacing: 0.5,
                                px: 2
                            }}
                        >
                            {messages[topBarIndex]?.text}
                            {messages[topBarIndex]?.link_text && (
                                <Link
                                    to={messages[topBarIndex]?.path || '/'}
                                    style={{ color: '#8B6B3A', fontWeight: 900, textDecoration: 'underline', marginLeft: '5px' }}
                                >
                                    {messages[topBarIndex]?.link_text}
                                </Link>
                            )}
                        </Typography>
                    </Fade>

                    <IconButton
                        size="small"
                        onClick={() => setTopBarIndex((prev) => (prev + 1) % messages.length)}
                        sx={{ color: '#C2A161', display: { xs: 'none', sm: 'flex' } }}
                    >
                        <ArrowDownIcon sx={{ transform: 'rotate(-90deg)', fontSize: 16 }} />
                    </IconButton>
                </Box>

                <IconButton
                    size="small"
                    onClick={() => setShowTopBar(false)}
                    sx={{ position: 'absolute', right: { xs: -8, sm: 0 }, color: '#8B6B3A', opacity: 0.7, '&:hover': { opacity: 1 } }}
                >
                    <CloseIcon sx={{ fontSize: 14 }} />
                </IconButton>
            </Container>
        </Box>
    );
};

export default TopBar;
