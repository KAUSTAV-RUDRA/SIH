import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Page.css'

function PageC() {
  useEffect(() => {
    // Load A-Frame script dynamically
    const script = document.createElement('script')
    script.src = 'https://aframe.io/releases/1.5.0/aframe.min.js'
    script.async = true
    document.head.appendChild(script)

    // Load Tailwind CSS
    const tailwindScript = document.createElement('script')
    tailwindScript.src = 'https://cdn.tailwindcss.com'
    tailwindScript.async = true
    document.head.appendChild(tailwindScript)

    return () => {
      // Cleanup scripts when component unmounts
      document.head.removeChild(script)
      document.head.removeChild(tailwindScript)
    }
  }, [])

  return (
    <div className="page-container" style={{ margin: 0, padding: 0, overflow: 'hidden', height: '100vh' }}>
      <div className="container" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        pointerEvents: 'none'
      }}>
        <div className="info-card" style={{
          pointerEvents: 'auto',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
          maxWidth: '90%',
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2d3748', marginBottom: '1rem' }}>
            Jharkhand Waterfall Virtual Tour
          </h1>
          <p style={{ color: '#4a5568', marginBottom: '1rem' }}>
            Experience the beauty of Jharkhand's waterfalls in immersive VR/AR
          </p>
          <Link to="/" style={{
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '9999px',
            fontWeight: 'bold',
            textDecoration: 'none',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.2s',
            display: 'inline-block'
          }}>
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* A-Frame Scene */}
      <a-scene style={{ width: '100%', height: '100%' }}>
        {/* Camera with controls for user interaction */}
        <a-entity 
          camera 
          look-controls="mouseEnabled: true; touchEnabled: true;" 
          wasd-controls 
          position="0 1.6 0"
        />

        {/* A-Frame Assets */}
        <a-assets>
          {/* 360-degree image for the waterfall */}
          <img 
            id="waterfall-img" 
            src="https://i.imgur.com/k2HhV2Z.jpeg" 
            crossOrigin="anonymous"
          />
        </a-assets>
        
        {/* The static skybox to show the 360 image */}
        <a-sky 
          id="main-sky" 
          src="https://th.bing.com/th/id/R.c38426623420f286041f28ea5250ba12?rik=5ZoODOXT94S1vQ&riu=http%3a%2f%2fthewowstyle.com%2fwp-content%2fuploads%2f2015%2f01%2fWaterfall-in-Mount-Rainier-National-Park-by-Michael-Matti.jpg&ehk=8Uu%2fcvh8YsnEoh2h0r3%2beosYzQspRjmconf8fuFMsco%3d&risl=&pid=ImgRaw&r=0" 
          rotation="0 -90 0"
        />
      </a-scene>
    </div>
  )
}

export default PageC
