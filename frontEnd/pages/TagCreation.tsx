import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { postApi } from "../lib/postApi"; // Ensure this path is correct

export default function CreateTag({ userId, onGoBack }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name) return Alert.alert("Error", "Name is required");
    
    setLoading(true);
    try {
      // Passing all 4 required/supported arguments to your API
      await postApi.createTag(userId, name, description, photoUrl);
      
      Alert.alert("Success", "Tag Created!");
      onGoBack(); // Navigate back to the profile or search screen
    } catch (error) {
      // Shows the specific error from Supabase or your Express server
      Alert.alert("Error", error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>New Treasure Tag</Text>
      
      <Text style={styles.label}>Tag Name</Text>
      <TextInput 
        style={styles.input} 
        placeholder="e.g. Kuromi Plush" 
        placeholderTextColor="#999"
        value={name} 
        onChangeText={setName} 
      />

      <Text style={styles.label}>Description</Text>
      <TextInput 
        style={[styles.input, { height: 80 }]} 
        placeholder="What kind of items belong in this tag?" 
        placeholderTextColor="#999"
        multiline
        value={description} 
        onChangeText={setDescription} 
      />

      <Text style={styles.label}>Icon/Photo URL</Text>
      <TextInput 
        style={styles.input} 
        placeholder="https://image-link.com/photo.png" 
        placeholderTextColor="#999"
        value={photoUrl} 
        onChangeText={setPhotoUrl} 
      />
      
      <Pressable 
        style={[styles.button, loading && { opacity: 0.7 }]} 
        onPress={handleCreate} 
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Create Tag</Text>
        )}
      </Pressable>
      
      <Pressable onPress={onGoBack} style={styles.cancelButton}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#fff' 
  },
  title: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    color: '#333',
    marginBottom: 25, 
    marginTop: 40 
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: { 
    backgroundColor: '#f8f8f8', 
    padding: 15, 
    borderRadius: 12, 
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eee',
    color: '#333'
  },
  button: { 
    backgroundColor: '#FF8FAB', 
    padding: 16, 
    borderRadius: 12, 
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#FF8FAB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 16,
    fontWeight: 'bold' 
  },
  cancelButton: { 
    marginTop: 20,
    padding: 10
  },
  cancelButtonText: { 
    textAlign: 'center', 
    color: '#999',
    fontWeight: '500'
  },
});