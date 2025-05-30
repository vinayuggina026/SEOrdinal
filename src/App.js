import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Login from './components/Login';
import Signup from './components/Signup';
import ResetPassword from './components/ResetPassword';
import EmailVerification from './components/EmailVerification';
import Footer from './components/Footer';
import SideNavbar from './components/SideNavbar';
import HomeDashboard from './components/HomeDashboard';
import Optimize from './components/Optimize';
import Metadata from './components/Metadata';
import Analysis from './components/Analysis';
import Milestone from './components/Milestone';
import Settings from './components/Settings';
import Account from './components/Account';
import Notifications from './components/Notifications';
import History from './components/History';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './styles/Dashboard.css';
import './App.css';

function AppContent() {
  const [splashLoading, setSplashLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const { currentUser } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => setSplashLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth > 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (splashLoading) return <SplashScreen />;

  return (
    <div className="App">
      {currentUser ? (
        currentUser.emailVerified ? (
          <div className="app-layout">
            <SideNavbar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            <div className={`app-main ${sidebarOpen ? 'sidebar-open' : ''}`}>
              <Routes>
                <Route path="/dashboard" element={<HomeDashboard />} />
                <Route path="/optimize" element={<Optimize />} />
<Route path="/metadata" element={<Metadata />} />
                <Route path="/milestone" element={<Milestone />} />
                <Route path="/analysis" element={<Analysis />} />
                <Route path="/history" element={<History />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/account" element={<Account />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
              <Footer />
            </div>
          </div>
        ) : (
          <>
            <main className="app-main">
              <Routes>
                <Route path="/verify-email" element={<EmailVerification />} />
                <Route path="*" element={<Navigate to="/verify-email" replace />} />
              </Routes>
            </main>
            <Footer />
          </>
        )
      ) : (
        <>
          <Navbar />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify-email" element={<EmailVerification />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
