import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './components/Home'
import PageA from './components/PageA'
import PageB from './components/PageB'
import PageC from './components/PageC'
import Calendar from './components/Calendar'
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
              <Link to="/page-a" className="nav-link">ChatBot</Link>
              <Link to="/page-b" className="nav-link">Maps</Link>
              <Link to="/page-c" className="nav-link">Virtual Tour</Link>
              <Link to="/calendar" className="nav-link">Calendar</Link>
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
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/feedback" element={<FeedbackPage />} /> {/* ✅ New route */}
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
