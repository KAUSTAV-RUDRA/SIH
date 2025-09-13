import React from 'react'
import { Link } from 'react-router-dom'
import './Page.css'

function PageA() {
  return (
    <div className="page-container">
      <div className="page-content">
        <h1 className="page-title">A</h1>
        <Link to="/" className="back-link">← Back to Home</Link>
      </div>
    </div>
  )
}

export default PageA
