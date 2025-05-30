import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FaUser, FaCamera } from 'react-icons/fa';
import '../styles/Account.css';

const Account = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const storage = getStorage();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    countryCode: '+91',
    country: 'India',
    photoURL: ''
  });

  const countryCodes = [
    { code: '+91', country: 'India' },
    { code: '+1', country: 'USA' },
    { code: '+44', country: 'UK' },
    { code: '+81', country: 'Japan' },
    { code: '+86', country: 'China' },
    { code: '+61', country: 'Australia' },
    { code: '+49', country: 'Germany' },
    { code: '+33', country: 'France' },
    { code: '+39', country: 'Italy' },
    { code: '+34', country: 'Spain' },
    { code: '+55', country: 'Brazil' },
    { code: '+7', country: 'Russia' },
    { code: '+1', country: 'Canada' }
  ];

  const countries = [
    'India', 'USA', 'UK', 'Japan', 'China', 'Canada', 'Australia',
    'Germany', 'France', 'Italy', 'Spain', 'Brazil', 'Russia'
  ];

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.displayName || '',
        email: currentUser.email || '',
        phoneNumber: currentUser.phoneNumber || '',
        countryCode: '+91',
        country: 'India',
        photoURL: currentUser.photoURL || ''
      });
      setImageError(false);
    }
  }, [currentUser]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setLoading(true);
      try {
        const storageRef = ref(storage, `profile_pics/${currentUser.uid}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        setFormData(prev => ({ ...prev, photoURL: downloadURL }));
        setImageError(false);
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image. Please try again.');
        setImageError(true);
      }
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateUserProfile({
        displayName: formData.name,
        photoURL: formData.photoURL
      });
      
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
    setLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setFormData(prev => ({ ...prev, photoURL: '' }));
  };

  return (
    <div className="account-container">
      <div className="account-header">
        <h1>My Account</h1>
        <p>Manage your personal information</p>
      </div>

      <div className="account-content">
        <div className="profile-section">
          <div className="profile-image-wrapper">
            <div className={`profile-image-container ${formData.photoURL && !imageError ? 'has-image' : ''}`}>
              {formData.photoURL && !imageError ? (
                <img 
                  src={formData.photoURL} 
                  alt="Profile" 
                  className="profile-image"
                  onError={handleImageError}
                />
              ) : (
                <div className="profile-image-placeholder">
                  <FaUser />
                </div>
              )}
            </div>
            {isEditing && (
              <div className="image-upload">
                <label htmlFor="photo-upload" className="camera-icon">
                  <FaCamera />
                </label>
                <input
                  type="file"
                  id="photo-upload"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </div>
            )}
          </div>

          <div className="profile-details">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Enter your name"
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="disabled-input"
              />
            </div>

            <div className="form-group phone-group">
              <label>Phone Number</label>
              <div className="phone-input-wrapper">
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                >
                  {countryCodes.map(({ code, country }) => (
                    <option key={code + country} value={code}>
                      {code} ({country})
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Country</label>
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                disabled={!isEditing}
              >
                {countries.map(country => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <div className="button-group">
              {!isEditing ? (
                <button 
                  className="update-button"
                  onClick={handleUpdate}
                  disabled={loading}
                >
                  Update Details
                </button>
              ) : (
                <button 
                  className="save-button"
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Details'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
