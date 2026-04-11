import { useState } from "react";
import { Text, View, Pressable, StatusBar } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import ImageUploader from './components/ImageUpload';
import CustomMap from './components/Map';

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
          <CustomMap />
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
