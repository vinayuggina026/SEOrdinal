import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { MdContentCopy } from 'react-icons/md';
import { getAuth } from 'firebase/auth';
import '../styles/Optimize.css';

const Optimize = () => {
  const [file, setFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [keywords, setKeywords] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  const handleFileSelect = (selectedFile) => {
    if (
      selectedFile &&
      (selectedFile.type.startsWith('video/') || selectedFile.type.startsWith('audio/'))
    ) {
      setFile(selectedFile);
      setVideoUrl(URL.createObjectURL(selectedFile));
    } else {
      alert('Please upload a valid video or audio file');
    }
  };

  const handleFileInput = (e) => {
    const selectedFile = e.target.files[0];
    handleFileSelect(selectedFile);
  };

  const generateKeywords = async () => {
    if (!file) {
      alert('Please upload a video or audio file first');
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      alert('You must be logged in to generate keywords.');
      navigate('/login'); 
      return;
    }

    setIsGenerating(true);
    try {
      const formData = new FormData();
      formData.append('video', file);

      const response = await fetch('http://localhost:5000/transcribe', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${await user.getIdToken()}`, 
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch keywords');
      }

      const data = await response.json();
      setKeywords(data.ranked_keywords || []);
    } catch (error) {
      console.error('Error generating keywords:', error);
      alert('Failed to generate keywords. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyKeywords = () => {
    const hashtagKeywords = keywords.map(k => `#${k}`).join(' ');
    navigator.clipboard
      .writeText(hashtagKeywords)
      .then(() => alert('Keywords copied to clipboard!'))
      .catch((err) => console.error('Failed to copy keywords:', err));
  };


  const handleGenerateMetadata = () => {
    if (!file || !videoUrl) {
      alert('Upload and process a file first');
      return;
    }

    navigate('/metadata', {
      state: {
        videoUrl,
        fileName: file.name,
      },
    });
  };

  return (
    <div className="optimize-container">
      <div className="optimize-header">
        <h1>Video & Audio Optimization</h1>
        <p>
          Upload your video or audio file and get AI-powered SEO keywords to boost your
          content's visibility
        </p>
      </div>

      <div
        className={`upload-section ${isDragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          accept="video/*,audio/*"
          style={{ display: 'none' }}
        />

        {!file ? (
          <>
            <FaCloudUploadAlt className="upload-icon" />
            <p>Drag and drop your video or audio here or click to browse</p>
            <span className="supported-formats">
              Supported formats: MP4, AVI, MOV, MP3, WAV, M4A
            </span>
          </>
        ) : (
          <div className="video-preview">
            {file.type.startsWith('video/') ? (
              <video controls src={videoUrl}>
                Your browser does not support the video tag.
              </video>
            ) : (
              <audio controls src={videoUrl}>
                Your browser does not support the audio element.
              </audio>
            )}
            <p className="file-name">{file.name}</p>
          </div>
        )}
      </div>

      <div className="keyword-section">
        <div className="keyword-header">
          <h2>SEO Keywords</h2>
          <button
            className="generate-btn"
            onClick={generateKeywords}
            disabled={!file || isGenerating}
          >
            {isGenerating ? 'Generating keywords...' : 'Generate Keywords'}
          </button>
        </div>

        {keywords.length > 0 && (
          <>
            <div className="keywords-container">
              <div className="keywords-list">
                {keywords.map((keyword, index) => (
                  <span key={index} className="keyword-tag">
                    {keyword}
                  </span>
                ))}
              </div>
              <button className="copy-btn" onClick={copyKeywords}>
                <MdContentCopy /> Copy All
              </button>
            </div>

            <div className="generate-metadata-btn-wrapper">
              <button
                className="generate-metadata-btn"
                onClick={handleGenerateMetadata}
              >
                Generate Metadata
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Optimize;
