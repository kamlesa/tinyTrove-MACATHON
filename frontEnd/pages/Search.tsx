import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, FlatList, TextInput } from "react-native";

const results = [
  {
    id: "treasure-1",
    type: "treasure",
    name: "Moonlight Gem",
    community: "Kawaii Collectors",
    icon: "💎",
  },
  {
    id: "community-1",
    type: "community",
    name: "Sanrio Squad",
    members: 100,
    treasures: 20,
    icon: "🌸",
  },
  {
    id: "store-1",
    type: "store",
    name: "Kuromi Store",
    address: "407 Bourke Street",
    icon: "🏪",
  },
];

const filterOptions = [
  { key: "all", label: "All" },
  { key: "treasure", label: "Treasure" },
  { key: "community", label: "Community" },
  { key: "store", label: "Store" },
];

export function Search() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredResults = results
    .filter((item) => activeFilter === "all" || item.type === activeFilter)
    .filter((item) => {
      const query = searchQuery.trim().toLowerCase();
      if (!query) return true;
      return (
        item.name.toLowerCase().includes(query) ||
        item.community?.toLowerCase().includes(query) ||
        item.address?.toLowerCase().includes(query)
      );
    });

  const getTypeStyles = (type) => {
    switch (type) {
      case "treasure":
        return {
          card: styles.treasureCard,
          iconCircle: styles.treasureIcon,
          iconText: styles.treasureIconText,
        };
      case "community":
        return {
          card: styles.communityCard,
          iconCircle: styles.communityIcon,
          iconText: styles.communityIconText,
        };
      case "store":
      default:
        return {
          card: styles.storeCard,
          iconCircle: styles.storeIcon,
          iconText: styles.storeIconText,
        };
    }
  };

  const renderResult = ({ item }) => {
    const typeStyles = getTypeStyles(item.type);
    return (
      <View style={[styles.resultCard, typeStyles.card]}>
        <View style={[styles.iconCircle, typeStyles.iconCircle]}>
          <Text style={[styles.iconText, typeStyles.iconText]}>{item.icon}</Text>
        </View>
        <View style={styles.resultText}>
          <Text style={styles.resultName}>{item.name}</Text>
          {item.type === "treasure" && (
            <Text style={styles.resultMeta}>Community: {item.community}</Text>
          )}
          {item.type === "community" && (
            <Text style={styles.resultMeta}>
              {item.members} members · {item.treasures} treasures
            </Text>
          )}
          {item.type === "store" && (
            <Text style={styles.resultMeta}>{item.address}</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.page}>
      <Text style={styles.headerTitle}>Search</Text>

      <TextInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search treasures, communities, stores"
        placeholderTextColor="#aaa"
        style={styles.searchInput}
      />

      <View style={styles.filterRow}>
        {filterOptions.map((option) => (
          <Pressable
            key={option.key}
            style={[
              styles.filterButton,
              activeFilter === option.key && styles.filterButtonActive,
            ]}
            onPress={() => setActiveFilter(option.key)}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === option.key && styles.filterTextActive,
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filteredResults}
        keyExtractor={(item) => item.id}
        renderItem={renderResult}
        contentContainerStyle={styles.resultsList}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No results found.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#fffbf5",
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2e1d14",
    marginBottom: 16,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e5c4d6",
    backgroundColor: "#fff",
  },
  filterButtonActive: {
    backgroundColor: "#ffdaec",
    borderColor: "#ff8fab",
  },
  filterText: {
    color: "#7a6b78",
    fontWeight: "600",
  },
  filterTextActive: {
    color: "#d9417d",
  },
  resultsList: {
    paddingBottom: 40,
  },
  resultCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 3,
  },
  resultText: {
    flex: 1,
  },
  resultName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#231f20",
    marginBottom: 6,
  },
  searchInput: {
    height: 48,
    borderRadius: 16,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e8d8d0",
    marginBottom: 16,
    color: "#2e1d14",
  },

  treasureCard: {
    backgroundColor: "#FFF8F0",
    borderLeftWidth: 4,
    borderLeftColor: "#ff8fab",
  },
  communityCard: {
    backgroundColor: "#E8F2FF",
    borderLeftWidth: 4,
    borderLeftColor: "#71A5D3",
  },
  storeCard: {
    backgroundColor: "#F5E5D8",
    borderLeftWidth: 4,
    borderLeftColor: "#A47552",
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  treasureIcon: {
    backgroundColor: "#FFE8EE",
  },
  communityIcon: {
    backgroundColor: "#DCE8F8",
  },
  storeIcon: {
    backgroundColor: "#E8D4C1",
  },
  iconText: {
    fontSize: 24,
  },
  treasureIconText: {
    color: "#D9417D",
  },
  communityIconText: {
    color: "#2B5B8A",
  },
  storeIconText: {
    color: "#7A4C2A",
  },
  resultMeta: {
    fontSize: 14,
    color: "#6e5a68",
  },
  emptyText: {
    marginTop: 30,
    textAlign: "center",
    color: "#7a6b78",
    fontSize: 16,
  },
});
