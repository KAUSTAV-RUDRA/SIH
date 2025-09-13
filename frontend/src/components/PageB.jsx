import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet'
import L from 'leaflet'
import axios from 'axios'
import './Page.css'
import generatedImage from '../static/generated-image.png'
import ErrorBoundary from './ErrorBoundary'

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Custom icons for different categories
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  })
}

const categoryIcons = {
  'Religious': createCustomIcon('#ff6b6b'),
  'Nature': createCustomIcon('#4ecdc4'),
  'Wildlife': createCustomIcon('#45b7d1'),
  'Hill Station': createCustomIcon('#96ceb4'),
  'Heritage': createCustomIcon('#feca57')
}

function PageB() {
  const [geoData, setGeoData] = useState(null)
  const [touristPlaces, setTouristPlaces] = useState([])
  const [error, setError] = useState('')
  const [isMapReady, setIsMapReady] = useState(false)
  const [mapKey, setMapKey] = useState(Date.now())
  const mapRef = useRef(null)

  // Generate unique container ID
  const mapContainerId = `map-container-${mapKey}`

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      try {
        const [touristResponse, districtsResponse] = await Promise.all([
          axios.get('/api/tourist-places'),
          axios.get('/api/districts')
        ])

        if (isMounted) {
          console.log('Tourist places loaded:', touristResponse.data)
          setTouristPlaces(touristResponse.data)

          console.log('Districts loaded:', districtsResponse.data)
          // Convert districts to proper GeoJSON format for react-leaflet
          const geoJsonData = {
            type: "FeatureCollection",
            features: districtsResponse.data.map(district => district.geojson_data)
          }
          setGeoData(geoJsonData)
          setIsMapReady(true)
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching data', err)
          setError('Could not load map data')
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [])

  const handleMapCreated = useCallback((map) => {
    console.log('Map created successfully with key:', mapKey)
  }, [mapKey])

  const handleRefreshMap = useCallback(() => {
    console.log('Refreshing map...')
    setMapKey(Date.now())
    setError('')
    setIsMapReady(false)
    
    // Small delay to ensure cleanup is complete
    setTimeout(() => {
      setIsMapReady(true)
    }, 200)
  }, [])

  const center = [23.6102, 85.2799]

  return (
    <ErrorBoundary>
      <div className="page-container">
        <div className="page-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h1 className="page-title" style={{ margin: 0 }}>Map</h1>
          <button 
            onClick={handleRefreshMap}
            style={{
              padding: '8px 16px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Refresh Map
          </button>
        </div>

        <div style={{ height: 400, width: '100%', marginBottom: 16 }}>
          {isMapReady && touristPlaces.length > 0 ? (
            <div key={mapKey} id={mapContainerId} style={{ height: '100%', width: '100%' }}>
              <MapContainer 
                center={center} 
                zoom={7} 
                style={{ height: '100%', width: '100%' }}
                whenCreated={handleMapCreated}
                preferCanvas={true}
                key={mapKey}
              >
                <TileLayer 
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {touristPlaces.map((p, i) => (
                  <Marker 
                    key={`marker-${mapKey}-${p.id || i}`} 
                    position={[p.latitude, p.longitude]}
                    icon={categoryIcons[p.category] || categoryIcons['Nature']}
                  >
                    <Popup>
                      <div>
                        <h3>{p.name}</h3>
                        <p><strong>Category:</strong> {p.category}</p>
                        <p><strong>District:</strong> {p.district}</p>
                        {p.description && <p>{p.description}</p>}
                        {p.rating && <p><strong>Rating:</strong> {p.rating}/5</p>}
                      </div>
                    </Popup>
                  </Marker>
                ))}

                {geoData && <GeoJSON key={`districts-${mapKey}`} data={geoData} />}
              </MapContainer>
            </div>
          ) : (
            <div style={{ 
              height: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: '#f0f0f0',
              borderRadius: '8px',
              border: '2px dashed #ccc'
            }}>
              <div style={{ textAlign: 'center' }}>
                <p>{isMapReady ? 'Loading map data...' : 'Preparing map...'}</p>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>
                  Tourist places: {touristPlaces.length} | Districts: {geoData ? 'Loaded' : 'Loading...'}
                </p>
                <p style={{ fontSize: '0.8rem', color: '#999' }}>
                  Map Key: {mapKey}
                </p>
              </div>
            </div>
          )}
        </div>

        {error && <div className="page-error">❌ {error}</div>}
        
        {/* Debug information */}
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
          <h4>Debug Info:</h4>
          <p>Tourist Places Loaded: {touristPlaces.length}</p>
          <p>GeoJSON Data: {geoData ? 'Loaded' : 'Not loaded'}</p>
          {touristPlaces.length > 0 && (
            <div>
              <p>Sample place: {touristPlaces[0].name} at {touristPlaces[0].latitude}, {touristPlaces[0].longitude}</p>
            </div>
          )}
        </div>

        <h3>Map Image</h3>
        <img src={generatedImage} alt="generated" style={{ maxWidth: '100%', marginTop: 10 }} />

        <div style={{ fontSize: '2rem', margin: '1rem 0' }}>&#92;</div>
        <Link to="/" className="back-link">← Back to Home</Link>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default PageB
