import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import Speak from "speak-tts";

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png"
});

// Night Map Style
const nightMap =
  "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png";

// ⭐ MAIN FIX — NAVIGATION COMPONENT ⭐
function RoutingMachine({ currentPos, destination, setStats }) {
  const map = useMap();
  const routingRef = useRef(null);

  useEffect(() => {
    if (!currentPos || !destination) return;

    // Remove old route
    if (routingRef.current) {
      map.removeControl(routingRef.current);
    }

    const router = L.Routing.control({
      waypoints: [
        L.latLng(currentPos.lat, currentPos.lng),
        L.latLng(destination.lat, destination.lng),
      ],
      lineOptions: { styles: [{ color: "blue", weight: 4 }] },
      show: false,
      addWaypoints: false,
      draggableWaypoints: false,
      routeWhileDragging: false,
    })
      .on("routesfound", function (e) {
        const route = e.routes[0];

        // Calculate distance (km) & time (min)
        const distanceKm = (route.summary.totalDistance / 1000).toFixed(2);
        const timeMin = (route.summary.totalTime / 60).toFixed(0);

        setStats({
          distance: distanceKm,
          time: timeMin,
        });
      })
      .addTo(map);

    routingRef.current = router;

    return () => map.removeControl(router);
  }, [currentPos, destination, map]);

  return null;
}

export default function GoogleMapClone() {
  const [currentPos, setCurrentPos] = useState(null);
  const [destination, setDestination] = useState(null);
  const [destSearch, setDestSearch] = useState("");
  const [stats, setStats] = useState({ distance: null, time: null });
  const watchIdRef = useRef(null);

  const speech = new Speak();
  speech.init();

  // ⭐ VERY IMPORTANT: EXACT LIVE LOCATION ⭐
  useEffect(() => {
    if (!navigator.geolocation) {
      alert("GPS not supported");
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setCurrentPos({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => console.log(err),
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 5000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchIdRef.current);
  }, []);

  // ⭐ Destination search — very accurate
  const searchDestination = async () => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${destSearch}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.length > 0) {
      const dest = {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
      setDestination(dest);

      speech.speak({
        text: `Navigating to ${destSearch}`,
      });
    }
  };

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      {/* Search Input */}
      <div
        style={{
          zIndex: 1000,
          position: "absolute",
          top: 20,
          left: "50%",
          transform: "translateX(-50%)",
          width: "80%",
        }}
      >
        <input
          value={destSearch}
          onChange={(e) => setDestSearch(e.target.value)}
          placeholder="Search destination..."
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 10,
            border: "1px solid white",
            background: "#000",
            color: "#fff",
          }}
        />
        <button
          onClick={searchDestination}
          style={{
            width: "100%",
            padding: 10,
            marginTop: 8,
            borderRadius: 10,
            background: "#1e90ff",
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          Navigate
        </button>
      </div>

      {/* Live stats */}
      {stats.distance && (
        <div
          style={{
            position: "absolute",
            top: 120,
            left: 20,
            padding: 12,
            background: "rgba(0,0,0,0.6)",
            color: "white",
            borderRadius: 10,
            zIndex: 1000,
          }}
        >
          <div>Distance: {stats.distance} km</div>
          <div>Time: {stats.time} min</div>
        </div>
      )}

      {/* Map */}
      {currentPos && (
        <MapContainer
          center={currentPos}
          zoom={16}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url={nightMap} />

          <Marker position={currentPos}>
            <Popup>You are here</Popup>
          </Marker>

          {destination && (
            <Marker position={destination}>
              <Popup>Destination</Popup>
            </Marker>
          )}

          {destination && (
            <RoutingMachine
              currentPos={currentPos}
              destination={destination}
              setStats={setStats}
            />
          )}
        </MapContainer>
      )}
    </div>
  );
}
