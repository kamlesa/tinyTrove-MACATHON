import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

interface MapLocation {
  lat: number;
  lng: number;
  title: string;
  description: string;
}

export default function Map() {
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(
    null,
  );

  // Default map center (San Francisco)
  const mapCenter = {
    lat: 37.7749,
    lng: -122.4194,
  };

  // Sample locations
  const locations: MapLocation[] = [
    {
      lat: 37.7849,
      lng: -122.4094,
      title: "Location 1",
      description: "First marker location",
    },
    {
      lat: 37.7649,
      lng: -122.4294,
      title: "Location 2",
      description: "Second marker location",
    },
    {
      lat: 37.7749,
      lng: -122.3994,
      title: "Location 3",
      description: "Third marker location",
    },
  ];

  const mapContainerStyle = {
    width: "100%",
    height: "calc(100vh - 120px)",
  };

  const mapOptions = {
    zoom: 12,
    center: mapCenter,
  };

  const page = {
    position: "relative" as const,
    height: "100vh",
  };

  const center = {
    paddingTop: 40,
    textAlign: "center" as const,
  };

  const title = {
    fontSize: 30,
  };

  const buttonRow = {
    position: "absolute" as const,
    bottom: 0,
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    padding: "16px 10px",
    backgroundColor: "white",
    boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
    zIndex: 10,
  };

  const bottomButton = {
    padding: "12px 16px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer" as const,
    backgroundColor: "#4F8CFF",
    color: "white",
    fontWeight: "bold" as const,
    textDecoration: "none",
  };

  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "";

  return (
    <div style={page}>
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          zoom={mapOptions.zoom}
          options={{
            disableDefaultUI: false,
          }}
        >
          {locations.map((location, index) => (
            <Marker
              key={index}
              position={{ lat: location.lat, lng: location.lng }}
              onClick={() => setSelectedLocation(location)}
            />
          ))}

          {selectedLocation && (
            <InfoWindow
              position={{
                lat: selectedLocation.lat,
                lng: selectedLocation.lng,
              }}
              onCloseClick={() => setSelectedLocation(null)}
            >
              <div>
                <h3>{selectedLocation.title}</h3>
                <p>{selectedLocation.description}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>

      <div style={buttonRow}>
        <Link to="/home" style={{ textDecoration: "none" }}>
          <button style={bottomButton}>Home</button>
        </Link>
        <Link to="/map" style={{ textDecoration: "none" }}>
          <button style={bottomButton}>Map</button>
        </Link>
        <Link to="/search" style={{ textDecoration: "none" }}>
          <button style={bottomButton}>Search</button>
        </Link>
        <Link to="/post" style={{ textDecoration: "none" }}>
          <button style={bottomButton}>Post</button>
        </Link>
        <Link to="/profile" style={{ textDecoration: "none" }}>
          <button style={bottomButton}>Profile</button>
        </Link>
      </div>
    </div>
  );
}
