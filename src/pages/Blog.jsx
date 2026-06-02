import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { IMAGE_BASE_URL } from '../api/config';

// ── Brand constants (identical across Shop / Bestsellers / Contact) ────────
const G = '#1A3C2E';
const G2 = '#0f2419';
const A = '#B48253';
const SAGE = '#F4F5F2';

// ─── CSS ──────────────────────────────────────────────────────────────────
const css = `
  .bl-root {
    background: #fff;
    font-family: 'Playfair Display', serif;
    min-height: 100vh;
  }

  /* ════════════════════════════════════════════════════════════════
     HERO — Enhanced without bg image
  ════════════════════════════════════════════════════════════════ */
  .bl-hero {
    background: linear-gradient(135deg, ${G} 0%, ${G2} 100%);
    padding: 4rem 2rem 5rem;
    margin-bottom: 0;
    position: relative;
    overflow: hidden;
  }
  
  /* Decorative elements */
  .bl-hero::before {
    content: '';
    position: absolute;
    top: -40%;
    right: -10%;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(180,130,83,0.15) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }
  
  .bl-hero::after {
    content: '';
    position: absolute;
    bottom: -30%;
    left: -5%;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(180,130,83,0.1) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }
  
  .bl-hero-inner {
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

  /* Left copy block */
  .bl-hero-left { display: flex; flex-direction: column; }
  
  .bl-hero-badge {
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
  .bl-hero-badge span {
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
  .bl-hero-badge p {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.9);
    margin: 0;
  }
  
  .bl-hero-subtitle {
    color: ${A};
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.3em;
    margin-bottom: 1rem;
    text-transform: uppercase;
  }
  
  .bl-hero-title {
    color: #fff;
    font-size: clamp(2.5rem, 5vw, 4.8rem);
    font-family: 'Playfair Display', serif;
    font-weight: 700;
    line-height: 1.1;
    margin: 0 0 0.5rem;
    letter-spacing: -0.01em;
  }
  .bl-hero-script {
    color: ${A};
    font-weight: 700;
    display: inline-block;
    margin-left: 0.2em;
  }
  .luxury-serif { font-family: 'Playfair Display', serif; }
  .text-gradient {
    background: linear-gradient(to right, #D4B28C, ${A});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .bl-hero-desc {
    color: #c0c8c3;
    font-size: 1rem;
    margin-top: 1rem;
    max-width: 500px;
    line-height: 1.6;
  }

  /* Stats Card */
  .bl-hero-stats {
    align-self: flex-end;
    background: rgba(255,255,255,0.08);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 60px;
    padding: 0.75rem 1.75rem;
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  .bl-hero-stats-item {
    text-align: center;
  }
  .bl-hero-stats-number {
    font-size: 1.5rem;
    font-weight: 700;
    color: ${A};
    font-family: 'Playfair Display', serif;
    line-height: 1;
  }
  .bl-hero-stats-label {
    font-size: 0.6rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.7);
    margin-top: 4px;
  }
  .bl-hero-stats-divider {
    width: 1px;
    height: 30px;
    background: rgba(255,255,255,0.2);
  }

  /* Right — category pills (enhanced) */
  .bl-hero-cats {
    display: flex;
    gap: 0.8rem;
    flex-wrap: wrap;
    align-items: center;
    margin-top: 1rem;
  }
  .bl-cat {
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.2);
    color: rgba(255,255,255,0.8);
    padding: 0.6rem 1.4rem;
    border-radius: 40px;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    font-family: 'Playfair Display', serif;
    white-space: nowrap;
  }
  .bl-cat:hover {
    background: rgba(255,255,255,0.15);
    border-color: rgba(255,255,255,0.4);
    color: #fff;
    transform: translateY(-2px);
  }
  .bl-cat.active {
    background: ${A};
    border-color: ${A};
    color: #fff;
  }
  .bl-cat-count {
    background: rgba(255,255,255,0.15);
    border-radius: 20px;
    padding: 2px 8px;
    font-size: 0.6rem;
    font-weight: 600;
  }
  .bl-cat.active .bl-cat-count {
    background: rgba(255,255,255,0.25);
  }

  /* ════════════════════════════════════════════════════════════════
     MAIN CONTAINER
  ════════════════════════════════════════════════════════════════ */
  .bl-main {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 1.5rem 5rem;
  }

  /* Results / search bar */
  .bl-results-bar {
    font-size: 0.85rem;
    color: #888;
    margin: 2rem 0;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.75rem;
  }
  .bl-results-bar strong {
    color: ${G};
    font-weight: 700;
  }

  /* Search */
  .bl-search-wrap {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  .bl-search-inner {
    position: relative;
  }
  .bl-search-inner svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 14px;
    height: 14px;
    color: #aaa;
    pointer-events: none;
  }
  .bl-search {
    padding: 0.7rem 1rem 0.7rem 2.4rem;
    background: ${SAGE};
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    font-size: 0.85rem;
    font-family: 'Playfair Display', serif;
    color: #1A1A14;
    outline: none;
    width: 240px;
    box-sizing: border-box;
    transition: all 0.2s;
  }
  .bl-search:focus {
    border-color: ${A};
    background: #fff;
    box-shadow: 0 0 0 3px rgba(180,130,83,0.1);
  }
  .bl-search::placeholder {
    color: #bbb;
  }

  .bl-clear-btn {
    background: none;
    border: none;
    color: ${A};
    font-weight: 700;
    font-size: 0.7rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    font-family: 'Playfair Display', serif;
    transition: color 0.2s;
    white-space: nowrap;
  }
  .bl-clear-btn:hover {
    color: ${G};
  }

  /* ════════════════════════════════════════════════════════════════
     BLOG GRID — mirrors Shop p-grid exactly
  ════════════════════════════════════════════════════════════════ */
  .bl-grid {
    display: grid;
    gap: clamp(20px, 2.2vw, 30px);
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 1024px) {
    .bl-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 600px) {
    .bl-grid { grid-template-columns: 1fr; }
  }

  /* ════════════════════════════════════════════════════════════════
     BLOG CARD — Enhanced with border-radius and better hover
  ════════════════════════════════════════════════════════════════ */
  .bl-card {
    position: relative;
    background: #fff;
    border: 1px solid #f0f0f0;
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
    text-decoration: none;
    color: inherit;
  }
  .bl-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(26,60,46,0.12);
    border-color: transparent;
  }
  .bl-card:hover .bl-card-img {
    transform: scale(1.08);
  }
  .bl-card:hover .bl-card-title {
    color: ${A};
  }
  .bl-card:hover .bl-read-arrow {
    transform: translateX(4px);
  }

  /* Image */
  .bl-img-wrap {
    position: relative;
    width: 100%;
    padding-bottom: 62%;
    background: ${SAGE};
    overflow: hidden;
    flex-shrink: 0;
  }
  .bl-card-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
  }
  .bl-badge {
    position: absolute;
    top: 12px;
    left: 12px;
    z-index: 2;
    background: ${G};
    color: #fff;
    font-size: 0.55rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    padding: 6px 12px;
    border-radius: 20px;
  }

  /* Card body */
  .bl-body {
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    flex: 1;
    text-align: left;
  }

  /* Category label */
  .bl-body-cat {
    font-size: 0.6rem;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: ${A};
    margin-bottom: 8px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  /* Title */
  .bl-card-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.1rem;
    font-weight: 600;
    color: ${G};
    line-height: 1.35;
    margin: 0 0 10px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    transition: color 0.2s;
    min-height: 2.8em;
  }

  /* Excerpt */
  .bl-excerpt {
    font-size: 0.85rem;
    color: #666;
    line-height: 1.65;
    margin-bottom: 1rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .bl-spacer {
    flex: 1;
  }

  /* Footer row */
  .bl-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-top: auto;
    padding-top: 14px;
    border-top: 1px solid rgba(26,60,46,0.08);
  }

  /* Meta */
  .bl-meta {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }
  .bl-meta-item {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 0.7rem;
    color: #999;
    font-weight: 600;
  }
  .bl-meta-item svg {
    width: 12px;
    height: 12px;
  }

  /* Read link */
  .bl-read {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    background: ${G};
    color: #fff;
    padding: 8px 14px;
    border-radius: 30px;
    white-space: nowrap;
    transition: all 0.3s ease;
  }
  .bl-read:hover {
    background: ${A};
  }
  .bl-read-arrow {
    display: inline-flex;
    font-size: 1rem;
    line-height: 1;
    transition: transform 0.2s ease;
  }

  /* Scroll Animation */
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .rv {
    animation: fadeInUp 0.6s ease-out forwards;
    opacity: 0;
  }

  /* ════════════════════════════════════════════════════════════════
     EMPTY STATE
  ════════════════════════════════════════════════════════════════ */
  .bl-empty {
    text-align: center;
    padding: 4rem 2rem;
    color: #888;
  }
  .bl-empty h3 {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    color: ${G};
    margin-bottom: 1rem;
  }

  /* ════════════════════════════════════════════════════════════════
     NEWSLETTER — Enhanced
  ════════════════════════════════════════════════════════════════ */
  .bl-newsletter {
    background: linear-gradient(135deg, ${G} 0%, ${G2} 100%);
    padding: 5rem 1.5rem;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .bl-newsletter::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -10%;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(180,130,83,0.1) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }
  .bl-nl-inner {
    max-width: 640px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }
  .bl-nl-eyebrow {
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: ${A};
    margin-bottom: 1rem;
    display: block;
  }
  .bl-nl-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.8rem, 4vw, 2.6rem);
    font-weight: 700;
    color: #fff;
    margin: 0 0 1rem;
  }
  .bl-nl-sub {
    color: rgba(255,255,255,0.7);
    font-size: 0.95rem;
    line-height: 1.65;
    margin-bottom: 2.5rem;
  }
  .bl-nl-form {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  .bl-nl-input {
    padding: 1rem 1.5rem;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 8px;
    color: #fff;
    font-size: 0.9rem;
    font-family: 'Playfair Display', serif;
    outline: none;
    width: 300px;
    box-sizing: border-box;
    transition: all 0.2s;
  }
  .bl-nl-input::placeholder {
    color: rgba(255,255,255,0.5);
  }
  .bl-nl-input:focus {
    border-color: ${A};
    background: rgba(255,255,255,0.15);
  }
  .bl-nl-btn {
    padding: 1rem 2rem;
    background: ${A};
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    cursor: pointer;
    font-family: 'Playfair Display', serif;
    transition: all 0.3s ease;
    white-space: nowrap;
  }
  .bl-nl-btn:hover {
    background: #9a6d40;
    transform: translateY(-2px);
  }

  /* ════════════════════════════════════════════════════════════════
     LOADING SPINNER
  ════════════════════════════════════════════════════════════════ */
  .bl-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
  }
  .bl-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid ${SAGE};
    border-top-color: ${G};
    border-radius: 50%;
    animation: bl-spin 0.7s linear infinite;
  }
  @keyframes bl-spin {
    to { transform: rotate(360deg); }
  }

  /* ════════════════════════════════════════════════════════════════
     RESPONSIVE
  ════════════════════════════════════════════════════════════════ */
  @media (max-width: 768px) {
    .bl-hero { padding: 2rem 1rem 3rem; }
    .bl-hero-inner { flex-direction: column; align-items: flex-start; }
    .bl-hero-stats { align-self: flex-start; }
    .bl-hero-cats { width: 100%; overflow-x: auto; flex-wrap: nowrap; padding-bottom: 4px; }
    .bl-main { padding: 0 1rem 3rem; }
    .bl-results-bar { flex-direction: column; align-items: flex-start; }
    .bl-search-wrap { width: 100%; }
    .bl-search { width: 100%; }
  }
  @media (max-width: 480px) {
    .bl-hero { padding: 1.5rem 1rem 2rem; }
    .bl-main { padding: 0 0.75rem 2rem; }
    .bl-newsletter { padding: 3rem 1rem; }
    .bl-nl-input { width: 100%; }
    .bl-nl-btn { width: 100%; }
  }
`;

