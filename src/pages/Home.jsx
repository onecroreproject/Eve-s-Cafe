import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Categories from '../components/Categories';
import Bestseller from '../components/Bestseller';
import RecentProducts from '../components/RecentProducts';
import Combos from '../components/Combos';
import RecentlyViewed from '../components/RecentlyViewed';
import AboutHeritage from '../components/AboutHeritage';
import BrandHeritage from '../components/BrandHeritage';
import ContactCard from '../components/ContactCard';
import YouTube from '../components/YouTube';
import TrustSection from '../components/TrustSection';

const Home = () => {
  return (
    <div className="w-full overflow-x-hidden">
      <Hero />
      <Features />
      <Categories />
      <Bestseller />
      <RecentProducts />
      <Combos />
      <RecentlyViewed />
      <BrandHeritage />
      <AboutHeritage />
      <ContactCard />
      <TrustSection />
      <YouTube />
    </div>
  );
};

export default Home;

