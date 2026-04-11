import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator, Pressable, Alert } from 'react-native';
import { authApi } from '../lib/authApi';

export function ProfileScreen({ userId, onLogout, onCommunitySelect, onPostSelect, onCreateCommunity}) {
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
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              style={[styles.resultCard, styles.postResultCard]}
              onPress={() => onPostSelect?.(item)}
            >
              <View style={[styles.iconCircle, styles.postIcon]}> 
                {item.photo_url ? (
                  <Image source={{ uri: item.photo_url }} style={styles.resultImage} />
                ) : (
                  <Text style={[styles.iconText, styles.postIconText]}>📸</Text>
                )}
              </View>
              <View style={styles.resultText}>
                <Text style={styles.resultName}>{item.caption || 'Untitled post'}</Text>
                <Text style={styles.resultMeta}>{item.location || 'No location provided'}</Text>
              </View>
            </Pressable>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No posts yet!</Text>
          }
          contentContainerStyle={styles.resultsList}
        />
      )}

      {/* Communities List */}
      {activeTab === 'communities' && (
        <FlatList
          data={communities}
          keyExtractor={(item) => item.id}
          // ADDED: The Create Community Button sits at the top of the list!
          ListHeaderComponent={
            <Pressable 
              style={styles.createCommunityBtn}
              onPress={onCreateCommunity}
            >
              <Text style={styles.createCommunityBtnText}>+ Create New Community</Text>
            </Pressable>
          }
          renderItem={({ item }) => (
            <Pressable
              style={[styles.resultCard, styles.communityCard]}
              onPress={() => onCommunitySelect?.(item)}
            >
              <View style={[styles.iconCircle, styles.communityIcon]}>
                {item.cover_image_url ? (
                  <Image source={{ uri: item.cover_image_url }} style={styles.resultImage} />
                ) : (
                  <Text style={[styles.iconText, styles.communityIconText]}>👥</Text>
                )}
              </View>
              <View style={styles.resultText}>
                <Text style={styles.resultName}>{item.name}</Text>
                <Text style={styles.resultMeta}>{item.description || 'Community details'}</Text>
                <Text style={styles.resultMeta}>{item.member_count || 0} members</Text>
              </View>
            </Pressable>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No communities yet!</Text>
          }
          contentContainerStyle={styles.resultsList}
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
  
  // ADDED: New button styles
  createCommunityBtn: {
    backgroundColor: '#71A5D3',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    margin: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  createCommunityBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  gridItem: { flex: 1/3, aspectRatio: 1, padding: 1 },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    marginHorizontal: 16, // Added to match the button spacing
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 3,
    backgroundColor: '#fff',
  },
  postResultCard: {
    backgroundColor: '#F5E5D8',
    borderLeftWidth: 4,
    borderLeftColor: '#A47552',
    marginTop: 16, // Padding for the first post
  },
  communityCard: {
    backgroundColor: '#E8F2FF',
    borderLeftWidth: 4,
    borderLeftColor: '#71A5D3',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  postIcon: {
    backgroundColor: '#E8D4C1',
  },
  communityIcon: {
    backgroundColor: '#DCE8F8',
  },
  resultImage: {
    width: 52,
    height: 52,
    borderRadius: 18,
  },
  iconText: {
    fontSize: 24,
  },
  postIconText: {
    color: '#7A4C2A',
  },
  communityIconText: {
    color: '#2B5B8A',
  },
  resultText: {
    flex: 1,
  },
  resultName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#231f20',
    marginBottom: 6,
  },
  resultMeta: {
    fontSize: 14,
    color: '#6e5a68',
  },
  resultsList: {
    paddingBottom: 40,
  },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#999' },
  signOutButton: { margin: 20, padding: 15, borderRadius: 8, backgroundColor: '#f5f5f5', alignItems: 'center' },
  signOutText: { color: '#ff4d4d', fontWeight: 'bold' }
});