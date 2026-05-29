import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import HairCare from './pages/HairCare';
import ProductDetail from './pages/ProductDetail';
import Shop from './pages/Shop';
import Bestsellers from './pages/Bestsellers';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Cart from './pages/Cart';
import Terms from './pages/Terms';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RefundPolicy from './pages/RefundPolicy';
import Videos from './pages/Videos';
import DeleteAccount from './pages/DeleteAccount';
import Profile from './pages/Profile';
import MyOrders from './pages/MyOrders';
import Wishlist from './pages/Wishlist';
import ThankYou from './pages/ThankYou';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1E4632', // Deep Botanical Green
    },
    secondary: {
      main: '#8B5A2B', // Espresso Accent
    },
  },
  typography: {
    fontFamily: "'Playfair Display', serif",
    h1: {
      fontFamily: "'Playfair Display', serif",
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontFamily: "'Playfair Display', serif",
      fontSize: '2.25rem', // Matches standard luxury-title
      fontWeight: 700,
    },
    h3: {
      fontFamily: "'Playfair Display', serif",
      fontSize: '1.75rem',
      fontWeight: 700,
    },
    h4: {
      fontFamily: "'Playfair Display', serif",
      fontSize: '1.4rem',
      fontWeight: 700,
    },
    h5: {
      fontFamily: "'Playfair Display', serif",
      fontSize: '1.2rem',
      fontWeight: 700,
    },
    h6: {
      fontFamily: "'Playfair Display', serif",
      fontSize: '1.05rem', // Matches luxury-subtitle
      fontWeight: 700,
    },
    body1: {
      fontFamily: "'Playfair Display', serif",
      fontSize: '1.05rem', // Matches luxury-description
      lineHeight: 1.8,
    },
    body2: {
      fontFamily: "'Playfair Display', serif",
      fontSize: '0.88rem', // Matches luxury-child-description
      lineHeight: 1.6,
    },
    subtitle1: {
      fontFamily: "'Playfair Display', serif",
      fontSize: '1.05rem',
      fontWeight: 600,
    },
    subtitle2: {
      fontFamily: "'Playfair Display', serif",
      fontSize: '0.88rem',
      fontWeight: 600,
    },
    button: {
      fontFamily: "'Playfair Display', serif",
      fontWeight: 700,
    },
  },
});

function AppContent() {
  const location = useLocation();

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <Navbar />
      <main style={{ paddingTop: '105px' }} className="md:pt-[110px]">
        {/* Elegant Page Route Transition Wrapper */}
        <div key={location.pathname} className="page-fade-in-transition">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/shop/:cat/:subcat" element={<Shop />} />
            <Route path="/shop/:cat" element={<Shop />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/bestseller" element={<Bestsellers />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/delete-account" element={<DeleteAccount />} />
            <Route path="/thank-you" element={<ThankYou />} />

            {/* New Routes for Profile */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/wishlist" element={<Wishlist />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'botanical');
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
