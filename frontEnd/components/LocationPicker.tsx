import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  TextInput,
  FlatList,
  StyleSheet,
} from "react-native";

interface LocationPickerProps {
  chooseLocation: (location: string) => void;
}

export default function LocationPicker({
  chooseLocation,
}: LocationPickerProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [location, setLocation] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const mockLocations = [
    "Melbourne",
    "Sydney",
    "Brisbane",
    "Perth",
    "Adelaide",
    "Tokyo",
    "London",
  ];

  const filtered = mockLocations.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View>
      {/* BUTTON / SELECTED VALUE */}
      <Pressable style={styles.trigger} onPress={() => setModalVisible(true)}>
        <Text style={styles.triggerText}>
          {location ? location : "Add location"}
        </Text>

        <Text style={styles.arrow}>›</Text>
      </Pressable>

      {/* MODAL */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modal}>
          <TextInput
            style={styles.input}
            placeholder="Search location..."
            value={query}
            onChangeText={setQuery}
          />

          <FlatList
            data={filtered}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Pressable
                style={styles.item}
                onPress={() => {
                  chooseLocation(item); // set selected
                  setLocation(item);
                  setModalVisible(false); // close modal
                  setQuery(""); // reset search
                }}
              >
                <Text>{item}</Text>
              </Pressable>
            )}
          />

          <Pressable onPress={() => setModalVisible(false)}>
            <Text style={styles.close}>Close</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  trigger: {
    width: "100%",
    backgroundColor: "#D9D9D9", // 👈 slightly darker grey
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 10,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    marginTop: 15,
  },

  triggerText: {
    fontSize: 16,
    color: "#333",
  },

  arrow: {
    fontSize: 20,
    color: "#555",
  },

  modal: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },

  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  close: {
    marginTop: 20,
    textAlign: "center",
    color: "blue",
  },
});
