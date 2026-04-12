import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ActivityIndicator,
  Alert,
  FlatList,
} from "react-native";
import { authApi } from "../lib/authApi";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../lib/supabase";

export function ProfileScreen({ userId, onLogout, onCommunitySelect, onPostSelect }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [refreshKey, setRefreshKey] = useState(0);
  const [uploading, setUploading] = useState(false);

  const folderName = userId;
  const bucketName = "ProfilePictures";

  useEffect(() => {
    if (userId) {
      getProfileData();
    }
  }, [userId]);

  async function getProfileData() {
    try {
      setLoading(true);

      const [profileData, postsData, communitiesData] = await Promise.all([
        authApi.getProfile(userId),
        authApi.getPosts(userId),
        authApi.getCommunities(userId),
      ]);

      setProfile(profileData);
      setPosts(postsData || []);
      setCommunities(communitiesData || []);
    } catch (error) {
      Alert.alert("Error", error.response?.data?.error || error.message);
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    try {
      await authApi.signOut();
      Alert.alert("Success", "You have been signed out");
      onLogout();
    } catch (error) {
      Alert.alert("Error", error.response?.data?.error || error.message);
    }
  }

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "We need access to your photos to upload an image."
      );
      return false;
    }
    return true;
  };

  const pickAndUploadImage = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
    });

    if (result.canceled) return;

    const uri = result.assets[0].uri;

    try {
      setUploading(true);

      const response = await fetch(uri);
      const arrayBuffer = await response.arrayBuffer();

      const filePath = `${folderName}/${Date.now()}.jpg`;

      const { error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, arrayBuffer, {
          contentType: "image/jpeg",
        });

      if (error) throw error;

      const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;
      await updateProfilePicture(userId, publicUrl);
    } catch (err) {
      console.error("Upload error:", err);
      Alert.alert(
        "Upload failed",
        "Check your internet connection or Supabase setup."
      );
    } finally {
      setUploading(false);
    }
  };

  const updateProfilePicture = async (userId, photo_url) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ avatar_url: photo_url })
        .eq("id", userId);

      if (error) throw error;

      setRefreshKey((prev) => prev + 1);
      getProfileData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#7EA8D9" />
      </View>
    );
  }

  const postImages = posts.map((item) => ({
    id: String(item.id),
    source: item.photo_url ? { uri: item.photo_url } : null,
    onClick: () => onPostSelect?.(item),
  }));

  const communityImages = communities.map((item) => ({
    id: String(item.id),
    source: item.cover_image_url ? { uri: item.cover_image_url } : null,
    onClick: () => onCommunitySelect?.(item),
  }));

  const gridImages = activeTab === "posts" ? postImages : communityImages;

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Image
            key={refreshKey}
            source={{ uri: profile?.avatar_url || "https://via.placeholder.com/160" }}
            style={styles.avatar}
          />
          <View style={styles.profileDetails}>
            <Text style={styles.displayName}>
              {profile?.display_name || "Collector"}
            </Text>
            <Text style={styles.username}>@{profile?.username || "username"}</Text>
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{posts.length}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{communities.length}</Text>
                <Text style={styles.statLabel}>Communities</Text>
              </View>
            </View>
            <View style={styles.actionRow}>
              <Pressable style={styles.editButton} onPress={pickAndUploadImage}>
                <Text style={styles.editButtonText}>
                  {uploading ? "Uploading..." : "Update Picture"}
                </Text>
              </Pressable>
              <Pressable style={styles.signOutButton} onPress={handleSignOut}>
                <Text style={styles.signOutText}>Sign Out</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.tabRow}>
        <Pressable
          style={[styles.tabButton, activeTab === "posts" && styles.activeTabButton]}
          onPress={() => setActiveTab("posts")}
        >
          <Text style={[styles.tabText, activeTab === "posts" && styles.activeTabText]}>
            Posts
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.tabButton,
            activeTab === "communities" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("communities")}
        >
          <Text style={[styles.tabText, activeTab === "communities" && styles.activeTabText]}>
            Communities
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={gridImages}
        keyExtractor={(item) => item.id}
        numColumns={3}
        renderItem={({ item }) => (
          <Pressable style={styles.gridItem} onPress={item.onClick}>
            {item.source ? (
              <Image source={item.source} style={styles.gridImage} />
            ) : (
              <View style={styles.emptyGridImage}>
                <Text style={styles.photoPlaceholderText}>No Image</Text>
              </View>
            )}
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {activeTab === "posts" ? "No posts yet!" : "No communities yet!"}
          </Text>
        }
        contentContainerStyle={styles.gridContainer}
        style={styles.gridWrapper}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#FFD09A",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFD09A",
  },
  header: {
    padding: 20,
    backgroundColor: "#FFD09A",
    // borderBottomWidth: 1,
    // borderBottomColor: "#FFD09A",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 100,        // 👈 was 120
    height: 100,       // 👈 was 120
    borderRadius: 50, // keep it half of width/height
    borderWidth: 4,
    borderColor: "#FFF8F0",
    backgroundColor: "#FFD09A",
    marginRight: 12,  // slightly smaller gap
  },
  profileDetails: {
    flex: 1,
    // alignItems: "center",
  },
  displayName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  username: {
    fontSize: 14,
    color: "#5a2835",
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: "row",
    marginBottom: 14,
    alignItems: "center",
  },
  statBox: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#171312",
  },
  statLabel: {
    fontSize: 12,
    color: "#4C433E",
    marginTop: 2,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    paddingRight: 10,
  },
  editButton: {
    backgroundColor: "#71A5D3",
    paddingHorizontal: 16,
    height: 34,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  editButtonText: {
    color: "#fff",
    fontSize: 15,
  },
  signOutButton: {
    backgroundColor: "#D86D55",
    paddingHorizontal: 16,
    height: 34,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  signOutText: {
    color: "#fff",
    fontSize: 15,
  },
  tabRow: {
    flexDirection: "row",
    backgroundColor: "#FFD09A",
    borderBottomWidth: 1,
    borderBottomColor: "#FFD09A",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    justifyContent: "center",
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: "#4B2E2B",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4B2E2B",
  },
  activeTabText: {
    color: "#4B2E2B",
  },
  gridWrapper: {
    flex: 1,
    backgroundColor: "#FFE6C9",
  },
  gridItem: {
    flex: 1 / 3,
    aspectRatio: 1,
    padding: 1,
  },
  gridImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  gridContainer: {
    padding: 10,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#6A625B",
    fontSize: 16,
  },
  emptyGridImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    backgroundColor: "#FFD09A",
    justifyContent: "center",
    alignItems: "center",
  },
  photoPlaceholderText: {
    color: "#735635",
    fontSize: 16,
  },
});