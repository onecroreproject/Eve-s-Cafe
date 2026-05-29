import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { IMAGE_BASE_URL } from '../api/config';

// ── Design Tokens (Matching other pages) ──────────────────────────────────────────────
const G = '#1A3C2E';   // Dark Green
const G2 = '#0f2419';  // Darker Green
const A = '#B48253';   // Gold Accent
const SAGE = '#F4F5F2'; // Light background
const WHITE = '#FFFFFF';
const BLACK = '#000000';
const RED = '#e74c3c';

// ── Injected Global Styles ──────────────────────────────────────
const STYLES = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  
  .cart-root {
    font-family: 'Playfair Display', serif;
    background: ${WHITE};
    min-height: 100vh;
    color: ${BLACK};
    position: relative;
    overflow-x: hidden;
  }

  .cart-inner { position: relative; z-index: 1; max-width: 1340px; margin: 0 auto; padding: 0 32px; }

  /* Header */
  .cart-header {
    border-bottom: 1px solid #f0f0f0;
    padding: 28px 0;
  }

  /* Steps Card at Top */
  .steps-card-top {
    background: ${WHITE};
    border: 1px solid #f0f0f0;
    border-radius: 16px;
    padding: 20px 32px;
    margin-top: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 20px rgba(0,0,0,0.02);
  }
  
  .cart-steps {
    display: flex;
    align-items: center;
    gap: 0;
    width: 100%;
    max-width: 600px;
    justify-content: center;
  }
  
  .cart-step {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .cart-step-dot {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0;
    border: 1.5px solid #e0e0e0;
    color: #999;
    background: transparent;
    transition: all 0.3s;
  }
  
  .cart-step-dot.active {
    background: ${G};
    border-color: ${G};
    color: ${WHITE};
  }
  
  .cart-step-dot.done {
    background: ${G};
    border-color: ${G};
    color: ${WHITE};
  }
  
  .cart-step-label {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #999;
  }
  
  @media (max-width: 600px) {
    .cart-step-label { display: none; }
    .cart-step-divider { width: 20px; margin: 0 8px; }
  }
  
  .cart-step-label.active { color: ${BLACK}; }
  
  .cart-step-divider {
    width: 40px;
    height: 1px;
    background: #e0e0e0;
    margin: 0 12px;
  }

  /* Layout */
  .cart-layout {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 48px;
    padding: 60px 0 80px;
  }
  
  @media (max-width: 1000px) {
    .cart-layout { grid-template-columns: 1fr; }
  }

  /* Left col headline */
  .cart-headline {
    margin-bottom: 40px;
  }
  
  .cart-eyebrow {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: ${A};
    margin-bottom: 12px;
  }
  
  .cart-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 600;
    line-height: 1.1;
    color: ${BLACK};
  }
  
  .cart-title em {
    font-style: italic;
    color: ${A};
  }
  
  .cart-count {
    margin-top: 12px;
    font-size: 0.85rem;
    color: #999;
    font-weight: 400;
  }

  /* Cart Item Card */
  .cart-item {
    background: ${WHITE};
    border: 1px solid #f0f0f0;
    border-radius: 16px;
    padding: 24px;
    display: grid;
    grid-template-columns: 110px 1fr auto auto;
    gap: 24px;
    align-items: center;
    transition: all 0.35s ease;
    margin-bottom: 16px;
  }
  
  @media (max-width: 600px) {
    .cart-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 32px 24px;
      gap: 20px;
    }
    .cart-item-image {
      width: 140px;
      height: 140px;
      margin-bottom: 8px;
    }
    .qty-control {
      flex-direction: row !important;
      justify-content: center;
      gap: 24px;
      width: 100%;
      padding: 12px !important;
    }
    .cart-item-price {
      width: 100%;
      justify-content: center !important;
      border-top: 1px solid #f0f0f0;
      padding-top: 16px;
    }
  }
  
  .cart-item:hover {
    background: ${SAGE};
    box-shadow: 0 12px 30px rgba(0,0,0,0.05);
    transform: translateX(4px);
  }

  .cart-item-image {
    width: 110px;
    height: 110px;
    border-radius: 12px;
    background: ${SAGE};
    border: 1px solid #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex-shrink: 0;
  }
  
  .cart-item-image img {
    width: 80%;
    height: 80%;
    object-fit: contain;
  }

  .cart-item-info {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .cart-item-cat {
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: ${A};
    margin-bottom: 6px;
  }
  
  .cart-item-name {
    font-family: 'Playfair Display', serif;
    font-size: 1.2rem;
    font-weight: 600;
    color: ${G};
    line-height: 1.3;
    margin-bottom: 6px;
  }
  
  .cart-item-sub {
    font-size: 0.75rem;
    color: #999;
    margin-bottom: 16px;
  }
  
  .cart-item-remove {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #999;
    padding: 0;
    transition: color 0.2s;
    font-family: 'Playfair Display', serif;
  }
  
  .cart-item-remove:hover { color: ${RED}; }

  /* Qty control */
  .qty-control {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    background: ${WHITE};
    border: 1px solid #e0e0e0;
    border-radius: 40px;
    padding: 10px 8px;
  }
  
  .qty-btn {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 1px solid #e0e0e0;
    background: none;
    color: ${BLACK};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    line-height: 1;
    transition: all 0.2s;
    font-family: 'Playfair Display', serif;
  }
  
  .qty-btn:hover { background: ${G}; border-color: ${G}; color: white; }
  
  .qty-num {
    font-weight: 700;
    font-size: 0.9rem;
    min-width: 20px;
    text-align: center;
    color: ${BLACK};
  }

  .cart-item-price {
    text-align: right;
  }
  
  .price-main {
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem;
    font-weight: 700;
    color: ${G};
  }
  
  .price-unit {
    font-size: 0.7rem;
    color: #999;
    margin-top: 2px;
  }

  /* Back button */
  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 48px;
    background: none;
    border: none;
    cursor: pointer;
    font-family: 'Playfair Display', serif;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #999;
    transition: color 0.2s;
    padding: 0;
  }
  
  .back-btn:hover { color: ${G}; }

  /* ── ORDER SUMMARY PANEL ── */
  .summary-panel {
    background: ${WHITE};
    border-radius: 20px;
    overflow: hidden;
    position: sticky;
    top: 32px;
    border: 1px solid #f0f0f0;
    box-shadow: 0 40px 100px rgba(0,0,0,0.05);
  }

  .summary-top {
    background: ${G};
    padding: 28px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .summary-top-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.1rem;
    font-weight: 600;
    letter-spacing: 1px;
    color: ${WHITE};
  }
  
  .summary-badge {
    background: ${WHITE};
    color: ${G};
    font-size: 0.6rem;
    font-weight: 800;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 20px;
  }

  .summary-body { padding: 32px; }

  /* Mini items in summary */
  .summary-items { margin-bottom: 28px; }
  
  .summary-item-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 0;
    border-bottom: 1px solid ${SAGE};
  }
  
  .summary-item-row:last-child { border-bottom: none; }
  
  .summary-item-thumb {
    width: 44px;
    height: 44px;
    border-radius: 8px;
    background: ${SAGE};
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex-shrink: 0;
  }
  
  .summary-item-thumb img { width: 80%; height: 80%; object-fit: contain; }
  
  .summary-item-name {
    font-family: 'Playfair Display', serif;
    font-size: 0.9rem;
    font-weight: 600;
    color: ${G};
    flex: 1;
    line-height: 1.2;
  }
  
  .summary-item-qty {
    font-size: 0.7rem;
    color: #666;
    flex-shrink: 0;
  }
  
  .summary-item-p {
    font-weight: 700;
    font-size: 0.9rem;
    color: ${BLACK};
    flex-shrink: 0;
  }

  /* Shipping bar */
  .ship-bar-wrap {
    background: ${SAGE};
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 24px;
  }
  
  .ship-bar-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: #666;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
  }
  
  .ship-bar-label span { color: ${G}; font-weight: 700; }
  
  .ship-bar-track {
    height: 4px;
    background: #e0e0e0;
    border-radius: 4px;
    overflow: hidden;
  }
  
  .ship-bar-fill {
    height: 100%;
    background: ${G};
    border-radius: 4px;
    transition: width 0.6s ease;
  }

  /* Totals */
  .summary-totals { margin-bottom: 28px; }
  
  .totals-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
  }
  
  .totals-label {
    font-size: 0.85rem;
    color: #666;
    font-weight: 400;
  }
  
  .totals-value {
    font-size: 0.9rem;
    font-weight: 600;
    color: ${BLACK};
  }
  
  .totals-value.green { color: ${G}; }
  
  .totals-divider {
    height: 1px;
    background: ${SAGE};
    margin: 16px 0;
  }
  
  .totals-grand-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding-top: 4px;
  }
  
  .totals-grand-label {
    font-family: 'Playfair Display', serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: ${BLACK};
  }
  
  .totals-grand-label small {
    display: block;
    font-family: 'Playfair Display', serif;
    font-size: 0.65rem;
    font-weight: 400;
    color: #999;
    margin-top: 4px;
  }
  
  .totals-grand-amount {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    font-weight: 700;
    color: ${A};
    line-height: 1;
  }

  /* CTA Button */
  .cta-btn {
    width: 100%;
    background: ${G};
    border: none;
    border-radius: 12px;
    padding: 16px 24px;
    font-family: 'Playfair Display', serif;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: ${WHITE};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    transition: all 0.3s ease;
    margin-bottom: 20px;
  }
  
  .cta-btn:hover {
    background: ${A};
    transform: translateY(-2px);
    box-shadow: 0 16px 40px rgba(26,60,46,0.2);
  }

  /* Trust signals */
  .trust-row {
    display: flex;
    justify-content: space-between;
    padding-top: 16px;
    border-top: 1px solid ${SAGE};
  }
  
  .trust-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    flex: 1;
  }
  
  .trust-icon {
    width: 36px;
    height: 36px;
    background: ${SAGE};
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
  }
  
  .trust-text {
    font-size: 0.6rem;
    font-weight: 600;
    text-align: center;
    color: #666;
    line-height: 1.3;
    letter-spacing: 0.5px;
  }

  /* Delivery Form */
  .delivery-form {
    background: ${WHITE};
    border: 1px solid #f0f0f0;
    border-radius: 20px;
    padding: 32px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }
  
  .delivery-field-full {
    grid-column: 1 / -1;
  }
  
  .delivery-label {
    display: block;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 8px;
    color: #999;
  }
  
  .delivery-input, .delivery-textarea {
    width: 100%;
    padding: 12px 16px;
    border-radius: 10px;
    border: 1px solid #e0e0e0;
    font-family: 'Playfair Display', serif;
    font-size: 0.9rem;
    outline: none;
    transition: all 0.2s;
  }
  
  .delivery-input:focus, .delivery-textarea:focus {
    border-color: ${G};
    box-shadow: 0 0 0 3px rgba(26,60,46,0.1);
  }
  
  .delivery-textarea {
    min-height: 100px;
    resize: none;
  }
  
  .delivery-error {
    font-size: 0.65rem;
    color: ${RED};
    margin-top: 6px;
    font-weight: 600;
  }

  /* Payment Options */
  .payment-option {
    background: ${WHITE};
    border: 2px solid #f0f0f0;
    border-radius: 16px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .payment-option:hover {
    border-color: ${G};
    background: ${SAGE};
  }
  
  .payment-option.selected {
    border-color: ${G};
    background: ${SAGE};
  }
  
  .payment-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: ${SAGE};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
  }
  
  .payment-info {
    flex: 1;
  }
  
  .payment-title {
    font-weight: 700;
    font-size: 1rem;
    color: ${BLACK};
  }
  
  .payment-sub {
    font-size: 0.75rem;
    color: #999;
    margin-top: 2px;
  }
  
  .payment-radio {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid #e0e0e0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .payment-radio.selected {
    border-color: ${G};
  }
  
  .payment-radio.selected::after {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${G};
  }

  /* Empty state */
  .cart-empty {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 40px;
  }
  
  .empty-icon {
    font-size: 4rem;
    margin-bottom: 24px;
    opacity: 0.3;
  }
  
  .empty-title {
    font-family: 'Playfair Display', serif;
    font-size: 2.5rem;
    font-weight: 600;
    color: ${G};
    margin-bottom: 12px;
  }
  
  .empty-sub {
    font-size: 0.9rem;
    color: #999;
    margin-bottom: 40px;
  }
  
  .empty-btn {
    background: ${G};
    color: ${WHITE};
    border: none;
    border-radius: 12px;
    padding: 16px 40px;
    font-family: 'Playfair Display', serif;
    font-weight: 700;
    font-size: 0.85rem;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .empty-btn:hover {
    background: ${A};
    transform: translateY(-2px);
  }

  /* Mobile Sticky Bar */
  .mobile-cta-bar {
    display: none;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: rgba(255,255,255,0.95);
    backdrop-filter: blur(15px);
    border: 1px solid #f0f0f0;
    padding: 16px 20px;
    z-index: 1000;
    box-shadow: 0 10px 40px rgba(0,0,0,0.12);
    border-radius: 20px;
    width: calc(100% - 32px);
    left: 16px;
    bottom: 16px;
  }
  
  @media (max-width: 1000px) {
    .mobile-cta-bar { display: block; }
    .cart-layout { padding-bottom: 120px; }
  }
  
  .m-cta-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }
  
  .m-total-wrap { display: flex; flex-direction: column; text-align: right; }
  .m-total-label { font-size: 0.7rem; color: #999; font-weight: 600; text-transform: uppercase; }
  .m-total-val { font-size: 1.3rem; font-weight: 700; color: ${G}; }
  .m-btn {
    background: ${G};
    color: white;
    border: none;
    border-radius: 12px;
    padding: 14px 24px;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: 'Playfair Display', serif;
  }
  .m-btn:hover { background: ${A}; }
`;

// ── Icon SVGs ──────────────────────────────────────────────────
const ArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);
const Plus = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
);
const Minus = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="5" y1="12" x2="19" y2="12" /></svg>
);
const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);
const CheckSVG = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// ── Main Component ─────────────────────────────────────────────
export default function Cart() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('cart');
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [shipData, setShipData] = useState({
    name: '', email: '', phone: '', address: '', city: '', zip: ''
  });

  const [payMethod, setPayMethod] = useState('payu');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.textContent = STYLES;
    document.head.appendChild(styleEl);
    loadCart();
    return () => document.head.removeChild(styleEl);
  }, []);

  const loadCart = () => {
    const saved = localStorage.getItem('cartItems');
    const items = saved ? JSON.parse(saved) : [];
    setCartItems(items);
    if (items.length > 0) {
      fetchProductDetails(items);
    } else {
      setLoading(false);
    }
  };

  const fetchProductDetails = async (items) => {
    try {
      const ids = [...new Set(items.map(i => i.id))];
      const res = await api.get(`/products?ids=${ids.join(',')}`);
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch cart details:", err);
    } finally {
      setLoading(false);
    }
  };

  const validateDelivery = () => {
    let newErrors = {};
    if (!shipData.name.trim()) newErrors.name = 'Full name is required';
    if (!shipData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(shipData.email)) newErrors.email = 'Invalid email format';
    if (!shipData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!shipData.address.trim()) newErrors.address = 'Shipping address is required';
    if (!shipData.city.trim()) newErrors.city = 'City is required';
    if (!shipData.zip.trim()) newErrors.zip = 'Pincode is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.dispatchEvent(new CustomEvent('open-login-modal', { detail: { mode: 'login' } }));
      return;
    }

    if (currentStep === 'cart') {
      setCurrentStep('delivery');
    } else if (currentStep === 'delivery') {
      if (validateDelivery()) setCurrentStep('payment');
    } else if (currentStep === 'payment') {
      if (payMethod === 'payu') initiatePayUPayment();
      else alert('Order Placed Successfully!');
    }
  };

  const initiatePayUPayment = async () => {
    try {
      const txnid = 'TXN' + Date.now();
      const amount = total;
      const productinfo = enrichedItems.map(i => i.name).join(', ');
      const firstname = shipData.name.split(' ')[0] || 'Customer';
      const email = shipData.email;

      const res = await api.post('/payment/hash', {
        txnid, amount, productinfo, firstname, email,
        phone: shipData.phone, address: shipData.address,
        city: shipData.city, pincode: shipData.zip, cartItems: enrichedItems
      });

      if (res.data.success) {
        const { hash, action, key, surl, furl, cancel_url, txnid: backendTxnId, amount: backendAmount } = res.data;
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = action;
        const params = { key, txnid: backendTxnId, amount: backendAmount, productinfo, firstname, email, phone: shipData.phone, surl, furl, cancel_url, hash, service_provider: 'payu_paisa' };
        for (const [k, v] of Object.entries(params)) {
          const input = document.createElement('input');
          input.type = 'hidden'; input.name = k; input.value = v;
          form.appendChild(input);
        }
        document.body.appendChild(form);
        form.submit();
      }
    } catch (err) {
      console.error("PayU Error:", err);
      alert("Failed to initiate payment. Please try again.");
    }
  };

  const updateQty = (id, variant_id, delta) => {
    const updated = cartItems.map(i => 
      (i.id === id && i.variant_id === variant_id) 
        ? { ...i, quantity: Math.max(1, i.quantity + delta) } 
        : i
    );
    setCartItems(updated);
    localStorage.setItem('cartItems', JSON.stringify(updated));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const removeItem = (id, variant_id) => {
    const updated = cartItems.filter(i => !(i.id === id && i.variant_id === variant_id));
    setCartItems(updated);
    localStorage.setItem('cartItems', JSON.stringify(updated));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const formatImg = (path) => {
    if (!path || typeof path !== 'string') return 'https://placehold.co/400x400?text=Product';
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${IMAGE_BASE_URL}${cleanPath}`;
  };

  const enrichedItems = cartItems.map(item => {
    const product = products.find(p => p.id === item.id);
    if (!product) return { ...item, image: formatImg(item.image), unitPrice: item.price };
    const variant = product.variants?.find(v => v.id === item.variant_id) || product.variants?.[0];
    return {
      ...item, name: product.name, category: product.category?.name,
      image: formatImg(product.image), unitPrice: variant?.price || product.price,
      label: variant?.label || 'Standard'
    };
  });

  const subtotal = enrichedItems.reduce((s, i) => s + (i.unitPrice || 0) * i.quantity, 0);
  const freeShipAt = 5000;
  const shipping = subtotal >= freeShipAt ? 0 : 0;
  const total = subtotal + shipping;
  const shipProgress = Math.min(100, (subtotal / freeShipAt) * 100);
  const remaining = Math.max(0, freeShipAt - subtotal);

  if (loading) {
    return (
      <div className="cart-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <p style={{ fontFamily: 'Playfair Display', fontSize: '1.2rem', color: G }}>Loading your ritual...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-root">
        <div className="cart-empty">
          <div className="empty-icon">🌿</div>
          <h2 className="empty-title">Your Ritual is Empty</h2>
          <p className="empty-sub">Begin your botanical discovery to curate your collection.</p>
          <button className="empty-btn" onClick={() => navigate('/shop')}>Explore the Collection</button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-root">
      <div className="cart-inner">
        {/* Steps Card at Top */}
        <div className="steps-card-top">
          <div className="cart-steps">
            {[
              { id: 'cart', label: 'Cart' },
              { id: 'delivery', label: 'Delivery' },
              { id: 'payment', label: 'Payment' }
            ].map((step, i) => {
              const isActive = currentStep === step.id;
              const isDone = (currentStep === 'delivery' && i === 0) || (currentStep === 'payment' && i < 2);
              return (
                <React.Fragment key={step.id}>
                  {i > 0 && <div className="cart-step-divider" />}
                  <div className="cart-step" style={{ cursor: isDone ? 'pointer' : 'default' }} onClick={() => isDone && setCurrentStep(step.id)}>
                    <div className={`cart-step-dot ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}>
                      {isDone ? <CheckSVG /> : `0${i + 1}`}
                    </div>
                    <span className={`cart-step-label ${isActive ? 'active' : ''}`}>{step.label}</span>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="cart-layout">
          {/* LEFT: Content Area */}
          <div>
            {currentStep === 'cart' && (
              <>
                <div className="cart-headline">
                  <p className="cart-eyebrow">Your Selection</p>
                  <h1 className="cart-title">Shopping <em>Collection</em></h1>
                  <p className="cart-count">{enrichedItems.length} curated botanical items</p>
                </div>

                {enrichedItems.map(item => (
                  <div key={`${item.id}-${item.variant_id}`} className="cart-item">
                    <div className="cart-item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="cart-item-info">
                      <p className="cart-item-cat">{item.category}</p>
                      <p className="cart-item-name">{item.name}</p>
                      <p className="cart-item-sub">{item.label} · ₹{item.unitPrice?.toLocaleString('en-IN')} per unit</p>
                      <button className="cart-item-remove" onClick={() => removeItem(item.id, item.variant_id)}>Remove</button>
                    </div>
                    <div className="qty-control">
                      <button className="qty-btn" onClick={() => updateQty(item.id, item.variant_id, 1)}><Plus /></button>
                      <span className="qty-num">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateQty(item.id, item.variant_id, -1)}><Minus /></button>
                    </div>
                    <div className="cart-item-price">
                      <p className="price-main">₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}</p>
                      {item.quantity > 1 && <p className="price-unit">×{item.quantity} units</p>}
                    </div>
                  </div>
                ))}

                <button className="back-btn" onClick={() => navigate('/shop')}><ArrowLeft /> Continue Discovery</button>
              </>
            )}

            {currentStep === 'delivery' && (
              <>
                <div className="cart-headline">
                  <p className="cart-eyebrow">Step 02</p>
                  <h1 className="cart-title">Delivery <em>Sanctum</em></h1>
                  <p className="cart-count">Where shall we send your botanical treasures?</p>
                </div>

                <div className="delivery-form">
                  <div className="delivery-field-full">
                    <label className="delivery-label">Full Name</label>
                    <input className="delivery-input" placeholder="Enter your name" value={shipData.name} onChange={e => {setShipData({...shipData, name: e.target.value}); setErrors({...errors, name: ''})}} style={{borderColor: errors.name ? RED : '#e0e0e0'}} />
                    {errors.name && <p className="delivery-error">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="delivery-label">Email Address</label>
                    <input className="delivery-input" placeholder="email@example.com" value={shipData.email} onChange={e => {setShipData({...shipData, email: e.target.value}); setErrors({...errors, email: ''})}} style={{borderColor: errors.email ? RED : '#e0e0e0'}} />
                    {errors.email && <p className="delivery-error">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="delivery-label">Phone Number</label>
                    <input className="delivery-input" placeholder="+91" value={shipData.phone} onChange={e => {setShipData({...shipData, phone: e.target.value}); setErrors({...errors, phone: ''})}} style={{borderColor: errors.phone ? RED : '#e0e0e0'}} />
                    {errors.phone && <p className="delivery-error">{errors.phone}</p>}
                  </div>
                  <div className="delivery-field-full">
                    <label className="delivery-label">Shipping Address</label>
                    <textarea className="delivery-textarea" placeholder="Street, Building, Landmark..." value={shipData.address} onChange={e => {setShipData({...shipData, address: e.target.value}); setErrors({...errors, address: ''})}} style={{borderColor: errors.address ? RED : '#e0e0e0'}} />
                    {errors.address && <p className="delivery-error">{errors.address}</p>}
                  </div>
                  <div>
                    <label className="delivery-label">City</label>
                    <input className="delivery-input" placeholder="Your City" value={shipData.city} onChange={e => {setShipData({...shipData, city: e.target.value}); setErrors({...errors, city: ''})}} style={{borderColor: errors.city ? RED : '#e0e0e0'}} />
                    {errors.city && <p className="delivery-error">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="delivery-label">Pincode</label>
                    <input className="delivery-input" placeholder="600000" value={shipData.zip} onChange={e => {setShipData({...shipData, zip: e.target.value}); setErrors({...errors, zip: ''})}} style={{borderColor: errors.zip ? RED : '#e0e0e0'}} />
                    {errors.zip && <p className="delivery-error">{errors.zip}</p>}
                  </div>
                </div>

                <button className="back-btn" onClick={() => setCurrentStep('cart')}><ArrowLeft /> Back to Collection</button>
              </>
            )}

            {currentStep === 'payment' && (
              <>
                <div className="cart-headline">
                  <p className="cart-eyebrow">Step 03</p>
                  <h1 className="cart-title">Payment <em>Sanctuary</em></h1>
                  <p className="cart-count">Securely complete your botanical investment.</p>
                </div>

                <div style={{ display: 'grid', gap: '16px' }}>
                  {[
                    { id: 'payu', label: 'PayU Money / Secure Pay', icon: '💎', sub: 'Secure online payment' },
                    { id: 'card', label: 'Credit / Debit Card', icon: '💳', sub: 'Visa, Mastercard, RuPay' },
                    { id: 'upi', label: 'UPI / PhonePe / GPay', icon: '📱', sub: 'Instant bank transfer' },
                    { id: 'cod', label: 'Cash on Delivery', icon: '💵', sub: 'Pay when you receive' }
                  ].map(m => (
                    <div key={m.id} onClick={() => setPayMethod(m.id)} className={`payment-option ${payMethod === m.id ? 'selected' : ''}`}>
                      <div className="payment-icon">{m.icon}</div>
                      <div className="payment-info">
                        <p className="payment-title">{m.label}</p>
                        <p className="payment-sub">{m.sub}</p>
                      </div>
                      <div className={`payment-radio ${payMethod === m.id ? 'selected' : ''}`} />
                    </div>
                  ))}
                </div>

                <button className="back-btn" onClick={() => setCurrentStep('delivery')}><ArrowLeft /> Back to Delivery</button>
              </>
            )}
          </div>

          {/* RIGHT: Summary Panel */}
          <div>
            <div className="summary-panel">
              <div className="summary-top">
                <span className="summary-top-title">Order Summary</span>
                <span className="summary-badge">Secure Checkout</span>
              </div>

              <div className="summary-body">
                <div className="ship-bar-wrap">
                  <div className="ship-bar-label">
                    {shipping === 0
                      ? <><span>✓ Free Shipping Unlocked</span><span>—</span></>
                      : <>Add <span>₹{remaining.toLocaleString('en-IN')}</span> for free shipping</>
                    }
                  </div>
                  <div className="ship-bar-track">
                    <div className="ship-bar-fill" style={{ width: `${shipProgress}%` }} />
                  </div>
                </div>

                <div className="summary-items">
                  {enrichedItems.map(item => (
                    <div key={`${item.id}-${item.variant_id}`} className="summary-item-row">
                      <div className="summary-item-thumb"><img src={item.image} alt={item.name} /></div>
                      <span className="summary-item-name">{item.name}</span>
                      <span className="summary-item-qty">×{item.quantity}</span>
                      <span className="summary-item-p">₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>

                <div className="summary-totals">
                  <div className="totals-row">
                    <span className="totals-label">Subtotal</span>
                    <span className="totals-value">₹ {subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="totals-row">
                    <span className="totals-label">Shipping</span>
                    <span className={`totals-value ${shipping === 0 ? 'green' : ''}`}>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                  </div>
                  <div className="totals-divider" />
                  <div className="totals-grand-row">
                    <div className="totals-grand-label">Total<small>All taxes included</small></div>
                    <span className="totals-grand-amount">₹ {total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button className="cta-btn" onClick={handleNextStep}>
                  <span>
                    {!localStorage.getItem('token') && currentStep === 'cart' ? 'Login to Proceed' : (
                      <>
                        {currentStep === 'cart' && 'Proceed to Delivery'}
                        {currentStep === 'delivery' && 'Proceed to Payment'}
                        {currentStep === 'payment' && 'Place Order Ritual'}
                      </>
                    )}
                  </span>
                  <ArrowRight />
                </button>

                <div className="trust-row">
                  <div className="trust-item"><div className="trust-icon">🔒</div><span className="trust-text">SSL Secure</span></div>
                  <div className="trust-item"><div className="trust-icon">🌿</div><span className="trust-text">Carbon Neutral</span></div>
                  <div className="trust-item"><div className="trust-icon">✓</div><span className="trust-text">Purity Guarantee</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bar */}
      <div className="mobile-cta-bar">
        <div className="m-cta-inner">
          <div className="m-total-wrap">
            <span className="m-total-label">Total Ritual</span>
            <span className="m-total-val">₹ {total.toLocaleString('en-IN')}</span>
          </div>
          <button className="m-btn" onClick={handleNextStep}>
            {!localStorage.getItem('token') && currentStep === 'cart' ? 'Login' : (
              <>
                {currentStep === 'cart' && 'Checkout'}
                {currentStep === 'delivery' && 'Pay Now'}
                {currentStep === 'payment' && 'Confirm'}
              </>
            )} <ArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}