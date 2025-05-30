import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Contact.css';

const Contact = () => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    message: ''
  });
  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setShowPopup(true);
    setFormData({ name: '', message: '' });
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="contact-container">
      <div className="contact-content">
        <section className="contact-section">
          <h1>Contact Us</h1>
          <div className="contact-intro">
            <p>Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
          </div>

          {showPopup && (
            <div className="form-popup">
              <div className="popup-content">
                <p>Message sent successfully!</p>
              </div>
              <button className="popup-close" onClick={handleClosePopup}>&times;</button>
            </div>
          )}

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={currentUser?.email || ''}
                readOnly
                className="readonly-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your message"
                required
              />
            </div>

            <button type="submit" className="submit-btn">
              Send Message
            </button>
          </form>

          <div className="contact-info">
            <h2>Other Ways to Connect</h2>
            <div className="info-items">
              <div className="info-item">
                <strong>Email:</strong>
                <span>support@seordinal.com</span>
              </div>
              <div className="info-item">
                <strong>Phone:</strong>
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="info-item">
                <strong>Address:</strong>
                <span>123 SEO Street, Digital City, DC 12345</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;
