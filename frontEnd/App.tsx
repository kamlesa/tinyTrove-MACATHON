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
import { authApi } from "./lib/authApi"; // Adjust if your path is different  

// --- SCREENS ---
import { LoginScreen } from './pages/Login';
import { ProfileScreen } from './pages/Profile';
import { HomeScreen } from './pages/Home';
import Map from './pages/Map'
import Post  from './pages/Post';
import CreateCommunity from './pages/CommunityUpload';
import { Search } from './pages/Search';
import StoreMap from './pages/StoreMap';
import CommunityDetail from './pages/CommunityDetail';
import TreasureDetail from './pages/TreasureDetail';
import PostDetail from './pages/PostDetail';
import CreateTag from './pages/TagCreation';

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
  const [userCommunities, setUserCommunities] = useState([]);

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

  const fetchUserCommunities = async () => {
  // 1. Guard Clause: Don't try to fetch if we don't have a user
  console.log("Fetching user communities for userId:", userId);
  if (!userId) return;

  try {
    // 2. Call your API helper 
    // This hits your GET /user/:userId/communities route
    const data = await authApi.userCommunities(userId);
    console.log("Fetched user communities:", data);
    // 3. Update the global state
    // This triggers a re-render, updating buttons from 'Join' to 'Leave'
    setUserCommunities(data);

    console.log("Successfully synced membership data.");
  } catch (err) {
    // 4. Handle errors silently or via alert
    console.error("Failed to sync communities:", err);
    // You might want to clear the list if the fetch fails
    setUserCommunities([]); 
  }
};

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
      case 'profile': 
      return (
        <ProfileScreen 
          userId={userId} 
          onLogout={handleLogout} 
          // ADD THESE TWO LINES:
          onCommunitySelect={(community) => handleCommunitySelect(community, 'profile')} 
          onPostSelect={(post) => handlePostSelect(post, 'profile')}
          onCreateCommunity={() => {
            setPreviousPage('profile'); 
            setActivePage('createCommunity');
          }}
        />
      );
      case "createCommunity":
      return (
        <CreateCommunity 
          userId={userId} 
          onGoBack={() => setActivePage('profile')} 
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
        
        console.log("Passing member status to CommunityDetail:", currentCommunity);
        console.log("User communities for membership check:", userCommunities);
        console.log("Current community ID:", userId);
        return (
          <CommunityDetail
            community={currentCommunity}
            userId={userId} // Pass the ID down
            onBack={() => setActivePage(previousPage)}
            onTreasureSelect={(treasure) => handleTreasureSelect(treasure, "community")}
            onPostSelect={(post) => handlePostSelect(post, "community")}
          />
            onCreateTag={() => {
              setPreviousPage('communityDetail'); 
              setActivePage('createTag');        
            }}
            // Pass your fetch function so the detail page can trigger a refresh!
            checkStatus={() => fetchUserCommunities()} 
          />
        );
      case "treasureDetail":
        return (
          <TreasureDetail
            treasure={currentTreasure}
            onBack={() => setActivePage(previousPage)}
          />
        );
      case "createTag":
      return (
        <CreateTag 
          userId={userId} 
          // When they finish or hit cancel, they go back to the Community page
          onGoBack={() => setActivePage(previousPage)} 
        />
      );

      case "treasureDetail":
        return (
          <TreasureDetail
            treasure={currentTreasure}
            onBack={() => setActivePage(previousPage)}
            onPostSelect={(post) => { setCurrentPost(post); setActivePage("postDetail"); }}
          />
        );
      case "createTag":
      return (
        <CreateTag 
          userId={userId} 
          // When they finish or hit cancel, they go back to the Community page
          onGoBack={() => setActivePage(previousPage)} 
        />
      );

      case "treasureDetail":
        return (
          <TreasureDetail
            treasure={currentTreasure}
            onBack={() => setActivePage(previousPage)}
            onPostSelect={(post) => { setCurrentPost(post); setActivePage("postDetail"); }}
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
