import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, Image } from "react-native";

export default function CommunityDetail({ community, onBack }) {
  if (!community) return null;

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>
      </View>

      {/* Community Details */}
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{community.name}</Text>

        {community.photo && (
          <Image source={{ uri: community.photo }} style={styles.photo} />
        )}

        <Text style={styles.description}>{community.description}</Text>

        <View style={styles.stats}>
          <Text style={styles.statText}>Members: {community.members || 0}</Text>
          <Text style={styles.statText}>Treasures: {community.treasures || 0}</Text>
        </View>

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
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#71A5D3",
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2e1d14',
    marginBottom: 16,
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#6e5a68',
    lineHeight: 24,
    marginBottom: 16,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e1d14',
  },
  placeholder: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 40,
  },
});