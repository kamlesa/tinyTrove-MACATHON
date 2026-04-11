import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, Alert, ActivityIndicator, ScrollView } from "react-native";
import { authApi } from "../lib/authApi";

export function Post({ userId }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [communityId, setCommunityId] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreatePost() {
    if (!photoUrl) {
      Alert.alert("Required", "Please provide an image URL");
      return;
    }

    if (!title.trim()) {
      Alert.alert("Required", "Please enter a title");
      return;
    }

    try {
      setLoading(true);
      const result = await authApi.createPost(
        userId,
        title,
        description,
        photoUrl,
        communityId || null
      );
      
      Alert.alert("Success", "Post created successfully!");
      // Reset form
      setTitle("");
      setDescription("");
      setPhotoUrl("");
      setCommunityId("");
    } catch (error) {
      Alert.alert("Error", error.response?.data?.error || error.message);
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create a Post</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter post title"
          value={title}
          onChangeText={setTitle}
          editable={!loading}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="What's your collection?"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          editable={!loading}
        />

        <Text style={styles.label}>Image URL *</Text>
        <TextInput
          style={styles.input}
          placeholder="https://example.com/image.jpg"
          value={photoUrl}
          onChangeText={setPhotoUrl}
          editable={!loading}
        />

        <Text style={styles.label}>Community ID (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Leave empty for no community"
          value={communityId}
          onChangeText={setCommunityId}
          editable={!loading}
        />

        <Pressable 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleCreatePost}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Create Post</Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    backgroundColor: "#FF8FAB",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: "#f9f9f9",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#FF8FAB",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
