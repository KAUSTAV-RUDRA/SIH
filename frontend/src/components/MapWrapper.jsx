import React, { useEffect, useState } from 'react';
import { MapContainer } from 'react-leaflet';

const MapWrapper = ({ children, center, zoom, whenCreated }) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Clean up any existing map instances and related elements
    const cleanup = () => {
      const elements = document.querySelectorAll('.leaflet-container, .leaflet-control-container');
      elements.forEach(el => {
        if (el && el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });

      // Remove any leftover style elements created by Leaflet
      const styles = document.querySelectorAll('style[data-leaflet]');
      styles.forEach(style => style.remove());

      // Clear any Leaflet-related classes from the body
      document.body.classList.remove(...Array.from(document.body.classList).filter(c => c.startsWith('leaflet-')));
    };

    // Initial cleanup
    cleanup();

    // Small delay before setting ready to ensure DOM is clear
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    // Cleanup on unmount
    return () => {
      clearTimeout(timer);
      cleanup();
      setIsReady(false);
    };
  }, []);

  if (!isReady) {
    return <div style={{ height: '100%', width: '100%', background: '#f0f0f0' }} />;
  }

  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      style={{ height: '100%', width: '100%' }}
      whenCreated={whenCreated}
      preferCanvas={true}
      key={Date.now()} // Ensure new instance on reload
    >
      {children}
    </MapContainer>
  );
};

export default MapWrapper;