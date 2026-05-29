import React, { useState, useEffect } from 'react';
import banner1 from '../assets/banner/banner1.jpg';
import banner2 from '../assets/banner/banner2.jpg';
import api from '../api/config';
import { CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';

// ── Brand constants ──────────────────────────────────────────────────────
const G = '#1A3C2E';
const G2 = '#0f2419';
const A = '#B48253';
const SAGE = '#F4F5F2';

// ─── CSS ──────────────────────────────────────────────────────────────────
const css = `
  .ct-root {
    background: #fff;
    font-family: 'Playfair Display', serif;
    min-height: 100vh;
  }

  /* ── Hero Banner ──────────────────────────────────────────────────── */
  .ct-hero {
    position: relative;
    padding: 4rem 2rem 5rem;
    margin-bottom: 2rem;
    overflow: hidden;
    background: linear-gradient(135deg, ${G} 0%, ${G2} 100%);
  }
  
  .ct-hero::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.12;
    pointer-events: none;
  }
  
  .ct-hero::after {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(180,130,83,0.15) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }

  .ct-hero-inner {
    position: relative;
    z-index: 2;
    max-width: 1280px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    flex-wrap: wrap;
    gap: 2rem;
  }

  .ct-hero-left { display: flex; flex-direction: column; }

  .ct-hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(255,255,255,0.1);
    backdrop-filter: blur(10px);
    padding: 6px 16px;
    border-radius: 40px;
    width: fit-content;
    margin-bottom: 1.5rem;
  }
  .ct-hero-badge span {
    width: 8px;
    height: 8px;
    background: ${A};
    border-radius: 50%;
    display: inline-block;
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.2); }
  }
  .ct-hero-badge p {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.9);
    margin: 0;
  }

  .ct-hero-title {
    color: #fff;
    font-size: clamp(2.5rem, 5vw, 4.8rem);
    font-family: 'Playfair Display', serif;
    font-weight: 600;
    line-height: 1.1;
    margin: 0 0 0.5rem;
  }
  .ct-hero-title span {
    font-style: italic;
    color: ${A};
    font-weight: 400;
    display: inline-block;
  }
  .ct-hero-desc {
    color: #c0c8c3;
    font-size: 1rem;
    margin-top: 1.5rem;
    max-width: 500px;
    line-height: 1.6;
  }

  .ct-hero-ctas {
    align-self: flex-end;
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .ct-cta-primary {
    padding: 0.8rem 2rem;
    background: ${A};
    color: #fff;
    border: none;
    border-radius: 50px;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .ct-cta-primary:hover {
    background: #9a6d40;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.2);
  }

  .ct-cta-ghost {
    padding: 0.8rem 2rem;
    background: transparent;
    border: 1.5px solid rgba(255,255,255,0.3);
    color: rgba(255,255,255,0.9);
    border-radius: 50px;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.3s ease;
  }
  .ct-cta-ghost:hover {
    background: rgba(255,255,255,0.1);
    color: #fff;
    transform: translateY(-2px);
    border-color: rgba(255,255,255,0.5);
  }

  /* ── Main section ──────────────────────────────────────────────── */
  .ct-main {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 1.5rem 5rem;
  }

  /* ── Two-column card ───────────────────────────────────────────── */
  .ct-card {
    display: grid;
    grid-template-columns: 1fr 1fr;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 24px 60px rgba(0,0,0,0.08);
    background: #fff;
  }
  @media (max-width: 900px) {
    .ct-card { grid-template-columns: 1fr; border-radius: 12px; }
  }

  /* Form side */
  .ct-form-col {
    padding: 3.5rem;
    background: #fff;
  }
  @media (max-width: 900px) {
    .ct-form-col { padding: 2rem 1.5rem; }
  }
  @media (max-width: 480px) {
    .ct-form-col { padding: 1.5rem 1rem; }
  }

  .ct-section-tag {
    display: inline-block;
    padding: 6px 16px;
    margin-bottom: 2rem;
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: ${G};
    background: ${SAGE};
    border-radius: 40px;
  }

  /* Alert */
  .ct-alert {
    margin-bottom: 1.5rem;
    padding: 1rem 1.25rem;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 500;
  }
  .ct-alert.success {
    background: #f0faf4;
    color: #1a6b3a;
    border-left: 3px solid #1a6b3a;
  }
  .ct-alert.error {
    background: #fdf2f2;
    color: #9b2626;
    border-left: 3px solid #9b2626;
  }

  /* Form fields */
  .ct-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }
  @media (max-width: 600px) {
    .ct-row { grid-template-columns: 1fr; gap: 1rem; margin-bottom: 1rem; }
  }
  .ct-field { display: flex; flex-direction: column; gap: 0.5rem; }
  .ct-field-full { margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem; }

  .ct-label {
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #999;
  }
  .ct-input, .ct-textarea {
    background: ${SAGE};
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    padding: 0.9rem 1rem;
    font-size: 0.9rem;
    font-family: 'Playfair Display', serif;
    color: #1A1A14;
    transition: all 0.2s;
    width: 100%;
    box-sizing: border-box;
    outline: none;
  }
  .ct-input:focus, .ct-textarea:focus {
    border-color: ${A};
    background: #fff;
    box-shadow: 0 0 0 3px rgba(180,130,83,0.1);
  }
  .ct-textarea { resize: none; min-height: 130px; }

  .ct-submit {
    width: 100%;
    padding: 1rem;
    background: ${G};
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    margin-top: 0.5rem;
  }
  .ct-submit:hover:not(:disabled) {
    background: ${A};
    transform: translateY(-2px);
  }
  .ct-submit:disabled { opacity: 0.55; cursor: not-allowed; }

  /* Info side with Better Banner */
  .ct-info-col {
    display: flex;
    flex-direction: column;
    background: #fff;
  }

  .ct-banner-wrap {
    position: relative;
    overflow: hidden;
    flex-shrink: 0;
    cursor: pointer;
  }
  .ct-banner-wrap img {
    width: 100%;
    height: 280px;
    display: block;
    object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
  }
  .ct-banner-wrap:hover img {
    transform: scale(1.05);
  }
  
  .ct-banner-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(26,60,46,0.3) 0%, rgba(0,0,0,0.5) 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 2rem;
    transition: all 0.3s ease;
  }
  
  .ct-banner-wrap:hover .ct-banner-overlay {
    background: linear-gradient(135deg, rgba(180,130,83,0.4) 0%, rgba(26,60,46,0.6) 100%);
  }
  
  .ct-banner-icon {
    width: 60px;
    height: 60px;
    background: rgba(255,255,255,0.2);
    backdrop-filter: blur(10px);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
    transition: transform 0.3s ease;
  }
  .ct-banner-wrap:hover .ct-banner-icon {
    transform: scale(1.1);
  }
  .ct-banner-icon svg {
    width: 28px;
    height: 28px;
    color: white;
  }
  
  .ct-banner-title {
    color: white;
    font-size: 1.5rem;
    font-weight: 600;
    font-family: 'Playfair Display', serif;
    margin-bottom: 0.5rem;
  }
  .ct-banner-subtitle {
    color: rgba(255,255,255,0.9);
    font-size: 0.75rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }

  .ct-info-body {
    padding: 3rem 3rem;
    background: ${SAGE};
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  @media (max-width: 900px) {
    .ct-info-body { padding: 2rem 1.5rem; }
  }
  @media (max-width: 480px) {
    .ct-info-body { padding: 1.5rem 1rem; }
  }

  .ct-contact-item { display: flex; gap: 1.2rem; align-items: flex-start; }
  .ct-icon-wrap {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${G};
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    transition: transform 0.2s ease;
  }
  .ct-contact-item:hover .ct-icon-wrap {
    transform: scale(1.05);
  }
  .ct-icon-wrap svg { width: 18px; height: 18px; }
  .ct-contact-label {
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #999;
    margin-bottom: 6px;
  }
  .ct-contact-value {
    font-size: 0.9rem;
    color: #1A1A14;
    font-weight: 600;
    line-height: 1.5;
    white-space: pre-line;
  }

  .ct-social-wrap {
    padding-top: 1.5rem;
    border-top: 1px solid rgba(26,60,46,0.1);
  }
  .ct-social-title {
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #999;
    margin-bottom: 1rem;
  }
  .ct-social-pills {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }
  .ct-social-pill {
    padding: 8px 20px;
    border-radius: 40px;
    border: 1px solid #e0e0e0;
    background: #fff;
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #666;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .ct-social-pill:hover {
    border-color: ${A};
    color: ${A};
    transform: translateY(-2px);
  }

  /* ── FAQ ── */
  .ct-faq {
    background: ${SAGE};
    padding: 5rem 1.5rem;
    position: relative;
    overflow: hidden;
  }
  .ct-faq-dots {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle, rgba(26,60,46,0.08) 1px, transparent 1px);
    background-size: 28px 28px;
    pointer-events: none;
  }
  .ct-faq-inner {
    max-width: 820px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }


  details.ct-faq-item {
    background: #fff;
    border: 1px solid #e8e8e8;
    margin-bottom: 0.75rem;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
  }
  details.ct-faq-item[open] {
    box-shadow: 0 8px 24px rgba(26,60,46,0.08);
  }

  details.ct-faq-item summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.5rem;
    cursor: pointer;
    list-style: none;
    font-size: 0.95rem;
    font-weight: 700;
    color: #1A1A14;
    transition: color 0.2s ease;
    gap: 1rem;
  }
  details.ct-faq-item[open] summary { color: ${G}; }
  details.ct-faq-item summary::-webkit-details-marker { display: none; }

  .ct-faq-icon {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: ${SAGE};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${G};
    flex-shrink: 0;
    transition: transform 0.3s ease;
  }
  details.ct-faq-item[open] .ct-faq-icon { transform: rotate(180deg); }
  .ct-faq-icon svg { width: 12px; height: 12px; }

  .ct-faq-body {
    padding: 0 1.5rem 1.25rem;
    font-size: 0.9rem;
    color: #666;
    line-height: 1.7;
    border-top: 1px solid #f0f0f0;
    padding-top: 1rem;
  }

  /* Responsive fixes */
  @media (max-width: 768px) {
    .ct-hero { padding: 2rem 1rem 3rem; }
    .ct-hero-inner { flex-direction: column; align-items: flex-start; }
    .ct-hero-ctas { align-self: flex-start; }
    .ct-main { padding: 0 1rem 3rem; }
    .ct-faq { padding: 3rem 1rem; }
    .ct-banner-wrap img { height: 220px; }
    .ct-banner-title { font-size: 1.2rem; }
  }
  @media (max-width: 480px) {
    .ct-hero { padding: 1.5rem 1rem 2rem; }
    .ct-main { padding: 0 0.75rem 2rem; }
    .ct-faq { padding: 2.5rem 0.75rem; }
    .ct-banner-wrap img { height: 180px; }
    .ct-banner-icon { width: 45px; height: 45px; }
    .ct-banner-icon svg { width: 20px; height: 20px; }
  }
`;

// ── Icons ─────────────────────────────────────────────────────────────────
const MailIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);
const PhoneIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);
const PinIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const LeafIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
      d="M12 2v4M12 6a4 4 0 00-4 4c0 2.5 2 4 4 4s4-1.5 4-4a4 4 0 00-4-4z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
      d="M12 14v8M9 19h6" />
  </svg>
);
const ChevronIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────
const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });
    try {
      const res = await api.post('/contact/submit', formData);
      if (res.data.status === 'success') {
        setStatus({ type: 'success', message: res.data.message });
        setFormData({ name: '', email: '', subject: '', phone: '', message: '' });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong. Please try again.';
      setStatus({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  const contacts = [
    { icon: <MailIcon />, label: 'Write to us', value: 'evescafe.in@gmail.com' },
    { icon: <PhoneIcon />, label: 'Speak with us', value: '+91 98840 55777' },
    { icon: <PinIcon />, label: 'Visit us', value: '95, Mc Nichols Road,\nDoshi Llanstephan,\nC & D , 2nd Floor, Block 2,\nChetpet, Chennai - 600031.' },
  ];

  const faqs = [
    { q: 'Are EveCafe products 100% natural?', a: 'Yes, all our formulations are crafted exclusively with high-quality botanical ingredients, essential oils, and herbal extracts.' },
    { q: 'How long does shipping usually take?', a: 'Domestic shipping within India usually takes 3–5 business days depending on your location.' },
    { q: 'What is your return policy?', a: 'Due to the artisanal nature of our products, we do not accept returns unless the item is damaged during transit.' },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="ct-root">

        {/* ── Hero Banner with Better UI ── */}
        <div className="ct-hero">
          <div className="ct-hero-inner">
            <div className="ct-hero-left">
              <div className="ct-hero-badge">
                <span></span>
                <p>Handcrafted · Botanical · Organic</p>
              </div>
              <h1 className="ct-hero-title">
                Get In <span>Touch</span>
              </h1>
              <p className="ct-hero-desc">
                We'd love to hear from you — reach out for inquiries, collaborations, 
                or just to say hello. Our team responds within 24 hours.
              </p>
            </div>
            <div className="ct-hero-ctas">
              <a href="#contact-form" className="ct-cta-primary">
                Send a Message
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
              <Link to="/about" className="ct-cta-ghost">Our Story</Link>
            </div>
          </div>
        </div>

        {/* ── Form + Info card ── */}
        <div id="contact-form" className="ct-main">
          <div className="ct-card">

            {/* Form */}
            <div className="ct-form-col">
              <span className="ct-section-tag">Send an Inquiry</span>

              {status.message && (
                <div className={`ct-alert ${status.type}`}>{status.message}</div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="ct-row">
                  <div className="ct-field">
                    <label className="ct-label">Full Name</label>
                    <input className="ct-input" type="text" name="name" required
                      value={formData.name} onChange={handleChange} placeholder="E.g. Sahil Khan" />
                  </div>
                  <div className="ct-field">
                    <label className="ct-label">Email Address</label>
                    <input className="ct-input" type="email" name="email" required
                      value={formData.email} onChange={handleChange} placeholder="evescafe.in@gmail.com" />
                  </div>
                </div>

                <div className="ct-row">
                  <div className="ct-field">
                    <label className="ct-label">Phone (Optional)</label>
                    <input className="ct-input" type="text" name="phone"
                      value={formData.phone} onChange={handleChange} placeholder="+91 00000 00000" />
                  </div>
                  <div className="ct-field">
                    <label className="ct-label">Subject</label>
                    <input className="ct-input" type="text" name="subject" required
                      value={formData.subject} onChange={handleChange} placeholder="How can we help?" />
                  </div>
                </div>

                <div className="ct-field-full">
                  <label className="ct-label">Message</label>
                  <textarea className="ct-textarea" name="message" required rows="5"
                    value={formData.message} onChange={handleChange}
                    placeholder="Write your message here..." />
                </div>

                <button type="submit" className="ct-submit" disabled={loading}>
                  {loading ? (
                    <><CircularProgress size={15} color="inherit" /> Processing…</>
                  ) : 'Submit Inquiry'}
                </button>
              </form>
            </div>

            {/* Info with Better Banner */}
            <div className="ct-info-col">
              <div className="ct-banner-wrap">
                <img src={banner2} alt="Our Sanctuary" />
                <div className="ct-banner-overlay">
                  <div className="ct-banner-icon">
                    <LeafIcon />
                  </div>
                  <div className="ct-banner-title">Our Sanctuary</div>
                  <div className="ct-banner-subtitle">Where Nature Meets Luxury</div>
                </div>
              </div>

              <div className="ct-info-body">
                {contacts.map((item, i) => (
                  <div key={i} className="ct-contact-item">
                    <div className="ct-icon-wrap">{item.icon}</div>
                    <div>
                      <div className="ct-contact-label">{item.label}</div>
                      <div className="ct-contact-value">{item.value}</div>
                    </div>
                  </div>
                ))}

                <div className="ct-social-wrap">
                  <div className="ct-social-title">Follow our journey</div>
                  <div className="ct-social-pills">
                    {['Instagram', 'Pinterest', 'YouTube'].map((s) => (
                      <span key={s} className="ct-social-pill">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── FAQ ── */}
        <section className="ct-faq">
          <div className="ct-faq-dots" />
          <div className="ct-faq-inner">
            <div className="flex flex-col items-center text-center mb-16 px-4">
              <div className="max-w-2xl">
                <h6 className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-[#B48253] mb-4">Common Enquiries</h6>
                <h2 className="text-4xl md:text-5xl font-bold text-[#1A3C2E] luxury-serif leading-tight">
                  Frequently Asked <span className="text-gradient">Questions</span>
                </h2>
                <p className="mt-4 text-gray-500 font-medium">
                  Have questions about our botanical formulations or sacred rituals? Explore our guided answers below.
                </p>
              </div>
            </div>

            {faqs.map((faq, i) => (
              <details key={i} className="ct-faq-item">
                <summary>
                  {faq.q}
                  <div className="ct-faq-icon"><ChevronIcon /></div>
                </summary>
                <div className="ct-faq-body">{faq.a}</div>
              </details>
            ))}
          </div>
        </section>

      </div>
    </>
  );
};

export default Contact;