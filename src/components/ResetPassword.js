import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase/config';
import { MdEmail } from 'react-icons/md';
import '../styles/Auth.css';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsResetting(true);
    setError('');

    try {
      await sendPasswordResetEmail(auth, email);
      setEmailSent(true);
    } catch (error) {
      console.error('Password reset error:', error);
      switch (error.code) {
        case 'auth/user-not-found':
          setError('No account found with this email address.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        case 'auth/too-many-requests':
          setError('Too many attempts. Please try again later.');
          break;
        default:
          setError('Failed to send reset email. Please try again.');
      }
    } finally {
      setIsResetting(false);
    }
  };

  if (emailSent) {
    return (
      <div className="auth-container">
        <div className="auth-box">
          <h1>Check Your Email</h1>
          <div className="success-message">
            Password reset link has been sent to your email.
          </div>
          <p className="reset-instructions">
            Please check your email and follow the instructions to reset your password.
            After resetting your password, you can log in with your new credentials.
          </p>
          <button 
            className="auth-btn"
            onClick={() => navigate('/login')}
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Reset Password</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-container">
              <MdEmail />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                disabled={isResetting}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="auth-btn"
            disabled={isResetting}
          >
            {isResetting ? 'Sending Reset Link...' : 'Send Reset Link'}
          </button>

          <button 
            type="button" 
            className="auth-btn secondary"
            onClick={() => navigate('/login')}
            disabled={isResetting}
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
