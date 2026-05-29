import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  Box,
  Typography,
  IconButton,
  Stack,
  Button,
  useMediaQuery,
  useTheme,
  DialogContent
} from '@mui/material';
import {
  Close as CloseIcon,
  ChevronLeft,
  ChevronRight,
  ShoppingBagOutlined as ShopIcon
} from '@mui/icons-material';

const StoryPlayer = ({ open, onClose, stories, initialIndex = 0 }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    if (open) {
      setCurrentIndex(initialIndex);
    }
  }, [open, initialIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  }, [currentIndex, stories, onClose]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  if (!stories || stories.length === 0) return null;

  const currentStory = stories[currentIndex];

  return (
    <Dialog
      fullScreen={isMobile}
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: 'black',
          borderRadius: isMobile ? 0 : 4,
          overflow: 'hidden',
          minHeight: isMobile ? '100%' : '80vh',
        }
      }}
    >
      <Box sx={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'black' }}>
        
        {/* Header */}
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            bgcolor: 'rgba(0,0,0,0.5)',
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <Box>
             <Typography sx={{ color: 'white', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
               {currentStory.category}
             </Typography>
             <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem' }}>
               Eve's Cafe Rituals
             </Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Video Area */}
        <Box sx={{ flex: 1, position: 'relative', width: '100%', minHeight: '500px', bgcolor: 'black' }}>
          <iframe
            width="100%"
            height="100%"
            src={`${currentStory.url}?autoplay=1&rel=0`}
            title={currentStory.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          ></iframe>
        </Box>

        {/* Footer */}
        <Box sx={{ p: 3, bgcolor: '#1A2406', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h6" sx={{ color: 'white', fontFamily: '"Playfair Display", serif', fontWeight: 700 }}>
              {currentStory.title}
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
              {currentStory.duration} • Botanical Wisdom
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<ShopIcon />}
            sx={{ bgcolor: 'white', color: 'black', borderRadius: '50px', px: 4, '&:hover': { bgcolor: '#f0f0f0' } }}
          >
            Shop Ritual
          </Button>
        </Box>

        {/* Nav Arrows */}
        {!isMobile && (
          <>
            <IconButton
              onClick={handlePrev}
              sx={{ position: 'absolute', left: 10, top: '50%', color: 'white', bgcolor: 'rgba(0,0,0,0.3)', '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' } }}
              disabled={currentIndex === 0}
            >
              <ChevronLeft fontSize="large" />
            </IconButton>
            <IconButton
              onClick={handleNext}
              sx={{ position: 'absolute', right: 10, top: '50%', color: 'white', bgcolor: 'rgba(0,0,0,0.3)', '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' } }}
              disabled={currentIndex === stories.length - 1}
            >
              <ChevronRight fontSize="large" />
            </IconButton>
          </>
        )}
      </Box>
    </Dialog>
  );
};

export default StoryPlayer;
