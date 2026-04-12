import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// --- SCREENS ---
import { LoginScreen } from "./pages/Login";
import { ProfileScreen } from "./pages/Profile";
import { HomeScreen } from "./pages/Home";
import Map from "./pages/Map";
import Post from "./pages/Post";
import { Search } from "./pages/Search";
import StoreMap from "./pages/StoreMap";
import CommunityDetail from "./pages/CommunityDetail";
import TreasureDetail from "./pages/TreasureDetail";
import PostDetail from "./pages/PostDetail";

// --- COMPONENTS ---
import Button from './components/button';
// --- NAVIGATION CONFIG ---
const pages = [
  { key: "home", label: "Home" },
  { key: "map", label: "Map" },
  { key: "post", label: "Post" },
  { key: "search", label: "Search" },
  { key: "profile", label: "Profile" },
];

export default function App() {
  // Auth State
  const [session, setSession] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isInitializing, setIsInitializing] = useState(false);

  // Navigation State
  const [activePage, setActivePage] = useState("home");
  const [currentStore, setCurrentStore] = useState(null);
  const [currentCommunity, setCurrentCommunity] = useState(null);
  const [currentTreasure, setCurrentTreasure] = useState(null);
  const [currentPost, setCurrentPost] = useState(null);
  const [previousPage, setPreviousPage] = useState("search");

  useEffect(() => {
    // TODO: Check for stored auth token and set session
    // For now, user starts logged out
    setIsInitializing(false);
  }, []);

  const handleLogout = () => {
    setSession(null);
    setUserId(null);
  };

  const handleStoreSelect = (store, origin = "search") => {
    setCurrentStore(store);
    setPreviousPage(origin);
    setActivePage("storeMap");
  };

  const handleCommunitySelect = (community, origin = "search") => {
    setCurrentCommunity(community);
    setPreviousPage(origin);
    setActivePage("communityDetail");
  };

  const handleTreasureSelect = (treasure, origin = "search") => {
    setCurrentTreasure(treasure);
    setPreviousPage(origin);
    setActivePage("treasureDetail");
  };

  const handlePostSelect = (post, origin = "profile") => {
    setCurrentPost(post);
    setPreviousPage(origin);
    setActivePage("postDetail");
  };

  const handleLoginSuccess = (user) => {
    setSession(user);
    setUserId(user?.id);
  };

  const handleHeaderBack = () => {
    switch (activePage) {
      case "postDetail":
        setActivePage("profile");
        break;
      case "storeMap":
      case "communityDetail":
      case "treasureDetail":
        setActivePage("search");
        break;
      default:
        setActivePage("home");
        break;
    }
  };

  const showBackButton = ["postDetail", "storeMap", "communityDetail", "treasureDetail"].includes(activePage);


  // --- LOADING STATE ---
  if (isInitializing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF8FAB" />
      </View>
    );
  }

  // --- AUTH GATE: If no session, show Login ---
  if (!session) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  const locations = [
    //TODO: fetch locations via treasure/database
    {
      id: "1",
      address: "Level3/258 Little Bourke St, Melbourne VIC 3000",
      title: "Melridai",
    },
    { id: "2", address: "Kidstuff Malvern", title: "Kidstuff Malvern" },
    {
      id: "3",
      address: "21 Chancellors Walk, Clayton VIC 3168",
      title: "Monash Kuromi Store",
    },
  ];

  // --- MAIN APP: If logged in, show Navigation ---
  const renderContent = () => {
    switch (activePage) {
      case "home":
        return <HomeScreen onLogout={handleLogout} />;
      case "map":
        return <Map locations={locations} />;
      case "post":
        return <Post userId={userId} setActivePage={setActivePage} />;
      case "search":
        return (
          <Search
            onStoreSelect={(store) => handleStoreSelect(store, "search")}
            onCommunitySelect={(community) =>
              handleCommunitySelect(community, "search")
            }
            onTreasureSelect={(treasure) =>
              handleTreasureSelect(treasure, "search")
            }
          />
        );
      case "profile":
        return (
          <ProfileScreen
            userId={userId}
            onLogout={handleLogout}
            onCommunitySelect={(community) =>
              handleCommunitySelect(community, "profile")
            }
            onPostSelect={(post) => handlePostSelect(post, "profile")}
          />
        );
      case "storeMap":
        return (
          <StoreMap
            store={currentStore}
            onBack={() => setActivePage(previousPage)}
          />
        );
      case "communityDetail":
        return (
          <CommunityDetail
            community={currentCommunity}
            onBack={() => setActivePage(previousPage)}
          />
        );
      case "treasureDetail":
        return (
          <TreasureDetail
            treasure={currentTreasure}
            onBack={() => setActivePage(previousPage)}
          />
        );
      case "postDetail":
        return (
          <PostDetail
            post={currentPost}
            onBack={() => setActivePage(previousPage)}
          />
        );
      default:
        return <HomeScreen onLogout={handleLogout} />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />


      <View style={styles.header}>
        {showBackButton && (
          <View style={styles.backButtonWrapper}>
            <Button widthSize="icon" heightSize="icon" onClick={handleHeaderBack}>
              ←
            </Button>
          </View>
        )}

        <Text style={styles.appTitle}>tinyTrove</Text>
      </View>

      {/* Main Page Content */}
      <View style={styles.mainContent}>
        {renderContent()}
      </View>

     

      {/* Navigation Footer */}
      <View style={styles.footer}>
        {pages.map((page) => (
          <Pressable
            key={page.key}
            style={[
              styles.navButton,
              activePage === page.key && styles.activeButton,
            ]}
            onPress={() => setActivePage(page.key)}
          >
            <Text
              style={[
                styles.navButtonText,
                activePage === page.key && styles.activeButtonText,
              ]}
            >
              {page.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    backgroundColor: "#211A19",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingTop: 40,
    paddingBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#211A19",
    position: "relative",
  },

  backButtonWrapper: {
    position: "absolute",
    left: 12,
    top: 30,
    zIndex: 1,
  },

  appTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFF8F0",
  },
  mainContent: {
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
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: "#211A19",
    backgroundColor: "#211A19",
  },
  navButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  activeButton: {
    backgroundColor: "#71A5D3", // Light pink highlight
  },
  navButtonText: {
    fontWeight: "600",
    color: "#FFE6C9",
    fontSize: 12,
  },
  activeButtonText: {
    color: "#FFF8F0", // Main pink
  },
});
