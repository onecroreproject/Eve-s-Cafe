import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';

// Design Tokens (Synced with BrandHeritage)
const OLIVE_DRAB = '#556B2F';
const BLACK = '#000000';
const FONT_SERIF = '"Playfair Display", serif';

const Features = () => {
  const features = [
    {
      id: 1,
      title: "100% Genuine",
      subtitle: "Natural Products",
      icon: <i className="fa-solid fa-shield-halved text-xl md:text-2xl"></i>
    },
    {
      id: 2,
      title: "Exclusive",
      subtitle: "Offers",
      icon: <i className="fa-solid fa-tag text-xl md:text-2xl"></i>
    },
    {
      id: 3,
      title: "Natural & Ayurvedic",
      subtitle: "Formulation",
      icon: <i className="fa-solid fa-leaf text-xl md:text-2xl"></i>
    },
    {
      id: 4,
      title: "100%",
      subtitle: "Paraben Free",
      icon: <i className="fa-solid fa-vial text-xl md:text-2xl"></i>
    },
    {
      id: 5,
      title: "Free Gift",
      subtitle: "With Every Order",
      icon: <i className="fa-solid fa-gift text-xl md:text-2xl"></i>
    },
    {
      id: 6,
      title: "Secure Payment",
      subtitle: "100% Safe Checkout",
      icon: <i className="fa-solid fa-lock text-xl md:text-2xl"></i>
    }
  ];

  return (
    <Box sx={{ bgcolor: 'white', pt: 4, pb: 4, borderY: '1px solid rgba(0,0,0,0.05)' }}>
      <Container sx={{ maxWidth: '1280px !important', px: { xs: 3, sm: 3, md: 3 } }}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'nowrap',
            overflowX: 'auto',
            gap: { xs: 2, md: 3 },
            pt: 1,
            pb: { xs: 2, lg: 0 },
            justifyContent: { xs: 'flex-start', lg: 'center' },
            '&::-webkit-scrollbar': { display: 'none' },
            msOverflowStyle: 'none',
            scrollbarWidth: 'none'
          }}
        >
          {features.map((item) => (
            <Box
              key={item.id}
              sx={{
                flex: { xs: '0 0 auto', lg: '1' },
                minWidth: { xs: 100, md: 140 },
                maxWidth: { lg: 200 },
                px: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover .feature-icon-container': {
                  bgcolor: OLIVE_DRAB,
                  color: 'white',
                  transform: 'translateY(-5px)',
                  boxShadow: `0 10px 20px ${OLIVE_DRAB}30`
                }
              }}
            >
              <Box
                className="feature-icon-container"
                sx={{
                  width: { xs: 50, md: 60 },
                  height: { xs: 50, md: 60 },
                  borderRadius: '50%',
                  border: `1px solid ${OLIVE_DRAB}30`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: OLIVE_DRAB,
                  mb: 2,
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  bgcolor: 'transparent'
                }}
              >
                {item.icon}
              </Box>
              <Box>
                <Typography
                  sx={{
                    color: OLIVE_DRAB,
                    fontWeight: 800,
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    mb: 0.5,
                    whiteSpace: 'nowrap'
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  sx={{
                    color: BLACK,
                    fontWeight: 600,
                    fontSize: '14px',
                    lineHeight: 1.2
                  }}
                >
                  {item.subtitle}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Features;

