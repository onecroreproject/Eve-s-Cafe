import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { IMAGE_BASE_URL } from '../api/config';

const skeletonCss = `
  @keyframes skeletonShimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  
  .skeleton-item {
    background: linear-gradient(90deg, #f9fafb 25%, #f3f4f6 37%, #f9fafb 63%);
    background-size: 400% 100%;
    animation: skeletonShimmer 1.4s ease infinite;
    border-radius: 4px;
  }
  
  .skeleton-card {
    display: flex;
    flex-direction: column;
    background: transparent;
    height: 100%;
  }
`;

const ShopByCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/categories');
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pt-0 pb-10 bg-white">
      <style>{skeletonCss}</style>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10 px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1A3C2E] leading-tight mb-4 luxury-serif">
            Shop by <span className="text-gradient">Category</span>
          </h2>
          <p className="text-[rgb(var(--muted))] max-w-xl">
            Explore our curated collections of traditional Ayurvedic remedies.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="skeleton-card">
                {/* Rounded Square Image Container */}
                <div className="skeleton-item" style={{ width: '100%', paddingBottom: '100%', borderRadius: '16px', marginBottom: '16px' }} />
                {/* Text Line Below */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <div className="skeleton-item" style={{ width: '60%', height: '18px', borderRadius: '4px' }} />
                </div>
              </div>
            ))
          ) : (
            Array.isArray(categories) && categories.map((category) => (
              <Link
                key={category.id}
                to={`/shop/${category.slug}`}
                className="group cursor-pointer no-underline block"
              >
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden rounded-2xl mb-4 bg-gray-50 border border-gray-100">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-all duration-500 z-10 rounded-2xl"></div>

                  {category.image ? (
                    <img
                      src={`${IMAGE_BASE_URL}${category.image}`}
                      alt={category.name}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-200">
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Content Below Image */}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-[rgb(var(--foreground))] mb-1 group-hover:text-[#556B2F] transition-colors duration-300">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3 border-2 border-[#556B2F] text-[#556B2F] font-semibold uppercase tracking-wider text-sm rounded-full hover:bg-[#556B2F] hover:text-white transition-all duration-300 group"
          >
            Explore Full Collection
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;
