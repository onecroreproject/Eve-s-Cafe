import React, { useEffect } from 'react';
import { Container, Typography, Box, Stack, Divider } from '@mui/material';

const OLIVE_DRAB = '#556B2F';
const OLIVE_SOFT = '#F8F9F4';
const BLACK = '#1A2406';
const FONT_SERIF = '"Playfair Display", serif';
const FONT_SANS = '"Playfair Display", serif';

const Terms = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing and using EvesCafe, you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site."
    },
    {
      title: "2. Use License",
      content: "Permission is granted to temporarily download one copy of the materials (information or software) on EvesCafe's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title."
    },
    {
      title: "3. Disclaimer",
      content: "The materials on EvesCafe's website are provided on an 'as is' basis. EvesCafe makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights."
    },
    {
      title: "4. Limitations",
      content: "In no event shall EvesCafe or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on EvesCafe's website."
    },
    {
      title: "5. Accuracy of Materials",
      content: "The materials appearing on EvesCafe's website could include technical, typographical, or photographic errors. EvesCafe does not warrant that any of the materials on its website are accurate, complete or current. EvesCafe may make changes to the materials contained on its website at any time without notice."
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
            LEGAL RITUALS
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
            Terms & Conditions
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="md">
        <Stack spacing={8}>
          {sections.map((section, index) => (
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
                {section.title}
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
                {section.content}
              </Typography>
              {index < sections.length - 1 && <Divider sx={{ mt: { xs: 4, md: 8 }, opacity: 0.5 }} />}
            </Box>
          ))}
        </Stack>

        <Box sx={{ mt: 15, p: 4, bgcolor: OLIVE_SOFT, borderRadius: 4, border: '1px dashed #556B2F' }}>
          <Typography sx={{ fontFamily: FONT_SANS, fontSize: '0.9rem', color: '#666', textAlign: 'center' }}>
            Last Updated: April 20, 2026. For any legal inquiries, please contact our apothecary at evescafe.in@gmail.com
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Terms;