// ── Icons ─────────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const CalIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────
const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, catsRes] = await Promise.all([
          api.get('/blogs'),
          api.get('/blog-categories'),
        ]);
        setPosts(postsRes.data);
        setCategories(['All', ...catsRes.data.map(c => c.name)]);
      } catch (err) {
        console.error('Error fetching blog data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.excerpt || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = activeCategory === 'All' || post.category === activeCategory;
    return matchSearch && matchCat;
  });

  const clearFilters = () => { setActiveCategory('All'); setSearchTerm(''); };

  const formatImg = img =>
    img
      ? img.startsWith('http') ? img : `${IMAGE_BASE_URL}${img.startsWith('/') ? '' : '/'}${img}`
      : 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80';

  const formatDate = d =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  // Count posts per category for pills
  const countFor = cat =>
    cat === 'All' ? posts.length : posts.filter(p => p.category === cat).length;

  // ── Loading ──────────────────────────────────────────────────────
  if (loading) return (
    <>
      <style>{css}</style>
      <div className="bl-loading"><div className="bl-spinner" /></div>
    </>
  );

  // ── Render ───────────────────────────────────────────────────────
  return (
    <>
      <style>{css}</style>
      <div className="bl-root">

        {/* ── Hero — Enhanced without bg image ── */}
        <div className="bl-hero">
          <div className="bl-hero-inner">

            {/* Left */}
            <div className="bl-hero-left">
              <div className="bl-hero-badge">
                <span></span>
                <p>EvesCafe · Botanical Wisdom · Journal</p>
              </div>
              <h1 className="bl-hero-title luxury-serif">
                {searchTerm ? 'Search' : 'Botanical'}
                <span className="bl-hero-script text-gradient">
                  {searchTerm ? `"${searchTerm}"` : 'Journal'}
                </span>
              </h1>
              <p className="bl-hero-desc">
                {searchTerm
                  ? `Discovering rituals for your quest…`
                  : `Artisan insights, thoughtfully curated for your journey`}
              </p>

              {/* Category pills moved inside left column */}
              <div className="bl-hero-cats">
                {categories.map(cat => (
                  <button
                    key={cat}
                    className={`bl-cat${activeCategory === cat ? ' active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                    <span className="bl-cat-count">{countFor(cat)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Stats Card */}
            {!loading && posts.length > 0 && (
              <div className="bl-hero-stats">
                <div className="bl-hero-stats-item">
                  <div className="bl-hero-stats-number">{posts.length}</div>
                  <div className="bl-hero-stats-label">Articles</div>
                </div>
                <div className="bl-hero-stats-divider"></div>
                <div className="bl-hero-stats-item">
                  <div className="bl-hero-stats-number">100%</div>
                  <div className="bl-hero-stats-label">Organic</div>
                </div>
                <div className="bl-hero-stats-divider"></div>
                <div className="bl-hero-stats-item">
                  <div className="bl-hero-stats-number">🌿</div>
                  <div className="bl-hero-stats-label">Ayurveda</div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* ── Main ── */}
        <div className="bl-main">

          {/* Results bar + search */}
          <div className="bl-results-bar">
            <span>
              {loading ? (
                'Refreshing ritual library…'
              ) : (
                <span>
                  Showing <strong>{filteredPosts.length}</strong> post{filteredPosts.length !== 1 ? 's' : ''}
                </span>
              )}
            </span>

            <div className="bl-search-wrap">
              {(searchTerm || activeCategory !== 'All') && (
                <button className="bl-clear-btn" onClick={clearFilters}>Clear</button>
              )}
              <div className="bl-search-inner">
                <SearchIcon />
                <input
                  className="bl-search"
                  type="text"
                  placeholder="Search rituals…"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Grid */}
          {filteredPosts.length === 0 ? (
            <div className="bl-empty">
              <h3>No rituals found</h3>
              <p>
                {searchTerm
                  ? `We couldn't find anything matching "${searchTerm}"`
                  : 'Try selecting a different category.'}
              </p>
              <button
                className="bl-cat active"
                style={{ marginTop: '1.5rem', borderRadius: '40px' }}
                onClick={clearFilters}
              >
                View all posts
              </button>
            </div>
          ) : (
            <div className="bl-grid">
              {filteredPosts.map((post, index) => (
                <div
                  key={post.id}
                  className="bl-card rv"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Image */}
                  <div className="bl-img-wrap">
                    <img
                      className="bl-card-img"
                      src={formatImg(post.image)}
                      alt={post.title}
                      loading="lazy"
                    />
                    {post.category && <span className="bl-badge">{post.category}</span>}
                  </div>

                  {/* Body */}
                  <div className="bl-body">
                    <span className="bl-body-cat">{post.category}</span>

                    <h2 className="bl-card-title">{post.title}</h2>

                    <p className="bl-excerpt">{post.excerpt}</p>

                    <div className="bl-spacer" />

                    <div className="bl-foot">
                      <div className="bl-meta">
                        <span className="bl-meta-item">
                          <CalIcon />
                          {formatDate(post.created_at)}
                        </span>
                        {post.author && (
                          <span className="bl-meta-item">
                            <UserIcon />
                            {post.author}
                          </span>
                        )}
                      </div>
                      <span className="bl-read">
                        Read <span className="bl-read-arrow">→</span>
                      </span>
                    </div>
                  </div>

                  {/* Full-card invisible link */}
                  <Link
                    to={`/blog/${post.slug}`}
                    style={{ position: 'absolute', inset: 0, zIndex: 20 }}
                    aria-label={`Read ${post.title}`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Newsletter ── */}
        <div className="bl-newsletter">
          <div className="bl-nl-inner">
            <span className="bl-nl-eyebrow">Stay Connected</span>
            <h2 className="bl-nl-title">Subscribe to the Ritual Journal</h2>
            <p className="bl-nl-sub">
              Get monthly botanical insights and Ayurvedic tips delivered straight to your sanctuary.
            </p>
            <div className="bl-nl-form">
              <input className="bl-nl-input" type="email" placeholder="Your ritual email…" />
              <button className="bl-nl-btn">Join Us</button>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default Blog;