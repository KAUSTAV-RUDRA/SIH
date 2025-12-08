import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // IMPORTANT: required to show the map

const MapWrapper = ({ children, center, zoom, whenCreated }) => {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: "100%", width: "100%" }}
      whenCreated={whenCreated}
    >
      {/* Default map tiles */}
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* For additional markers, controls, functions */}
      {children}
    </MapContainer>
  );
};

export default MapWrapper;
