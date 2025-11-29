import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Page.css";

const waterfalls = [
  {
    id: 1,
    name: "Waterfall 1",
    thumbnail: "https://images.pexels.com/photos/2406395/pexels-photo-2406395.jpeg?cs=srgb&dl=pexels-avery-nielsenwebb-2406395.jpg&fm=jpg",
    vrImage: "https://images.pexels.com/photos/2406395/pexels-photo-2406395.jpeg?cs=srgb&dl=pexels-avery-nielsenwebb-2406395.jpg&fm=jpg",
  },
  {
    id: 2,
    name: "Waterfall 2",
    thumbnail: "https://i.imgur.com/3fJ1P9y.jpeg",
    vrImage: "https://i.imgur.com/3fJ1P9y.jpeg",
  },
  {
    id: 3,
    name: "Waterfall 3",
    thumbnail: "https://i.imgur.com/x5RnQ6v.jpeg",
    vrImage: "https://i.imgur.com/x5RnQ6v.jpeg",
  },
];

function PageC() {
  const [selectedVR, setSelectedVR] = useState(null);

  // Load A-Frame script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://aframe.io/releases/1.5.0/aframe.min.js";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Function to render cards
  const renderCards = () => (
    <div className="cards-container">
      {waterfalls.map((wf) => (
        <div key={wf.id} className="card" onClick={() => setSelectedVR(wf.vrImage)}>
          <img src={wf.thumbnail} alt={wf.name} className="card-img" />
          <h3 className="card-title">{wf.name}</h3>
          <button className="vr-btn">View VR</button>
        </div>
      ))}
    </div>
  );

  // Function to render VR scene
  const renderVR = () => (
    <div className="vr-container" style={{ width: "100%", height: "100vh", position: "relative" }}>
      <div className="info-card" style={{
        position: "absolute",
        bottom: "2rem",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "rgba(255,255,255,0.9)",
        padding: "1.5rem",
        borderRadius: "12px",
        zIndex: 10,
        textAlign: "center",
      }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}>VR Waterfall Tour</h1>
        <p style={{ marginBottom: "1rem" }}>Experience the beauty in immersive VR</p>
        <button onClick={() => setSelectedVR(null)} style={{
          backgroundColor: "#2563eb",
          color: "#fff",
          padding: "0.5rem 1rem",
          borderRadius: "9999px",
          fontWeight: "bold",
          cursor: "pointer"
        }}>
          ← Back to Cards
        </button>
      </div>

      <a-scene style={{ width: "100%", height: "100%" }}>
        <a-entity camera look-controls="mouseEnabled: true; touchEnabled: true;" wasd-controls position="0 1.6 0" />
        <a-assets>
          <img id="vr-img" src={selectedVR} crossOrigin="anonymous" />
        </a-assets>
        <a-sky src="#vr-img" rotation="0 -90 0" />
      </a-scene>
    </div>
  );

  return (
    <div className="page-container" style={{ margin: 0, padding: 0 }}>
      {selectedVR ? renderVR() : renderCards()}
    </div>
  );
}

export default PageC;
