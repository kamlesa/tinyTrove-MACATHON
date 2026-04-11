import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator, Pressable, Alert } from 'react-native';
import { authApi } from '../lib/authApi';

export function ProfileScreen({ userId, onLogout }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [activeTab, setActiveTab] = useState('posts'); // 'posts' or 'communities'

  useEffect(() => {
    if (userId) {
      getProfileData();
    }
  }, [userId]);

  async function getProfileData() {
    try {
      setLoading(true);
      
      // Fetch profile, posts, and communities in parallel
      const [profileData, postsData, communitiesData] = await Promise.all([
        authApi.getProfile(userId),
        authApi.getPosts(userId),
        authApi.getCommunities(userId)
      ]);

      setProfile(profileData);
      setPosts(postsData || []);
      setCommunities(communitiesData || []);
      console.log('Posts fetched:', postsData);
      console.log('Communities fetched:', communitiesData);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || error.message);
      console.error('Error fetching profile:', error);
      console.log('Full error:', JSON.stringify(error, null, 2));
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
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{communities.length}</Text>
            <Text style={styles.statLabel}>Communities</Text>
          </View>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <Pressable 
          style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
          onPress={() => setActiveTab('posts')}
        >
          <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>Posts</Text>
        </Pressable>
        <Pressable 
          style={[styles.tab, activeTab === 'communities' && styles.activeTab]}
          onPress={() => setActiveTab('communities')}
        >
          <Text style={[styles.tabText, activeTab === 'communities' && styles.activeTabText]}>Communities</Text>
        </Pressable>
      </View>

      {/* Posts Grid */}
      {activeTab === 'posts' && (
        <FlatList
          data={posts}
          numColumns={3}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            console.log('Post item:', item);
            return (
              <View style={styles.gridItem}>
                <Image 
                  source={{ uri: item.photo_url || item.image_url || item.image || 'https://via.placeholder.com/150?text=No+Image' }} 
                  style={styles.postImage}
                  onError={(err) => console.log('Image load error:', err, 'URL:', item.photo_url || item.image_url || item.image)}
                />
              </View>
            );
          }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No posts yet!</Text>
          }
        />
      )}

      {/* Communities List */}
      {activeTab === 'communities' && (
        <FlatList
          data={communities}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.communityCard}>
              <Image 
                source={{ uri: item.cover_image_url || 'https://via.placeholder.com/100' }} 
                style={styles.communityImage} 
              />
              <View style={styles.communityInfo}>
                <Text style={styles.communityName}>{item.name}</Text>
                <Text style={styles.communityDesc}>{item.description}</Text>
                <Text style={styles.communityMembers}>{item.member_count || 0} members</Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No communities yet!</Text>
          }
        />
      )}
      
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
  tabContainer: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#eee' },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: '#FF8FAB' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#999' },
  activeTabText: { color: '#FF8FAB' },
  gridItem: { flex: 1/3, aspectRatio: 1, padding: 1 },
  postImage: { width: '100%', height: '100%' },
  communityCard: { flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee', alignItems: 'center' },
  communityImage: { width: 60, height: 60, borderRadius: 8, marginRight: 12, backgroundColor: '#f0f0f0' },
  communityInfo: { flex: 1 },
  communityName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  communityDesc: { fontSize: 12, color: '#666', marginTop: 2 },
  communityMembers: { fontSize: 11, color: '#999', marginTop: 4 },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#999' },
  signOutButton: { margin: 20, padding: 15, borderRadius: 8, backgroundColor: '#f5f5f5', alignItems: 'center' },
  signOutText: { color: '#ff4d4d', fontWeight: 'bold' }
});