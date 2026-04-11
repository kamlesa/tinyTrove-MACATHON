import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, Image } from "react-native";

export default function TreasureDetail({ treasure, onBack }) {
  if (!treasure) return null;

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>
      </View>

      {/* Treasure Details */}
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{treasure.name}</Text>

        {treasure.photo && (
          <Image source={{ uri: treasure.photo }} style={styles.photo} />
        )}

        <Text style={styles.placeholder}>Treasure details page - to be completed</Text>
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
    backgroundColor: "#ff8fab",
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
  placeholder: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 40,
  },
});