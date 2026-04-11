import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { supabase } from './UserAuth';

export function ProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getProfileData();
  }, []);

  async function getProfileData() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // 1. Fetch Profile Info
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        // 2. Fetch User's Posts
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (postsError) throw postsError;
        setPosts(postsData);
      }
    } catch (error) {
      console.error('Error fetching profile:', error.message);
    } finally {
      setLoading(false);
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
      
      <Pressable style={styles.signOutButton} onPress={() => supabase.auth.signOut()}>
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