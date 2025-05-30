import React, { useState } from 'react';
import { FaBell, FaCheck, FaExclamationCircle, FaTrophy } from 'react-icons/fa';
import '../styles/Notifications.css';

const Notifications = () => {
  const [notifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'Video Upload Successful',
      message: 'Your video "SEO Tips 2025" has been successfully uploaded.',
      time: '2 minutes ago',
      icon: <FaCheck />
    },
    {
      id: 2,
      type: 'info',
      title: 'Keywords Generated',
      message: 'SEO keywords have been generated for your recent upload.',
      time: '1 hour ago',
      icon: <FaBell />
    },
    {
      id: 3,
      type: 'achievement',
      title: 'New Badge Earned',
      message: 'Congratulations! You\'ve earned the Bronze 1 badge.',
      time: '2 hours ago',
      icon: <FaTrophy />
    },
    {
      id: 4,
      type: 'alert',
      title: 'Upload Reminder',
      message: 'It\'s been a week since your last upload. Keep your content fresh!',
      time: '1 day ago',
      icon: <FaExclamationCircle />
    }
  ]);

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h1>Notifications</h1>
        <p>Stay updated with your content performance</p>
      </div>

      <div className="notifications-list">
        {notifications.map(notification => (
          <div key={notification.id} className={`notification-card ${notification.type}`}>
            <div className="notification-icon">
              {notification.icon}
            </div>
            <div className="notification-content">
              <h3>{notification.title}</h3>
              <p>{notification.message}</p>
              <span className="notification-time">{notification.time}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="notifications-settings">
        <h2>Notification Preferences</h2>
        <div className="settings-grid">
          <label className="setting-item">
            <input type="checkbox" defaultChecked />
            <span>Upload Notifications</span>
          </label>
          <label className="setting-item">
            <input type="checkbox" defaultChecked />
            <span>Performance Updates</span>
          </label>
          <label className="setting-item">
            <input type="checkbox" defaultChecked />
            <span>Achievement Alerts</span>
          </label>
          <label className="setting-item">
            <input type="checkbox" defaultChecked />
            <span>Content Reminders</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
