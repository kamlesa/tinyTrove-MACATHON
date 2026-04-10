import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useUserAuthStore } from "./stores/useUserAuthStore";

export default function App() {
  const [count, setCount] = useState(0);

  const { addUser } = useUserAuthStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MACATHON 2026</Text>
      <Text style={styles.subtitle}>React + Expo Go starter app</Text>
      <Pressable
        style={styles.button}
        onPress={() => {
          setCount((value) => value + 1);
          addUser("data");
        }}
      >
        <Text style={styles.buttonText}>Tap me</Text>
      </Pressable>
      <Text style={styles.counter}>Tapped {count} times</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A101F",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#A3B3CC",
    marginBottom: 24,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#4F8CFF",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  counter: {
    color: "#E0E7FF",
    fontSize: 15,
  },
});
