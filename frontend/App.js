import { useState } from "react";
import { Text, View, Pressable, StatusBar, TextInput } from "react-native";
import { WebView } from "react-native-webview";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import ImageUploader from './components/ImageUpload';

const pages = [
  { key: "home", label: "Home" },
  { key: "map", label: "Map" },
  { key: "post", label: "Post" },
  { key: "search", label: "Search" },
  { key: "profile", label: "Profile" },
];

const pageTitles = {
  home: "Home Page",
  map: "Map Page",
  profile: "Profile Page",
  post: "Post Page",
  search: "Search Page",
};

import { useUserAuthStore } from "./stores/useUserAuthStore";

// Color scheme: Light cream, brown, and black
const colors = {
  cream: "#FFF8F0",
  darkCream: "#FFF8F0",
  brown: "#f3e0ca",
  darkBrown: "#f0d2b0",
  black: "#1A1A1A",
  lightGray: "#D4CFBE",
};

const mapHTML = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://polyfill.io/v3/polyfill.min.js?features=default"></script>
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBhCrEsAMyzkWJMzVmMQKg5yhKidiIBleE&libraries=marker"></script>
    <style>
      html, body { height: 100%; margin: 0; padding: 0; }
      #container { display: flex; flex-direction: column; height: 100%; }
      #searchContainer { 
        padding: 12px; 
        background: #F5F1E8; 
        border-bottom: 2px solid #8B6F47;
      }
      #searchBox {
        padding: 10px 12px;
        border: 2px solid #8B6F47;
        border-radius: 8px;
        font-size: 16px;
        width: 100%;
        box-sizing: border-box;
        background: white;
      }
      #map { flex: 1; width: 100%; }
      #loading { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    </style>
  </head>
  <body>
    <div id="container">
      <div id="searchContainer">
        <input id="searchBox" type="text" placeholder="Search locations...">
      </div>
      <div id="map"></div>
    </div>
    <div id="loading" style="display: none;">Loading your location...</div>
    <script>
      let map;
      let markers = [];
      const defaultCenter = { lat: 37.7749, lng: -122.4194 };

      function clearMarkers() {
        markers.forEach(marker => marker.setMap(null));
        markers = [];
      }

      function addMarkers(locations) {
        clearMarkers();
        locations.forEach(loc => {
          const marker = new google.maps.Marker({
            position: { lat: loc.lat, lng: loc.lng },
            map: map,
            title: loc.title
          });
          markers.push(marker);
        });
      }

      function initMap(center) {
        const mapElement = document.getElementById('map');
        map = new google.maps.Map(mapElement, {
          zoom: 15,
          center: center
        });

        const allLocations = [
          { title: 'Location 1', lat: center.lat + 0.01, lng: center.lng + 0.01 },
          { title: 'Location 2', lat: center.lat - 0.01, lng: center.lng + 0.01 },
          { title: 'Location 3', lat: center.lat + 0.005, lng: center.lng - 0.015 },
          { title: 'Your Location', lat: center.lat, lng: center.lng }
        ];

        addMarkers(allLocations);

        // Search functionality
        document.getElementById('searchBox').addEventListener('input', (e) => {
          const searchTerm = e.target.value.toLowerCase();
          const filtered = allLocations.filter(loc => 
            loc.title.toLowerCase().includes(searchTerm) || searchTerm === ''
          );
          addMarkers(filtered.length > 0 ? filtered : allLocations);
        });

        document.getElementById('loading').style.display = 'none';
      }

      // Try to get user's location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            initMap(userLocation);
          },
          (error) => {
            console.error('Geolocation error:', error);
            initMap(defaultCenter);
          }
        );
      } else {
        initMap(defaultCenter);
      }
    </script>
  </body>
</html>
`;

function MainApp() {
  const [activePage, setActivePage] = useState("home");
  const { addUser } = useUserAuthStore();
  const handleImage = (uri) => {
    console.log('Selected image URI:', uri);
  };
  return (
    <SafeAreaView style={styles.container}>
       <Text style={styles.title}>MACATHON 2026</Text>
      <Text style={styles.subtitle}>React + Expo Go starter app</Text>
      <Pressable
        style={styles.button}
        onPress={() => {
          addUser("data");
        }}
      >
        <Text style={styles.buttonText}>Tap me</Text>
      </Pressable>
      <StatusBar barStyle="dark-content" backgroundColor={colors.cream} />

      {/* Top Logo Bar */}
      <View style={styles.topBar}>
        <Text style={styles.logoText}>🗺️ MACATHON</Text>
      </View>

      <View style={styles.contentContainer}>
        {activePage === "map" ? (
          <WebView
            style={styles.webview}
            source={{ html: mapHTML }}
            scalesPageToFit={true}
            startInLoadingState={true}
            geolocationEnabled={true}
            javaScriptEnabled={true}
            originWhitelist={["*"]}
            onGeolocationPermissionShowPrompt={({ onAllow, onDeny }) => {
              onAllow();
            }}
          />
        ) : (
          <View style={styles.content}>
            <Text style={styles.title}>{pageTitles[activePage]}</Text>
                  <ImageUploader onImageSelected={handleImage} />
          </View>
        )}
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.footer}>
        {pages.map((page) => (
          <Pressable
            key={page.key}
            style={[
              styles.button,
              activePage === page.key && styles.activeButton,
            ]}
            onPress={() => setActivePage(page.key)}
          >
            <Text
              style={[
                styles.buttonText,
                activePage === page.key && styles.activeButtonText,
              ]}
            >
              {page.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <MainApp />
    </SafeAreaProvider>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  topBar: {
    backgroundColor: colors.brown,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: colors.darkBrown,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.cream,
    letterSpacing: 2,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  webview: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.cream,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.black,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderTopWidth: 2,
    borderTopColor: colors.brown,
    backgroundColor: colors.darkCream,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  activeButton: {
    backgroundColor: colors.brown,
  },
  buttonText: {
    fontWeight: "600",
    fontSize: 12,
    color: colors.black,
  },
  activeButtonText: {
    color: colors.cream,
  },
};
