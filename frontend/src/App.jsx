import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './components/Home'
import PageA from './components/PageA'
import PageB from './components/PageB'
import PageC from './components/PageC'
import FeedbackPage from './components/FeedbackPage'   // ✅ Import FeedbackPage
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navbar */}
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-logo">
              SIH project
            </Link>
            <div className="nav-menu">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/page-a" className="nav-link">Page A</Link>
              <Link to="/page-b" className="nav-link">Page B</Link>
              <Link to="/page-c" className="nav-link">Page C</Link>
              <Link to="/feedback" className="nav-link">Feedback</Link> {/* ✅ New link */}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/page-a" element={<PageA />} />
            <Route path="/page-b" element={<PageB />} />
            <Route path="/page-c" element={<PageC />} />
            <Route path="/feedback" element={<FeedbackPage />} /> {/* ✅ New route */}
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
