import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Dashboard.css';

const HomeDashboard = () => {
  const [file, setFile] = useState(null);
  const [inputText, setInputText] = useState('');
  const { currentUser } = useAuth();

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleGenerate = () => {
    console.log('Generating with file:', file, 'and text:', inputText);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {currentUser?.displayName || currentUser?.email}!</h1>
        <p>Manage your videos and track your analytics</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">12</div>
          <div className="stat-label">Total Videos</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">1.2K</div>
          <div className="stat-label">Total Views</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">89%</div>
          <div className="stat-label">Engagement Rate</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <h2 className="card-title">Quick Upload</h2>
            <div className="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
          </div>
          <div className="card-content">
            <div 
              className="upload-area"
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const droppedFile = e.dataTransfer.files[0];
                if (droppedFile && droppedFile.type.startsWith('video/')) {
                  setFile(droppedFile);
                }
              }}
            >
              <input
                type="file"
                id="video-upload"
                className="hidden"
                accept="video/*"
                onChange={handleFileChange}
              />
              <label htmlFor="video-upload" className="upload-label">
                {file ? (
                  <div className="file-info">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{file.name}</span>
                  </div>
                ) : (
                  <div className="upload-prompt">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span>Click to upload or drag and drop</span>
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h2 className="card-title">Recent Analytics</h2>
            <div className="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div className="card-content">
            <div className="analytics-preview">
              <p>View your latest video performance metrics and insights</p>
              <div className="analytics-actions">
                <button className="view-details-btn">View Details</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="upload-section">
        <div className="generate-content">
          <input
            type="text"
            placeholder="Enter your text..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="text-input"
          />
          <button 
            className="upload-button" 
            onClick={handleGenerate} 
            disabled={!file || !inputText}
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;
