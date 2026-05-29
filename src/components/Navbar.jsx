// Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, IconButton, Button, Badge, Menu, MenuItem,
  Drawer, List, ListItem, ListItemIcon, ListItemText, Tooltip,
  Box, Container, Typography, Fade, Dialog,
  TextField, Checkbox, FormControlLabel, Divider, InputAdornment, Avatar,
  useMediaQuery, useTheme, Grid, Collapse, ListItemButton,
  Snackbar, Alert, CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  ShoppingBagOutlined as CartIcon,
  PersonOutlined,
  Menu as MenuIcon,
  KeyboardArrowDown as ArrowDownIcon,
  HomeOutlined as HomeIcon,
  InfoOutlined as AboutIcon,
  ContactSupportOutlined as ContactIcon,
  LocalOfferOutlined as BestsellerIcon,
  AutoStoriesOutlined as BlogIcon,
  PlayCircleOutlined as VideoIcon,
  ChildCare,
  SpaOutlined,
  CleanHandsOutlined,
  Close as CloseIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Visibility,
  VisibilityOff,
  VerifiedUserOutlined as VerifiedIcon,
  ShoppingBagOutlined,
  LogoutOutlined,
  AccountCircleOutlined,
} from '@mui/icons-material';

import logo from '../assets/logo/logo.png';
import skincare from '../assets/categories/skin-care.jpg';
import Fav from './Fav';

const GREEN = '#1A3C2E';
const GREEN_DARK = '#0f2419';
const GREEN_LIGHT = '#ECFDF5';
const ACCENT = '#B48253';

