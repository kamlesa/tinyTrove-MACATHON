import { useState } from "react";
import { Text, View, Pressable, StatusBar, StyleSheet } from "react-native";

import { useUserAuthStore } from "./stores/useUserAuthStore";

import Home from "./pages/Home";
import Map from "./pages/Map";
import Profile from "./pages/Profile";
import Post from "./pages/Post";
import Search from "./pages/Search";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

type Page = "home" | "map" | "profile" | "post" | "search" | "login" | "signup";

const pages: { key: Page; label: string }[] = [
  { key: "home", label: "Home" },
  { key: "map", label: "Map" },
  { key: "profile", label: "Profile" },
  { key: "post", label: "Post" },
  { key: "search", label: "Search" },
  { key: "login", label: "Login" },
  { key: "signup", label: "Signup" },
];

export default function App() {
  const [activePage, setActivePage] = useState<Page>("login");
  const { addUser } = useUserAuthStore();

  const renderPage = () => {
    switch (activePage) {
      case "home":
        return <Home />;
      case "map":
        return <Map />;
      case "profile":
        return <Profile />;
      case "post":
        return <Post />;
      case "search":
        return <Search />;
      case "login":
        return <Login />;
      case "signup":
        return <Signup />;
      default:
        return <Text>Unknown Page</Text>;
    }
  };

  return (
    <View style={styles.container}>
      {/* <Text>MACATHON 2026</Text>
      <Text>React + Expo Go starter app</Text>

      <Pressable style={styles.button} onPress={() => addUser("data")}>
        <Text style={styles.buttonText}>Tap me</Text>
      </Pressable> */}

      <StatusBar barStyle="dark-content" />

      <View style={styles.content}>{renderPage()}</View>

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
            <Text style={styles.buttonText}>{page.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderTopWidth: 1,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  activeButton: {
    backgroundColor: "#ddd",
  },
  buttonText: {
    fontWeight: "600",
  },
});
