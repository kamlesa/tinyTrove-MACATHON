// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator, Pressable, Alert } from 'react-native';
// import { authApi } from '../lib/authApi';
// import ImageUploader from '../components/ImageUpload';
// import * as ImagePicker from 'expo-image-picker';
// import { supabase } from '../lib/supabase'

// export function ProfileScreen({ userId, onLogout, onCommunitySelect, onPostSelect }) {
//   const [loading, setLoading] = useState(true);
//   const [profile, setProfile] = useState(null);
//   const [posts, setPosts] = useState([]);
//   const [communities, setCommunities] = useState([]);
//   const [activeTab, setActiveTab] = useState('posts'); // 'posts' or 'communities'
//   const [refreshKey, setRefreshKey] = useState(0);
//   const folderName = userId
//   const bucketName = "ProfilePictures"
//   const [uploading, setUploading] = useState(false);
  
//   useEffect(() => {
//     if (userId) {
//       getProfileData();
//     }
//   }, [userId]);

//   async function getProfileData() {
//     try {
//       setLoading(true);
      
//       // Fetch profile, posts, and communities in parallel
//       const [profileData, postsData, communitiesData] = await Promise.all([
//         authApi.getProfile(userId),
//         authApi.getPosts(userId),
//         authApi.getCommunities(userId)
//       ]);

