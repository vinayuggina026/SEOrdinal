import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { MdContentCopy } from 'react-icons/md';
import Loader from './Loader';
import '../styles/Metadata.css';

const Metadata = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { videoUrl, fileName } = location.state || {};
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  const fetchMetadata = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/metadata');
      if (!res.ok) {
        throw new Error('Failed to fetch metadata');
      }
      const data = await res.json();
      setMetadata(data);
    } catch (err) {
      console.error('Failed to fetch metadata:', err);
      alert('Failed to fetch metadata. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!videoUrl) {
      alert('No video found, redirecting...');
      navigate('/optimize');
      return;
    }
    fetchMetadata();
  }, [videoUrl, navigate]);

  const regenerateMetadata = async () => {
    setRegenerating(true);
    try {
      const response = await fetch('http://localhost:5000/regenerate', { method: 'POST' });
      if (!response.ok) {
        throw new Error('Error regenerating metadata');
      }
      const data = await response.json();
      setMetadata(data);
    } catch (error) {
      console.error('Error regenerating metadata:', error);
      alert('Failed to regenerate metadata. Please try again.');
    } finally {
      setRegenerating(false);
    }
  };

  const handleUpload = async () => {
    if (!verified) {
      alert('Please verify the metadata before uploading.');
      return;
    }

    try {
      const userToken = 'user-auth-token';
      const formData = new FormData();
      formData.append('video', videoUrl);
      formData.append('user_token', userToken); 

      const response = await fetch('http://localhost:5000/upload_video', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.error) {
        alert(result.error);
      } else {
        alert('Video uploaded successfully!');
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Failed to upload video. Please try again.');
    }
  };

  return (
    <div className="metadata-container">
      <div className="metadata-header">
        <FaArrowLeft
          className="back-arrow"
          onClick={() => navigate('/optimize')}
          title="Go back"
        />
        <h2>Generated Metadata</h2>
      </div>

      <div className="video-preview">
        {videoUrl ? (
          <video controls src={videoUrl}>
            Your browser does not support the video tag.
          </video>
        ) : (
          <p>No video preview available</p>
        )}
        <p className="file-name">{fileName}</p>
      </div>

      {(loading || regenerating) ? (
        <div className="loader-wrapper">
          <Loader />
          <p>{regenerating ? 'Regenerating metadata...' : 'Loading metadata...'}</p>
        </div>
      ) : (
        metadata && (
          <div className="metadata-details">
            <div className="meta-box">
              <div className="meta-label">Title</div>
              <div className="meta-content-row align-left">
                <div className="meta-content">{metadata.title}</div>
              </div>
            </div>

            <div className="meta-box">
              <div className="meta-label">Description</div>
              <div className="meta-content-row align-left">
                <div className="meta-content">{metadata.description}</div>
              </div>
            </div>

            <div className="meta-box">
              <div className="meta-label">Tags</div>
              <div className="meta-content-row align-left">
                <div className="meta-content tags-list">
                  {metadata.tags.map((tag, index) => (
                    <span key={index} className="keyword-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="center-actions">
              <button
                className="regenerate-btn full-width-btn"
                onClick={regenerateMetadata}
                disabled={regenerating}
              >
                {regenerating ? 'Regenerating...' : 'Regenerate Metadata'}
              </button>

              <div className="verify-checkbox center-checkbox">
                <input
                  type="checkbox"
                  id="verify"
                  checked={verified}
                  onChange={(e) => setVerified(e.target.checked)}
                />
                <label htmlFor="verify">I verified the generated metadata</label>
              </div>
              <button
                className="upload-btn full-width-btn"
                disabled={!verified}
                onClick={handleUpload}
              >
                Upload to YouTube
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default Metadata;
