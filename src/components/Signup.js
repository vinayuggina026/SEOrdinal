import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { IoMdClose } from 'react-icons/io';
import { MdEmail } from 'react-icons/md';
import { RiLockPasswordLine } from 'react-icons/ri';
import { createUserWithEmailAndPassword, signInWithPopup, sendEmailVerification } from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';
import '../styles/Auth.css';

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  useEffect(() => {
    auth.signOut();
    
    if (location.state?.message) {
      setError(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    if (!formData.acceptTerms) {
      setError('Please accept the Terms and Conditions');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      await sendEmailVerification(userCredential.user);
      navigate('/verify-email', { replace: true });
    } catch (error) {
      console.error('Signup error:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please use a different email address.');
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!formData.acceptTerms) {
      setError('Please accept the Terms and Conditions');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user.emailVerified) {
        navigate('/', { replace: true });
      } else {
        await sendEmailVerification(result.user);
        navigate('/verify-email', { replace: true });
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleTerms = (e) => {
    e.preventDefault();
    setShowTerms(!showTerms);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-container">
              <MdEmail />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-container">
              <RiLockPasswordLine />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-container">
              <RiLockPasswordLine />
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
                disabled={loading}
              />
            </div>
          </div>

          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                required
                disabled={loading}
              />
              I accept the <button onClick={toggleTerms} className="terms-btn">Terms and Conditions</button>
            </label>
          </div>

          <button 
            type="submit" 
            className="auth-btn"
            disabled={loading || !formData.acceptTerms}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>

          <div className="divider">
            <span>Or With</span>
          </div>

          <button 
            type="button" 
            className="google-btn"
            onClick={handleGoogleSignIn}
            disabled={loading || !formData.acceptTerms}
          >
            <FcGoogle />
            Sign up with Google
          </button>

          <p className="auth-redirect">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>

      {showTerms && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Terms and Conditions</h2>
              <button onClick={toggleTerms} className="close-btn">
                <IoMdClose />
              </button>
            </div>
            <div className="modal-content">
              <h3>1. Account Access and Information</h3>
              <p>By using SEOrdinal, you agree to grant us access to:</p>
              <ul>
                <li>Your Gmail account information</li>
                <li>Basic profile details (name, email, profile picture)</li>
                <li>Account preferences and settings</li>
              </ul>

              <h3>2. Data Usage</h3>
              <p>We will use your information to:</p>
              <ul>
                <li>Personalize your SEO optimization experience</li>
                <li>Provide customized keyword suggestions</li>
                <li>Improve our services and user experience</li>
              </ul>

              <h3>3. Privacy and Security</h3>
              <p>We are committed to protecting your data by:</p>
              <ul>
                <li>Using industry-standard encryption</li>
                <li>Never sharing your data with third parties</li>
                <li>Allowing you to delete your data at any time</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
