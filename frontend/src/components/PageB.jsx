import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet'
import L from 'leaflet'
import '../utils/leafletFix'
import axios from 'axios'
import './Page.css'
import generatedImage from '../static/generated-image.png'
import ErrorBoundary from './ErrorBoundary'

// Leaflet icon configuration is now handled in leafletFix.js

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

// Move the control buttons outside of the ErrorBoundary and create a separate controls component
const MapControls = ({ onClear, onUnmount, onMount, onRefresh }) => {
  // Wrap button clicks in try-catch to prevent errors
  const handleClick = (handler) => {
    return (e) => {
      e.preventDefault();
      try {
        handler();
      } catch (err) {
        console.error('Error in button handler:', err);
      }
    };
  };

  return (
    <div className="map-controls" style={{ 
      marginBottom: '20px',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: 'white',
      padding: '10px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '10px'
      }}>
        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button 
            onClick={handleClick(onClear)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Clear Map
          </button>
          <button 
            onClick={handleClick(onRefresh)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Refresh Map
          </button>
        </div>
        
        {/* Mount/Unmount buttons */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button 
            onClick={handleClick(onUnmount)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#95a5a6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Unmount
          </button>
          <button 
            onClick={handleClick(onMount)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#2ecc71',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Mount
          </button>
        </div>
      </div>
    </div>
  );
};

// Add these helper functions at the top of the file, after imports
const cleanupLeaflet = () => {
  // Remove map containers
  const containers = document.querySelectorAll('.leaflet-container');
  containers.forEach(el => el.parentElement?.removeChild(el));

  // Remove control containers
  const controls = document.querySelectorAll('.leaflet-control-container');
  controls.forEach(el => el.parentElement?.removeChild(el));

  // Remove Leaflet styles
  const styles = document.querySelectorAll('style[data-leaflet]');
  styles.forEach(style => style.remove());

  // Remove body classes
  document.body.classList.forEach(cls => {
    if (cls.startsWith('leaflet-')) {
      document.body.classList.remove(cls);
    }
  });
};

function PageB() {
  const [geoData, setGeoData] = useState(null)
  const [touristPlaces, setTouristPlaces] = useState([])
  const [error, setError] = useState('')
  const [isMapReady, setIsMapReady] = useState(false)
  const [showMap, setShowMap] = useState(true)
  const [mapKey, setMapKey] = useState(Date.now())
  const mapRef = useRef(null)

  // Generate unique container ID
  const mapContainerId = `map-container-${mapKey}`

  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    // Cleanup function for map instance
    const cleanup = () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };

    // Define visibility change handler
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        cleanup();
        setMapKey(Date.now());
      }
    };

    // Define beforeunload handler
    const handleBeforeUnload = () => {
      cleanup();
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    const fetchData = async () => {
      try {
        const [touristResponse, districtsResponse] = await Promise.all([
          axios.get('/api/tourist-places'),
          axios.get('/api/districts')
        ]);

        if (isMounted) {
          console.log('Tourist places loaded:', touristResponse.data);
          setTouristPlaces(touristResponse.data);

          console.log('Districts loaded:', districtsResponse.data);
          const geoJsonData = {
            type: "FeatureCollection",
            features: districtsResponse.data.map(district => district.geojson_data)
          };
          setGeoData(geoJsonData);
          setIsMapReady(true);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching data', err);
          // Provide a small fallback dataset so the map can render during development
          const samplePlaces = [
            { id: 1, name: 'Sample Temple', latitude: 23.6102, longitude: 85.2799, category: 'Religious', district: 'Sample' },
            { id: 2, name: 'Sample Lake', latitude: 23.7, longitude: 85.3, category: 'Nature', district: 'Sample' }
          ];
          const sampleGeo = {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                properties: { name: 'Sample District' },
                geometry: {
                  type: 'Polygon',
                  coordinates: [[[85.25,23.55],[85.35,23.55],[85.35,23.65],[85.25,23.65],[85.25,23.55]]]
                }
              }
            ]
          };
          setTouristPlaces(samplePlaces);
          setGeoData(sampleGeo);
          setIsMapReady(true);
          setError('Could not load remote data — using sample data');
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      cleanup();
      setIsMapReady(false);
      setGeoData(null);
      setTouristPlaces([]);
      
      // Remove event listeners
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [location.key]); // Re-run effect when location changes

  const handleMapCreated = useCallback((map) => {
    console.log('Map created successfully');
    if (mapRef.current) {
      mapRef.current.remove();
    }
    mapRef.current = map;
  }, [])

  const handleClear = useCallback(() => {
    console.log('Clearing map container...');
    cleanupLeaflet();
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }
    setIsMapReady(false);
    setGeoData(null);
    setTouristPlaces([]);
    setMapKey(Date.now());
    setError('');
  }, []);

  const handleUnmount = useCallback(() => {
    console.log('Unmounting map...');
    cleanupLeaflet();
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }
    setShowMap(false);
    setError('');
    setMapKey(Date.now());
  }, []);

  const handleMount = useCallback(() => {
    console.log('Mounting map...');
    setShowMap(true);
    setIsMapReady(true);
    setMapKey(Date.now());
  }, []);

  const handleRefreshMap = useCallback(() => {
    console.log('Refreshing map...');
    cleanupLeaflet();
    setMapKey(Date.now());
    setError('');
    setIsMapReady(false);
    setGeoData(null);
    setTouristPlaces([]);
    
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }
    
    // Delay before re-initializing
    setTimeout(() => {
      setIsMapReady(true);
    }, 300);
  }, [])

  const center = [23.6102, 85.2799]

  return (
    <div className="page-container">
      <div className="page-content">
        <h1 className="page-title" style={{ margin: 0 }}>Map</h1>
        
        <MapControls 
          onClear={handleClear}
          onUnmount={handleUnmount}
          onMount={handleMount}
          onRefresh={handleRefreshMap}
        />

        <ErrorBoundary>
          <div style={{ height: 400, width: '100%', marginBottom: 16 }}>
            {showMap && isMapReady && touristPlaces.length > 0 ? (
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
                      key={`marker-${p.id || i}`} 
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

                  {geoData && <GeoJSON data={geoData} />}
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
                  <p>Loading map data...</p>
                  <p style={{ fontSize: '0.9rem', color: '#666' }}>
                    Tourist places: {touristPlaces.length} | Districts: {geoData ? 'Loaded' : 'Loading...'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </ErrorBoundary>

        <h3>Map Image</h3>
        <img src={generatedImage} alt="generated" style={{ maxWidth: '100%', marginTop: 10 }} />
        <div style={{ fontSize: '2rem', margin: '1rem 0' }}>&#92;</div>
        <Link to="/" className="back-link">← Back to Home</Link>
      </div>
    </div>
  );
}

export default PageB
