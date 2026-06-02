import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api, { IMAGE_BASE_URL } from '../api/config';
import { 
  Container, 
  Typography, 
  Box, 
  Stack, 
  Button, 
  Breadcrumbs, 
  Divider,
  Paper,
  Avatar,
  Grid,
  CircularProgress,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';

// Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/PersonOutlined';
import TimeIcon from '@mui/icons-material/AccessTime';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

// Design Tokens
const BOTANICAL_DARK = '#1A2406';
const BOTANICAL_PRIMARY = '#556B2F';
const BOTANICAL_ACCENT = '#8F9779';
const BOTANICAL_SOFT = '#F9FAF5';
const CREAM = '#FDFEFA';
const GOLD = '#A8862E';

const FONT_SERIF = '"Playfair Display", serif';
const FONT_SANS = '"Playfair Display", serif';

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/blogs/${slug}`);
        setPost(response.data.post);
        setRelatedPosts(response.data.related);
        window.scrollTo(0, 0);
      } catch (error) {
        console.error("Error fetching blog detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: BOTANICAL_SOFT }}>
        <CircularProgress sx={{ color: BOTANICAL_PRIMARY }} />
      </Box>
    );
  }

  if (!post) {
    return (
      <Container sx={{ py: 20, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontFamily: FONT_SERIF, mb: 4 }}>Ritual Not Found</Typography>
        <Button component={Link} to="/blog" variant="outlined" color="inherit">Back to Journal</Button>
      </Container>
    );
  }

  const imageUrl = post.image ? (post.image.startsWith('http') ? post.image : `${IMAGE_BASE_URL}${post.image}`) : 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80';

  return (
    <Box sx={{ bgcolor: BOTANICAL_SOFT, minHeight: '100vh', pb: 8 }}>
      
      {/* ── 1. Hero Section ── */}
      <Box sx={{ position: 'relative', height: { xs: '45vh', md: '70vh' }, width: '100%', overflow: 'hidden' }}>
        <Box 
          component="img"
          src={imageUrl}
          alt={post.title}
          sx={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.9)' }}
        />
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.4) 100%)' }} />
        
        {/* Navigation Over Hero */}
        <Container maxWidth="xl" sx={{ position: 'absolute', top: { xs: 80, md: 100 }, left: '50%', transform: 'translateX(-50%)', zIndex: 100 }}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Button 
              onClick={() => navigate('/blog')}
              startIcon={<ArrowBackIcon />}
              sx={{ 
                color: 'white', 
                textTransform: 'none', 
                fontWeight: 700, 
                bgcolor: 'rgba(26, 36, 6, 0.6)', 
                backdropFilter: 'blur(12px)', 
                px: 3, 
                py: 1,
                borderRadius: 10,
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                '&:hover': { bgcolor: BOTANICAL_PRIMARY }
              }}
            >
              Back to Journal
            </Button>
            <IconButton sx={{ bgcolor: 'rgba(255,255,255,0.25)', color: 'white', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)' }}>
              <BookmarkBorderIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Container>
      </Box>

      {/* ── 2. Title Card ── */}
      <Container maxWidth="xl" sx={{ mt: -8, position: 'relative', zIndex: 20, px: 2 }}>
        <Paper 
          elevation={10}
          sx={{ 
            p: { xs: 3, md: 6 }, 
            borderRadius: { xs: 3, md: 5 }, 
            bgcolor: 'white',
            textAlign: 'center',
            boxShadow: '0 30px 60px rgba(26, 36, 6, 0.08)',
            maxWidth: 1200,
            mx: 'auto'
          }}
        >
          <Typography 
            variant="overline" 
            sx={{ color: GOLD, fontWeight: 800, letterSpacing: 3, mb: 1, display: 'block', fontSize: '0.65rem' }}
          >
            {post.category}
          </Typography>
          
          <Typography 
            variant="h1" 
            sx={{ 
              fontFamily: FONT_SERIF, 
              fontWeight: 700, 
              lineHeight: 1.2,
              mb: 3,
              fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3.5rem' },
              color: BOTANICAL_DARK
            }}
          >
            {post.title}
          </Typography>

          <Stack 
            direction="row" 
            spacing={{ xs: 2, md: 4 }} 
            sx={{ justifyContent: 'center', color: '#666', fontSize: { xs: '0.75rem', md: '0.9rem' }, flexWrap: 'wrap', gap: 2 }}
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <CalendarIcon sx={{ fontSize: 16, color: BOTANICAL_PRIMARY }} />
              <Typography sx={{ fontWeight: 600 }}>{new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</Typography>
            </Stack>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <PersonIcon sx={{ fontSize: 16, color: BOTANICAL_PRIMARY }} />
              <Typography sx={{ fontWeight: 600 }}>By {post.author}</Typography>
            </Stack>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <TimeIcon sx={{ fontSize: 16, color: BOTANICAL_PRIMARY }} />
              <Typography sx={{ fontWeight: 600 }}>{post.read_time || '5 min'}</Typography>
            </Stack>
          </Stack>
        </Paper>
      </Container>

      {/* ── 3. Main Content ── */}
      <Container maxWidth="xl" sx={{ mt: 6 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={12} sx={{ mx: 'auto' }}>
            <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontFamily: FONT_SANS, 
                  color: BOTANICAL_PRIMARY, 
                  mb: 4, 
                  lineHeight: 1.6,
                  fontWeight: 500,
                  fontSize: { xs: '1.1rem', md: '1.3rem' },
                  borderLeft: `4px solid ${GOLD}`,
                  pl: 3
                }}
              >
                {post.excerpt}
              </Typography>

              <Box 
                className="article-content"
                sx={{ 
                  fontFamily: FONT_SANS,
                  color: '#2D3436',
                  lineHeight: 1.8,
                  fontSize: { xs: '1.05rem', md: '1.15rem' },
                  '& p': { mb: 3 },
                  '& h3': { fontFamily: FONT_SERIF, fontWeight: 800, mt: 5, mb: 3, fontSize: { xs: '1.5rem', md: '2rem' }, color: BOTANICAL_DARK },
                  '& ul, & ol': { 
                    mb: 4, 
                    pl: 4, 
                    '& li': { mb: 1.5, pl: 1 } 
                  },
                  '& ul': { listStyleType: 'disc' },
                  '& ol': { listStyleType: 'decimal' },
                  '& img': { width: '100%', borderRadius: 3, my: 4, boxShadow: '0 10px 20px rgba(0,0,0,0.05)' },
                  '& em': { fontStyle: 'normal' },
                  '& blockquote': { 
                    borderLeft: `5px solid ${BOTANICAL_PRIMARY}`, 
                    pl: 4, py: 2, my: 4, 
                    fontStyle: 'normal', 
                    fontSize: '1.2rem',
                    color: BOTANICAL_PRIMARY,
                    bgcolor: 'rgba(85, 107, 47, 0.05)',
                    borderRadius: '0 1rem 1rem 0'
                  }
                }}
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Author Section */}
              <Box sx={{ mt: 8, pt: 6, borderTop: `1px solid ${BOTANICAL_ACCENT}` }}>
                <Grid container spacing={4} sx={{ alignItems: 'center' }}>
                  <Grid item xs={12} sm={3}>
                    <Avatar sx={{ width: 100, height: 100, mx: 'auto', border: `3px solid white`, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>{post.author[0]}</Avatar>
                  </Grid>
                  <Grid item xs={12} sm={9}>
                    <Typography variant="h5" sx={{ fontFamily: FONT_SERIF, fontWeight: 800, mb: 1 }}>{post.author}</Typography>
                    <Typography sx={{ color: '#666', fontSize: '0.95rem', lineHeight: 1.5 }}>
                      As EvesCafe's Lead Botanical Expert, {post.author} translates ancient Ayurvedic wisdom into modern beauty rituals.
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              {/* Share Section */}
              <Stack direction="row" spacing={2} sx={{ mt: 6, justifyContent: 'center', alignItems: 'center' }}>
                <Typography sx={{ fontWeight: 800, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 1 }}>Share:</Typography>
                <IconButton size="small" sx={{ color: BOTANICAL_PRIMARY }}><FacebookIcon fontSize="small" /></IconButton>
                <IconButton size="small" sx={{ color: BOTANICAL_PRIMARY }}><TwitterIcon fontSize="small" /></IconButton>
                <IconButton size="small" sx={{ color: BOTANICAL_PRIMARY }}><InstagramIcon fontSize="small" /></IconButton>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* ── 4. Related Rituals ── */}
      <Box sx={{ mt: 10, bgcolor: BOTANICAL_DARK, py: 8, color: 'white' }}>
        <Container maxWidth="lg">
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-end', mb: 6 }}>
            <Box>
              <Typography variant="h4" sx={{ fontFamily: FONT_SERIF, fontWeight: 700 }}>Related Rituals</Typography>
            </Box>
            <Button component={Link} to="/blog" sx={{ color: 'white', borderBottom: '1px solid white', borderRadius: 0, pb: 0.5, fontSize: '0.75rem' }}>View All</Button>
          </Stack>

          <Grid container spacing={4}>
            {relatedPosts.map(p => (
              <Grid item key={p.id} xs={12} md={6}>
                <Box 
                  onClick={() => navigate(`/blog/${p.slug}`)}
                  sx={{ cursor: 'pointer', borderRadius: 4, overflow: 'hidden', transition: 'all 0.3s ease', '&:hover img': { transform: 'scale(1.05)' } }}
                >
                  <Box sx={{ height: 280, width: '100%' }}>
                    <img src={p.image ? (p.image.startsWith('http') ? p.image : `${IMAGE_BASE_URL}${p.image}`) : ''} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} />
                  </Box>
                  <Box sx={{ p: 2 }}>
                    <Typography sx={{ color: GOLD, fontWeight: 800, fontSize: '0.6rem', letterSpacing: 2 }}>{p.category}</Typography>
                    <Typography variant="h6" sx={{ fontFamily: FONT_SERIF, fontWeight: 700, mt: 0.5 }}>{p.title}</Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default BlogDetail;
