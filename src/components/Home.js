import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import seoImage from '../assets/images/image1.png';
import { motion } from 'framer-motion';

function Home() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    videos: 0,
    growth: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        users: prev.users < 10000 ? prev.users + 100 : prev.users,
        videos: prev.videos < 50000 ? prev.videos + 500 : prev.videos,
        growth: prev.growth < 200 ? prev.growth + 2 : prev.growth
      }));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      className="home-content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}>
      <motion.div 
        className="hero-section"
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}>
        <div className="hero-text">
          <h1>Boost Your YouTube Growth with AI-Powered Optimization!</h1>
          <p>Unlock your channel's full potential with our cutting-edge AI tools. From discovering trending topics to generating engaging scripts and optimizing metadata, we provide everything you need to maximize views, subscribers, and engagement. Stay ahead of the competition with data-driven insights and smart recommendations tailored for your content. 🚀📈</p>
          <div className="button-wrapper">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2 }}
            >
              <motion.button 
                className="explore-btn" 
                onClick={() => navigate('/login')}
                whileHover={{ y: -1 }}
                whileTap={{ y: 0 }}
                transition={{ duration: 2, ease: 'easeInOut' }}
              >
                Start Optimizing →
              </motion.button>
            </motion.div>
          </div>
        </div>
        <div className="hero-image">
          <img src={seoImage} alt="SEO Visualization" />
        </div>
      </motion.div>

      <section className="stats-section">
        <div className="stats-grid">
          <motion.div 
            className="stat-card"
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3>{stats.users.toLocaleString()}+</h3>
            <p>Active Users</p>
          </motion.div>
          <motion.div 
            className="stat-card"
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3>{stats.videos.toLocaleString()}+</h3>
            <p>Videos Optimized</p>
          </motion.div>
          <motion.div 
            className="stat-card"
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3>{stats.growth}%</h3>
            <p>Average Growth</p>
          </motion.div>
        </div>
      </section>

      <section className="features-section">
        <h2>🚀 How It Works?</h2>
        <div className="features-grid">
          {[
            { title: "Topic Research", description: "Find trending and high-potential topics for your YouTube videos using AI-driven analysis.", icon: "🔍" },
            { title: "Script Generation", description: "Generate compelling and structured video scripts with our AI-powered writing assistant.", icon: "📝" },
            { title: "Thumbnail & Caption Suggestions", description: "Get AI-generated thumbnail ideas and captions to make your videos more clickable.", icon: "🎨" },
            { title: "Video Optimization", description: "Boost your video's reach with AI-powered titles, descriptions, and tags.", icon: "🚀" },
            { title: "Audience Engagement", description: "Increase watch time with AI-generated engagement strategies.", icon: "📢" },
            { title: "Upload & Publish", description: "Upload your video with optimized metadata for maximum reach.", icon: "📤" }
          ].map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="benefits-section">
        <h2>🔥 Why Choose Us?</h2>
        <div className="features-grid">
          {[
            { title: "More Views", description: "Rank higher in search results and suggested feeds.", icon: "👀" },
            { title: "Smart Notifications", description: "Get instant alerts about video performance and optimization opportunities.", icon: "🔔" },
            { title: "More Subscribers", description: "Convert viewers into loyal subscribers.", icon: "🎉" },
            { title: "Save Time", description: "Automate content creation and optimization.", icon: "⏰" }
          ].map((benefit, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{benefit.icon}</div>
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="testimonials-section">
        <h2>💬 What Creators Say</h2>
        <div className="testimonials-grid">
          {[
            {
              name: "Sarah Johnson",
              role: "Tech Reviewer",
              text: "SEOrdinal helped me grow my tech review channel from 1K to 100K subscribers in just 6 months!",
              avatar: "👩‍💻"
            },
            {
              name: "Mike Chen",
              role: "Gaming Creator",
              text: "The AI-powered title and thumbnail suggestions have dramatically improved my click-through rates.",
              avatar: "🎮"
            },
            {
              name: "Emma Davis",
              role: "Lifestyle Vlogger",
              text: "The trend analysis feature helps me stay ahead of the curve and create content that resonates.",
              avatar: "📱"
            }
          ].map((testimonial, index) => (
            <motion.div 
              key={index} 
              className="testimonial-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="testimonial-avatar">{testimonial.avatar}</div>
              <p className="testimonial-text">"{testimonial.text}"</p>
              <h4>{testimonial.name}</h4>
              <p className="testimonial-role">{testimonial.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Transform Your YouTube Channel?</h2>
        <p>Join thousands of content creators who are already using our AI tools.</p>
        <div className="button-wrapper">
          <motion.button 
            className="explore-btn" 
            onClick={() => navigate('/login')}
            whileHover={{ y: -1 }}
            whileTap={{ y: 0 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          >
            Get Started Now →
          </motion.button>
        </div>
      </section>




    </motion.div>
  );
}

export default Home;
