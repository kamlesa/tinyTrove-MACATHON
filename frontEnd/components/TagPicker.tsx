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

interface TagPickerProps {
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
}

export default function TagPicker({ addTag, removeTag }: TagPickerProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [query, setQuery] = useState("");

  const mockTags = ["Kuromi", "Hello Kitty", "Pikachu"];

  const filtered = mockTags.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  );

  const handleAddTag = (tag: string) => {
    if (!tags.includes(tag)) {
      const updated = [...tags, tag];
      setTags(updated);
      addTag(tag);
    }
  };

  const handleRemoveTag = (tag: string) => {
    const updated = tags.filter((t) => t !== tag);
    setTags(updated);
    removeTag(tag);
  };

  return (
    <View>
      {/* TRIGGER */}
      <Pressable style={styles.trigger} onPress={() => setModalVisible(true)}>
        <Text style={styles.triggerText}>Tags</Text>

        <View style={styles.right}>
          <Text style={styles.count}>{tags.length}</Text>
          <Text style={styles.arrow}>›</Text>
        </View>
      </Pressable>

      {/* MODAL */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modal}>
          {/* SEARCH */}
          <TextInput
            style={styles.input}
            placeholder="Search tags..."
            value={query}
            onChangeText={setQuery}
          />

          {tags.length > 0 && (
            <View style={styles.selectedBox}>
              {tags.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>

                  <Pressable onPress={() => handleRemoveTag(tag)}>
                    <Text style={styles.remove}>×</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          )}

          {/* LIST */}
          <FlatList
            data={filtered}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Pressable style={styles.item} onPress={() => handleAddTag(item)}>
                <Text>{item}</Text>
              </Pressable>
            )}
          />

          {/* CLOSE */}
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
    backgroundColor: "#D9D9D9",
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

  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  count: {
    fontSize: 14,
    color: "#555",
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

  selectedBox: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },

  tag: {
    flexDirection: "row",
    backgroundColor: "#E6E6E6",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    alignItems: "center",
  },

  tagText: {
    marginRight: 6,
    color: "#333",
  },

  remove: {
    fontSize: 16,
    color: "#666",
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
