import React from 'react';
import { Container, Typography, Box, Button, Grid } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link } from 'react-router-dom';
import heritageImg from '../assets/generated/eco_friendly_self_care_botanical_1776410886652.png';

// Design Tokens
const OLIVE_DRAB = '#556B2F';
const BLACK = '#000000';
const FONT_SERIF = '"Playfair Display", serif';

const ContactHeritage = () => {
  return (
    <Box sx={{ pt: { xs: 2, md: 4 }, pb: { xs: 8, md: 15 }, bgcolor: 'white', overflow: 'hidden' }}>
      <Container maxWidth="xl">
        <Grid container spacing={8} sx={{ alignItems: 'center' }}>

          {/* Image Side (Left) */}
          <Grid xs={12} md={6}>
            <Box sx={{ position: 'relative' }}>
              <Box
                sx={{
                  width: '100%',
                  height: { xs: 400, md: 600 },
                  borderRadius: '120px 4px 120px 4px',
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: '0 40px 100px rgba(0,0,0,0.1)'
                }}
              >
                <Box
                  component="img"
                  src={heritageImg}
                  alt="Contact Heritage Ritual"
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <Box sx={{ position: 'absolute', inset: 0, bgcolor: `${OLIVE_DRAB}20`, mixBlendMode: 'multiply' }} />
              </Box>

              {/* Subtle Decorative Badge */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -20,
                  right: -20,
                  width: 140,
                  height: 140,
                  bgcolor: 'white',
                  borderRadius: '50%',
                  display: { xs: 'none', lg: 'flex' },
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                  p: 1.5,
                  zIndex: 2
                }}
              >
                <Box
                  sx={{
                    width: '100%', height: '100%', borderRadius: '50%',
                    border: `1px dashed ${OLIVE_DRAB}40`,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center'
                  }}
                >
                  <Typography sx={{ color: OLIVE_DRAB, fontWeight: 900, fontSize: '1.2rem' }}>24/7</Typography>
                  <Typography sx={{ color: BLACK, fontSize: '0.55rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>Caretaker Support</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Text Side (Right) */}
          <Grid xs={12} md={6}>
            <Box sx={{ p: { md: 4 } }}>
              <Typography sx={{ color: OLIVE_DRAB, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', fontSize: '0.75rem', mb: 3 }}>
                Reach Out — Our Sanctuary Support
              </Typography>
              <Typography variant="h2" sx={{ fontFamily: FONT_SERIF, fontWeight: 700, color: '#1A3C2E', mb: 4, lineHeight: 1.1, fontSize: { xs: '2.5rem', md: '3.8rem' } }}>
                Your Ritual, <br />
                <span className="text-gradient">Our Personal Care</span>
              </Typography>

              <Typography sx={{ color: '#444', fontSize: '1.2rem', lineHeight: 1.8, mb: 6, maxWidth: 600 }}>
                Whether you seek personalized botanical guidance or have questions about your recent ritual collection, our caretakers are here to assist your journey back to nature. We value every pulse of connection.
              </Typography>

              <Button
                component={Link}
                to="/about"
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  bgcolor: BLACK, color: 'white',
                  borderRadius: 2, px: 6, py: 2, textTransform: 'none', fontWeight: 700,
                  fontSize: '1rem',
                  '&:hover': { bgcolor: '#222' }
                }}
              >
                Learn Our Values
              </Button>
            </Box>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
};

export default ContactHeritage;

