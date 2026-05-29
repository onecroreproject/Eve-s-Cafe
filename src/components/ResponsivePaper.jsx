import React from 'react';
import { Paper } from '@mui/material';

/**
 * ResponsivePaper – a reusable wrapper around MUI Paper that provides
 * consistent padding, max‑width, border‑radius and responsive layout
 * across the application.
 *
 * Props:
 *   - children: content to render inside the Paper.
 *   - sx: additional style overrides (merged with the base styles).
 */
const ResponsivePaper = ({ children, sx = {} }) => {
  const baseSx = {
    p: { xs: 2, md: 4 },
    mx: 'auto',
    maxWidth: { xs: '100%', sm: 'calc(100vw - 40px)', md: 860 },
    borderRadius: 4,
    bgcolor: 'background.paper',
  };
  return (
    <Paper elevation={0} sx={{ ...baseSx, ...sx }}>
      {children}
    </Paper>
  );
};

export default ResponsivePaper;
