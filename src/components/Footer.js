import React from 'react';
import { FaYoutube, FaInstagram, FaDiscord, FaTwitter } from 'react-icons/fa';
import logo from '../assets/images/logo.png';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <img src={logo} alt="SEOrdinal Logo" className="footer-logo" />
          <span className="footer-title">SEOrdinal</span>
        </div>
        <div className="social-links">
          <h3>Follow us on</h3>
          <div className="social-icons">
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon">
              <FaYoutube />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
              <FaInstagram />
            </a>
            <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="social-icon">
              <FaDiscord />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
              <FaTwitter />
            </a>
          </div>
        </div>
        <p className="copyright">&copy; {new Date().getFullYear()} SEOrdinal. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
