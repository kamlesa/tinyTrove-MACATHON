import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import ImageUploader from "../components/ImageUpload";

export default function Post({ userId }) {
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const handleUploadComplete = (url: string) => {
    // console.log('Image uploaded successfully:', url);
    setUploadedImageUrl(url);
  };

  return (
    <ScrollView style={styles.page}>
      <View style={styles.center}>
        <Text style={styles.title}>Post Page</Text>
      </View>

      <View style={styles.uploadSection}>
        <Text style={styles.sectionTitle}>Upload Image</Text>
        <ImageUploader
          folderName={userId || "anonymous"}
          bucketName="Posts"
          onUploadComplete={handleUploadComplete}
        />

        {uploadedImageUrl && (
          <View style={styles.linkContainer}>
            <Text style={styles.linkLabel}>Uploaded Image Link:</Text>
            <Text style={styles.linkText} selectable={true}>
              {uploadedImageUrl}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    position: "relative",
  },
  center: {
    paddingTop: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
  },
  uploadSection: {
    padding: 20,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  linkContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    width: "100%",
  },
  linkLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  linkText: {
    fontSize: 14,
    color: "#007AFF",
    fontFamily: "monospace",
    lineHeight: 20,
  },
});
