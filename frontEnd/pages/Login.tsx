import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Login() {
  return (
    <View style={styles.page}>
      <View style={styles.center}>
        <Text style={styles.title}>Login Page Page</Text>
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
