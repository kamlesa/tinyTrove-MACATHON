import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  FlatList,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { supabase } from "../lib/supabase";
import { authApi } from "../lib/authApi";
import CreateTag from './TagCreation';

export default function CommunityDetail({
  community,
  onBack,
  onTreasureSelect,
  onPostSelect,
  checkStatus,
  userId,
}) {
  const [localMemberStatus, setLocalMemberStatus] = useState("loading");
  const [actionLoading, setActionLoading] = useState(false);
  const [treasures, setTreasures] = useState([]);
  const [posts, setPosts] = useState([]);
  
  // Controls the Modal
  const [isCreatingTag, setIsCreatingTag] = useState(false);

  // --- 1. ACTION HANDLERS ---
  const handleJoin = useCallback(async () => {
    setActionLoading(true);
    try {
      await authApi.joinCommunity(userId, community.id);
      Alert.alert("Success", "Welcome to the Trove!");
      setLocalMemberStatus("member");
      if (checkStatus) await checkStatus();
    } catch (error) {
      Alert.alert("Error", error.message || "Could not join community");
    } finally {
      setActionLoading(false);
    }
  }, [community, userId, checkStatus]);

  const handleLeave = useCallback(async () => {
    Alert.alert("Leave Trove?", "Are you sure you want to leave?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Leave",
        style: "destructive",
        onPress: async () => {
          setActionLoading(true);
          try {
            await authApi.leaveCommunity(userId, community.id);
            Alert.alert("Success", "You have left the Trove.");
            setLocalMemberStatus("non-member");
            if (checkStatus) await checkStatus();
          } catch (error) {
            Alert.alert("Error", "Could not leave community");
          } finally {
            setActionLoading(false);
          }
        },
      },
    ]);
  }, [community, userId, checkStatus]);

  // --- 2. DATA FETCHING ---
  useEffect(() => {
    const fetchMembership = async () => {
      if (!userId || !community?.id) return;
      try {
        const communitiesData = await authApi.getUserCommunities(userId);
        const currentId = String(community.id).replace(/^community-/, "");
        const isJoined = communitiesData.some(
          (c) => String(c.community_id || c.id).replace(/^community-/, "") === currentId
        );
        setLocalMemberStatus(isJoined ? "member" : "non-member");
      } catch (error) {
        setLocalMemberStatus("non-member");
      }
    };
    fetchMembership();
  }, [userId, community?.id]);

  useEffect(() => {
    if (community?.id) {
      fetchCommunityContent();
    }
  }, [community]);

  async function fetchCommunityContent() {
    const communityId = String(community.id).replace(/^community-/, "");
    try {
      const { data: communityTreasures } = await supabase
        .from("community_treasures")
        .select("treasure_id")
        .eq("community_id", communityId);

      const treasureIds = (communityTreasures || []).map((row) => row.treasure_id);
      
      if (treasureIds.length > 0) {
        const { data: treasureData } = await supabase
          .from("treasure_tag")
          .select("id,name,descriptor,photo")
          .in("id", treasureIds);
        setTreasures(treasureData || []);

        const { data: postTags } = await supabase
          .from("post_tags")
          .select("post_id")
          .in("tag_id", treasureIds);

        const postIds = Array.from(new Set((postTags || []).map((row) => row.post_id)));
        if (postIds.length > 0) {
          const { data: postsData } = await supabase
            .from("posts")
            .select("id,photo_url")
            .in("id", postIds);
          setPosts(postsData || []);
        }
      }
    } catch (error) {
      console.error("Error fetching community content:", error);
    }
  }

  // --- 3. HEADER COMPONENT ---
  const renderHeader = useMemo(() => {
    if (!community) return null;
    const memberJoined = localMemberStatus === "member";

    return (
      <View style={styles.headerContainer}>
        <View style={styles.bannerFrame}>
          <Image source={{ uri: community.banner_url || community.photo }} style={styles.bannerImage} resizeMode="cover" />
        </View>

        <View style={styles.profileInfo}>
          <Image source={{ uri: community.photo_url || community.photo }} style={styles.profilePhoto} />
          <View style={styles.infoText}>
            <Text style={styles.title}>{community.name}</Text>
            <Text style={styles.membersCount}>{community.number_of_members || 0} members</Text>
          </View>
        </View>

        <Text style={styles.description}>{community.description}</Text>

        <Pressable
          style={[styles.mainButton, memberJoined ? styles.leaveButton : styles.joinButton]}
          onPress={memberJoined ? handleLeave : handleJoin}
          disabled={actionLoading}
        >
          {actionLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{memberJoined ? "Leave Trove" : "Join Trove"}</Text>
          )}
        </Pressable>

        <Text style={styles.subTitle}>Community Treasures</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.treasureScroll}>
          {treasures.map((item) => (
            <Pressable key={item.id} onPress={() => onTreasureSelect?.(item)} style={styles.treasureItem}>
              <Image source={{ uri: item.photo }} style={styles.treasureImage} />
              <Text numberOfLines={1} style={styles.treasureLabel}>{item.name}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Syntax fixed: Modal removed from here, and button opens the Modal */}
        {memberJoined && (
          <Pressable style={styles.tagButton} onPress={() => setIsCreatingTag(true)}>
            <Text style={styles.tagButtonText}>+ Create New Treasure Tag</Text>
          </Pressable>
        )}

        <Text style={styles.sectionTitle}>Community Posts</Text>
      </View>
    );
  }, [community, localMemberStatus, actionLoading, treasures, handleJoin, handleLeave]);

  if (!community) return null;

  // --- 4. MAIN RENDER ---
  return (
    <View style={styles.page}>
      
      {/* Absolute Back Button */}
      <View style={styles.topNav}>
        <Pressable onPress={onBack} style={styles.backButton} hitSlop={20}>
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        numColumns={3}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
          <Pressable style={styles.gridItem} onPress={() => onPostSelect?.(item)}>
            <Image source={{ uri: item.photo_url }} style={styles.gridImage} />
          </Pressable>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No posts yet!</Text>}
        contentContainerStyle={{ paddingTop: 80 }}
      />

      {/* The Modal belongs down here at the root of the component */}
      <Modal visible={isCreatingTag} animationType="slide">
        <CreateTag 
          userId={userId} 
          communityId={community.id} 
          onGoBack={() => {
            setIsCreatingTag(false); 
            fetchCommunityContent(); 
          }} 
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#fffbf5" },
  topNav: { 
    position: 'absolute', 
    top: 50, 
    left: 16, 
    zIndex: 9999, 
    elevation: 15,
  },
  backButton: { 
    backgroundColor: "#71A5D3", 
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  backButtonText: { color: 'white', fontWeight: 'bold' },
  headerContainer: { padding: 16 },
  bannerFrame: { width: '100%', height: 180, borderRadius: 15, overflow: 'hidden', marginBottom: -40 },
  bannerImage: { width: '100%', height: '100%' },
  profileInfo: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 15 },
  profilePhoto: { width: 80, height: 80, borderRadius: 20, borderWidth: 4, borderColor: '#fffbf5' },
  infoText: { marginLeft: 15, paddingBottom: 5 },
  title: { fontSize: 24, fontWeight: '800', color: '#2e1d14' },
  membersCount: { color: '#71A5D3', fontWeight: 'bold' },
  description: { fontSize: 15, color: '#6e5a68', marginVertical: 15, lineHeight: 20 },
  mainButton: { padding: 15, borderRadius: 12, alignItems: 'center', marginBottom: 20 },
  joinButton: { backgroundColor: '#FF8FAB' },
  leaveButton: { backgroundColor: '#ddd' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  subTitle: { fontSize: 18, fontWeight: '700', marginBottom: 10 },
  treasureScroll: { marginBottom: 20 },
  treasureItem: { marginRight: 15, width: 100 },
  treasureImage: { width: '100%', height: 100, borderRadius: 10 },
  treasureLabel: { marginTop: 5, textAlign: 'center', color: '#4c3a2e' },
  tagButton: { backgroundColor: '#71A5D3', padding: 12, borderRadius: 10, alignItems: 'center', marginBottom: 20 },
  tagButtonText: { color: '#fff', fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  gridItem: { flex: 1/3, aspectRatio: 1, padding: 2 },
  gridImage: { width: '100%', height: '100%', borderRadius: 8 },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#6e5a68' }
});