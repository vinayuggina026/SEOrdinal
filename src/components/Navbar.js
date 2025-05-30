import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/images/logo.png';
import '../styles/Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      closeMenu();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleNavigation = (path) => {
    closeMenu();
    navigate(path);
  };

  const isLoginPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <img src={logo} alt="SEOrdinal Logo" className="navbar-logo" />
          <span className="navbar-title">SEOrdinal</span>
        </Link>
      </div>

      <div className={`navbar-right ${isOpen ? 'active' : ''}`}>
        <Link 
          to="/" 
          className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          onClick={() => handleNavigation('/')}
        >
          HOME
        </Link>
        <Link 
          to="/about" 
          className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
          onClick={() => handleNavigation('/about')}
        >
          ABOUT
        </Link>
        <Link 
          to="/blog" 
          className={`nav-link ${location.pathname === '/blog' ? 'active' : ''}`}
          onClick={() => handleNavigation('/blog')}
        >
          BLOG
        </Link>
        {currentUser ? (
          <>
            <span className="user-email">{currentUser.email}</span>
            <button onClick={handleSignOut} className="login-btn">Sign Out</button>
          </>
        ) : (
          <Link 
            to="/login" 
            className={`login-btn ${isLoginPage ? 'active' : ''}`}
            onClick={() => handleNavigation('/login')}
          >
            Register/Login
          </Link>
        )}
      </div>

      <button 
        className={`hamburger ${isOpen ? 'active' : ''}`} 
        onClick={toggleMenu} 
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {isOpen && <div className="overlay" onClick={closeMenu}></div>}
    </nav>
  );
};

export default Navbar;
