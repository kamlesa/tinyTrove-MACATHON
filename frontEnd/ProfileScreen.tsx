import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator, Pressable, Alert } from 'react-native';
import { authApi } from './lib/authApi';

export function ProfileScreen({ userId, onLogout }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (userId) {
      getProfileData();
    }
  }, [userId]);

  async function getProfileData() {
    try {
      setLoading(true);
      
      // Fetch profile and posts in parallel
      const [profileData, postsData] = await Promise.all([
        authApi.getProfile(userId),
        authApi.getPosts(userId)
      ]);

      setProfile(profileData);
      setPosts(postsData);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || error.message);
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    try {
      await authApi.signOut();
      Alert.alert('Success', 'You have been signed out');
      onLogout();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || error.message);
    }
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF8FAB" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image 
          source={{ uri: profile?.avatar_url || 'https://via.placeholder.com/100' }} 
          style={styles.avatar} 
        />
        <Text style={styles.displayName}>{profile?.display_name || 'Collector'}</Text>
        <Text style={styles.username}>@{profile?.username}</Text>
        
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{posts.length}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
        </View>
      </View>

      {/* Grid of Posts */}
      <FlatList
        data={posts}
        numColumns={3}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.gridItem}>
            <Image source={{ uri: item.photo_url }} style={styles.postImage} />
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No obsessions posted yet!</Text>
        }
      />
      
      <Pressable style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#f0f0f0', marginBottom: 12 },
  displayName: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  username: { fontSize: 14, color: '#FF8FAB', marginBottom: 15 },
  statsRow: { flexDirection: 'row', marginTop: 10 },
  statBox: { alignItems: 'center', marginHorizontal: 20 },
  statNumber: { fontSize: 18, fontWeight: 'bold' },
  statLabel: { fontSize: 12, color: '#666' },
  gridItem: { flex: 1/3, aspectRatio: 1, padding: 1 },
  postImage: { width: '100%', height: '100%' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#999' },
  signOutButton: { margin: 20, padding: 15, borderRadius: 8, backgroundColor: '#f5f5f5', alignItems: 'center' },
  signOutText: { color: '#ff4d4d', fontWeight: 'bold' }
});