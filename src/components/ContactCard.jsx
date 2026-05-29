import React from 'react';
import { Container, Typography, Box, Button, Grid, Stack, Paper } from '@mui/material';
import EmailIcon from '@mui/icons-material/EmailOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LocationIcon from '@mui/icons-material/LocationOnOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import contactImg from '../assets/generated/eco_friendly_self_care_botanical_1776410886652.png';

// Design Tokens
const OLIVE_DRAB = '#556B2F';
const OLIVE_SOFT = '#F8F9F4';
const BLACK = '#000000';
const FONT_SERIF = '"Playfair Display", serif';

const ContactCard = () => {
  const navigate = useNavigate();

  const contacts = [
    { icon: <EmailIcon />, label: "Email Us", detail: "evescafe.in@gmail.com" },
    { icon: <WhatsAppIcon />, label: "WhatsApp", detail: "+91 98840 55777" },
    { icon: <LocationIcon />, label: "Visit Us", detail: "Chetpet, Chennai" }
  ];

  return (
      <Paper
        elevation={0}
        sx={{
          py: { xs: 3.5, md: 5 },
          px: { xs: 2, md: 4 },
          bgcolor: OLIVE_SOFT,
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 0,
          borderY: '1px solid rgba(85,107,47,0.08)',
          width: '100%',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: '0 10px 30px rgba(0,0,0,0.02)'
          }
        }}
      >
        <Container sx={{ maxWidth: '1280px !important', px: { xs: 1, sm: 3 } }}>
          {/* Decorative Branch Overlay (Simulated with Box) */}
          <Box sx={{
            position: 'absolute', top: -50, right: -50, width: 250, height: 250,
            bgcolor: OLIVE_DRAB, opacity: 0.03, borderRadius: '50%', zIndex: 0
          }} />

          <Grid container spacing={{ xs: 3, md: 3 }} sx={{ position: 'relative', zIndex: 1, alignItems: 'center' }}>
            
            {/* Column 1 - Content Related Image */}
            <Grid item xs={12} sm={3} md={2.2}>
              <Box
                sx={{
                  width: '100%',
                  height: { xs: 140, sm: 110, md: 110 },
                  borderRadius: 3,
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                  border: '1px solid rgba(85,107,47,0.1)'
                }}
              >
                <Box
                  component="img"
                  src={contactImg}
                  alt="Botanical Care Consultation"
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>
            </Grid>

            {/* Column 2 - Title */}
            <Grid item xs={12} sm={9} md={3.8}>
              <Typography 
                sx={{ 
                  color: OLIVE_DRAB, 
                  fontWeight: 600, 
                  letterSpacing: 2, 
                  mb: 1, 
                  textTransform: 'uppercase', 
                  fontSize: { xs: '0.6rem', md: '0.65rem' } 
                }}
              >
                A Personal Connection
              </Typography>
              
              <Typography 
                variant="h3" 
                sx={{ 
                  fontFamily: FONT_SERIF, 
                  fontWeight: 600, 
                  color: '#1A3C2E',
                  mb: 1, 
                  lineHeight: 1.2, 
                  fontSize: { xs: '1.3rem', sm: '1.6rem', md: '1.65rem' } 
                }}
              >
                Seeking Personalized <br />
                <span className="text-gradient">Botanical Guidance?</span>
              </Typography>
              
              <Typography 
                sx={{ 
                  color: '#666', 
                  fontSize: { xs: '0.75rem', md: '0.8rem' }, 
                  lineHeight: 1.4,
                  maxWidth: 380
                }}
              >
                Our caretakers are dedicated to assisting your journey back to nature.
              </Typography>
            </Grid>

            {/* Column 3 - Contacts Row */}
            <Grid item xs={12} sm={8} md={3.8}>
              <Stack 
                direction={{ xs: 'column', sm: 'row', md: 'row' }} 
                spacing={{ xs: 2.5, md: 2.5 }} 
                sx={{ 
                  justifyContent: { xs: 'flex-start', md: 'center' },
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: { xs: 1.5, md: 0 }
                }}
              >
                {contacts.map((c, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.2, minWidth: { xs: 'auto', sm: 130 } }}>
                    <Box sx={{ 
                      color: OLIVE_DRAB, 
                      '& svg': { fontSize: '1.2rem' },
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      {c.icon}
                    </Box>
                    <Box>
                      <Typography 
                        sx={{ 
                          fontWeight: 600, 
                          color: '#888', 
                          textTransform: 'uppercase', 
                          fontSize: '0.6rem',
                          letterSpacing: 0.5,
                          mb: 0.15
                        }}
                      >
                        {c.label}
                      </Typography>
                      <Typography 
                        sx={{ 
                          fontWeight: 600, 
                          fontSize: { xs: '0.7rem', md: '0.78rem' },
                          color: BLACK
                        }}
                      >
                        {c.detail}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Grid>

            {/* Column 4 - Action Button */}
            <Grid item xs={12} sm={4} md={2.2}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: { xs: 'center', md: 'flex-end' },
                alignItems: 'center'
              }}>
                <Button
                  onClick={() => navigate('/contact')}
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    bgcolor: BLACK,
                    color: 'white',
                    px: { xs: 2.5, md: 3 },
                    py: { xs: 1.1, md: 1.3 },
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: { xs: '0.8rem', md: '0.85rem' },
                    gap: 0.75,
                    transition: 'all 0.3s ease',
                    '&:hover': { 
                      bgcolor: OLIVE_DRAB,
                      transform: 'translateX(4px)'
                    }
                  }}
                >
                  Go to Support
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Paper>
  );
};

export default ContactCard;


