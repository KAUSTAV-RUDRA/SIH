import React from 'react'
import { Link } from 'react-router-dom'
import './Home.css'

function Home() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to <span className="gradient-text">Jharkhand</span>
          </h1>
          <p className="hero-subtitle">
            Discover the natural beauty and cultural heritage of India's mineral-rich state
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">24</div>
              <div className="stat-label">Districts</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">40%</div>
              <div className="stat-label">Forest Cover</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">32</div>
              <div className="stat-label">Tribes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <h2 className="section-title">Explore Jharkhand</h2>
        <p className="section-subtitle">Choose your adventure and discover the wonders of this beautiful state</p>
        
        <div className="navigation-cards">
          <Link to="/page-a" className="nav-card card-a">
            <div className="card-icon">📊</div>
            <div className="card-content">
              <h3>Analytics & Data</h3>
              <p>Explore comprehensive data and analytics about Jharkhand's demographics, economy, and development</p>
              <div className="card-features">
                <span className="feature-tag">Statistics</span>
                <span className="feature-tag">Charts</span>
                <span className="feature-tag">Reports</span>
              </div>
            </div>
            <div className="card-arrow">→</div>
          </Link>
          
          <Link to="/page-b" className="nav-card card-b">
            <div className="card-icon">🗺️</div>
            <div className="card-content">
              <h3>Interactive Maps</h3>
              <p>Navigate through interactive maps showcasing Jharkhand's geography, tourist destinations, and infrastructure</p>
              <div className="card-features">
                <span className="feature-tag">Tourism</span>
                <span className="feature-tag">Geography</span>
                <span className="feature-tag">Routes</span>
              </div>
            </div>
            <div className="card-arrow">→</div>
          </Link>
          
          <Link to="/page-c" className="nav-card card-c">
            <div className="card-icon">🥽</div>
            <div className="card-content">
              <h3>Virtual Reality Tour</h3>
              <p>Immerse yourself in a stunning VR experience of Jharkhand's waterfalls and natural landscapes</p>
              <div className="card-features">
                <span className="feature-tag">360° View</span>
                <span className="feature-tag">VR/AR</span>
                <span className="feature-tag">Immersive</span>
              </div>
            </div>
            <div className="card-arrow">→</div>
          </Link>
        </div>
      </div>

      {/* Call to Action */}
      <div className="cta-section">
        <div className="cta-content">
          <h3>Ready to Explore?</h3>
          <p>Start your journey through Jharkhand's rich culture and natural beauty</p>
          <div className="cta-buttons">
            <Link to="/page-c" className="cta-button primary">
              Start VR Tour
            </Link>
            <Link to="/page-a" className="cta-button secondary">
              View Analytics
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
