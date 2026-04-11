import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

const defaultLocations = [
  {
    id: "1",
    title: "Creative Hub",
    description: "A bright shop with artisanal goods and community classes.",
    lat: 37.7765,
    lng: -122.4172,
  },
  {
    id: "2",
    title: "Market Corner",
    description: "Local vendors, fresh food, and a great coffee stop.",
    lat: 37.7719,
    lng: -122.4234,
  },
  {
    id: "3",
    title: "Bike Studio",
    description: "Small workshop offering rides and repairs in a relaxed space.",
    lat: 37.7694,
    lng: -122.4100,
  },
];

const mapStyle = [
  {
    elementType: "geometry",
    stylers: [{ color: "#f3e9da" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#5d4a3a" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#f3e9da" }],
  },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [{ color: "#d3b8a5" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#5d4a3a" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#e9dac4" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#d6bfa4" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#d7d0c5" }],
  },
];

export default function CustomMap({ locations = defaultLocations }) {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const initialRegion = useMemo(
    () => ({
      latitude: 37.7749,
      longitude: -122.4194,
      latitudeDelta: 0.05,
      longitudeDelta: 0.04,
    }),
    [],
  );

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        customMapStyle={mapStyle}
        initialRegion={initialRegion}
        onPress={() => setSelectedLocation(null)}
      >
        {locations.map((location) => (
          <Marker
            key={location.id}
            coordinate={{ latitude: location.lat, longitude: location.lng }}
            title={location.title}
            description={location.description}
            pinColor="#8B6F47"
            onPress={() => setSelectedLocation(location)}
          />
        ))}
      </MapView>

      <View style={styles.panel}>
        <Text style={styles.panelHeader}>Featured locations</Text>
        <View style={styles.chipRow}>
          {locations.map((location) => (
            <TouchableOpacity
              key={location.id}
              style={[
                styles.chip,
                selectedLocation?.id === location.id && styles.chipActive,
              ]}
              onPress={() => setSelectedLocation(location)}
            >
              <Text
                style={
                  selectedLocation?.id === location.id
                    ? styles.chipTextActive
                    : styles.chipText
                }
              >
                {location.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedLocation ? (
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>{selectedLocation.title}</Text>
            <Text style={styles.infoDescription}>{selectedLocation.description}</Text>
            <Text style={styles.infoCoords}>
              {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
            </Text>
          </View>
        ) : (
          <Text style={styles.infoHint}>Tap a marker or a location chip to see details.</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F0",
  },
  map: {
    flex: 1,
  },
  panel: {
    backgroundColor: "rgba(255, 248, 240, 0.96)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    borderColor: "#d8c1a4",
    borderTopWidth: 1,
  },
  panelHeader: {
    fontSize: 16,
    fontWeight: "700",
    color: "#3d2b1f",
    marginBottom: 10,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  chip: {
    backgroundColor: "#f3e0ca",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#e6d0b4",
    marginRight: 10,
    marginBottom: 10,
  },
  chipActive: {
    backgroundColor: "#8B6F47",
  },
  chipText: {
    color: "#5d4a3a",
    fontWeight: "600",
  },
  chipTextActive: {
    color: "#FFF8F0",
    fontWeight: "700",
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2e1d14",
    marginBottom: 6,
  },
  infoDescription: {
    fontSize: 14,
    color: "#5b4735",
    marginBottom: 8,
  },
  infoCoords: {
    fontSize: 12,
    color: "#8b6f47",
  },
  infoHint: {
    color: "#6f5a48",
    fontSize: 14,
  },
});