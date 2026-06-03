import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
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
    font-style: normal;
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
    align-self: start;
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

  /* Saved Address Cards */
  .address-cards-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    margin-bottom: 24px;
    grid-column: 1 / -1;
  }
  
  @media (min-width: 600px) {
    .address-cards-grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  .address-card {
    background: ${WHITE};
    border: 2px solid #f0f0f0;
    border-radius: 16px;
    padding: 20px;
    display: flex;
    gap: 16px;
    cursor: pointer;
    position: relative;
    transition: all 0.2s;
    text-align: left;
  }
  
  .address-card:hover {
    border-color: ${G};
    background: ${SAGE};
  }
  
  .address-card.selected {
    border-color: ${G};
    background: ${SAGE};
  }

  .address-card.default-border {
    border-color: ${G}80;
  }

  .address-card.selected.default-border {
    border-color: ${G};
  }
  
  .address-card-radio {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid #e0e0e0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 2px;
  }
  
  .address-card-radio.selected {
    border-color: ${G};
  }
  
  .address-card-radio.selected::after {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${G};
  }
  
  .address-card-content {
    flex: 1;
  }
  
  .address-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;
  }
  
  .address-card-title {
    font-weight: 700;
    font-size: 0.95rem;
    color: ${BLACK};
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .address-card-badge {
    background: ${G};
    color: ${WHITE};
    font-size: 0.6rem;
    font-weight: 800;
    padding: 2px 8px;
    border-radius: 20px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-family: 'Playfair Display', serif;
  }
  
  .address-card-text {
    font-size: 0.82rem;
    color: #555;
    line-height: 1.5;
    margin-bottom: 4px;
  }
  
  .address-card-phone {
    font-size: 0.72rem;
    color: #888;
    font-weight: 600;
  }

  .address-form-toggle-btn {
    background: none;
    border: 2px dashed #d0d0d0;
    border-radius: 16px;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    cursor: pointer;
    font-family: 'Playfair Display', serif;
    font-size: 0.95rem;
    font-weight: 700;
    color: #666;
    transition: all 0.2s;
    width: 100%;
    margin-bottom: 24px;
    grid-column: 1 / -1;
  }
  
  .address-form-toggle-btn:hover {
    border-color: ${G};
    color: ${G};
    background: ${SAGE};
  }

  .address-checkbox-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
    grid-column: 1 / -1;
    margin-top: 8px;
    text-align: left;
  }

  .address-checkbox {
    width: 18px;
    height: 18px;
    accent-color: ${G};
    cursor: pointer;
  }

  .address-checkbox-label {
    font-size: 0.8rem;
    color: #444;
    cursor: pointer;
    font-family: 'Playfair Display', serif;
    font-weight: 600;
  }
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
  
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = localStorage.getItem('token');
    return !!(token && token !== 'undefined' && token !== 'null');
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [shipData, setShipData] = useState({
    name: '', email: '', phone: '', address: '', city: '', zip: '', address_id: null
  });

  const [payMethod, setPayMethod] = useState('payu');
  const [errors, setErrors] = useState({});

  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [paypalConfig, setPaypalConfig] = useState(null);
  const [sdkLoading, setSdkLoading] = useState(false);

  // Address selection state additions
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    type: 'Home', street: '', landmark: '', city: '', state: '', pincode: '', phone: '', alternate_phone: '', is_default: false, save_future: true
  });
  const [addressErrors, setAddressErrors] = useState({});

  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.textContent = STYLES;
    document.head.appendChild(styleEl);
    loadCart();
    return () => document.head.removeChild(styleEl);
  }, []);

  useEffect(() => {
    const handleLoginSuccess = () => {
      setIsLoggedIn(true);
      if (currentStep === 'cart') {
        setCurrentStep('delivery');
        loadSavedAddresses();
      }
    };
    const handleLogoutSuccess = () => {
      setIsLoggedIn(false);
      setCurrentStep('cart');
    };
    window.addEventListener('login-success', handleLoginSuccess);
    window.addEventListener('logout-success', handleLogoutSuccess);
    return () => {
      window.removeEventListener('login-success', handleLoginSuccess);
      window.removeEventListener('logout-success', handleLogoutSuccess);
    };
  }, [currentStep]);



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

  const loadSavedAddresses = async () => {
    try {
      const res = await api.get('/addresses');
      if (res.data.status === 'success') {
        const list = res.data.data;
        setSavedAddresses(list);
        
        if (list.length > 0) {
          const defaultAddr = list.find(a => a.is_default);
          if (defaultAddr) {
            setSelectedAddressId(defaultAddr.id);
            setShipData(prev => ({
              ...prev,
              phone: defaultAddr.phone || prev.phone,
              address: defaultAddr.address,
              city: defaultAddr.city,
              zip: defaultAddr.pincode,
              address_id: defaultAddr.id
            }));
          } else {
            setSelectedAddressId(list[0].id);
            setShipData(prev => ({
              ...prev,
              phone: list[0].phone || prev.phone,
              address: list[0].address,
              city: list[0].city,
              zip: list[0].pincode,
              address_id: list[0].id
            }));
          }
          setShowNewAddressForm(false);
        } else {
          setShowNewAddressForm(true);
        }
      }
    } catch (err) {
      console.error("Failed to load saved addresses:", err);
      setShowNewAddressForm(true);
    }
  };

  const handleSelectAddress = (addr) => {
    setSelectedAddressId(addr.id);
    setShipData(prev => ({
      ...prev,
      phone: addr.phone || prev.phone,
      address: addr.address,
      city: addr.city,
      zip: addr.pincode,
      address_id: addr.id
    }));
  };

  const validateDelivery = () => {
    let newErrors = {};
    let newAddrErrors = {};
    
    if (!shipData.name.trim()) newErrors.name = 'Full name is required';
    if (!shipData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(shipData.email)) newErrors.email = 'Invalid email format';

    if (showNewAddressForm) {
      if (!newAddress.street || !newAddress.street.trim()) newAddrErrors.street = 'Street address is required';
      if (!newAddress.city || !newAddress.city.trim()) newAddrErrors.city = 'City is required';
      if (!newAddress.state || !newAddress.state.trim()) newAddrErrors.state = 'State is required';
      
      if (!newAddress.pincode || !newAddress.pincode.trim()) {
        newAddrErrors.pincode = 'Pincode is required';
      } else if (!/^\d{6}$/.test(newAddress.pincode.trim())) {
        newAddrErrors.pincode = 'Pincode must be a valid 6-digit number';
      }
      
      if (!newAddress.phone || !newAddress.phone.trim()) {
        newAddrErrors.phone = 'Phone number is required';
      } else if (!/^\d{10}$/.test(newAddress.phone.trim())) {
        newAddrErrors.phone = 'Phone must be a valid 10-digit number';
      }
      
      if (newAddress.alternate_phone && newAddress.alternate_phone.trim() && !/^\d{10}$/.test(newAddress.alternate_phone.trim())) {
        newAddrErrors.alternate_phone = 'Alternate phone must be a 10-digit number';
      }
      
      setErrors(newErrors);
      setAddressErrors(newAddrErrors);
      return Object.keys(newErrors).length === 0 && Object.keys(newAddrErrors).length === 0;
    } else {
      if (!selectedAddressId) {
        newErrors.selectedAddress = 'Please select a saved shipping address';
      }
      if (!shipData.phone || !shipData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      }
      setErrors(newErrors);
      setAddressErrors({});
      return Object.keys(newErrors).length === 0;
    }
  };

  const handleNextStep = async () => {
    const currentToken = localStorage.getItem('token');
    if (!currentToken || currentToken === 'undefined' || currentToken === 'null') {
      setIsLoggedIn(false);
      window.dispatchEvent(new CustomEvent('open-login-modal', { detail: { mode: 'login' } }));
      return;
    }

    if (currentStep === 'cart') {
      setCurrentStep('delivery');
      loadSavedAddresses();
    } else if (currentStep === 'delivery') {
      if (validateDelivery()) {
        setLoading(true);
        try {
          if (showNewAddressForm) {
            const combinedAddress = [
              newAddress.street,
              newAddress.landmark,
              newAddress.city,
              newAddress.state,
              newAddress.pincode
            ].filter(part => part && part.trim() !== '').join(', ');

            let addressId = null;

            if (newAddress.save_future) {
              const res = await api.post('/addresses', {
                type: newAddress.type,
                address_type: newAddress.type,
                address: combinedAddress,
                street: newAddress.street,
                landmark: newAddress.landmark,
                city: newAddress.city,
                state: newAddress.state,
                pincode: newAddress.pincode,
                phone: newAddress.phone,
                alternate_phone: newAddress.alternate_phone,
                is_default: newAddress.is_default
              });
              if (res.data.status === 'success') {
                addressId = res.data.data.id;
              }
            }

            setShipData(prev => ({
              ...prev,
              phone: newAddress.phone,
              address: combinedAddress,
              city: newAddress.city,
              zip: newAddress.pincode,
              address_id: addressId
            }));
          } else {
            setShipData(prev => ({
              ...prev,
              address_id: selectedAddressId
            }));
          }
          setCurrentStep('payment');
        } catch (err) {
          console.error("Fulfillment address setup failed:", err);
          alert("Failed to setup delivery address. Please try again.");
        } finally {
          setLoading(false);
        }
      }
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
        city: shipData.city, pincode: shipData.zip, cartItems: enrichedItems,
        address_id: shipData.address_id
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

  const handleSimulatePayment = async () => {
    setLoading(true);
    try {
      const res = await api.post('/payment/paypal/simulate', {
        amount: total,
        firstname: shipData.name,
        email: shipData.email,
        phone: shipData.phone,
        address: shipData.address,
        city: shipData.city,
        pincode: shipData.zip,
        cartItems: enrichedItems,
        address_id: shipData.address_id
      });

      if (res.data.success) {
        navigate(`/thank-you?status=success&txnid=${res.data.paypal_order_id}`);
      } else {
        alert(res.data.message || "Simulation failed");
      }
    } catch (err) {
      console.error("Simulation Error:", err);
      alert("Failed to simulate checkout.");
    } finally {
      setLoading(false);
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

  useEffect(() => {
    if (payMethod === 'paypal' && currentStep === 'payment' && !paypalConfig && !sdkLoading) {
      const fetchPaypalConfig = async () => {
        setSdkLoading(true);
        try {
          const res = await api.get('/payment/paypal/config');
          if (res.data.success) {
            setPaypalConfig(res.data);
          } else {
            console.error("Failed to load PayPal config", res.data);
          }
        } catch (err) {
          console.error("Failed to load PayPal config", err);
        } finally {
          setSdkLoading(false);
        }
      };
      fetchPaypalConfig();
    }
  }, [payMethod, currentStep, paypalConfig, sdkLoading]);

  useEffect(() => {
    if (paypalConfig && !window.paypal && !paypalLoaded) {
      let clientId = paypalConfig.client_id || 'test';
      
      // If it looks like a placeholder, use 'test'
      if (
        paypalConfig.mode === 'sandbox' &&
        (!clientId ||
          clientId.includes('your_') ||
          clientId.includes('abc_') ||
          clientId.includes('secret') ||
          clientId === 'AdpL5X_Y5L7cQ-T8c4G8qX7_3u_X8PqL5X_Y5L7cQ-T8c4G8qX7_3u_X8Pq')
      ) {
        console.warn("Using PayPal 'test' client-id fallback for sandbox mode");
        clientId = 'test';
      }

      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${paypalConfig.currency || 'USD'}`;
      script.async = true;
      
      const handleLoadSuccess = () => {
        setPaypalLoaded(true);
      };
      
      const handleLoadFailure = (err) => {
        console.error("PayPal SDK failed to load with client ID: " + clientId + ". Retrying with 'test'...", err);
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
        
        if (clientId !== 'test') {
          const fallbackScript = document.createElement('script');
          fallbackScript.src = `https://www.paypal.com/sdk/js?client-id=test&currency=${paypalConfig.currency || 'USD'}`;
          fallbackScript.async = true;
          fallbackScript.onload = () => {
            setPaypalLoaded(true);
          };
          fallbackScript.onerror = (fallbackErr) => {
            console.error("PayPal SDK failed to load even with 'test' client-id:", fallbackErr);
            alert("Failed to load PayPal secure payment gateway. Please choose another payment method.");
          };
          document.body.appendChild(fallbackScript);
        } else {
          alert("Failed to load PayPal secure payment gateway. Please choose another payment method.");
        }
      };

      script.onload = handleLoadSuccess;
      script.onerror = handleLoadFailure;
      document.body.appendChild(script);
    } else if (window.paypal) {
      setPaypalLoaded(true);
    }
  }, [paypalConfig, paypalLoaded]);

  useEffect(() => {
    let buttonsInstance = null;

    if (paypalLoaded && currentStep === 'payment' && payMethod === 'paypal') {
      const container = document.getElementById('paypal-button-container');
      if (container && window.paypal) {
        container.innerHTML = '';
        try {
          buttonsInstance = window.paypal.Buttons({
            createOrder: async () => {
              try {
                const res = await api.post('/payment/paypal/create', {
                  amount: total,
                  firstname: shipData.name,
                  email: shipData.email,
                  phone: shipData.phone,
                  address: shipData.address,
                  city: shipData.city,
                  pincode: shipData.zip,
                  cartItems: enrichedItems,
                  address_id: shipData.address_id
                });
                if (res.data.success && res.data.paypal_order_id) {
                  return res.data.paypal_order_id;
                } else {
                  alert(res.data.message || "Failed to create order on server");
                  throw new Error("Order creation failed");
                }
              } catch (err) {
                console.error("PayPal Create Order Error:", err);
                alert("Could not initialize PayPal transaction. Please try again.");
                throw err;
              }
            },
            onApprove: async (data, actions) => {
              try {
                const res = await api.post('/payment/paypal/capture', {
                  paypal_order_id: data.orderID
                });
                if (res.data.success) {
                  navigate(`/thank-you?status=success&txnid=${data.orderID}`);
                } else {
                  alert(res.data.message || "Payment capture failed");
                }
              } catch (err) {
                console.error("PayPal Capture Error:", err);
                alert("Payment capture failed. Please contact support.");
              }
            },
            onError: (err) => {
              console.error("PayPal Button Error:", err);
              alert("An error occurred with PayPal. Please try another payment method.");
            },
            onCancel: () => {
              console.log("User cancelled PayPal payment");
            }
          });

          buttonsInstance.render('#paypal-button-container');
        } catch (renderError) {
          console.error("PayPal button rendering error: ", renderError);
        }
      }
    }

    return () => {
      if (buttonsInstance && buttonsInstance.close) {
        buttonsInstance.close();
      }
    };
  }, [paypalLoaded, currentStep, payMethod, total, shipData, enrichedItems, navigate]);

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
          <div style={{ marginTop: '24px' }}>
            <Button to="/shop" variant="outline" icon="arrow-right">Explore the Collection</Button>
          </div>
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
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', color: G, borderBottom: '1px solid #f0f0f0', paddingBottom: '8px', marginBottom: '8px' }}>
                      Recipient Details
                    </h3>
                  </div>

                  <div className="delivery-field-full">
                    <label className="delivery-label">Full Name</label>
                    <input className="delivery-input" placeholder="Enter your name" value={shipData.name} onChange={e => {setShipData({...shipData, name: e.target.value}); setErrors({...errors, name: ''})}} style={{borderColor: errors.name ? RED : '#e0e0e0'}} />
                    {errors.name && <p className="delivery-error">{errors.name}</p>}
                  </div>
                  
                  <div className="delivery-field-full">
                    <label className="delivery-label">Email Address</label>
                    <input className="delivery-input" placeholder="email@example.com" value={shipData.email} onChange={e => {setShipData({...shipData, email: e.target.value}); setErrors({...errors, email: ''})}} style={{borderColor: errors.email ? RED : '#e0e0e0'}} />
                    {errors.email && <p className="delivery-error">{errors.email}</p>}
                  </div>

                  <div className="delivery-field-full" style={{ marginTop: '16px' }}>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', color: G, borderBottom: '1px solid #f0f0f0', paddingBottom: '8px', marginBottom: '8px' }}>
                      Shipping Address
                    </h3>
                  </div>

                  {savedAddresses.length > 0 && (
                    <div className="delivery-field-full">
                      <div className="address-cards-grid">
                        {savedAddresses.map(addr => {
                          const isSelected = selectedAddressId === addr.id;
                          return (
                            <div
                              key={addr.id}
                              onClick={() => handleSelectAddress(addr)}
                              className={`address-card ${isSelected ? 'selected' : ''} ${addr.is_default ? 'default-border' : ''}`}
                            >
                              <div className={`address-card-radio ${isSelected ? 'selected' : ''}`} />
                              <div className="address-card-content">
                                <div className="address-card-header">
                                  <span className="address-card-title">
                                    {addr.type || 'Address'}
                                    {addr.is_default && <span className="address-card-badge">Default</span>}
                                  </span>
                                </div>
                                <p className="address-card-text">{addr.address}</p>
                                {addr.phone && <p className="address-card-phone">📞 {addr.phone}</p>}
                                {addr.alternate_phone && <p className="address-card-phone">📞 {addr.alternate_phone} (Alt)</p>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {errors.selectedAddress && <p className="delivery-error" style={{ marginBottom: '16px' }}>{errors.selectedAddress}</p>}
                    </div>
                  )}

                  {savedAddresses.length > 0 && (
                    <div className="delivery-field-full">
                      {!showNewAddressForm ? (
                        <button
                          type="button"
                          className="address-form-toggle-btn"
                          onClick={() => {
                            setShowNewAddressForm(true);
                            setSelectedAddressId(null);
                          }}
                        >
                          <Plus /> Add New Address
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="address-form-toggle-btn"
                          onClick={() => {
                            setShowNewAddressForm(false);
                            if (savedAddresses.length > 0) {
                              const def = savedAddresses.find(a => a.is_default) || savedAddresses[0];
                              handleSelectAddress(def);
                            }
                          }}
                        >
                          Use a Saved Address
                        </button>
                      )}
                    </div>
                  )}

                  {showNewAddressForm && (
                    <div className="delivery-form" style={{ gridColumn: '1 / -1', border: `1px solid ${G}15`, background: `${SAGE}30`, padding: '24px', borderRadius: '16px', gap: '20px' }}>
                      <div className="delivery-field-full" style={{ marginBottom: '8px' }}>
                        <label className="delivery-label">Address Type</label>
                        <div style={{ display: 'flex', gap: '12px' }}>
                          {['Home', 'Work', 'Other'].map(t => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => setNewAddress({ ...newAddress, type: t })}
                              style={{
                                padding: '8px 20px',
                                borderRadius: '20px',
                                fontFamily: "'Playfair Display', serif",
                                fontSize: '0.8rem',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                border: `1.5px solid ${newAddress.type === t ? G : '#e0e0e0'}`,
                                background: newAddress.type === t ? G : WHITE,
                                color: newAddress.type === t ? WHITE : '#666',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="delivery-field-full">
                        <label className="delivery-label">Street Address</label>
                        <input
                          className="delivery-input"
                          placeholder="Flat, House no., Building, Company, Apartment, Street"
                          value={newAddress.street}
                          onChange={e => {
                            setNewAddress({ ...newAddress, street: e.target.value });
                            setAddressErrors({ ...addressErrors, street: '' });
                          }}
                          style={{ borderColor: addressErrors.street ? RED : '#e0e0e0' }}
                        />
                        {addressErrors.street && <p className="delivery-error">{addressErrors.street}</p>}
                      </div>

                      <div className="delivery-field-full">
                        <label className="delivery-label">Landmark (Optional)</label>
                        <input
                          className="delivery-input"
                          placeholder="e.g. Near Apollo Hospital, Opp. Central Mall"
                          value={newAddress.landmark}
                          onChange={e => {
                            setNewAddress({ ...newAddress, landmark: e.target.value });
                          }}
                        />
                      </div>

                      <div>
                        <label className="delivery-label">City</label>
                        <input
                          className="delivery-input"
                          placeholder="Your City"
                          value={newAddress.city}
                          onChange={e => {
                            setNewAddress({ ...newAddress, city: e.target.value });
                            setAddressErrors({ ...addressErrors, city: '' });
                          }}
                          style={{ borderColor: addressErrors.city ? RED : '#e0e0e0' }}
                        />
                        {addressErrors.city && <p className="delivery-error">{addressErrors.city}</p>}
                      </div>

                      <div>
                        <label className="delivery-label">State</label>
                        <input
                          className="delivery-input"
                          placeholder="Your State"
                          value={newAddress.state}
                          onChange={e => {
                            setNewAddress({ ...newAddress, state: e.target.value });
                            setAddressErrors({ ...addressErrors, state: '' });
                          }}
                          style={{ borderColor: addressErrors.state ? RED : '#e0e0e0' }}
                        />
                        {addressErrors.state && <p className="delivery-error">{addressErrors.state}</p>}
                      </div>

                      <div>
                        <label className="delivery-label">Pincode</label>
                        <input
                          className="delivery-input"
                          placeholder="6-digit PIN code"
                          value={newAddress.pincode}
                          onChange={e => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                            setNewAddress({ ...newAddress, pincode: val });
                            setAddressErrors({ ...addressErrors, pincode: '' });
                          }}
                          style={{ borderColor: addressErrors.pincode ? RED : '#e0e0e0' }}
                        />
                        {addressErrors.pincode && <p className="delivery-error">{addressErrors.pincode}</p>}
                      </div>

                      <div>
                        <label className="delivery-label">Phone Number</label>
                        <input
                          className="delivery-input"
                          placeholder="10-digit mobile number"
                          value={newAddress.phone}
                          onChange={e => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                            setNewAddress({ ...newAddress, phone: val });
                            setAddressErrors({ ...addressErrors, phone: '' });
                          }}
                          style={{ borderColor: addressErrors.phone ? RED : '#e0e0e0' }}
                        />
                        {addressErrors.phone && <p className="delivery-error">{addressErrors.phone}</p>}
                      </div>

                      <div className="delivery-field-full">
                        <label className="delivery-label">Alternate Phone (Optional)</label>
                        <input
                          className="delivery-input"
                          placeholder="Optional 10-digit number"
                          value={newAddress.alternate_phone}
                          onChange={e => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                            setNewAddress({ ...newAddress, alternate_phone: val });
                            setAddressErrors({ ...addressErrors, alternate_phone: '' });
                          }}
                          style={{ borderColor: addressErrors.alternate_phone ? RED : '#e0e0e0' }}
                        />
                        {addressErrors.alternate_phone && <p className="delivery-error">{addressErrors.alternate_phone}</p>}
                      </div>

                      <div className="address-checkbox-wrap">
                        <input
                          type="checkbox"
                          id="save_future"
                          className="address-checkbox"
                          checked={newAddress.save_future}
                          onChange={e => setNewAddress({ ...newAddress, save_future: e.target.checked })}
                        />
                        <label htmlFor="save_future" className="address-checkbox-label">
                          Save this address for future use
                        </label>
                      </div>

                      {newAddress.save_future && (
                        <div className="address-checkbox-wrap" style={{ marginTop: '0px' }}>
                          <input
                            type="checkbox"
                            id="is_default"
                            className="address-checkbox"
                            checked={newAddress.is_default}
                            onChange={e => setNewAddress({ ...newAddress, is_default: e.target.checked })}
                          />
                          <label htmlFor="is_default" className="address-checkbox-label">
                            Set as default address
                          </label>
                        </div>
                      )}
                    </div>
                  )}

                  {!showNewAddressForm && savedAddresses.length === 0 && (
                    <div className="delivery-field-full" style={{ textAlign: 'center', padding: '24px', border: '1px dashed #e0e0e0', borderRadius: '16px', background: SAGE }}>
                      <p style={{ fontFamily: "'Playfair Display', serif", color: '#666', fontSize: '0.9rem' }}>Loading addresses...</p>
                    </div>
                  )}
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
                    { id: 'paypal', label: 'PayPal', icon: '🅿️', sub: 'PayPal account or credit/debit card' },
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

                {payMethod === 'paypal' && currentStep === 'payment' ? (
                  <div style={{ marginTop: '10px', minHeight: '150px' }}>
                    {!paypalLoaded ? (
                      <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#999', padding: '20px 0' }}>
                        Loading PayPal Secure Buttons...
                      </p>
                    ) : null}
                    <div id="paypal-button-container"></div>
                    
                    {paypalConfig && (
                      !paypalConfig.client_id ||
                      paypalConfig.client_id.includes('your_') ||
                      paypalConfig.client_id.includes('abc_') ||
                      paypalConfig.client_id.includes('secret') ||
                      paypalConfig.client_id === 'AdpL5X_Y5L7cQ-T8c4G8qX7_3u_X8PqL5X_Y5L7cQ-T8c4G8qX7_3u_X8Pq'
                    ) ? (
                      <div style={{
                        marginTop: '24px',
                        padding: '24px',
                        border: `1.5px dashed ${A}`,
                        borderRadius: '16px',
                        background: '#FFFDF9',
                        textAlign: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.01)'
                      }}>
                        <p style={{ fontSize: '0.9rem', color: G, fontWeight: '700', marginBottom: '8px', fontFamily: "'Playfair Display', serif" }}>
                          🛠️ Developer Sandbox Simulator
                        </p>
                        <p style={{ fontSize: '0.75rem', color: '#666', lineHeight: '1.6', marginBottom: '20px', fontFamily: "'Playfair Display', serif" }}>
                          You are using placeholder credentials in your backend <code>.env</code> file. To run the actual PayPal popup window, configure real sandbox keys. Otherwise, you can test EvesCafe's database order, emails, and Shiprocket booking flow immediately by simulating a successful payment.
                        </p>
                        <button 
                          onClick={handleSimulatePayment} 
                          className="cta-btn" 
                          style={{ 
                            margin: '0 auto', 
                            padding: '12px 24px', 
                            fontSize: '0.75rem', 
                            width: 'auto',
                            background: A,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                        >
                          Simulate Successful Payment
                        </button>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <button className="cta-btn" onClick={handleNextStep}>
                    <span>
                      {!isLoggedIn && currentStep === 'cart' ? 'Login to Proceed' : (
                        <>
                          {currentStep === 'cart' && 'Proceed to Delivery'}
                          {currentStep === 'delivery' && 'Proceed to Payment'}
                          {currentStep === 'payment' && 'Place Order Ritual'}
                        </>
                      )}
                    </span>
                    <ArrowRight />
                  </button>
                )}

                <div className="trust-row">
                  <div className="trust-item"><div className="trust-icon">🔒</div><span className="trust-text">SSL Secure</span></div>
                  <div className="trust-item"><div className="trust-icon">🌿</div><span className="trust-text">Carbon Neutral</span></div>
                  <div className="trust-item"><div className="trust-icon">✓</div><span className="trust-text">Purity Guarantee</span></div>
                </div>
              </div>
            </div>
        </div>
      </div>

      {/* Mobile Sticky Bar */}
      {!(payMethod === 'paypal' && currentStep === 'payment') && (
        <div className="mobile-cta-bar">
          <div className="m-cta-inner">
            <div className="m-total-wrap">
              <span className="m-total-label">Total Ritual</span>
              <span className="m-total-val">₹ {total.toLocaleString('en-IN')}</span>
            </div>
            <button className="m-btn" onClick={handleNextStep}>
              {!isLoggedIn && currentStep === 'cart' ? 'Login' : (
                <>
                  {currentStep === 'cart' && 'Checkout'}
                  {currentStep === 'delivery' && 'Pay Now'}
                  {currentStep === 'payment' && 'Confirm'}
                </>
              )} <ArrowRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}