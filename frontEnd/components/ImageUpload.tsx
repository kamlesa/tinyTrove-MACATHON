import React, { useState } from "react";
import { View, Text, Pressable, Image, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function ImageUploader() {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      {!image ? (
        <Pressable style={styles.uploadButton} onPress={pickImage}>
          <Text style={styles.uploadText}>Upload Image</Text>
        </Pressable>
      ) : (
        <Pressable onPress={pickImage}>
          <Image source={{ uri: image }} style={styles.image} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    marginVertical: 15,
  },

  uploadButton: {
    backgroundColor: "#E6E6E6",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
  },

  uploadText: {
    color: "#555",
    fontWeight: "600",
  },

  image: {
    width: 200,
    height: 200,
    borderRadius: 12,
  },
});
