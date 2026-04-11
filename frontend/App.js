import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable, ActivityIndicator, SafeAreaView } from 'react-native';

// --- SUPABASE & SCREENS ---
import { supabase } from './UserAuth';
import { LoginScreen } from './LoginScreen';
import { ProfileScreen } from './ProfileScreen';
import { HomeScreen } from './HomeScreen'; // Ensure this exists

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
  const [isInitializing, setIsInitializing] = useState(true);
  
  // Navigation State
  const [activePage, setActivePage] = useState("home");

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsInitializing(false);
    });

    // Listen for Auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

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
    return <LoginScreen />;
  }

  // --- MAIN APP: If logged in, show Navigation ---
  const renderContent = () => {
    switch (activePage) {
      case 'home': return <HomeScreen />;
      case 'profile': return <ProfileScreen />;
      case 'map': return <View style={styles.content}><Text>Map Page</Text></View>;
      case 'post': return <View style={styles.content}><Text>Post Page</Text></View>;
      case 'search': return <View style={styles.content}><Text>Search Page</Text></View>;
      default: return <HomeScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      
      {/* Top Header */}
      <View style={styles.header}>
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
            <Text style={[
              styles.navButtonText,
              activePage === page.key && styles.activeButtonText
            ]}>
              {page.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingTop: 20,
    paddingBottom: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  appTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: '#FF8FAB',
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
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  navButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  activeButton: {
    backgroundColor: "#FFE5EC", // Light pink highlight
  },
  navButtonText: {
    fontWeight: "600",
    color: "#666",
    fontSize: 12,
  },
  activeButtonText: {
    color: "#FF8FAB", // Main pink
  },
});