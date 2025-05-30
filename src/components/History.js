import React, { useState } from 'react';
import { FaYoutube, FaSpinner, FaCheckCircle, FaClock } from 'react-icons/fa';
import '../styles/History.css';

const History = () => {
  const [videos] = useState({
    processing: [
      {
        id: 1,
        title: 'SEO Strategies 2025',
        thumbnail: 'https://via.placeholder.com/120x68',
        progress: 45,
        startedAt: '2025-04-02T09:30:00'
      },
      {
        id: 2,
        title: 'Content Marketing Guide',
        thumbnail: 'https://via.placeholder.com/120x68',
        progress: 78,
        startedAt: '2025-04-02T10:15:00'
      }
    ],
    completed: [
      {
        id: 3,
        title: 'Digital Marketing Masterclass',
        thumbnail: 'https://via.placeholder.com/120x68',
        youtubeUrl: 'https://youtube.com/watch?v=abc123',
        completedAt: '2025-04-01T15:45:00',
        views: 1234,
        likes: 89
      },
      {
        id: 4,
        title: 'SEO Tools Review',
        thumbnail: 'https://via.placeholder.com/120x68',
        youtubeUrl: 'https://youtube.com/watch?v=def456',
        completedAt: '2025-04-01T12:30:00',
        views: 2156,
        likes: 167
      },
      {
        id: 5,
        title: 'Keyword Research Tutorial',
        thumbnail: 'https://via.placeholder.com/120x68',
        youtubeUrl: 'https://youtube.com/watch?v=ghi789',
        completedAt: '2025-03-31T18:20:00',
        views: 3421,
        likes: 245
      }
    ]
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  const getTimeElapsed = (startTime) => {
    const start = new Date(startTime);
    const now = new Date();
    const diff = Math.floor((now - start) / 1000 / 60); // minutes
    
    if (diff < 60) return `${diff}m`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ${diff % 60}m`;
    return `${Math.floor(diff / 1440)}d`;
  };

  return (
    <div className="history-container">
      <div className="history-header">
        <h1>Video History</h1>
        <p>Track your video processing and uploads</p>
      </div>

      <div className="history-section">
        <h2>
          <FaSpinner className="spin" /> Currently Processing
        </h2>
        <div className="processing-list">
          {videos.processing.map(video => (
            <div key={video.id} className="video-card processing">
              <img src={video.thumbnail} alt={video.title} className="video-thumbnail" />
              <div className="video-info">
                <h3>{video.title}</h3>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${video.progress}%` }}
                  />
                </div>
                <div className="video-meta">
                  <span><FaClock /> Started {getTimeElapsed(video.startedAt)} ago</span>
                  <span className="progress-text">{video.progress}% Complete</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="history-section">
        <h2>
          <FaCheckCircle /> Successfully Uploaded
        </h2>
        <div className="completed-list">
          {videos.completed.map(video => (
            <div key={video.id} className="video-card completed">
              <img src={video.thumbnail} alt={video.title} className="video-thumbnail" />
              <div className="video-info">
                <h3>{video.title}</h3>
                <div className="video-meta">
                  <span>Uploaded {formatDate(video.completedAt)}</span>
                  <div className="video-stats">
                    <span>{video.views.toLocaleString()} views</span>
                    <span>{video.likes.toLocaleString()} likes</span>
                  </div>
                </div>
                <a 
                  href={video.youtubeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="youtube-link"
                >
                  <FaYoutube /> View on YouTube
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default History;
