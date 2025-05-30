import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../firebase/config';
import { sendEmailVerification, onAuthStateChanged, signOut, deleteUser } from 'firebase/auth';
import { MdEmail } from 'react-icons/md';
import { IoMdClose } from 'react-icons/io';
import '../styles/Auth.css';

const EmailVerification = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(() => {
    const saved = sessionStorage.getItem('verificationTimeLeft');
    return saved ? parseInt(saved) : 30;
  });
  const [resendCooldown, setResendCooldown] = useState(() => {
    const saved = sessionStorage.getItem('resendCooldown');
    return saved ? parseInt(saved) : 0;
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.querySelector('.navbar')?.classList.add('hidden');
    return () => document.querySelector('.navbar')?.classList.remove('hidden');
  }, []);


  useEffect(() => {
    const block = (e) => {
      if (!isVerified && !showTimeoutModal) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    const handlePop = (e) => {
      if (!isVerified && !showTimeoutModal) {
        e.preventDefault();
        window.history.pushState(null, '', location.pathname);
      }
    };

    window.history.pushState(null, '', location.pathname);
    window.addEventListener('beforeunload', block);
    window.addEventListener('popstate', handlePop);

    return () => {
      window.removeEventListener('beforeunload', block);
      window.removeEventListener('popstate', handlePop);
    };
  }, [isVerified, showTimeoutModal, location.pathname]);

  // Timer countdown
  useEffect(() => {
    if (!isVerified && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          sessionStorage.setItem('verificationTimeLeft', newTime.toString());
          return newTime;
        });
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !isVerified) {
      setShowTimeoutModal(true);
    }
  }, [timeLeft, isVerified]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          const newCooldown = prev - 1;
          sessionStorage.setItem('resendCooldown', newCooldown.toString());
          return newCooldown;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [resendCooldown]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const checkVerification = async () => {
          try {
            await user.reload();
            if (user.emailVerified) {
              setIsVerified(true);
              setError('');
              sessionStorage.removeItem('verificationTimeLeft');
              sessionStorage.removeItem('resendCooldown');

              setTimeout(() => {
                window.location.replace('/dashboard');
              }, 1000);
            }
            setLoading(false);
          } catch (err) {
            console.error(err);
            setError('Error checking verification status. Please try again.');
            setLoading(false);
          }
        };

        checkVerification();
        const interval = setInterval(checkVerification, 5000);

        return () => clearInterval(interval);
      } else if (!showTimeoutModal) {
        navigate('/signup', {
          state: { message: 'Please sign up to continue.', preventRedirect: true },
          replace: true,
        });
      }
    });

    return () => unsubscribe();
  }, [navigate, showTimeoutModal]);

  const handleSendVerificationEmail = async () => {
    const user = auth.currentUser;
    if (user && resendCooldown === 0) {
      try {
        await sendEmailVerification(user);
        setEmailSent(true);
        setResendCooldown(60);
        sessionStorage.setItem('resendCooldown', '60');
      } catch (err) {
        if (err.code === 'auth/user-token-expired') {
          await signOut(auth);
          navigate('/signup', {
            state: { message: 'Your session has expired. Please try again.', preventRedirect: true },
            replace: true,
          });
        } else {
          setError(err.message);
        }
      }
    }
  };

  const handleTimeout = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        await signOut(auth);
        await deleteUser(user);
        sessionStorage.clear();
        navigate('/signup', {
          state: { message: 'Verification time expired. Please try again.', preventRedirect: true },
          replace: true,
        });
      } catch (err) {
        console.error('Error during timeout:', err);
        await signOut(auth);
        navigate('/signup', {
          state: { message: 'Verification time expired. Please try again.', preventRedirect: true },
          replace: true,
        });
      }
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="auth-container">
        <div className="auth-box">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        {isVerified ? (
          <div className="success-message">
            <MdEmail className="verification-icon success" />
            <h2>Email Verified Successfully!</h2>
            <p>Redirecting to dashboard...</p>
          </div>
        ) : (
          <>
            <div className="auth-header">
              <MdEmail className="verification-icon" />
              <h1>Email Verification</h1>
            </div>
            <div className="verification-info">
              <p className="verification-text">SEOrdinal wants to verify your email</p>
              <p className="timer">Time remaining: {formatTime(timeLeft)}</p>
              {emailSent && <p className="success-message">Verification email sent! Check your inbox.</p>}
              {error && <p className="error-message">{error}</p>}
            </div>
            <button
              onClick={handleSendVerificationEmail}
              disabled={resendCooldown > 0 || emailSent}
              className={`auth-btn ${(resendCooldown > 0 || emailSent) ? 'disabled' : ''}`}
            >
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Verification Email'}
            </button>
          </>
        )}
      </div>

      {showTimeoutModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Verification Timeout</h2>
              <button onClick={handleTimeout} className="close-btn">
                <IoMdClose />
              </button>
            </div>
            <div className="modal-content">
              <p>Your email verification time has expired. Please try again.</p>
              <button onClick={handleTimeout} className="auth-btn">
                Go to Sign Up
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailVerification;