import { navLinks } from './navbarData';
import TopBar from './TopBar';
import api from '../api/config';

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    '&:hover fieldset': { borderColor: GREEN },
    '&.Mui-focused fieldset': { borderColor: GREEN },
  },
  '& .MuiInputLabel-root.Mui-focused': { color: GREEN },
};

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [showTopBar, setShowTopBar] = useState(true);
  const location = useLocation();
  const currentPath = location.pathname;

  const [authMode, setAuthMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [desktopShopOpen, setDesktopShopOpen] = useState(null);

  const [currentUser, setCurrentUser] = useState(null);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const profileMenuOpen = Boolean(profileMenuAnchor);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = () => {
    const saved = localStorage.getItem('cartItems');
    const items = saved ? JSON.parse(saved) : [];
    const total = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
    setCartCount(total);
  };

  useEffect(() => {
    updateCartCount();
    window.addEventListener('cart-updated', updateCartCount);
    window.addEventListener('storage', updateCartCount);
    return () => {
      window.removeEventListener('cart-updated', updateCartCount);
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  useEffect(() => {
    fetchCategories();
    checkUser();
    const handleOpenLogin = (e) => openLogin(e.detail?.mode || 'login');
    window.addEventListener('open-login-modal', handleOpenLogin);
    return () => window.removeEventListener('open-login-modal', handleOpenLogin);
  }, []);

  const checkUser = async () => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      try {
        const response = await api.get('/user');
        setCurrentUser(response.data.data);
        localStorage.setItem('user', JSON.stringify(response.data.data));
      } catch (error) {
        console.error("Token verification failed:", error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setCurrentUser(null);
      }
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      if (response.data.success) {
        setCategories(response.data.data);
        if (response.data.data && response.data.data.length > 0) {
          setDesktopShopOpen(response.data.data[0].name);
        }
      }
    } catch (error) {
      console.error("Error fetching categories for navbar:", error);
    }
  };

  const handleProfileMenuOpen = (e) => setProfileMenuAnchor(e.currentTarget);
  const handleProfileMenuClose = () => setProfileMenuAnchor(null);

  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setCurrentUser(null);
      handleProfileMenuClose();
      navigate('/');
    }
  };

  const userInitials = currentUser
    ? currentUser.name.split(' ').map((n) => n[0]).join('').slice(0, 2)
    : null;

  const profileMenuItems = [
    { icon: <AccountCircleOutlined sx={{ fontSize: 18 }} />, label: 'My Profile', path: '/profile' },
    { icon: <ShoppingBagOutlined sx={{ fontSize: 18 }} />, label: 'My Orders', path: '/profile', tab: 1 },
  ];

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhone] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });
  const [searchQuery, setSearchQuery] = useState('');

  const shopOpen = Boolean(anchorEl);
  const handleShopClick = (e) => {
    setAnchorEl(e.currentTarget);
    if (!desktopShopOpen && formattedShopCategories.length > 0) {
      setDesktopShopOpen(formattedShopCategories[0].name);
    }
  };
  const handleShopClose = () => {
    setAnchorEl(null);
    if (formattedShopCategories.length > 0) {
      setDesktopShopOpen(formattedShopCategories[0].name);
    } else {
      setDesktopShopOpen(null);
    }
  };

  const toggleDrawer = (open) => (e) => {
    if (e?.type === 'keydown' && (e.key === 'Tab' || e.key === 'Shift')) return;
    setMobileOpen(open);
  };

  const openLogin = (mode = 'login') => {
    setAuthMode(mode);
    setLoginOpen(true);
    if (mode === 'login') {
      const rememberedEmail = localStorage.getItem('rememberedEmail');
      if (rememberedEmail) { setEmail(rememberedEmail); setRememberMe(true); }
      else { setEmail(''); setRememberMe(false); }
    } else {
      setEmail(''); setRememberMe(false);
    }
    setPassword(''); setName(''); setPhone('');
    setShowPassword(false);
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (authMode === 'login') {
        const response = await api.post('/login', { email, password });
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.data));
        setCurrentUser(response.data.data);
        if (rememberMe) localStorage.setItem('rememberedEmail', email);
        else localStorage.removeItem('rememberedEmail');
      } else if (authMode === 'signup') {
        const response = await api.post('/register', { name, email, password, phone: phoneNumber });
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.data));
        setCurrentUser(response.data.data);
      }
      setLoginOpen(false);
    } catch (error) {
      console.error("Auth failed:", error);
      const serverErrors = error.response?.data?.errors;
      let errorMessage = error.response?.data?.message || "Authentication failed. Please check your credentials.";
      if (serverErrors) {
        const firstErrorKey = Object.keys(serverErrors)[0];
        errorMessage = serverErrors[firstErrorKey][0];
      }
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const iconMap = {
    'HomeIcon': <HomeIcon />,
    'LocalOfferOutlined': <BestsellerIcon />,
    'AutoStoriesOutlined': <BlogIcon />,
    'PlayCircleOutlined': <VideoIcon />,
    'InfoOutlined': <AboutIcon />,
    'ContactSupportOutlined': <ContactIcon />,
    'CleanHandsOutlined': <CleanHandsOutlined />,
    'SpaOutlined': <SpaOutlined />,
    'ChildCare': <ChildCare />,
  };

  const formattedNavLinks = navLinks.map(link => ({
    ...link,
    icon: iconMap[link.icon] || <HomeIcon />
  }));

  const formattedShopCategories = Array.isArray(categories) ? categories.map(cat => ({
    name: cat.name,
    path: `/shop/${cat.slug}`,
    icon: <SpaOutlined />,
    subCategories: cat.sub_categories ? cat.sub_categories.map(sub => ({
      name: sub.name,
      path: `/shop/${cat.slug}/${sub.slug}`
    })) : []
  })) : [];

  /* ── TopBar height: xs=40px, md=44px ─────────────────────────── */
  const topBarHeight = { xs: 40, md: 44 };
  const navbarTop = showTopBar ? topBarHeight : { xs: 0, md: 0 };

  // ── Total navbar height for page offset ────────────────────────
  // Total navbar height = 114px (TopBar 44px + Primary Row 70px)
  const navbarOffset = showTopBar
    ? { xs: '104px', sm: '104px', md: '114px', lg: '114px' }
    : { xs: '64px', sm: '64px', md: '70px', lg: '70px' };

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: theme.zIndex.appBar,
        }}
      >
        {/* ── Announcement Bar ───────────────────────────────────────── */}
        <Collapse in={showTopBar}>
          <TopBar showTopBar={showTopBar} setShowTopBar={setShowTopBar} />
        </Collapse>

        {/* ── AppBar ──────────────────────────────────────────────────── */}
        <AppBar
          position="static"
          elevation={0}
          color="inherit"
          sx={{
            bgcolor: 'rgba(255,255,255,0.97)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(0,0,0,0.07)',
          }}
        >
        {/* CUSTOM CONTAINER: Width set to 1081.2px */}
        <Container
          maxWidth={false}
          sx={{
            maxWidth: '1300.2px !important',
            px: { xs: 2, sm: 3, md: 4 },
            mx: 'auto',
          }}
        >
          {/* Primary Row - Height 70px */}
          <Toolbar
            disableGutters
            sx={{
              height: { xs: 64, sm: 64, md: 70, lg: 70 },
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: { xs: 1, sm: 2 },
            }}
          >
            {/* Logo */}
            <Box
              component={Link}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                height: '100%',
                textDecoration: 'none',
                flexShrink: 0,
                transition: 'transform 0.2s ease',
                '&:hover': { transform: 'scale(1.02)' },
              }}
            >
              <img
                src={logo}
                alt="EvesCafe"
                style={{
                  height: 'clamp(32px, 6vw, 52px)',
                  width: 'auto',
                  objectFit: 'contain',
                }}
              />
            </Box>

            {/* Desktop Search */}
            <Box
              component="form"
              onSubmit={handleSearch}
              sx={{
                display: { xs: 'none', md: 'flex' },
                flex: 1,
                mx: { md: 2, lg: 3 },
                maxWidth: { md: 320, lg: 380 },
              }}
            >
              <TextField
                fullWidth
                placeholder="Explore botanical rituals..."
                variant="outlined"
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchIcon
                          onClick={handleSearch}
                          sx={{
                            color: 'rgba(0,0,0,0.3)',
                            cursor: 'pointer',
                            fontSize: 20,
                            transition: 'all 0.2s ease',
                            '&:hover': { color: GREEN, transform: 'scale(1.1)' },
                          }}
                        />
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: 50,
                      bgcolor: '#F9FAFB',
                      fontSize: { md: '0.82rem', lg: '0.88rem' },
                      '& fieldset': { border: '1px solid rgba(0,0,0,0.08)' },
                      px: 2,
                      transition: 'all 0.2s ease',
                      '&:focus-within': {
                        boxShadow: `0 0 0 3px rgba(26,60,46,0.1)`,
                        '& fieldset': { borderColor: GREEN },
                      },
                    },
                  },
                }}
              />
            </Box>

            {/* Mobile Search Overlay */}
            <Fade in={mobileSearchOpen}>
              <Box
                component="form"
                onSubmit={handleSearch}
                sx={{
                  display: mobileSearchOpen ? 'flex' : 'none',
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  bgcolor: 'white',
                  zIndex: 10,
                  alignItems: 'center',
                  px: 2,
                  gap: 1,
                }}
              >
                <TextField
                  fullWidth
                  autoFocus
                  placeholder="Search botanicals..."
                  variant="standard"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  slotProps={{ input: { disableUnderline: true, sx: { fontSize: '1rem', fontWeight: 500 } } }}
                />
                <IconButton onClick={() => setMobileSearchOpen(false)} size="small">
                  <CloseIcon />
                </IconButton>
              </Box>
            </Fade>

            {/* Action Icons */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 0.25, sm: 0.75, md: 1, lg: 1.25 },
                flexShrink: 0,
              }}
            >
              {/* Mobile search trigger */}
              <IconButton
                onClick={() => setMobileSearchOpen(true)}
                sx={{
                  display: { xs: 'flex', md: 'none' },
                  color: 'text.primary',
                  p: { xs: '6px', sm: '8px' },
                  '&:hover': { color: GREEN },
                }}
              >
                <SearchIcon sx={{ fontSize: { xs: 20, sm: 22 } }} />
              </IconButton>

              <Fav />

              {/* Logged In */}
              {currentUser ? (
                <>
                  <Tooltip title="My Account">
                    <IconButton
                      onClick={handleProfileMenuOpen}
                      sx={{
                        p: 0.5,
                        border: profileMenuOpen ? `2px solid ${GREEN}` : '2px solid transparent',
                        borderRadius: '50%',
                        transition: 'all 0.2s ease',
                        '&:hover': { transform: 'scale(1.05)' },
                      }}
                    >
                      <Avatar
                        sx={{
                          width: { xs: 28, sm: 32, md: 34, lg: 36 },
                          height: { xs: 28, sm: 32, md: 34, lg: 36 },
                          bgcolor: GREEN,
                          fontSize: { xs: '0.62rem', md: '0.75rem' },
                          fontWeight: 900,
                        }}
                      >
                        {userInitials}
                      </Avatar>
                    </IconButton>
                  </Tooltip>

                  <Menu
                    anchorEl={profileMenuAnchor}
                    open={profileMenuOpen}
                    onClose={handleProfileMenuClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    slotProps={{
                      paper: {
                        sx: {
                          mt: 1.5,
                          minWidth: 220,
                          borderRadius: 4,
                          boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
                          border: '1px solid rgba(0,0,0,0.06)',
                          overflow: 'visible',
                          '&::before': {
                            content: '""', display: 'block', position: 'absolute',
                            top: -6, right: 20, width: 12, height: 12,
                            bgcolor: 'background.paper', transform: 'rotate(45deg)',
                            borderTop: '1px solid rgba(0,0,0,0.06)',
                            borderLeft: '1px solid rgba(0,0,0,0.06)',
                          },
                          animation: profileMenuOpen ? 'menuFadeIn 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'none',
                        },
                      },
                    }}
                  >
                    <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 38, height: 38, bgcolor: GREEN, fontWeight: 900, fontSize: '0.85rem' }}>
                          {userInitials}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 900, fontSize: '0.85rem', lineHeight: 1.3 }}>{currentUser.name}</Typography>
                          <Typography sx={{ color: '#9CA3AF', fontSize: '0.7rem' }}>{currentUser.email}</Typography>
                        </Box>
                      </Box>
                    </Box>

                    {profileMenuItems.map((item) => (
                      <MenuItem
                        key={item.label}
                        onClick={() => { handleProfileMenuClose(); navigate(item.path, { state: { tab: item.tab || 0 } }); }}
                        sx={{ px: 2.5, py: 1.3, gap: 1.5, color: '#374151', '&:hover': { bgcolor: GREEN_LIGHT, color: GREEN }, transition: 'all 0.15s' }}
                      >
                        <Box sx={{ display: 'flex', color: 'inherit' }}>{item.icon}</Box>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.83rem' }}>{item.label}</Typography>
                      </MenuItem>
                    ))}

                    <Divider sx={{ my: 0.5 }} />

                    <MenuItem
                      onClick={handleLogout}
                      sx={{ px: 2.5, py: 1.3, gap: 1.5, color: '#EF4444', '&:hover': { bgcolor: '#FEF2F2' }, transition: 'all 0.15s' }}
                    >
                      <LogoutOutlined sx={{ fontSize: 18 }} />
                      <Typography sx={{ fontWeight: 600, fontSize: '0.83rem' }}>Sign Out</Typography>
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Tooltip title="Sign in">
                  <IconButton
                    onClick={() => openLogin('login')}
                    sx={{
                      color: 'text.primary',
                      p: { xs: '6px', sm: '8px' },
                      borderRadius: 2,
                      gap: 0.5,
                      '&:hover': { color: GREEN, bgcolor: GREEN_LIGHT },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <PersonOutlined sx={{ fontSize: { xs: 22, md: 23 } }} />
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 800, display: { xs: 'none', lg: 'block' }, fontSize: '0.85rem' }}
                    >
                      Sign in
                    </Typography>
                  </IconButton>
                </Tooltip>
              )}

              {/* Cart */}
              <Tooltip title="Cart">
                <IconButton
                  component={Link}
                  to="/cart"
                  sx={{
                    color: 'text.primary',
                    p: { xs: '6px', sm: '8px' },
                    transition: 'all 0.2s ease',
                    '&:hover': { color: GREEN, transform: 'scale(1.1)' },
                  }}
                >
                  <Badge
                    badgeContent={cartCount}
                    sx={{ '& .MuiBadge-badge': { bgcolor: GREEN, color: '#fff', fontSize: 10, minWidth: 16, height: 16 } }}
                  >
                    <CartIcon sx={{ fontSize: { xs: 22, sm: 23, md: 23 } }} />
                  </Badge>
                </IconButton>
              </Tooltip>

              {/* Hamburger — hidden on lg+ */}
              <IconButton
                onClick={toggleDrawer(true)}
                sx={{
                  display: { xs: 'flex', lg: 'none' },
                  ml: { xs: 0, sm: 0.25 },
                  p: { xs: '6px', sm: '8px' },
                  transition: 'all 0.2s ease',
                  '&:hover': { color: GREEN, transform: 'scale(1.1)' },
                }}
              >
                <MenuIcon sx={{ fontSize: { xs: 22, sm: 24 } }} />
              </IconButton>
            </Box>
          </Toolbar>

          {/* Secondary Nav (desktop only) */}
          <Box
            sx={{
              display: { xs: 'none', lg: 'flex' },
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              flexWrap: 'nowrap',
              borderTop: '1px solid rgba(0,0,0,0.05)',
              py: 0.5,
              gap: { lg: 3, xl: 4 },
              overflowX: 'auto',
              '&::-webkit-scrollbar': { display: 'none' },
              scrollbarWidth: 'none',
            }}
          >
            {/* Shop All dropdown trigger */}
            <Box sx={{ position: 'relative', flexShrink: 0 }}>
              <Button
                onClick={handleShopClick}
                startIcon={
                  <SpaOutlined
                    sx={{ fontSize: 16, mr: -0.5, opacity: currentPath.startsWith('/shop') ? 1 : 0.7 }}
                  />
                }
                endIcon={
                  <ArrowDownIcon
                    sx={{ transition: 'transform .25s', transform: shopOpen ? 'rotate(180deg)' : 'none', fontSize: 15 }}
                  />
                }
                sx={{
                  textTransform: 'none',
                  fontWeight: 800,
                  fontSize: { lg: '0.8rem', xl: '0.87rem' },
                  fontFamily: "'Playfair Display', serif",
                  color: currentPath.startsWith('/shop') ? GREEN : 'text.primary',
                  px: { lg: 1.25, xl: 1.75 },
                  py: 0.5,
                  minWidth: 'auto',
                  borderRadius: 2,
                  transition: 'all 0.2s ease',
                  '&:hover': { color: GREEN, bgcolor: GREEN_LIGHT },
                  position: 'relative',
                  '&::after': {
                    content: '""', position: 'absolute', bottom: 1, left: '50%',
                    transform: `translateX(-50%) scale(${currentPath.startsWith('/shop') ? 1 : 0})`,
                    width: 5, height: 5, bgcolor: GREEN, borderRadius: '50%',
                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  },
                }}
              >
                Shop All
              </Button>

              {/* Mega Menu */}
              <Menu
                anchorEl={anchorEl}
                open={shopOpen}
                onClose={handleShopClose}
                slotProps={{
                  paper: {
                    sx: {
                      mt: 2,
                      width: 'min(calc(100vw - 48px), 880px)',
                      p: 0,
                      borderRadius: 5,
                      boxShadow: '0 40px 100px rgba(0,0,0,0.15)',
                      border: '1px solid rgba(0,0,0,0.06)',
                      overflow: 'hidden',
                      animation: shopOpen ? 'menuFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'none',
                    },
                  },
                }}
              >
                <Box sx={{ display: 'flex', minHeight: 320 }}>
                  {/* Left image panel */}
                  <Box
                    sx={{
                      width: { lg: 220, xl: 260 },
                      flexShrink: 0,
                      position: 'relative',
                      borderRadius: '20px 0 0 20px',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      m: { lg: 1.5, xl: 2 },
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': { transform: 'scale(1.02)' },
                    }}
                  >
                    <Box
                      component="img"
                      src={skincare}
                      alt="Skincare"
                      sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
                    />
                    <Box
                      sx={{
                        position: 'absolute', inset: 0,
                        background: `linear-gradient(to top, rgba(26,60,46,0.97) 0%, rgba(26,60,46,0.5) 45%, rgba(0,0,0,0.05) 100%)`,
                        zIndex: 1,
                      }}
                    />
                    <Box sx={{ position: 'relative', zIndex: 2, p: { lg: 2, xl: 2.5 }, color: '#fff' }}>
                      <Typography
                        variant="overline"
                        sx={{ fontWeight: 800, letterSpacing: 3, mb: 1, display: 'block', opacity: 0.9, fontSize: '0.6rem' }}
                      >
                        AUTHENTIC APOTHECARY
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 900, mb: 2, lineHeight: 1.2,
                          fontFamily: "'Playfair Display', serif",
                          fontSize: { lg: '1.05rem', xl: '1.2rem' },
                        }}
                      >
                        Dazzling Solution <br />
                        <span style={{ fontStyle: 'italic' }}>With Natural Touch</span>
                      </Typography>
                      <Button
                        component={Link}
                        to="/shop"
                        onClick={handleShopClose}
                        variant="contained"
                        size="small"
                        sx={{
                          bgcolor: '#fff', color: GREEN, fontWeight: 900, borderRadius: 2,
                          textTransform: 'none', fontSize: '0.75rem',
                          '&:hover': { bgcolor: '#f0f0f0', transform: 'translateY(-2px)', boxShadow: '0 8px 20px rgba(26,60,46,0.15)' },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        Explore Collection
                      </Button>
                    </Box>
                  </Box>

                  {/* Right categories */}
                  <Box
                    sx={{
                      flex: 1,
                      py: { lg: 2, xl: 2.5 },
                      pr: { lg: 2, xl: 2.5 },
                      bgcolor: '#fff',
                      overflowY: 'auto',
                    }}
                  >
                    <Grid container spacing={1.5}>
                      {formattedShopCategories.map((cat) => {
                        const isOpen = desktopShopOpen === cat.name;
                        return (
                          <Grid xs={12} sm={6} md={4} key={cat.name}>
                            <Box
                              onClick={() => setDesktopShopOpen(isOpen ? null : cat.name)}
                              sx={{
                                mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                cursor: 'pointer', borderBottom: '1px solid rgba(0,0,0,0.08)', pb: 1,
                                transition: 'all 0.2s ease',
                                '&:hover': { '& .MuiTypography-root': { color: GREEN, transform: 'translateX(3px)' } },
                              }}
                            >
                              <Typography
                                sx={{
                                  fontWeight: 900, color: isOpen ? GREEN : '#111827',
                                  fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: 1.5,
                                  transition: 'all 0.2s ease',
                                }}
                              >
                                {cat.name}
                              </Typography>
                              {isOpen
                                ? <RemoveIcon sx={{ fontSize: 13, color: GREEN }} />
                                : <AddIcon sx={{ fontSize: 13, color: '#111827' }} />}
                            </Box>
                            <Collapse in={isOpen}>
                              <List disablePadding sx={{ mb: 2 }}>
                                {cat.subCategories.map((sub) => (
                                  <ListItemButton
                                    key={sub.name}
                                    component={Link}
                                    to={sub.path}
                                    onClick={handleShopClose}
                                    className="submenu-item-fade"
                                    sx={{
                                      p: 0, mb: 0.75, color: '#4B5563',
                                      transition: 'all 0.2s ease',
                                      '&:hover': { color: GREEN, bgcolor: 'transparent', transform: 'translateX(5px)' },
                                    }}
                                  >
                                    <ListItemText
                                      primary={sub.name}
                                      primaryTypographyProps={{ fontSize: '0.8rem', fontWeight: 500 }}
                                    />
                                  </ListItemButton>
                                ))}
                                <ListItemButton
                                  component={Link}
                                  to={cat.path}
                                  onClick={handleShopClose}
                                  sx={{
                                    p: 0, mt: 1, color: GREEN, opacity: 0.8,
                                    transition: 'all 0.2s ease',
                                    '&:hover': { opacity: 1, bgcolor: 'transparent', transform: 'translateX(3px)' },
                                  }}
                                >
                                  <ListItemText
                                    primary="View all"
                                    primaryTypographyProps={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}
                                  />
                                </ListItemButton>
                              </List>
                            </Collapse>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                </Box>
              </Menu>
            </Box>

            {/* Nav links */}
            {formattedNavLinks.map((link) => (
              <Button
                key={link.name}
                component={Link}
                to={link.path}
                startIcon={React.cloneElement(link.icon, {
                  sx: { fontSize: 15, mr: -0.5, opacity: currentPath === link.path ? 1 : 0.7 },
                })}
                sx={{
                  textTransform: 'none',
                  fontWeight: 800,
                  fontSize: { lg: '0.8rem', xl: '0.87rem' },
                  fontFamily: "'Playfair Display', serif",
                  color: currentPath === link.path ? GREEN : 'text.primary',
                  px: { lg: 1.25, xl: 1.5 },
                  py: 0.5,
                  minWidth: 'auto',
                  flexShrink: 0,
                  borderRadius: 2,
                  transition: 'all 0.2s ease',
                  '&:hover': { color: GREEN, bgcolor: GREEN_LIGHT },
                  position: 'relative',
                  '&::after': {
                    content: '""', position: 'absolute', bottom: 1, left: '50%',
                    transform: `translateX(-50%) scale(${currentPath === link.path ? 1 : 0})`,
                    width: 5, height: 5, bgcolor: GREEN, borderRadius: '50%',
                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  },
                }}
              >
                {link.name}
                {link.badge && (
                  <Box
                    sx={{
                      ml: 0.75, bgcolor: '#F97316', color: '#fff',
                      fontSize: '0.55rem', px: 0.75, py: 0.2, borderRadius: 5, fontWeight: 900,
                    }}
                  >
                    {link.badge}
                  </Box>
                )}
              </Button>
            ))}
          </Box>
        </Container>
      </AppBar>
    </Box>

      {/* ── Auth Dialog ────────────────────────────────────────────── */}
      <Dialog
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        fullScreen={isSmall}
        maxWidth="md"
        fullWidth
        scroll="paper"
        slotProps={{
          paper: {
            sx: {
              borderRadius: { xs: 0, sm: 4, md: 5 },
              overflow: 'hidden',
              m: { xs: 0, sm: 2, md: 3 },
              maxHeight: { xs: '100dvh', sm: '94vh', md: '90vh' },
              width: { xs: '100%', sm: '90vw', md: '860px' },
            },
          },
        }}
      >
        <IconButton
          onClick={() => setLoginOpen(false)}
          sx={{
            position: 'absolute', top: { xs: 10, md: 16 }, right: { xs: 10, md: 16 },
            zIndex: 10, color: '#9CA3AF',
            bgcolor: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(4px)',
            '&:hover': { bgcolor: '#fff', color: '#374151' },
          }}
        >
          <CloseIcon />
        </IconButton>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            height: { md: '100%' },
            overflowY: { xs: 'auto', md: 'hidden' },
          }}
        >
          {/* Left branding panel */}
          <Box
            sx={{
              flex: { xs: 'none', md: '0 0 320px' },
              minHeight: { xs: 200, sm: 240, md: 'unset' },
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              bgcolor: '#FDFCF7',
              p: { xs: 3, sm: 4, md: 5 },
              '&::before': {
                content: '""', position: 'absolute', inset: 0,
                background: 'radial-gradient(circle at 10% 10%, rgba(6,78,59,0.06) 0%, transparent 55%), radial-gradient(circle at 90% 90%, rgba(6,78,59,0.06) 0%, transparent 55%)',
                zIndex: 0,
              },
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', width: '100%' }}>
              <Box sx={{ mb: { xs: 2, md: 3 } }}>
                <Box component="img" src={logo} alt="Logo" sx={{ height: { xs: 38, sm: 48, md: 64 }, mb: 0.5 }} />
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 900, color: GREEN, letterSpacing: 2, textTransform: 'uppercase', fontSize: '0.65rem' }}
                >
                  EvesCafe Rituals
                </Typography>
              </Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 900, color: '#111827', mb: { xs: 2, md: 3 }, lineHeight: 1.2,
                  fontFamily: "'Playfair Display', serif",
                  fontSize: { xs: '1rem', sm: '1.2rem', md: '1.7rem' },
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                Experience the <br />
                <span style={{ color: GREEN, fontStyle: 'italic' }}>Ancient Wisdom</span>
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(3, 1fr)', md: '1fr' },
                  gap: { xs: 1, md: 1.5 },
                  width: '100%',
                  maxWidth: { md: 280 },
                  mx: 'auto',
                }}
              >
                {[
                  { title: 'Customer-first', desc: 'Putting you in the center of every ritual', icon: <VerifiedIcon /> },
                  { title: 'Transparent', desc: 'Honest, clean labeling from the inside out', icon: <CleanHandsOutlined /> },
                  { title: 'Innovative', desc: 'Ancient wisdom meeting modern science', icon: <SpaOutlined /> },
                ].map((card, i) => (
                  <Box
                    key={i}
                    sx={{
                      p: { xs: 1, md: 1.5 }, borderRadius: 3,
                      bgcolor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(6,78,59,0.1)',
                      display: 'flex',
                      flexDirection: { xs: 'column', md: 'row' },
                      alignItems: 'center',
                      gap: { xs: 0.5, md: 1.5 },
                    }}
                  >
                    <Box
                      sx={{
                        width: { xs: 26, md: 40 }, height: { xs: 26, md: 40 },
                        borderRadius: 2, bgcolor: '#ECFDF5',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: GREEN, flexShrink: 0,
                      }}
                    >
                      {React.cloneElement(card.icon, { sx: { fontSize: { xs: 13, md: 20 } } })}
                    </Box>
                    <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                      <Typography sx={{ fontWeight: 900, fontSize: { xs: '0.58rem', md: '0.75rem' } }}>{card.title}</Typography>
                      <Typography
                        sx={{ color: '#6B7280', fontSize: '0.65rem', lineHeight: 1.2, display: { xs: 'none', md: 'block' } }}
                      >
                        {card.desc}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Right form */}
          <Box
            sx={{
              flex: 1,
              p: { xs: 3, sm: 4, md: 5 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              bgcolor: '#fff',
              overflowY: { xs: 'visible', md: 'auto' },
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 900, mb: 0.5, textAlign: 'center',
                letterSpacing: '-0.02em',
                fontFamily: "'Playfair Display', serif",
                fontSize: { xs: '1.4rem', sm: '1.7rem', md: '1.9rem' },
              }}
            >
              {authMode === 'login' ? 'Welcome Back!' : authMode === 'signup' ? 'Create Account' : 'Reset Password'}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: '#6B7280', mb: { xs: 2.5, md: 3.5 }, textAlign: 'center', fontWeight: 500, fontSize: '0.82rem' }}
            >
              {authMode === 'login'
                ? 'Please enter your account details'
                : authMode === 'signup'
                ? 'Join our botanical community'
                : 'Enter email to receive a reset link'}
            </Typography>

            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
                {authMode === 'signup' && (
                  <TextField fullWidth label="Full Name" variant="outlined" value={name} onChange={(e) => setName(e.target.value)} sx={fieldSx} required size="small" />
                )}
                <TextField fullWidth label="Email Address" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} sx={fieldSx} required type="email" size="small" />
                {authMode === 'signup' && (
                  <TextField fullWidth label="Mobile Number" variant="outlined" value={phoneNumber} onChange={(e) => setPhone(e.target.value)} sx={fieldSx} required size="small" />
                )}
                {authMode !== 'forgot' && (
                  <TextField
                    fullWidth label="Password" variant="outlined"
                    type={showPassword ? 'text' : 'password'}
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    sx={fieldSx} required size="small"
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                              {showPassword ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                )}
              </Box>

              {authMode === 'login' && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, md: 2.5 } }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        sx={{ color: '#D1D5DB', '&.Mui-checked': { color: GREEN }, p: 0.5 }}
                      />
                    }
                    label={<Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>Remember me</Typography>}
                  />
                </Box>
              )}

              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  py: { xs: 1.2, md: 1.4 }, borderRadius: 2, bgcolor: GREEN, fontWeight: 900,
                  textTransform: 'none', fontSize: '0.9rem',
                  boxShadow: '0 10px 20px rgba(6,78,59,0.2)',
                  '&:hover': { bgcolor: GREEN_DARK, transform: 'translateY(-1px)' },
                  transition: 'all 0.3s ease',
                }}
              >
                {loading
                  ? <CircularProgress size={22} sx={{ color: '#fff' }} />
                  : authMode === 'login' ? 'Login' : authMode === 'signup' ? 'Create Account' : 'Send Reset Link'}
              </Button>
            </form>

            <Box sx={{ mt: { xs: 2.5, md: 3 }, textAlign: 'center' }}>
              {authMode === 'login' ? (
                <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.82rem' }}>
                  Don't have an account?{' '}
                  <span onClick={() => setAuthMode('signup')} style={{ color: GREEN, fontWeight: 800, cursor: 'pointer' }}>Sign up</span>
                </Typography>
              ) : (
                <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.82rem' }}>
                  Already have an account?{' '}
                  <span onClick={() => setAuthMode('login')} style={{ color: GREEN, fontWeight: 800, cursor: 'pointer' }}>Login</span>
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Dialog>

      {/* ── Mobile Drawer ──────────────────────────────────────────── */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={toggleDrawer(false)}
        slotProps={{
          paper: {
            sx: {
              width: { xs: '82vw', sm: 340 },
              borderRadius: '20px 0 0 20px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
            },
          },
        }}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#fff' }}>
          {/* Drawer header */}
          <Box
            sx={{
              px: 2, py: 1.5,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              borderBottom: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            <img src={logo} alt="EvesCafe" style={{ height: 38, width: 'auto', objectFit: 'contain' }} />
            <IconButton
              onClick={toggleDrawer(false)}
              size="small"
              sx={{ transition: 'all 0.2s ease', '&:hover': { transform: 'rotate(90deg)', color: GREEN } }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* User greeting */}
          {currentUser && (
            <Box
              onClick={() => { setMobileOpen(false); navigate('/profile'); }}
              sx={{
                px: 2, py: 1.5,
                display: 'flex', alignItems: 'center', gap: 1.5,
                bgcolor: GREEN_LIGHT, borderBottom: '1px solid rgba(26,60,46,0.1)',
                cursor: 'pointer', transition: 'all 0.2s ease',
                '&:hover': { bgcolor: '#D1FAE5', transform: 'translateX(3px)' },
              }}
            >
              <Avatar sx={{ width: 36, height: 36, bgcolor: GREEN, fontSize: '0.75rem', fontWeight: 900 }}>
                {userInitials}
              </Avatar>
              <Box>
                <Typography sx={{ fontWeight: 900, fontSize: '0.85rem' }}>{currentUser.name}</Typography>
                <Typography sx={{ color: '#6B7280', fontSize: '0.7rem' }}>{currentUser.email}</Typography>
              </Box>
            </Box>
          )}

          {/* Nav list */}
          <List sx={{ flex: 1, overflow: 'auto', px: 1, pt: 1 }}>
            {formattedNavLinks.map((link) => (
              <ListItem key={link.name} disablePadding>
                <ListItemButton
                  component={Link}
                  to={link.path}
                  onClick={toggleDrawer(false)}
                  sx={{ borderRadius: 2.5, mb: 0.5, transition: 'all 0.2s ease', '&:hover': { bgcolor: `${GREEN}08`, transform: 'translateX(3px)' } }}
                >
                  <ListItemIcon sx={{ color: GREEN, minWidth: 40 }}>{link.icon}</ListItemIcon>
                  <ListItemText primary={link.name} primaryTypographyProps={{ fontWeight: 700, fontSize: '0.88rem' }} />
                </ListItemButton>
              </ListItem>
            ))}

            <Divider sx={{ my: 1, mx: 1 }} />

            {currentUser && (
              <>
                {profileMenuItems.map((item) => (
                  <ListItem key={item.label} disablePadding>
                    <ListItemButton
                      onClick={() => { setMobileOpen(false); navigate(item.path, { state: { tab: item.tab || 0 } }); }}
                      sx={{ borderRadius: 2.5, mb: 0.5, transition: 'all 0.2s ease', '&:hover': { bgcolor: GREEN_LIGHT, transform: 'translateX(3px)' } }}
                    >
                      <ListItemIcon sx={{ color: GREEN, minWidth: 40 }}>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 700, fontSize: '0.88rem' }} />
                    </ListItemButton>
                  </ListItem>
                ))}
                <Divider sx={{ my: 1, mx: 1 }} />
              </>
            )}

            {/* Shop by category */}
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => setMobileShopOpen(mobileShopOpen === 'all' ? null : 'all')}
                sx={{ py: 1.2, px: 2 }}
              >
                <ListItemText
                  primary="Shop By Category"
                  primaryTypographyProps={{
                    variant: 'overline', fontWeight: 900, color: 'text.secondary',
                    letterSpacing: 2, fontSize: '0.65rem',
                  }}
                />
                {mobileShopOpen === 'all'
                  ? <RemoveIcon sx={{ fontSize: 16 }} />
                  : <AddIcon sx={{ fontSize: 16 }} />}
              </ListItemButton>
            </ListItem>

            <Collapse in={mobileShopOpen === 'all' || (mobileShopOpen && mobileShopOpen !== 'all')}>
              <Box>
                {formattedShopCategories.map((cat) => {
                  const isOpen = mobileShopOpen === cat.name;
                  return (
                    <Box key={cat.name} sx={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                      <ListItem disablePadding>
                        <ListItemButton
                          onClick={() => setMobileShopOpen(isOpen ? null : cat.name)}
                          sx={{ py: 1.1, px: 2, transition: 'all 0.2s ease', '&:hover': { bgcolor: `${GREEN}04` } }}
                        >
                          <ListItemText
                            primary={cat.name}
                            primaryTypographyProps={{
                              fontSize: '0.72rem', fontWeight: 900,
                              textTransform: 'uppercase', letterSpacing: 1.5,
                              color: isOpen ? GREEN : '#111827',
                            }}
                          />
                          {isOpen
                            ? <CloseIcon sx={{ fontSize: 13, color: GREEN, opacity: 0.8 }} />
                            : <AddIcon sx={{ fontSize: 15, color: '#111827', opacity: 0.4 }} />}
                        </ListItemButton>
                      </ListItem>
                      <Collapse in={isOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding sx={{ bgcolor: '#F9FAFB', pb: 1 }}>
                          {cat.subCategories.map((sub) => (
                            <ListItem key={sub.name} disablePadding>
                              <ListItemButton
                                component={Link}
                                to={sub.path}
                                onClick={toggleDrawer(false)}
                                className="submenu-item-fade"
                                sx={{ py: 0.8, pl: 3, transition: 'all 0.2s ease', '&:hover': { transform: 'translateX(3px)' } }}
                              >
                                <ListItemText
                                  primary={sub.name}
                                  primaryTypographyProps={{ fontSize: '0.82rem', fontWeight: 500, color: '#4B5563' }}
                                />
                              </ListItemButton>
                            </ListItem>
                          ))}
                          <ListItem disablePadding>
                            <ListItemButton
                              component={Link}
                              to={cat.path}
                              onClick={toggleDrawer(false)}
                              sx={{ py: 0.8, pl: 3, transition: 'all 0.2s ease', '&:hover': { transform: 'translateX(3px)' } }}
                            >
                              <ListItemText
                                primary={`View all ${cat.name}`}
                                primaryTypographyProps={{
                                  fontSize: '0.68rem', fontWeight: 800,
                                  color: GREEN, textTransform: 'uppercase', letterSpacing: 1,
                                }}
                              />
                            </ListItemButton>
                          </ListItem>
                        </List>
                      </Collapse>
                    </Box>
                  );
                })}
              </Box>
            </Collapse>
          </List>

          {/* Drawer footer */}
          <Box sx={{ p: 2.5, bgcolor: '#F9FAFB', borderTop: '1px solid rgba(0,0,0,0.04)' }}>
            {currentUser ? (
              <Button
                fullWidth
                variant="outlined"
                onClick={() => { setMobileOpen(false); handleLogout(); }}
                sx={{
                  borderColor: '#EF4444', color: '#EF4444',
                  py: 1.2, borderRadius: 2.5, fontWeight: 900, textTransform: 'none', fontSize: '0.88rem',
                  transition: 'all 0.2s ease',
                  '&:hover': { bgcolor: '#FEF2F2', borderColor: '#EF4444', transform: 'translateY(-1px)' },
                }}
              >
                Sign Out
              </Button>
            ) : (
              <Button
                fullWidth
                variant="contained"
                onClick={() => { toggleDrawer(false)(); openLogin('login'); }}
                sx={{
                  bgcolor: GREEN, py: 1.2, borderRadius: 2.5, fontWeight: 900,
                  textTransform: 'none', fontSize: '0.88rem',
                  transition: 'all 0.2s ease',
                  '&:hover': { bgcolor: GREEN_DARK, transform: 'translateY(-1px)', boxShadow: `0 8px 20px rgba(26,60,46,0.15)` },
                }}
              >
                Sign In
              </Button>
            )}
            <Typography
              variant="caption"
              sx={{ display: 'block', textAlign: 'center', mt: 2, color: 'text.secondary', fontSize: '0.65rem' }}
            >
              © 2024 EvesCafe Botanical rituals.
            </Typography>
          </Box>
        </Box>
      </Drawer>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%', borderRadius: 2, fontWeight: 600 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Navbar;