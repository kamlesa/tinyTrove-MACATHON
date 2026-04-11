import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
  ActivityIndicator
} from "react-native";
import LocationPicker from "../components/LocationPicker";
import TagPicker from "../components/TagPicker";
import { postApi } from "../lib/postApi";

// If using TypeScript (.tsx), use: export default function Post({ userId }: { userId: string })
export default function Post({ userId }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState(null);
  const [tags, setTags] = useState([]);
  
  // ADDED: State for the image URL since your backend requires it
  const [image, setImage] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const handleUploadComplete = (url: string) => {
    // console.log('Image uploaded successfully:', url);
    setUploadedImageUrl(url);
  };
  async function submitPost() {
    // Safety check before calling the API
    if (!userId) {
      Alert.alert("Error", "Missing User ID. Are you logged in?");
      return;
    }

    setLoading(true);
    try {
      // THE FIX: We are now passing exactly what the backend expects!
      const response = await postApi.createPost(
        userId,       // <-- CRITICAL FIX
        image,        // <-- CRITICAL FIX
        description,
        location
      );
      
      Alert.alert("Success", "Post Created!");
      
      // Clear the form after success
      setTitle("");
      setDescription("");
      setImage("");
      setTags([]);
      setLocation(null);

    } catch (error) {
      // Axios errors hide the message in error.response.data
      const errorMsg = error.response?.data?.error || error.message;
      Alert.alert("Server Error", errorMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>New Post</Text>

        <Text style={styles.label}>Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter post title"
          placeholderTextColor="#555"
          value={title}
          onChangeText={setTitle}
          editable={!loading}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="What's your collection?"
          placeholderTextColor="#555"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          editable={!loading}
        />

        <LocationPicker chooseLocation={setLocation} />
        
        {/* Fixed the filter bug here */}
        <TagPicker
          addTag={(newItem) => setTags([...tags, newItem])}
          removeTag={(itemToRemove) => 
            setTags(tags.filter((t) => t !== itemToRemove))
          }
        />

        <Pressable 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={submitPost}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Submit Post</Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFD09A",
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 50,
    paddingBottom: 100, // Extra padding for ScrollView
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 5,
    color: "#333",
  },
  input: {
    width: "100%",
    backgroundColor: "#E6E6E6",
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    color: "#333", // Darker text color for input
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top", // Required for Android multiline
  },
  button: {
    backgroundColor: "#4F8CFF",
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 30,
    alignItems: "center", // Better than alignSelf for full width
  },
  buttonDisabled: {
    backgroundColor: "#A0C1FF",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    fontWeight: "bold",
  },
});