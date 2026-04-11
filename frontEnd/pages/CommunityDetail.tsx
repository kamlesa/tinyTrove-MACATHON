import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, Pressable } from "react-native";
import Button from "../components/button";
import ImageGrid from "../components/imageGrid";

export default function Community({ community, onBack }) {
  if (!community) return null;

  const profile = community.profile ?? require("./Image1.png");
  const background = community.background ?? require("./Image1.png");
  const title = community.title ?? "title";
  const members = community.members ?? "2999";

  const treasureImages = [
    { id: "1", source: require("./Image1.png"), onClick: () => {} },
    { id: "2", source: require("./Image1.png"), onClick: () => {} },
    { id: "3", source: require("./Image1.png"), onClick: () => {} },
    { id: "4", source: require("./Image1.png"), onClick: () => {} },
    { id: "5", source: require("./Image1.png"), onClick: () => {} },
    { id: "6", source: require("./Image1.png"), onClick: () => {} },
  ];

  const postImages = [
    { id: "1", source: require("./Image1.png"), onClick: () => {} },
    { id: "2", source: require("./Image1.png"), onClick: () => {} },
    { id: "3", source: require("./Image1.png"), onClick: () => {} },
    { id: "4", source: require("./Image1.png"), onClick: () => {} },
    { id: "5", source: require("./Image1.png"), onClick: () => {} },
    { id: "6", source: require("./Image1.png"), onClick: () => {} },
    { id: "7", source: require("./Image1.png"), onClick: () => {} },
    { id: "8", source: require("./Image1.png"), onClick: () => {} },
    { id: "9", source: require("./Image1.png"), onClick: () => {} },
    { id: "10", source: require("./Image1.png"), onClick: () => {} },
    { id: "11", source: require("./Image1.png"), onClick: () => {} },
    { id: "12", source: require("./Image1.png"), onClick: () => {} },
  ];

  return (
    <View style={styles.page}>
    <View style={styles.topSection}>
      <View style={styles.frame}>
        <Image source={background} style={styles.background} resizeMode="cover" />
      </View>

      <View style={styles.profileSection}>
        <Image source={profile} style={styles.profile} resizeMode="cover" />

        <View style={styles.infoContainer}>
          <View style={styles.titleText}>
            <Text style={styles.title}>{title}</Text>

            <View style={styles.memberBox}>
              <Text style={styles.members}>{members} members</Text>
              <Button widthSize="medium" heightSize="small" onClick={() => {}}>
                Join Club
              </Button>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.treasureContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.treasureList}
        >
          {treasureImages.map((item) => (
            <Pressable key={item.id} onPress={item.onClick} style={styles.treasureItem}>
              <Image source={item.source} style={styles.treasureImage} resizeMode="cover" />
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </View>

    <View style={styles.imageGrid}>
      <ImageGrid images={postImages} />
    </View>
  </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#FFF8F0",
  },
  topSection: {
    flexShrink: 0,
  },
  frame: {
    width: "100%",
    height: 140,
    overflow: "hidden",
  },
  background: {
    width: "100%",
    height: "100%",
  },
  backButtonWrapper: {
    position: "absolute",
    top: 10,
    left: 12,
    zIndex: 10,
  },
  profileSection: {
    marginTop: -50,
    paddingHorizontal: 20,
  },
  profile: {
    height: 100,
    aspectRatio: 1,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "#fff",
  },
  infoContainer: {
    marginTop: 5,
    backgroundColor: "#FFF8F0",
    paddingBottom: 0,
  },
  title: {
    fontSize: 40,
  },
  members: {
    fontSize: 20,
  },
  titleText: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  memberBox: {
    flexDirection: "column",
    alignItems: "center",
  },
  treasureContainer: {
    marginTop: 12,
    paddingVertical: 12,
    backgroundColor: "#FFD09A",
  },
  treasureList: {
    paddingHorizontal: 12,
    gap: 12,
    alignItems: "center",
  },
  treasureItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  treasureImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#fff",
  },
  imageGrid: {
    flex: 1,
    backgroundColor: "#FFF8F0",
  },
});