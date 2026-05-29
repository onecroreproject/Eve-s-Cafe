import React, { useEffect } from 'react';
import { Container, Typography, Box, Stack, Divider } from '@mui/material';

const OLIVE_DRAB = '#556B2F';
const OLIVE_SOFT = '#F8F9F4';
const BLACK = '#1A2406';
const FONT_SERIF = '"Playfair Display", serif';
const FONT_SANS = '"Playfair Display", serif';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const policies = [
    {
      title: "Data Collection Rituals",
      content: "We collect information to provide better services to all our users. This includes account information, botanical preferences, and transaction history. We honor your data as much as we honor the earth."
    },
    {
      title: "How We Use Your Information",
      content: "Information we collect is used to personalize your experience, process transactions, and send periodic emails regarding your orders or other botanical products and services."
    },
    {
      title: "Botanical Security",
      content: "We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information."
    },
    {
      title: "Ritual Cookies",
      content: "We use cookies to help us remember and process the items in your shopping cart and understand and save your preferences for future visits."
    },
    {
      title: "Third Party Disclosures",
      content: "We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information. This does not include trusted third parties who assist us in operating our website."
    }
  ];

  return (
    <Box sx={{ bgcolor: 'white', minHeight: '100vh', pt: { xs: '60px', md: '72px' }, pb: 10 }}>
      {/* Page Header */}
      <Box sx={{ bgcolor: OLIVE_SOFT, py: { xs: 6, md: 10 }, mb: { xs: 6, md: 10 }, borderBottom: '1px solid #E8EAE0' }}>
        <Container maxWidth="md">
          <Typography 
            variant="overline" 
            sx={{ color: OLIVE_DRAB, fontWeight: 800, letterSpacing: 3, display: 'block', mb: 2, textAlign: 'center' }}
          >
            PRIVACY RITUALS
          </Typography>
          <Typography 
            variant="h2" 
            sx={{ 
              fontFamily: FONT_SERIF, 
              fontWeight: 700, 
              color: BLACK, 
              textAlign: 'center',
              fontSize: { xs: '2rem', md: '4rem' }
            }}
          >
            Privacy Policy
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="md">
        <Stack spacing={8}>
          {policies.map((item, index) => (
            <Box key={index}>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontFamily: FONT_SERIF, 
                  fontWeight: 700, 
                  color: OLIVE_DRAB, 
                  mb: { xs: 2, md: 3 },
                  fontSize: { xs: '1.25rem', md: '1.5rem' }
                }}
              >
                {item.title}
              </Typography>
              <Typography 
                sx={{ 
                  fontFamily: FONT_SANS, 
                  color: '#444', 
                  lineHeight: 1.8, 
                  fontSize: { xs: '0.95rem', md: '1.05rem' },
                  textAlign: { xs: 'left', md: 'justify' }
                }}
              >
                {item.content}
              </Typography>
              {index < policies.length - 1 && <Divider sx={{ mt: { xs: 4, md: 8 }, opacity: 0.5 }} />}
            </Box>
          ))}
        </Stack>

        <Box sx={{ mt: 15, textAlign: 'center', p: 6, bgcolor: '#fdfdfd', borderRadius: 4, border: '1px solid #f0f0f0' }}>
          <Typography variant="h6" sx={{ fontFamily: FONT_SERIF, fontWeight: 700, mb: 2 }}>
            Your Rights
          </Typography>
          <Typography sx={{ fontFamily: FONT_SANS, color: '#666', mb: 4 }}>
            You have the right to access, correct, or delete your personal data at any time.
          </Typography>
          <Typography sx={{ fontFamily: FONT_SANS, fontSize: '0.85rem', color: '#999', textTransform: 'uppercase', letterSpacing: 1 }}>
            Last Revised: April 2026
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default PrivacyPolicy;

