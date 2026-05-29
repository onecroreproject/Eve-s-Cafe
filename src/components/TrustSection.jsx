import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import ResponsivePaper from './ResponsivePaper';
import LocalShippingOutlined from '@mui/icons-material/LocalShippingOutlined';
import SupportAgentOutlined from '@mui/icons-material/SupportAgentOutlined';
import SpaOutlined from '@mui/icons-material/SpaOutlined';
import AssignmentReturnOutlined from '@mui/icons-material/AssignmentReturnOutlined';
import CreditCardOutlined from '@mui/icons-material/CreditCardOutlined';

const TrustSection = () => {
  const trustItems = [
    {
      title: "On Time Delivery",
      description: "Get your orders delivered on time, every time.",
      icon: <LocalShippingOutlined sx={{ fontSize: { xs: 24, md: 32 } }} />
    },

    {
      title: "100% Herbal & Organic",
      description: "Pure botanical ingredients crafted for your soul.",
      icon: <SpaOutlined sx={{ fontSize: { xs: 24, md: 32 } }} />
    },
    {
      title: "24x7 Support",
      description: "We're here for you 24/7 to assist with any queries.",
      icon: <SupportAgentOutlined sx={{ fontSize: { xs: 24, md: 32 } }} />
    },
    {
      title: "Secure Payment",
      description: "Enjoy safe and encrypted transactions every time.",
      icon: <CreditCardOutlined sx={{ fontSize: { xs: 24, md: 32 } }} />
    }
  ];

  return (
    <Box sx={{ bgcolor: '#F1F8E9', py: { xs: 6, md: 12 }, borderTop: '1px solid rgba(0,0,0,0.05)' }}>
      <Container sx={{ maxWidth: '1280px !important', px: { xs: 3, sm: 3, md: 3 } }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
          {trustItems.map((item, index) => (
            <div key={index} className="h-full">
              <ResponsivePaper
                elevation={0}
                sx={{
                  p: { xs: 2, md: 4 },
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  borderRadius: { xs: 3, md: 4 },
                  bgcolor: '#fff',
                  border: '1px solid rgba(0,0,0,0.05)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.08)'
                  }
                }}
              >
                <Box
                  sx={{
                    width: { xs: 50, md: 70 },
                    height: { xs: 50, md: 70 },
                    borderRadius: '50%',
                    bgcolor: '#064E3B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    mb: { xs: 1.5, md: 3 },
                    boxShadow: '0 6px 12px rgba(6, 78, 59, 0.2)'
                  }}
                >
                  {item.icon}
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    color: '#1a1a1a',
                    mb: { xs: 0.5, md: 1.5 },
                    fontSize: { xs: '0.75rem', md: '1.1rem' },
                    letterSpacing: '-0.01em',
                    lineHeight: 1.2
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#666',
                    lineHeight: 1.4,
                    fontSize: { xs: '0.65rem', md: '0.9rem' },
                    maxWidth: 240
                  }}
                >
                  {item.description}
                </Typography>
              </ResponsivePaper>
            </div>
          ))}
        </div>
      </Container>
    </Box>
  );
};

export default TrustSection;

