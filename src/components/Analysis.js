import React from 'react';
import { FaEye, FaClock, FaThumbsUp, FaChartLine } from 'react-icons/fa';
import '../styles/Analysis.css';

const Analysis = () => {

  const overallMetrics = {
    totalViews: "12.5K",
    watchHours: "856",
    engagement: "24.3%",
    avgViewDuration: "4:32"
  };

  const previousUploads = [
    {
      id: 1,
      title: "How to Start with SEO",
      views: "5.2K",
      watchTime: "328",
      engagement: "26.8%",
      uploadDate: "2025-03-28"
    },
    {
      id: 2,
      title: "Content Marketing Tips",
      views: "3.8K",
      watchTime: "245",
      engagement: "22.4%",
      uploadDate: "2025-03-25"
    },
    {
      id: 3,
      title: "Digital Marketing Strategy",
      views: "3.5K",
      watchTime: "283",
      engagement: "23.7%",
      uploadDate: "2025-03-22"
    }
  ];

  return (
    <div className="analysis-container">
      <div className="analysis-header">
        <h1>Video Performance Insights</h1>
        <p>Track and analyze your video metrics</p>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <FaEye className="metric-icon" />
          <div className="metric-content">
            <h3>Total Views</h3>
            <p>{overallMetrics.totalViews}</p>
          </div>
        </div>
        <div className="metric-card">
          <FaClock className="metric-icon" />
          <div className="metric-content">
            <h3>Watch Hours</h3>
            <p>{overallMetrics.watchHours}</p>
          </div>
        </div>
        <div className="metric-card">
          <FaThumbsUp className="metric-icon" />
          <div className="metric-content">
            <h3>Engagement Rate</h3>
            <p>{overallMetrics.engagement}</p>
          </div>
        </div>
        <div className="metric-card">
          <FaChartLine className="metric-icon" />
          <div className="metric-content">
            <h3>Avg. View Duration</h3>
            <p>{overallMetrics.avgViewDuration}</p>
          </div>
        </div>
      </div>

      <div className="previous-uploads">
        <h2>Previous Upload Performance</h2>
        <div className="uploads-table">
          <table>
            <thead>
              <tr>
                <th>Video Title</th>
                <th>Views</th>
                <th>Watch Time (hrs)</th>
                <th>Engagement</th>
                <th>Upload Date</th>
              </tr>
            </thead>
            <tbody>
              {previousUploads.map(video => (
                <tr key={video.id}>
                  <td>{video.title}</td>
                  <td>{video.views}</td>
                  <td>{video.watchTime}</td>
                  <td>{video.engagement}</td>
                  <td>{video.uploadDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
