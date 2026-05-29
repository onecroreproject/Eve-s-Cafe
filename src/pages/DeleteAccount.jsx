import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, TextField, Button, Paper, Stack, Alert } from '@mui/material';

const OLIVE_DRAB = '#556B2F';
const OLIVE_SOFT = '#F8F9F4';
const BLACK = '#1A2406';
const LAKSHMI_RED = '#BF211E';
const FONT_SERIF = '"Playfair Display", serif';
const FONT_SANS = '"Playfair Display", serif';

const DeleteAccount = () => {
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would call an API
    console.log('Delete request for:', email, reason);
    setSubmitted(true);
  };

  return (
    <Box sx={{ bgcolor: 'white', minHeight: '100vh', pt: { xs: '60px', md: '72px' }, pb: 20 }}>
      {/* Page Header */}
      <Box sx={{ bgcolor: OLIVE_SOFT, py: { xs: 6, md: 10 }, mb: { xs: 6, md: 10 }, borderBottom: '1px solid #E8EAE0' }}>
        <Container maxWidth="sm">
          <Typography 
            variant="overline" 
            sx={{ color: LAKSHMI_RED, fontWeight: 800, letterSpacing: 3, display: 'block', mb: 2, textAlign: 'center' }}
          >
            ACCOUNT RITUALS
          </Typography>
          <Typography 
            variant="h2" 
            sx={{ 
              fontFamily: FONT_SERIF, 
              fontWeight: 700, 
              color: BLACK, 
              textAlign: 'center',
              fontSize: { xs: '2rem', md: '3.5rem' }
            }}
          >
            Delete Account
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="sm">
        {submitted ? (
          <Fade in={true}>
            <Box sx={{ textAlign: 'center', py: 10 }}>
              <Alert 
                severity="success" 
                sx={{ 
                  borderRadius: 4, 
                  bgcolor: '#F1F8E9', 
                  color: OLIVE_DRAB,
                  '& .MuiAlert-icon': { color: OLIVE_DRAB }
                }}
              >
                Your request has been received. Our care team will process your deactivation within 48 hours.
              </Alert>
              <Button 
                href="/" 
                variant="text" 
                sx={{ mt: 4, color: OLIVE_DRAB, fontWeight: 700 }}
              >
                Return to Home
              </Button>
            </Box>
          </Fade>
        ) : (
          <Paper elevation={0} sx={{ p: { xs: 3, md: 6 }, borderRadius: 6, border: '1px solid #eee' }}>
            <Typography sx={{ fontFamily: FONT_SANS, color: '#666', mb: { xs: 4, md: 6 }, textAlign: 'center', lineHeight: 1.6, fontSize: { xs: '0.9rem', md: '1rem' } }}>
              We're sorry to see you go. Deleting your account will remove your purchase history, botanical preferences, and saved addresses.
            </Typography>

            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: BLACK, textTransform: 'uppercase', mb: 1, display: 'block' }}>
                    Confirm Email Address
                  </Typography>
                  <TextField 
                    fullWidth 
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    sx={{ 
                      '& .MuiOutlinedInput-root': { borderRadius: 2 }
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: BLACK, textTransform: 'uppercase', mb: 1, display: 'block' }}>
                    Reason for leaving (Optional)
                  </Typography>
                  <TextField 
                    fullWidth 
                    multiline 
                    rows={4}
                    placeholder="Tell us how we can improve..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    sx={{ 
                      '& .MuiOutlinedInput-root': { borderRadius: 2 }
                    }}
                  />
                </Box>

                <Button 
                  type="submit"
                  variant="contained" 
                  fullWidth
                  sx={{ 
                    bgcolor: BLACK, 
                    color: 'white', 
                    py: 2, 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '1rem',
                    '&:hover': { bgcolor: LAKSHMI_RED }
                  }}
                >
                  Request Account Deletion
                </Button>
              </Stack>
            </form>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

// Helper component for fade effect
const Fade = ({ children, in: inProp }) => (
  <Box sx={{ opacity: inProp ? 1 : 0, transition: 'opacity 0.5s ease-in' }}>
    {children}
  </Box>
);

export default DeleteAccount;

