import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Stack,
  Chip,
  Paper,
  Button,
  CircularProgress
} from '@mui/material';
import {
  PlayCircleOutlined as PlayIcon,
  YouTube as YouTubeIcon
} from '@mui/icons-material';

import StoryPlayer from '../components/StoryPlayer';
import api, { IMAGE_BASE_URL } from '../api/config';
import logo from '../assets/logo/logo.png';

// Design Tokens (Matching other pages)
const G = '#1A3C2E';   // Dark Green
const G2 = '#0f2419';  // Darker Green
const A = '#B48253';   // Gold Accent
const SAGE = '#F4F5F2'; // Light background
const BLACK = '#000000';
const WHITE = '#ffffff';

const FONT_SERIF = '"Playfair Display", serif';
const FONT_SANS = '"Playfair Display", serif';

const Videos = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(null);
  const [storyOpen, setStoryOpen] = useState(false);
  const [videos, setVideos] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
  }, [activeCategory]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [videosRes, catsRes] = await Promise.all([
        api.get(`/videos?category=${activeCategory}`),
        api.get('/video-categories')
      ]);

      if (videosRes.data.status === 'success') {
        const mappedVideos = videosRes.data.data.map(v => ({
          ...v,
          category: v.category?.name || 'Uncategorized',
          url: v.video_url,
          thumbnail: v.thumbnail ? `${IMAGE_BASE_URL}${v.thumbnail}` : null
        }));
        setVideos(mappedVideos);
      }

      if (catsRes.data.status === 'success') {
        setCategories(['All', ...catsRes.data.data]);
      }
    } catch (error) {
      console.error("Error fetching video data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenStory = (index) => {
    setSelectedVideoIndex(index);
    setStoryOpen(true);
  };

  return (
    <Box sx={{ bgcolor: WHITE, minHeight: '100vh', fontFamily: FONT_SANS }}>

      {/* ── Hero Section (Enhanced without bg image) ── */}
      <Box sx={{ 
        background: `linear-gradient(135deg, ${G} 0%, ${G2} 100%)`,
        pt: { xs: 6, md: 10 }, 
        pb: { xs: 6, md: 10 }, 
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative elements */}
        <Box sx={{
          position: 'absolute',
          top: -40,
          right: -40,
          width: 300,
          height: 300,
          background: `radial-gradient(circle, rgba(180,130,83,0.15) 0%, transparent 70%)`,
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />
        <Box sx={{
          position: 'absolute',
          bottom: -40,
          left: -40,
          width: 250,
          height: 250,
          background: `radial-gradient(circle, rgba(180,130,83,0.1) 0%, transparent 70%)`,
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Stack spacing={{ xs: 2, md: 3 }} sx={{ alignItems: 'center', textAlign: 'center' }}>
            {/* Badge */}
            <Box sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              padding: '6px 16px',
              borderRadius: '40px',
              mb: 1
            }}>
              <Box sx={{ width: 8, height: 8, background: A, borderRadius: '50%', animation: 'pulse 2s infinite' }} />
              <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: { xs: '0.65rem', md: '0.7rem' } }}>
                Visual Rituals
              </Typography>
            </Box>
            
            <Typography variant="h1" sx={{ 
              fontFamily: FONT_SERIF, 
              fontWeight: 600, 
              color: WHITE, 
              fontSize: { xs: '2.5rem', md: 'clamp(2.5rem, 5vw, 4.8rem)' }, 
              lineHeight: 1.1 
            }}>
              Botanical <span style={{ color: A, fontStyle: 'italic', fontWeight: 400, marginLeft: '0.2em', display: 'inline-block' }}>Journeys</span>
            </Typography>
            
            <Typography sx={{ 
              color: 'rgba(255,255,255,0.8)', 
              maxWidth: 700, 
              fontSize: { xs: '0.9rem', md: '1.1rem' }, 
              lineHeight: 1.7 
            }}>
              Experience the art of botanical skincare through our curated video journeys and expert guides.
            </Typography>
          </Stack>
        </Container>
      </Box>

      {/* ── Filter Section (Enhanced) ── */}
      <Container maxWidth="lg" sx={{ mt: { xs: 4, md: 6 } }}>
        <Stack direction="row" spacing={1.5} justifyContent="center" sx={{ 
          overflowX: 'auto', 
          pb: 2,
          '&::-webkit-scrollbar': { height: 4 },
          '&::-webkit-scrollbar-track': { background: SAGE, borderRadius: 10 },
          '&::-webkit-scrollbar-thumb': { background: G, borderRadius: 10 }
        }}>
          {categories.map(cat => (
            <Chip
              key={cat}
              label={cat}
              onClick={() => setActiveCategory(cat)}
              sx={{
                px: { xs: 1.5, md: 2 },
                py: { xs: 2, md: 2.5 },
                fontSize: { xs: '0.7rem', md: '0.75rem' },
                fontWeight: 700,
                bgcolor: activeCategory === cat ? G : 'transparent',
                color: activeCategory === cat ? WHITE : '#666',
                border: activeCategory === cat ? `1px solid ${G}` : `1px solid #e0e0e0`,
                borderRadius: '40px',
                transition: 'all 0.3s ease',
                '&:hover': { 
                  bgcolor: activeCategory === cat ? G : SAGE,
                  transform: 'translateY(-2px)'
                }
              }}
            />
          ))}
        </Stack>
      </Container>

      {/* ── Video Grid ── */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress sx={{ color: G }} />
          </Box>
        ) : videos.length > 0 ? (
          <Grid container spacing={{ xs: 4, md: 6 }}>
            {videos.map((video, idx) => (
              <Grid item xs={12} key={video.id}>
                <Paper
                  elevation={0}
                  onClick={() => handleOpenStory(idx)}
                  sx={{
                    borderRadius: { xs: '16px', md: '20px' },
                    overflow: 'hidden',
                    width: '100%',
                    bgcolor: WHITE,
                    cursor: 'pointer',
                    border: `1px solid #f0f0f0`,
                    transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(26,60,46,0.12)',
                      borderColor: 'transparent'
                    }
                  }}
                >
                  {/* Thumbnail Section */}
                  <Box sx={{
                    position: 'relative',
                    width: { xs: '100%', md: '45%' },
                    aspectRatio: { xs: '16/9', md: 'unset' },
                    overflow: 'hidden',
                    bgcolor: SAGE
                  }}>
                    {video.thumbnail ? (
                      <Box
                        component="img"
                        src={video.thumbnail}
                        alt={video.title}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)',
                          '&:hover': { transform: 'scale(1.08)' }
                        }}
                      />
                    ) : (
                      <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: SAGE }}>
                        <PlayIcon sx={{ fontSize: 60, color: G, opacity: 0.3 }} />
                      </Box>
                    )}

                    {/* Play Button Overlay */}
                    <Box sx={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'rgba(0,0,0,0.3)',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                      '&:hover': { opacity: 1 }
                    }}>
                      <Box sx={{
                        bgcolor: WHITE,
                        borderRadius: '50%',
                        p: 2,
                        display: 'flex',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                        transition: 'transform 0.3s ease',
                        '&:hover': { transform: 'scale(1.1)' }
                      }}>
                        <PlayIcon sx={{ color: G, fontSize: 40 }} />
                      </Box>
                    </Box>

                    {/* Duration Badge */}
                    <Box sx={{
                      position: 'absolute',
                      bottom: 16,
                      right: 16,
                      bgcolor: 'rgba(0,0,0,0.8)',
                      color: WHITE,
                      px: 1.5,
                      py: 0.6,
                      borderRadius: '8px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      letterSpacing: 1,
                      backdropFilter: 'blur(10px)'
                    }}>
                      {video.duration || 'WATCH'}
                    </Box>
                  </Box>

                  {/* Content Section */}
                  <Box sx={{
                    p: { xs: 3, md: 5 },
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-start'
                  }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: A, animation: 'pulse 2s infinite' }} />
                      <Typography sx={{ 
                        fontSize: { xs: '0.6rem', md: '0.65rem' }, 
                        fontWeight: 700, 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.2em', 
                        color: A 
                      }}>
                        {video.category}
                      </Typography>
                    </Stack>
                    
                    <Typography sx={{
                      fontFamily: FONT_SERIF,
                      fontWeight: 700,
                      mb: 2,
                      fontSize: { xs: '1.3rem', sm: '1.6rem', md: '2rem' },
                      color: G,
                      lineHeight: 1.3
                    }}>
                      {video.title}
                    </Typography>

                    <Typography sx={{
                      color: '#666',
                      fontSize: { xs: '0.85rem', md: '0.95rem' },
                      lineHeight: 1.7,
                      mb: 3,
                      maxWidth: '500px'
                    }}>
                      {video.description || "Immerse yourself in our botanical ritual guides and ancient skincare wisdom."}
                    </Typography>

                    <Button
                      variant="text"
                      sx={{
                        color: G,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.15em',
                        fontSize: { xs: '0.65rem', md: '0.7rem' },
                        p: 0,
                        '&:hover': { 
                          bgcolor: 'transparent', 
                          color: A, 
                          transform: 'translateX(5px)' 
                        },
                        transition: 'all 0.3s ease'
                      }}
                      endIcon={<Box component="span" sx={{ ml: 1 }}>→</Box>}
                    >
                      Begin Ritual
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Typography sx={{ color: '#999', fontStyle: 'italic', fontSize: '1rem' }}>
              No visual rituals found in this category yet.
            </Typography>
          </Box>
        )}
      </Container>

      {/* ── Story Player Modal ── */}
      {videos.length > 0 && selectedVideoIndex !== null && (
        <StoryPlayer
          open={storyOpen}
          onClose={() => setStoryOpen(false)}
          stories={videos}
          initialIndex={selectedVideoIndex}
        />
      )}

      {/* ── Bottom CTA Section (Enhanced) ── */}
      <Box sx={{ 
        background: `linear-gradient(135deg, ${G} 0%, ${G2} 100%)`, 
        py: { xs: 8, md: 12 }, 
        color: WHITE, 
        textAlign: 'center', 
        position: 'relative', 
        overflow: 'hidden' 
      }}>
        {/* Decorative elements */}
        <Box sx={{
          position: 'absolute',
          top: -50,
          left: -50,
          width: 300,
          height: 300,
          background: `radial-gradient(circle, rgba(180,130,83,0.1) 0%, transparent 70%)`,
          borderRadius: '50%'
        }} />
        <Box sx={{
          position: 'absolute',
          bottom: -50,
          right: -50,
          width: 250,
          height: 250,
          background: `radial-gradient(circle, rgba(180,130,83,0.08) 0%, transparent 70%)`,
          borderRadius: '50%'
        }} />
        
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{
            width: 80,
            height: 80,
            mx: 'auto',
            mb: 3,
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <YouTubeIcon sx={{ fontSize: 45, color: '#FF0000' }} />
          </Box>
          
          <Typography variant="h2" sx={{ 
            fontFamily: FONT_SERIF, 
            mb: 2, 
            fontWeight: 700,
            fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' }
          }}>
            Botanical Community
          </Typography>
          
          <Typography sx={{ 
            opacity: 0.8, 
            mb: 4, 
            maxWidth: 600, 
            mx: 'auto', 
            fontSize: { xs: '0.9rem', md: '1rem' }, 
            lineHeight: 1.7 
          }}>
            Join thousands of others in our weekly botanical wisdom sessions and apothecary rituals on YouTube.
          </Typography>
          
          <Button
            variant="contained"
            href="https://youtube.com"
            target="_blank"
            sx={{
              bgcolor: WHITE,
              color: G,
              fontWeight: 800,
              borderRadius: '50px',
              px: { xs: 4, md: 8 },
              py: { xs: 1.5, md: 2 },
              fontSize: { xs: '0.7rem', md: '0.75rem' },
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
              '&:hover': { 
                bgcolor: SAGE, 
                transform: 'translateY(-4px)',
                boxShadow: '0 20px 30px rgba(0,0,0,0.25)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Subscribe Now →
          </Button>
        </Container>
      </Box>

      {/* Add pulse animation keyframes */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.2); }
          }
        `}
      </style>
    </Box>
  );
};

export default Videos;