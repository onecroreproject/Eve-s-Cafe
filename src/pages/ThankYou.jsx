import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const T = {
  primary: '#1A3C2E',
  accent: '#B48253',
  bg: '#FDFCF9',
  red: '#E07070',
  orange: '#F59E0B',
};

const STATUS_CONFIG = {
  success: {
    icon: '🌿',
    title: 'Ritual Confirmed',
    color: T.primary,
    message: 'Thank you for choosing EvesCafe. Your botanical treasures are being lovingly prepared and will arrive soon.',
    btnLabel: 'View My Orders',
    btnPath: '/profile',
    tab: 1,
  },
  failed: {
    icon: '✗',
    title: 'Payment Failed',
    color: T.red,
    message: 'Your payment could not be processed. No amount has been deducted. Please try again or use a different payment method.',
    btnLabel: 'Try Again',
    btnPath: '/cart',
  },
  cancelled: {
    icon: '↩',
    title: 'Payment Cancelled',
    color: T.orange,
    message: 'You cancelled the payment. Your cart is still saved. Whenever you are ready, we will be here to complete your ritual.',
    btnLabel: 'Return to Cart',
    btnPath: '/cart',
  },
  tampered: {
    icon: '⚠',
    title: 'Security Alert',
    color: T.red,
    message: 'We detected a security mismatch with your payment. No amount has been deducted. Please contact our support team.',
    btnLabel: 'Contact Support',
    btnPath: '/contact',
  },
};

const ThankYou = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState('success');
  const [txnid, setTxnid] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const s = params.get('status') || 'success';
    setStatus(s);
    setTxnid(params.get('txnid'));

    if (s === 'success') {
      localStorage.removeItem('cartItems');
      window.dispatchEvent(new Event('cart-updated'));
    }
  }, [location]);

  const config = STATUS_CONFIG[status] || STATUS_CONFIG.failed;

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: T.bg,
      padding: '40px 20px',
      fontFamily: "'Playfair Display', serif",
    }}>
      <div style={{
        maxWidth: '580px',
        width: '100%',
        textAlign: 'center',
        background: 'white',
        padding: '60px 40px',
        borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.06)',
      }}>
        {/* Icon */}
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: `${config.color}15`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px',
          fontSize: '2rem', color: config.color, fontWeight: 900,
        }}>
          {config.icon}
        </div>

        {/* Title */}
        <h1 style={{ color: config.color, fontSize: '2.2rem', fontWeight: 700, marginBottom: '16px' }}>
          {config.title}
        </h1>

        {/* Message */}
        <p style={{ color: '#666', fontSize: '1rem', marginBottom: '28px', lineHeight: 1.7, maxWidth: '420px', margin: '0 auto 28px' }}>
          {config.message}
        </p>

        {/* Transaction ID (only for non-cancelled) */}
        {txnid && status !== 'cancelled' && (
          <div style={{
            background: '#F8F9FA', padding: '14px 20px',
            borderRadius: '10px', marginBottom: '32px',
            fontSize: '0.85rem', color: '#888',
          }}>
            Transaction ID: <span style={{ color: T.primary, fontWeight: 700 }}>{txnid}</span>
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate(config.btnPath, { state: { tab: config.tab || 0 } })}
            style={{
              padding: '14px 28px', background: config.color, color: 'white',
              border: 'none', borderRadius: '12px', fontWeight: 700,
              cursor: 'pointer', fontSize: '0.9rem', fontFamily: "'Playfair Display', serif",
            }}
          >
            {config.btnLabel}
          </button>
          <button
            onClick={() => navigate('/shop')}
            style={{
              padding: '14px 28px', background: 'white', color: T.primary,
              border: `1.5px solid ${T.primary}`, borderRadius: '12px', fontWeight: 700,
              cursor: 'pointer', fontSize: '0.9rem', fontFamily: "'Playfair Display', serif",
            }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
