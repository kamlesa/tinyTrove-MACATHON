import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  FlatList,
  ActivityIndicator, Alert
} from "react-native";
import Button from "../components/button";
import { supabase } from "../lib/supabase";
import { authApi } from "../lib/authApi";

export default function CommunityDetail({ community, onBack, onTreasureSelect, onPostSelect, onCreateTag,
  checkStatus, userId }) {
  const [localMemberStatus, setLocalMemberStatus] = useState('loading');
  const [actionLoading, setActionLoading] = useState(false);}) {
  const [treasures, setTreasures] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (community?.id) {
      fetchCommunityContent();
    }
  }, [community]);

  async function fetchCommunityContent() {
    const communityId = community.id.replace(/^community-/, "");
    console.log(community);

    try {
      const { data: communityTreasures, error: communityTreasuresError } = await supabase
        .from("community_treasures")
        .select("treasure_id")
        .eq("community_id", communityId);

      if (communityTreasuresError) throw communityTreasuresError;

      const treasureIds = (communityTreasures || []).map((row) => row.treasure_id);
      if (treasureIds.length > 0) {
        const { data: treasureData, error: treasureError } = await supabase
          .from("treasure_tag")
          .select("id,name,descriptor,photo")
          .in("id", treasureIds);

        if (treasureError) throw treasureError;
        setTreasures(treasureData || []);

        const { data: postTags, error: postTagsError } = await supabase
          .from("post_tags")
          .select("post_id")
          .in("tag_id", treasureIds);

        if (postTagsError) throw postTagsError;

        const postIds = Array.from(new Set((postTags || []).map((row) => row.post_id)));
        if (postIds.length > 0) {
          const { data: postsData, error: postsError } = await supabase
            .from("posts")
            .select("id,photo_url")
            .in("id", postIds);

          if (postsError) throw postsError;
          setPosts(postsData || []);
        } else {
          setPosts([]);
        }
      } else {
        setTreasures([]);
        setPosts([]);
      }
    } catch (error) {
      console.error("Error fetching community treasures/posts:", error);
      setTreasures([]);
      setPosts([]);
    }
  }

