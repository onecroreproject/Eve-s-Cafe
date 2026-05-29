import React, { useEffect } from 'react';
import { Container, Typography, Box, Stack, Divider, Grid } from '@mui/material';

const OLIVE_DRAB = '#556B2F';
const OLIVE_SOFT = '#F8F9F4';
const BLACK = '#1A2406';
const FONT_SERIF = '"Playfair Display", serif';
const FONT_SANS = '"Playfair Display", serif';

const RefundPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Box sx={{ bgcolor: 'white', minHeight: '100vh', pt: { xs: '60px', md: '72px' }, pb: 10 }}>
      {/* Page Header */}
      <Box sx={{ bgcolor: OLIVE_SOFT, py: { xs: 6, md: 10 }, mb: { xs: 6, md: 10 }, borderBottom: '1px solid #E8EAE0' }}>
        <Container maxWidth="md">
          <Typography 
            variant="overline" 
            sx={{ color: OLIVE_DRAB, fontWeight: 800, letterSpacing: 3, display: 'block', mb: 2, textAlign: 'center' }}
          >
            ORDER PHILOSOPHY
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
            Refund Policy
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="md">
        <Typography 
          sx={{ 
            fontFamily: FONT_SANS, 
            fontSize: { xs: '1rem', md: '1.2rem' }, 
            color: '#444', 
            lineHeight: 1.6, 
            textAlign: 'center',
            mb: { xs: 6, md: 10 }
          }}
        >
          We take great pride in the quality of our botanical formulations. However, if you are not entirely satisfied with your purchase, we are here to help.
        </Typography>

        <Grid container spacing={6}>
          <Grid xs={12}>
            <Box sx={{ p: 5, borderRadius: 4, border: '1px solid #f0f0f0', bgcolor: '#fff' }}>
              <Typography variant="h5" sx={{ fontFamily: FONT_SERIF, fontWeight: 700, mb: { xs: 2, md: 3 }, color: OLIVE_DRAB, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
                Returns
              </Typography>
              <Typography sx={{ fontFamily: FONT_SANS, lineHeight: 1.8, color: '#666' }}>
                You have 15 calendar days to return an item from the date you received it. To be eligible for a return, your item must be unused and in the same condition that you received it. Your item must be in the original packaging.
              </Typography>
            </Box>
          </Grid>

          <Grid xs={12} md={6}>
            <Box sx={{ p: 5, height: '100%', borderRadius: 4, bgcolor: OLIVE_SOFT }}>
              <Typography variant="h5" sx={{ fontFamily: FONT_SERIF, fontWeight: 700, mb: { xs: 2, md: 3 }, color: OLIVE_DRAB, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
                Refunds
              </Typography>
              <Typography sx={{ fontFamily: FONT_SANS, lineHeight: 1.8, color: '#666' }}>
                Once we receive your item, we will inspect it and notify you that we have received your returned item. We will immediately notify you on the status of your refund after inspecting the item.
              </Typography>
            </Box>
          </Grid>

          <Grid xs={12} md={6}>
            <Box sx={{ p: 5, height: '100%', borderRadius: 4, bgcolor: OLIVE_SOFT }}>
              <Typography variant="h5" sx={{ fontFamily: FONT_SERIF, fontWeight: 700, mb: { xs: 2, md: 3 }, color: OLIVE_DRAB, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
                Shipping
              </Typography>
              <Typography sx={{ fontFamily: FONT_SANS, lineHeight: 1.8, color: '#666' }}>
                You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund.
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 10, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontFamily: FONT_SERIF, fontWeight: 700, mb: 2 }}>
            Need help with a return?
          </Typography>
          <Typography sx={{ fontFamily: FONT_SANS, color: '#666', mb: 4 }}>
            Contact our care team at evescafe.in@gmail.com
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default RefundPolicy;

