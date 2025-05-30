import React from 'react';
import { FaSearch, FaChartLine, FaAward, FaCrown } from 'react-icons/fa';
import { BiTrendingUp, BiSearchAlt } from 'react-icons/bi';
import { MdStars, MdTrendingUp } from 'react-icons/md';
import '../styles/Milestone.css';

const Milestone = () => {
  const userStats = {
    totalUploads: 3,
    currentBadge: "Bronze 1",
    nextBadge: "Bronze 2",
    uploadsToNext: 2
  };

  const badges = [
    {
      id: 1,
      name: "Bronze 1",
      requirement: "First Video Optimization",
      icon: <BiSearchAlt className="badge-icon bronze" />,
      achieved: true
    },
    {
      id: 2,
      name: "Bronze 2",
      requirement: "5 Videos with Keywords",
      icon: <FaSearch className="badge-icon bronze" />,
      achieved: false
    },
    {
      id: 3,
      name: "Silver 1",
      requirement: "10 High SEO Score Videos",
      icon: <FaChartLine className="badge-icon silver" />,
      achieved: false
    },
    {
      id: 4,
      name: "Silver 2",
      requirement: "25 Optimized Videos",
      icon: <BiTrendingUp className="badge-icon silver" />,
      achieved: false
    },
    {
      id: 5,
      name: "Gold 1",
      requirement: "50 Videos with 90%+ SEO Score",
      icon: <FaAward className="badge-icon gold" />,
      achieved: false
    },
    {
      id: 6,
      name: "Gold 2",
      requirement: "75 Trending Keywords Used",
      icon: <MdTrendingUp className="badge-icon gold" />,
      achieved: false
    },
    {
      id: 7,
      name: "Platinum",
      requirement: "100 Videos in Top Search Results",
      icon: <MdStars className="badge-icon platinum" />,
      achieved: false
    },
    {
      id: 8,
      name: "Diamond",
      requirement: "150 Viral Optimized Videos",
      icon: <FaCrown className="badge-icon diamond" />,
      achieved: false
    }
  ];

  return (
    <div className="milestone-container">
      <div className="milestone-header">
        <h1>Your Milestones</h1>
        <p>Track your progress and earn badges</p>
      </div>

      <div className="current-status">
        <div className="status-card">
          <h2>Current Progress</h2>
          <div className="status-content">
            <div className="status-item">
              <span>Total Uploads</span>
              <strong>{userStats.totalUploads}</strong>
            </div>
            <div className="status-item">
              <span>Current Badge</span>
              <strong>{userStats.currentBadge}</strong>
            </div>
            <div className="status-item">
              <span>Next Badge</span>
              <strong>{userStats.nextBadge}</strong>
            </div>
            <div className="status-item">
              <span>Uploads to Next Badge</span>
              <strong>{userStats.uploadsToNext}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="badges-section">
        <h2>Available Badges</h2>
        <div className="badges-grid">
          {badges.map(badge => (
            <div key={badge.id} className={`badge-card ${badge.achieved ? 'achieved' : ''}`}>
              <div className="badge-icon-wrapper">
                {badge.icon}
              </div>
              <h3>{badge.name}</h3>
              <p>{badge.requirement}</p>
              {badge.achieved && <span className="achieved-tag">Achieved!</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="progress-info">
        <h2>How to Earn Badges</h2>
        <ul>
          <li>Upload and optimize your first video to earn Bronze 1</li>
          <li>Optimize 5 videos with relevant keywords for Bronze 2</li>
          <li>Achieve high SEO scores on 10 videos to reach Silver 1</li>
          <li>Successfully optimize 25 videos to earn Silver 2</li>
          <li>Get 50 videos with 90% or higher SEO score for Gold 1</li>
          <li>Use trending keywords in 75 videos to achieve Gold 2</li>
          <li>Get 100 videos ranking in top search results for Platinum</li>
          <li>Create 150 viral-optimized videos to reach Diamond status</li>
        </ul>
      </div>
    </div>
  );
};

export default Milestone;
