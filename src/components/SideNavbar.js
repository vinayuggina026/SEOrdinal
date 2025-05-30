import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Sidebar.css';
import logo from '../assets/images/logo.png';

import { RiDashboardLine, RiHistoryLine, RiSettings4Line, RiUserLine, RiNotification3Line } from 'react-icons/ri';
import { BiAnalyse } from 'react-icons/bi';
import { AiOutlineInfoCircle, AiOutlineContacts, AiOutlineRead, AiOutlineMenu } from 'react-icons/ai';
import { FiLogOut } from 'react-icons/fi';
import { BsLightningCharge } from 'react-icons/bs';
import { IoTrophyOutline } from 'react-icons/io5';
import { FaHistory } from 'react-icons/fa';

const SideNavbar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (window.innerWidth <= 768) {
      toggleSidebar(false);
    }
  }, [location.pathname, toggleSidebar]);


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        toggleSidebar(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [toggleSidebar]);

  const mainLinks = [
    { path: '/dashboard', name: 'Dashboard', icon: <RiDashboardLine /> },
    { path: '/about', name: 'About', icon: <AiOutlineInfoCircle /> },
    { path: '/contact', name: 'Contact', icon: <AiOutlineContacts /> },
    { path: '/blog', name: 'Blog', icon: <AiOutlineRead /> },
  ];

  const serviceLinks = [
    { path: '/optimize', name: 'Optimize', icon: <BsLightningCharge /> },
    { path: '/analysis', name: 'Analysis', icon: <BiAnalyse /> },
    { path: '/milestone', name: 'Milestone', icon: <IoTrophyOutline /> },
    { path: '/notifications', name: 'Notifications', icon: <RiNotification3Line /> },
    { path: '/history', name: 'History', icon: <FaHistory /> },
    { path: '/settings', name: 'Settings', icon: <RiSettings4Line /> },
    { path: '/account', name: 'Account', icon: <RiUserLine /> },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <>
      <button 
        className={`mobile-menu-btn ${isOpen ? 'active' : ''}`}
        onClick={() => toggleSidebar(!isOpen)}
        aria-label="Toggle Menu"
      >
        <AiOutlineMenu />
      </button>

      <aside className={`app-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-logo">
            <img src={logo} alt="SEOrdinal" className="sidebar-logo" />
          </div>
          <div className="brand-text">
            <span className="brand-name">SEOrdinal</span>
            <span className="brand-tagline">SEO Analytics</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-section-title">Main Menu</div>
            {mainLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`sidebar-nav-item ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
          </div>

          <div className="nav-section">
            <div className="nav-section-title">Services</div>
            {serviceLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`sidebar-nav-item ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
          </div>
        </nav>

        <div className="sidebar-profile">
          <div className="profile-info">
            <Link to="/account" className="profile-avatar">
              {currentUser?.photoURL && !imageError ? (
                <img 
                  src={currentUser.photoURL} 
                  alt="Profile"
                  className="profile-pic"
                  onError={handleImageError}
                />
              ) : (
                <RiUserLine size={24} />
              )}
            </Link>
            <div className="profile-details">
              <div className="profile-name">
                {currentUser?.displayName || 'User'}
              </div>
              <div className="profile-email" title={currentUser?.email}>
                {currentUser?.email}
              </div>
            </div>
          </div>

          <button className="sidebar-logout" onClick={handleLogout}>
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default SideNavbar;
