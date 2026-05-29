import React from 'react';
import { Container, Typography, Box, Button, Grid } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link } from 'react-router-dom';
import heritageImg from '../assets/generated/botanical_heritage_ritual_1776410772203.png';

// Design Tokens
const OLIVE_DRAB = '#556B2F';
const BLACK = '#000000';
const FONT_SERIF = '"Playfair Display", serif';

const AboutHeritage = () => {
  return (
    <Box sx={{ pt: { xs: 4, md: 12 }, pb: { xs: 8, md: 12 }, bgcolor: 'white', overflow: 'hidden' }}>
      <Container sx={{ maxWidth: '1280px !important', px: { xs: 3, sm: 3, md: 3 } }}>
        <Grid container spacing={{ xs: 4, md: 8 }} sx={{ alignItems: 'center', flexWrap: 'nowrap' }}>
          
          {/* Image Side (Left) - ALWAYS 40% width */}
          <Grid item xs={5} sm={5} md={5} lg={4}>
            <Box sx={{ position: 'relative', maxWidth: '100%', mx: 'auto' }}>
              <Box
                sx={{
                  width: '100%',
                  height: { xs: 200, sm: 300, md: 450, lg: 500 },
                  borderRadius: { xs: '4px 20px 4px 20px', md: '4px 120px 4px 120px' },
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
                }}
              >
                <Box
                  component="img"
                  src={heritageImg}
                  alt="Botanical Heritage Ritual"
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <Box sx={{ position: 'absolute', inset: 0, bgcolor: `${OLIVE_DRAB}15`, mixBlendMode: 'multiply' }} />
              </Box>

              {/* Floating Badge */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: { xs: -5, md: -25 },
                  right: { xs: -5, md: -25 },
                  width: { xs: 40, sm: 80, md: 100, lg: 120 },
                  height: { xs: 40, sm: 80, md: 100, lg: 120 },
                  bgcolor: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  p: { xs: 0.5, md: 2 },
                  zIndex: 2,
                  border: `1px solid ${OLIVE_DRAB}20`
                }}
              >
                <Box
                  sx={{
                    width: '100%', height: '100%', borderRadius: '50%',
                    border: { xs: 'none', sm: `1px dashed ${OLIVE_DRAB}40` },
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center'
                  }}
                >
                  <Typography sx={{ color: OLIVE_DRAB, fontWeight: 900, fontSize: { xs: '0.35rem', sm: '0.8rem', md: '1rem' }, lineHeight: 1 }}>100%</Typography>
                  <Typography sx={{ color: BLACK, fontSize: { xs: '0.15rem', sm: '0.4rem', md: '0.45rem' }, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>Botanical</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Text Side (Right) - ALWAYS 60% width */}
          <Grid item xs={7} sm={7} md={7} lg={8}>
            <Box sx={{ p: { xs: 1, md: 3, lg: 4 }, textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Typography sx={{ color: OLIVE_DRAB, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: { xs: '0.5rem', sm: '0.7rem', md: '0.75rem' }, mb: { xs: 1, md: 2, lg: 3 } }}>
                Our Botanical Sanctuary — Est. 2018
              </Typography>
              <Typography variant="h2" sx={{ fontFamily: FONT_SERIF, fontWeight: 700, color: '#1A3C2E', mb: { xs: 1, md: 3, lg: 4 }, lineHeight: 1.1, fontSize: { xs: '1rem', sm: '1.8rem', md: '2.5rem', lg: '3rem' } }}>
                Ancient Wisdom, <br />
                <span className="text-gradient">Modern Luxury Rituals</span>
              </Typography>

              <Typography sx={{ color: '#444', fontSize: { xs: '0.7rem', sm: '0.9rem', md: '1rem', lg: '1.1rem' }, lineHeight: 1.6, mb: { xs: 2, md: 4, lg: 6 }, maxWidth: 600 }}>
                EvesCafe was born from a singular vision: to reconcile the raw purity of Ayurvedic traditions with the refined elegance of modern skincare. We craft every botanical formulation as a sacred ritual for your soul.
              </Typography>

              <Button
                component={Link}
                to="/about"
                variant="contained"
                endIcon={<ArrowForwardIcon sx={{ fontSize: { xs: '0.7rem', md: '1rem' } }} />}
                sx={{
                  bgcolor: BLACK, color: 'white',
                  borderRadius: 1.5, 
                  px: { xs: 1.5, sm: 3, md: 4, lg: 5 }, 
                  py: { xs: 0.5, sm: 1, md: 1.2, lg: 1.5 }, 
                  textTransform: 'none', 
                  fontWeight: 700,
                  fontSize: { xs: '0.65rem', sm: '0.85rem', md: '0.9rem', lg: '1rem' },
                  '&:hover': { bgcolor: '#222' }
                }}
              >
                Explore the Rituals
              </Button>
            </Box>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
};

export default AboutHeritage;