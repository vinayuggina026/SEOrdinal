import React from 'react';
import '../styles/About.css';

const About = () => {
  return (
    <div className="about-container">
      <div className="about-content">
        <section className="about-section">
          <h1>About SEOrdinal</h1>
          <div className="about-intro">
            <h2>Introduction</h2>
            <p>SEOrdinal is a cutting-edge AI-powered platform that revolutionizes video content optimization. We help content creators and businesses maximize their online visibility through intelligent SEO analysis and keyword optimization.</p>
          </div>
          
          <div className="about-mission">
            <h2>Our Mission</h2>
            <p>Our mission is to empower content creators with advanced AI tools that make SEO optimization intuitive and effective. We strive to bridge the gap between great content and great visibility.</p>
          </div>

          <div className="about-values">
            <h2>Our Values</h2>
            <ul>
              <li>Innovation in AI Technology</li>
              <li>User-Centric Approach</li>
              <li>Data-Driven Results</li>
              <li>Continuous Improvement</li>
            </ul>
          </div>

          <div className="about-features">
            <h2>What We Offer</h2>
            <ul>
              <li>AI-Powered Video Content Analysis</li>
              <li>Smart Keyword Generation</li>
              <li>Real-time SEO Recommendations</li>
              <li>Performance Analytics</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
