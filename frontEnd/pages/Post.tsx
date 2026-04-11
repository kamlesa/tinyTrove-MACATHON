import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ImageUploader
 from "../components/ImageUpload";
export default function Post() {
  const handleImage = (uri) => {
    console.log('Selected image URI:', uri);
  };
  return (
    <View style={styles.page}>
      <View style={styles.center}>
        <Text style={styles.title}>Post Page</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    position: "relative",
  },
  center: {
    paddingTop: 40,
    alignItems: "center", // 👈 replaces textAlign
  },
  title: {
    fontSize: 30,
  },
});
