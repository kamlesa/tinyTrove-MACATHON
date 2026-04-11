import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Modal,
} from "react-native";
import ImageUploader from "../components/ImageUpload";
import LocationPicker from "../components/LocationPicker";

export default function Post() {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [location, setLocation] = useState<string | null>(null);

  //Should be updated to use an official tag type
  const [tags, setTags] = useState<string[]>([]);

  const [query, setQuery] = useState<string>("");

  const mockLocations = [
    "Melbourne",
    "Sydney",
    "Brisbane",
    "Perth",
    "Adelaide",
    "Tokyo",
    "London",
  ];

  return (
    <View style={styles.page}>
      <View style={styles.content}>
        <Text style={styles.title}>New Post</Text>

        <ImageUploader />

        <TextInput
          style={styles.input}
          placeholder="Add a description"
          placeholderTextColor="#555"
        ></TextInput>

        <LocationPicker />
        <Text>Add tag</Text>
        <Text>Add location</Text>

        <Pressable style={styles.button} onPress={() => console.log("pressed")}>
          <Text style={styles.buttonText}>Submit Post</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#FFD09A",
    paddingHorizontal: 20,
    paddingVertical: 50,
    width: "100%",
  },
  content: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "#E6E6E6",
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    color: "#888",
    marginTop: 15,
  },
  button: {
    backgroundColor: "#4F8CFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    alignSelf: "center",
  },
});
