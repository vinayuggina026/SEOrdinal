import React from 'react';
import '../styles/SplashScreen.css';
import logo from '../assets/images/logo.png';

const SplashScreen = () => {
  return (
    <div className="splash-screen">
      <div className="splash-content">
        <img src={logo} alt="SEOrdinal Logo" className="splash-logo" />
        <h1>Welcome to SEOrdinal</h1>
        <p>Analyze video content to generate high-ranking SEO keywords, optimize metadata, and boost visibility using AI-driven keyword research and ranking.</p>
      </div>
    </div>
  );
};

export default SplashScreen;