export default function CommunityDetail({ 
  community, 
  userId,        
  onBack, 
  onCreateTag,
  checkStatus    
}) {
  const [localMemberStatus, setLocalMemberStatus] = useState('loading');
  const [actionLoading, setActionLoading] = useState(false);
  const [communities, setCommunities] = useState([]);
  

  if (!community) return null;
  console.log(community.photo)
  const photo_url = community.photo ?? "";
  const banner_url = community.banner_url ?? "";
  const title = community.name ?? "Community Name";
  const members = community.number_of_members ?? "0";

  const treasureItems = treasures.map((item) => ({
    id: `treasure-${item.id}`,
    source: { uri: item.photo || "https://via.placeholder.com/80" },
    onClick: () => onTreasureSelect?.({
      ...item,
      id: `treasure-${item.id}`,
      photo: item.photo,
      descriptor: item.descriptor,
    }),
  }));

  const postImages = posts.map((item) => ({
    id: item.id,
    source: { uri: item.photo_url || "https://via.placeholder.com/100" },
    onClick: () => onPostSelect?.(item),
  }));

  const headerComponent = (
    <>
      <View style={styles.topSection}>
        <View style={styles.frame}>
<Image
  source={{ uri: banner_url }}
  style={styles.banner_url}
  resizeMode="cover"
/>

        </View>

  // 2. The useEffect Hook: This runs exactly once when the component opens
  useEffect(() => {
    const fetchMembership = async () => {
      try {
        // Now it is safe to use await because we are inside an async function!
        const communitiesData = await authApi.getUserCommunities(userId);
        setCommunities(communitiesData || []);
        
        const status = communitiesData.some(
          (c) => String(c.community_id || c.id) === String(community?.id)
        ) ? 'member' : 'non-member';
        
        // Update the state with the result!
        setLocalMemberStatus(status);
      } catch (error) {
        console.error("Fetch error:", error);
        setLocalMemberStatus('non-member'); // Safe fallback
      }
    };
    if (userId && community?.id) {
      fetchMembership();
    }
  }, [userId, community?.id]); // Re-run if the user or community changes
  
  const memberJoined = localMemberStatus === 'member';
  // --- 3. THE ACTIONS ---
  const handleJoin = async () => {
    setActionLoading(true);
    try {
      console.log(`Attempting to join community ${community.id} for user ${userId}`);
      await authApi.joinCommunity(userId, community.id);
      
      Alert.alert("Success", "Welcome to the Trove!");
      if (checkStatus) await checkStatus(); // Refresh the parent state!
      
    } catch (error) {
      Alert.alert("Error", error.message || error.error || "Could not join community");
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeave = async () => {
    Alert.alert(
      "Leave Trove?",
      "Are you sure you want to leave this community?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Leave", 
          style: "destructive",
          onPress: async () => {
            setActionLoading(true);
            try {
              await authApi.leaveCommunity(userId, community.id);
              
              Alert.alert("Success", "You have left the Trove.");
              if (checkStatus) await checkStatus(); // Refresh the parent state!
              
            } catch (error) {
              Alert.alert("Error", error.message || error.error || "Could not leave community");
            } finally {
              setActionLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>
      </View>

        <View style={styles.profileSection}>
<Image
  source={{ uri: photo_url }}
  style={styles.photo_url}
  resizeMode="cover"
/>
          <View style={styles.infoContainer}>
            <View style={styles.titleText}>
              <Text style={styles.title}>{title}</Text>

              <View style={styles.memberBox}>
                <Text style={styles.members}>{members} members</Text>
                <Button widthSize="medium" heightSize="small" onClick={() => {}}>
                  Join Club
                </Button>
              </View>
            </View>
          </View>
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Banner/Photo */}
        {community.photo && (
          <Image source={{ uri: community.photo }} style={styles.photo} />
        )}

        <Text style={styles.title}>{community.name}</Text>
        <Text style={styles.description}>{community.description}</Text>

        {/* --- STATS SECTION --- */}
        <View style={styles.stats}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>
              {community.number_of_members ?? 0}
            </Text>
            <Text style={styles.statLabel}>Members</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{community.treasures || 0}</Text>
            <Text style={styles.statLabel}>Treasures</Text>
          </View>
        </View>

        <View style={styles.treasureContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.treasureList}
          >
            {treasureItems.map((item) => (
              <Pressable key={item.id} onPress={item.onClick} style={styles.treasureItem}>
                <Image source={item.source} style={styles.treasureImage} resizeMode="cover" />
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Community Treasure Posts</Text>
      </View>
    </>
  );

  return (
    <FlatList
      data={postImages}
      keyExtractor={(item) => item.id}
      numColumns={3}
      renderItem={({ item }) => (
        <Pressable style={styles.gridItem} onPress={item.onClick}>
          <Image source={item.source} style={styles.gridImage} />
        </Pressable>
      )}
      ListHeaderComponent={headerComponent}
      ListEmptyComponent={
        <Text style={styles.emptyText}>No posts yet!</Text>
      }
      contentContainerStyle={styles.gridContainer}
      style={styles.page}
    />
        {/* --- JOIN / LEAVE ACTION --- */}
        <Pressable 
          style={[
            styles.mainActionButton, 
            memberJoined ? styles.leaveButton : styles.joinButton
          ]} 
          // FIX: Changed onLeave/onJoin to handleLeave/handleJoin
          onPress={memberJoined ? handleLeave : handleJoin} 
          // FIX: Changed loading to actionLoading
          disabled={actionLoading} 
        >
          {/* FIX: Changed loading to actionLoading */}
          {actionLoading ? (
            <ActivityIndicator size="small" color={memberJoined ? "#999" : "#fff"} />
          ) : (
            <Text style={[styles.mainActionButtonText, memberJoined && styles.leaveButtonText]}>
              {memberJoined ? "Leave Community" : "Join Community"}
            </Text>
          )}
        </Pressable>

        {/* --- CREATE TAG ACTION --- */}
        {memberJoined ? (
          <Pressable style={styles.createTagButton} onPress={onCreateTag}>
            <Text style={styles.createTagButtonText}>+ Create New Treasure Tag</Text>
          </Pressable>
        ) : (
          <View style={styles.memberLockedNotice}>
            <Text style={styles.lockedText}>Join to start adding tags!</Text>
          </View>
        )}

        <View style={styles.divider} />
        <Text style={styles.placeholder}>Community details page - to be completed</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#FFF8F0",
  },
  topSection: {
    flexShrink: 0,
  },
  frame: {
    width: "100%",
    height: 140,
    overflow: "hidden",
  },
  banner_url: {
    width: "100%",
    height: "100%",
  header: {
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: 'transparent',
  },
  profileSection: {
    marginTop: -50,
    paddingHorizontal: 20,
  },
  photo_url: {
    height: 100,
    aspectRatio: 1,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "#fff",
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#71A5D3",
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  infoContainer: {
    marginTop: 5,
    backgroundColor: "#FFF8F0",
    paddingBottom: 0,
  },
  title: {
    fontSize: 40,
  },
  members: {
    fontSize: 20,
  },
  titleText: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 0,
  },
  memberBox: {
    flexDirection: "column",
    alignItems: "center",
  },
  treasureContainer: {
    marginTop: 12,
    paddingVertical: 12,
    backgroundColor: "#FFD09A",
  },
  treasureList: {
    paddingHorizontal: 12,
    gap: 12,
    alignItems: "center",
  photo: {
    width: '100%',
    height: 220,
    borderRadius: 15,
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#2e1d14',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#6e5a68',
    lineHeight: 24,
    marginBottom: 25,
  },
  treasureItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  treasureImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#fff",
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: "#FFF8F0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  gridItem: {
    flex: 1 / 3,
    aspectRatio: 1,
    padding: 1,
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FF8FAB',
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    textTransform: 'uppercase',
    marginTop: 2,
  },
  mainActionButton: {
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 12,
  },
  joinButton: {
    backgroundColor: '#FF8FAB',
  },
  leaveButton: {
    backgroundColor: '#eee',
  },
  mainActionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  leaveButtonText: {
    color: '#666',
  },
  createTagButton: {
    backgroundColor: 'transparent',
    paddingVertical: 14,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF8FAB',
    borderStyle: 'dashed',
  },
  createTagButtonText: {
    color: '#FF8FAB',
    fontSize: 16,
    fontWeight: 'bold',
  },
  memberLockedNotice: {
    padding: 10,
    alignItems: 'center',
  },
  lockedText: {
    color: '#bbb',
    fontSize: 13,
    fontStyle: 'italic',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 30,
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
    marginTop: 50,
    color: "#999",
  placeholder: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
  },
});