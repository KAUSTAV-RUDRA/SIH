import React from 'react'
import { Link } from 'react-router-dom'
import './Home.css'

function Home() {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">Welcome to Jharkhandh</h1>
        <p className="home-description">
          
        </p>
        
        <div className="navigation-cards">
          <Link to="/page-a" className="nav-card">
            <div className="card-content">
              <h2>Page A</h2>
              <p>Click to navigate to Page A</p>
            </div>
          </Link>
          
          <Link to="/page-b" className="nav-card">
            <div className="card-content">
              <h2>Page B</h2>
              <p>Click to navigate to Page B</p>
            </div>
          </Link>
          
          <Link to="/page-c" className="nav-card">
            <div className="card-content">
              <h2>Page C</h2>
              <p>Click to navigate to Page C</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home
