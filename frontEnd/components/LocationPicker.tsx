import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  TextInput,
  FlatList,
  StyleSheet,
} from "react-native";
import { supabase } from "../lib/supabase";

interface LocationPickerProps {
  chooseLocation: (location: string) => void;
}

export interface LocationProps {
  id: string;
  name: string;
  address: string;
}

export default function LocationPicker({
  chooseLocation,
}: LocationPickerProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [location, setLocation] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [stores, setStores] = useState<LocationProps[]>([]);

  // Fetch stores from Supabase
  useEffect(() => {
    async function fetchStores() {
      const { data, error } = await supabase
        .from("stores")
        .select("id,name,address");

      if (error) {
        console.error("Error fetching stores:", error);
        return;
      }

      setStores(data || []);
    }

    fetchStores();
  }, []);

  async function geocodeAddress(address) {
    const response = await fetch(
      "https://maps.googleapis.com/maps/api/geocode/json?address=" +
        encodeURIComponent(address) +
        "&key=AIzaSyBhCrEsAMyzkWJMzVmMQKg5yhKidiIBleE"
    );
    const data = await response.json();
    if (data.results && data.results[0]) {
      return data.results[0].geometry.location;
    }
    return null;
  }

  async function getAddressFromCoords(lat: number, lng: number) {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=YOUR_API_KEY`
    );

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      return data.results[0].formatted_address;
    }

    return null;
  }

  // Filter results
  const filtered = stores.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View>
      {/* TRIGGER */}
      <Pressable style={styles.trigger} onPress={() => setModalVisible(true)}>
        <Text style={styles.triggerText}>
          {location ? location : "Add location"}
        </Text>
        <Text style={styles.arrow}>›</Text>
      </Pressable>

      {/* MODAL */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modal}>
          {/* SEARCH */}
          <TextInput
            style={styles.input}
            placeholder="Search location..."
            value={query}
            onChangeText={setQuery}
          />

          {/* 🔥 NO RESULTS BUTTON (UNDER SEARCH BAR) */}
          {query.trim().length > 0 && filtered.length === 0 && (
            <Pressable
              style={styles.addButton}
              onPress={async () => {
                try {
                  console.log("pressed");
                  // 1. Geocode query → lat/lng
                  const geo = await geocodeAddress(query);

                  if (!geo) {
                    throw new Error("Could not geocode location");
                  }

                  console.log(geo);
                  const lat = geo.lat;
                  const lng = geo.lng;

                  // 2. Reverse geocode → formatted address
                  const response = await fetch(
                    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyBhCrEsAMyzkWJMzVmMQKg5yhKidiIBleE`
                  );

                  const data = await response.json();

                  const formattedAddress =
                    data.results?.[0]?.formatted_address || query;

                  console.log(formattedAddress);

                  // 3. Insert into Supabase
                  const { data: inserted, error } = await supabase
                    .from("stores")
                    .insert([
                      {
                        name: query.replace(/\b\w/g, c => c.toUpperCase()),
                        address: formattedAddress,
                      },
                    ])
                    .select()
                    .single();

                  if (error) {
                    console.error("Insert error:", error);
                    return;
                  }

                  // 4. Update UI
                  chooseLocation(inserted.name);
                  setLocation(inserted.name);
                  setModalVisible(false);
                  setQuery("");

                  // 5. Optional: update local state instantly
                  setStores((prev) => [...prev, inserted]);
                } catch (err) {
                  console.error("Failed to add location:", err);

                  // fallback
                  chooseLocation(query);
                  setLocation(query);
                  setModalVisible(false);
                  setQuery("");
                }
              }}
            >
              <Text style={styles.addButtonText}>
                Location not in list? Add "{query.replace(/\b\w/g, c => c.toUpperCase())}"
              </Text>
            </Pressable>
          )}

          {/* LIST */}
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable
                style={styles.item}
                onPress={() => {
                  chooseLocation(item.name);
                  setLocation(item.name);
                  setModalVisible(false);
                  setQuery("");
                }}
              >
                <Text style={{ fontSize: 16 }}>{item.name}</Text>
                <Text style={{ color: "#666", fontSize: 12 }}>
                  {item.address}
                </Text>
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

  addButton: {
    marginBottom: 10,
    padding: 14,
    backgroundColor: "#4F8CFF",
    borderRadius: 10,
  },

  addButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
});
