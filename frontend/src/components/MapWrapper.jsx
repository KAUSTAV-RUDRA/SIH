import React from 'react';
import { MapContainer } from 'react-leaflet';

const MapWrapper = ({ children, center, zoom, whenCreated }) => {
  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      style={{ height: '100%', width: '100%' }}
      whenCreated={whenCreated}
      key={Date.now()}
    >
      {children}
    </MapContainer>
  );
};

export default MapWrapper;
