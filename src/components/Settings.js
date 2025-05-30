import React, { useState, useEffect } from 'react';
import { FaMoon, FaSun, FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import { getAuth, deleteUser } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../styles/Settings.css';

const Settings = () => {
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, []);

  const handleThemeToggle = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    if (newDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteAccount = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await deleteUser(user);
        localStorage.removeItem('darkMode');
        document.body.classList.remove('dark-mode');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. Please try again or contact support.');
    }
    setShowDeleteConfirm(false);
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Customize your experience</p>
      </div>

      <div className="settings-section">
        <h2>Appearance</h2>
        <div className="setting-card">
          <div className="setting-item">
            <div className="setting-info">
              <h3>Dark Mode</h3>
              <p>Switch between light and dark themes</p>
            </div>
            <button 
              className={`theme-toggle ${darkMode ? 'dark' : 'light'}`}
              onClick={handleThemeToggle}
            >
              {darkMode ? <FaMoon /> : <FaSun />}
            </button>
          </div>
        </div>
      </div>

      <div className="settings-section danger-zone">
        <h2>Account Management</h2>
        <div className="setting-card danger">
          <div className="setting-item">
            <div className="setting-info">
              <h3>Delete Account</h3>
              <p>Permanently delete your account and all associated data</p>
            </div>
            <button 
              className="delete-btn"
              onClick={handleDeleteAccount}
            >
              <FaTrash /> Delete Account
            </button>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="delete-confirmation-modal">
          <div className="modal-content">
            <FaExclamationTriangle className="warning-icon" />
            <h2>Delete Account?</h2>
            <p>This action cannot be undone. All your data will be permanently deleted.</p>
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className="confirm-delete-btn"
                onClick={confirmDeleteAccount}
              >
                Yes, Delete My Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
