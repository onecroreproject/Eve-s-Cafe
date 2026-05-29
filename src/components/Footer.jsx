import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo/logo.png';

/* ─── Design Tokens (Green Olive Theme) ─── */
const OLIVE_DRAB = '#556B2F';
const OLIVE_LIGHT = '#F1F3E8';
const OLIVE_ACCENT = '#8F9779';
const OLIVE_DARK = '#1A2406';
const OLIVE_SOFT = '#F8F9F4';

const Footer = () => {
  const sections = [
    {
      title: "Navigation",
      links: [
        { name: "Home", path: "/" },
        { name: "Shop All", path: "/shop" },
        { name: "Bestsellers", path: "/bestseller" },
        { name: "New Arrivals", path: "/shop" },
        { name: "Our Story", path: "/about" }
      ]
    },
    {
      title: "Help & Support",
      links: [
        { name: "Track Order", path: "/contact" },
        { name: "Shipping Policy", path: "/contact" },
        { name: "Refund Policy", path: "/refund-policy" },
        { name: "Terms & Conditions", path: "/terms" },
        { name: "Delete Account", path: "/delete-account" },
        { name: "Contact Us", path: "/contact" },
        { name: "FAQs", path: "/about" }
      ]
    },
    {
      title: "Categories",
      links: [
        { name: "Skin Care", path: "/shop/skin-care" },
        { name: "Hair Care", path: "/shop/hair-care" },
        { name: "Body Care", path: "/shop/skin-care" },
        { name: "Herbal Powder", path: "/shop/herbal-powder" },
        { name: "Gift Boxes", path: "/shop" }
      ]
    }
  ];

  return (
    <footer style={{ backgroundColor: OLIVE_SOFT, color: OLIVE_DRAB, fontFamily: '"Playfair Display", serif' }} className="pt-10 pb-8 border-t border-[#E8EAE0]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-x-12 gap-y-8 mb-10">
          
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <div className="mb-6">
              <img 
                src={logo} 
                alt="EvesCafe Logo" 
                className="h-14 w-auto grayscale contrast-125 brightness-50" 
              />
            </div>
            <p className="text-gray-600 text-[0.95rem] leading-relaxed mb-6 max-w-sm">
              Discover the pure essence of Ayurvedic traditions blended with modern botanical science for your daily self-care rituals.
            </p>
            <div className="flex items-center gap-4">
              {[
                { name: 'facebook', path: '#', icon: (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                )},
                { name: 'instagram', path: '#', icon: (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                )},
                { name: 'youtube', path: '#', icon: (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                )},
                { name: 'twitter', path: '#', icon: (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                )},
              ].map((social) => (
                <a 
                  key={social.name} 
                  href={social.path}
                  className="text-[#8F9779] border border-[#E8EAE0] p-3 rounded-full hover:bg-white hover:text-[#556B2F] hover:border-[#556B2F] transition-all duration-300 shadow-sm"
                >
                  <span className="sr-only">{social.name}</span>
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {sections.map((section) => (
            <div key={section.title} className="lg:col-span-2">
              <h3 style={{ color: OLIVE_DRAB }} className="text-[0.75rem] font-bold uppercase tracking-[0.2em] mb-6">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.path} 
                      className="text-gray-500 hover:text-[#556B2F] text-[0.85rem] transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter Column */}
          <div className="lg:col-span-2">
            <h3 style={{ color: OLIVE_DRAB }} className="text-[0.75rem] font-bold uppercase tracking-[0.2em] mb-6">
              Stay Rooted
            </h3>
            <p className="text-gray-500 text-[0.85rem] leading-relaxed mb-6">Join our botanical family for exclusive ritual tips and seasonal wisdom.</p>
            <div className="space-y-3">
              <input 
                type="email" 
                placeholder="Your email address"
                className="w-full bg-white border border-[#E8EAE0] rounded-xl px-4 py-3 text-[0.9rem] focus:outline-none focus:border-[#556B2F] transition-colors"
                style={{ fontFamily: '"Playfair Display", serif' }}
              />
              <button className="w-full bg-[#556B2F] text-white py-3.5 rounded-xl font-bold text-[0.7rem] uppercase tracking-[0.15em] hover:bg-[#1A2406] transition-all shadow-lg shadow-[#556B2F]/10 active:scale-95">
                Join The Ritual
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-gray-200 flex flex-col md:row items-center justify-between gap-6">
          <p className="text-gray-400 text-[0.7rem] uppercase tracking-widest font-bold">
            © 2026 EVESCAFE LABORATORIES. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-8">
            <Link to="/privacy-policy" className="text-gray-400 text-[0.7rem] uppercase tracking-widest hover:text-[#556B2F] transition-colors no-underline">Privacy Rituals</Link>
            <Link to="/terms" className="text-gray-400 text-[0.7rem] uppercase tracking-widest hover:text-[#556B2F] transition-colors no-underline">Service Terms</Link>
            <span className="text-gray-400 text-[0.7rem] uppercase tracking-widest cursor-pointer hover:text-[#556B2F] transition-colors">Accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