//       setProfile(profileData);
//       setPosts(postsData || []);
//       setCommunities(communitiesData || []);
//     } catch (error) {
//       Alert.alert('Error', error.response?.data?.error || error.message);
//       console.error('Error fetching profile:', error);
//       console.log('Full error:', JSON.stringify(error, null, 2));
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function handleSignOut() {
//     try {
//       await authApi.signOut();
//       Alert.alert('Success', 'You have been signed out');
//       onLogout();
//     } catch (error) {
//       Alert.alert('Error', error.response?.data?.error || error.message);
//     }
//   }

//   if (loading) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color="#FF8FAB" />
//       </View>
//     );
//   }

//   const handleUploadComplete = (url: string) => {
//     console.log('Image uploaded successfully:', url);
//     //TODO: UPDATE DATABASE
//   };

  
//   const requestPermission = async () => {
//       const { status } =
//         await ImagePicker.requestMediaLibraryPermissionsAsync();
  
//       if (status !== 'granted') {
//         Alert.alert(
//           'Permission required',
//           'We need access to your photos to upload an image.'
//         );
//         return false;
//       }
//       return true;
//   };

//   const pickAndUploadImage = async () => {
//       const hasPermission = await requestPermission();
//       if (!hasPermission) return;
  
//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ['images'], 
//         allowsEditing: true,
//         quality: 0.8,
//       });
  
//       if (result.canceled) return;
  
//       const uri = result.assets[0].uri;
//       // console.log('Image URI:', uri);
  
//       try {
//         setUploading(true);
  
//         const response = await fetch(uri);
//         const arrayBuffer = await response.arrayBuffer();
  
//         const filePath = `${folderName}/${Date.now()}.jpg`;
  
//         const { error } = await supabase.storage
//           .from(bucketName)
//           .upload(filePath, arrayBuffer, {
//             contentType: 'image/jpeg',
//           });
  
//         if (error) throw error;
  
//         const { data } = supabase.storage
//           .from(bucketName)
//           .getPublicUrl(filePath);
  
//         const publicUrl = data.publicUrl;
//         updateProfilePicture(userId, publicUrl)
//         console.log(publicUrl)
//       } catch (err) {
//         console.error('Upload error:', err);
//         Alert.alert(
//           'Upload failed',
//           'Check your internet connection or Supabase setup.'
//         );
//       } finally {
//         setUploading(false);
//       }
//   };

//   const updateProfilePicture = async (userId: string, photo_url: string) => {
//   try {
//     const { error } = await supabase
//       .from("profiles")
//       .update({ avatar_url: photo_url })
//       .eq("id", userId);

//     if (error) throw error;

//     console.log("Profile picture updated");
//     // setRefreshKey(prev => prev + 1);
//     getProfileData();
//   } catch (err) {
//     console.error(err);
//   }
// };

//   return (
//     <View style={styles.container}>
//       {/* Header Section */}
//       <View style={styles.header}>
//         <Image 
//           key={refreshKey}
//           source={{ uri: profile?.avatar_url || 'https://via.placeholder.com/100' }} 
//           style={styles.avatar} 
//         />
//         {/* <ImageUploader folderName={userId || "anonymous"}
//           bucketName="ProfilePictures"
//           onUploadComplete={handleUploadComplete}></ImageUploader> */}
//         <Pressable onPress={pickAndUploadImage}><Text>Edit Profile</Text></Pressable>
//         <Text style={styles.displayName}>{profile?.display_name || 'Collector'}</Text>
//         <Text style={styles.username}>@{profile?.username}</Text>
        
//         <View style={styles.statsRow}>
//           <View style={styles.statBox}>
//             <Text style={styles.statNumber}>{posts.length}</Text>
//             <Text style={styles.statLabel}>Posts</Text>
//           </View>
//           <View style={styles.statBox}>
//             <Text style={styles.statNumber}>{communities.length}</Text>
//             <Text style={styles.statLabel}>Communities</Text>
//           </View>
//         </View>
//       </View>

//       {/* Tab Navigation */}
//       <View style={styles.tabContainer}>
//         <Pressable 
//           style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
//           onPress={() => setActiveTab('posts')}
//         >
//           <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>Posts</Text>
//         </Pressable>
//         <Pressable 
//           style={[styles.tab, activeTab === 'communities' && styles.activeTab]}
//           onPress={() => setActiveTab('communities')}
//         >
//           <Text style={[styles.tabText, activeTab === 'communities' && styles.activeTabText]}>Communities</Text>
//         </Pressable>
//       </View>

//       {/* Posts Grid */}
//       {activeTab === 'posts' && (
//         <FlatList
//           data={posts}
//           keyExtractor={(item) => item.id}
//           numColumns={3}
//           renderItem={({ item }) => (
//             <Pressable
//               style={styles.gridItem}
//               onPress={() => onPostSelect?.(item)}
//             >
//               <Image 
//                 source={{ uri: item.photo_url || 'https://via.placeholder.com/100' }} 
//                 style={styles.gridImage} 
//               />
//             </Pressable>
//           )}
//           ListEmptyComponent={
//             <Text style={styles.emptyText}>No posts yet!</Text>
//           }
//           contentContainerStyle={styles.gridContainer}
//         />
//       )}

//       {/* Communities List */}
//       {activeTab === 'communities' && (
//         <FlatList
//           data={communities}
//           keyExtractor={(item) => item.id}
//           renderItem={({ item }) => (
//             <Pressable
//               style={[styles.resultCard, styles.communityCard]}
//               onPress={() => onCommunitySelect?.(item)}
//             >
//               <View style={[styles.iconCircle, styles.communityIcon]}>
//                 {item.cover_image_url ? (
//                   <Image source={{ uri: item.cover_image_url }} style={styles.resultImage} />
//                 ) : (
//                   <Text style={[styles.iconText, styles.communityIconText]}>👥</Text>
//                 )}
//               </View>
//               <View style={styles.resultText}>
//                 <Text style={styles.resultName}>{item.name}</Text>
//                 <Text style={styles.resultMeta}>{item.description || 'Community details'}</Text>
//                 <Text style={styles.resultMeta}>{item.member_count || 0} members</Text>
//               </View>
//             </Pressable>
//           )}
//           ListEmptyComponent={
//             <Text style={styles.emptyText}>No communities yet!</Text>
//           }
//           contentContainerStyle={styles.resultsList}
//         />
//       )}
      
//       <Pressable style={styles.signOutButton} onPress={handleSignOut}>
//         <Text style={styles.signOutText}>Sign Out</Text>
//       </Pressable>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff' },
//   centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   header: { alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
//   avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#f0f0f0', marginBottom: 12 },
//   displayName: { fontSize: 22, fontWeight: 'bold', color: '#333' },
//   username: { fontSize: 14, color: '#FF8FAB', marginBottom: 15 },
//   statsRow: { flexDirection: 'row', marginTop: 10 },
//   statBox: { alignItems: 'center', marginHorizontal: 20 },
//   statNumber: { fontSize: 18, fontWeight: 'bold' },
//   statLabel: { fontSize: 12, color: '#666' },
//   tabContainer: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#eee' },
//   tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
//   activeTab: { borderBottomColor: '#FF8FAB' },
//   tabText: { fontSize: 14, fontWeight: '600', color: '#999' },
//   activeTabText: { color: '#FF8FAB' },
//   gridItem: { flex: 1/3, aspectRatio: 1, padding: 1 },
//   gridImage: { width: '100%', height: '100%', borderRadius: 8 },
//   gridContainer: { padding: 10 },
//   resultCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 14,
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowOffset: { width: 0, height: 4 },
//     shadowRadius: 12,
//     elevation: 3,
//     backgroundColor: '#fff',
//   },
//   postResultCard: {
//     backgroundColor: '#F5E5D8',
//     borderLeftWidth: 4,
//     borderLeftColor: '#A47552',
//   },
//   communityCard: {
//     backgroundColor: '#E8F2FF',
//     borderLeftWidth: 4,
//     borderLeftColor: '#71A5D3',
//   },
//   iconCircle: {
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 14,
//   },
//   postIcon: {
//     backgroundColor: '#E8D4C1',
//   },
//   communityIcon: {
//     backgroundColor: '#DCE8F8',
//   },
//   resultImage: {
//     width: 52,
//     height: 52,
//     borderRadius: 18,
//   },
//   iconText: {
//     fontSize: 24,
//   },
//   postIconText: {
//     color: '#7A4C2A',
//   },
//   communityIconText: {
//     color: '#2B5B8A',
//   },
//   resultText: {
//     flex: 1,
//   },
//   resultName: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#231f20',
//     marginBottom: 6,
//   },
//   resultMeta: {
//     fontSize: 14,
//     color: '#6e5a68',
//   },
//   resultsList: {
//     paddingBottom: 40,
//   },
//   emptyText: { textAlign: 'center', marginTop: 50, color: '#999' },
//   signOutButton: { margin: 20, padding: 15, borderRadius: 8, backgroundColor: '#f5f5f5', alignItems: 'center' },
//   signOutText: { color: '#ff4d4d', fontWeight: 'bold' }
// });

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ActivityIndicator,
  Alert, FlatList, ScrollView
} from "react-native";
import { authApi } from "../lib/authApi";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../lib/supabase";
import ImageGrid from "../components/imageGrid";

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


      <View style={styles.topSection}>
        <Image
          key={refreshKey}
          source={{ uri: profile?.avatar_url || "https://via.placeholder.com/100" }}
          style={styles.avatar}
        />

        <View style={styles.profileInfo}>
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
                {uploading ? "Uploading..." : "Edit Profile"}
              </Text>
            </Pressable>

            <Pressable style={styles.signOutButton} onPress={handleSignOut}>
              <Text style={styles.signOutText}>Sign Out</Text>
            </Pressable>
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
          <Text
            style={[
              styles.tabText,
              activeTab === "communities" && styles.activeTabText,
            ]}
          >
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
    backgroundColor: "#EBD9BE",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EBD9BE",
  },
  topBar: {
    height: 48,
    backgroundColor: "#221A19",
  },
  topSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 14,
    backgroundColor: "#FFD09A",
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    borderColor: "#FFF8F0",
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  displayName: {
    fontSize: 30,
    color: "#171312",
    marginBottom: 2,
  },
  username: {
    fontSize: 15,
    color: "#5C524D",
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  statBox: {
    marginRight: 22,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#171312",
  },
  statLabel: {
    fontSize: 13,
    color: "#4C433E",
    marginTop: 2,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
  },
  editButton: {
    backgroundColor: "#71A5D3",
    paddingHorizontal: 16,
    height: 30,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  editButtonText: {
    color: "#fff",
    fontSize: 15,
  },
  signOutButton: {
    backgroundColor: "#D86D55",
    paddingHorizontal: 16,
    height: 30,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  signOutText: {
    color: "#fff",
    fontSize: 15,
  },
  tabRow: {
    flexDirection: "row",
    backgroundColor: "#FFD09A",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#5A4A40",
    height: 40,
    justifyContent: "center",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 1,
    justifyContent: "center",
  },
  activeTabButton: {
    backgroundColor: "#71A5D3",
  },
  tabText: {
    fontSize: 18,
    color: "#211A19",
  },
  activeTabText: {
    fontWeight: "700",
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