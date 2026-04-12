import React, { useState, useEffect } from "react"; // ADDED useEffect
import { View, Text, StyleSheet, Pressable, ScrollView, Image, ActivityIndicator, Alert } from "react-native";
import { authApi } from "../lib/authApi";

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
  container: {
    flex: 1,
    backgroundColor: "#fffbf5",
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: 'transparent',
  },
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
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 0,
  },
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
  placeholder: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
  },
});