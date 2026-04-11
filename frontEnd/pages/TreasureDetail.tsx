import React from "react";
import { View, Text, StyleSheet, Image, ImageSourcePropType, ScrollView,} from "react-native";
import Button from "../components/button";
import ImageGrid from "../components/imageGrid";



export default function TreasureDetail({ treasure, onBack }) {
  if (!treasure) return null;

  const groupImageSource =
    treasure.groupImageSource ??
    (treasure.groupPhoto ? { uri: treasure.groupPhoto } : require("./Image1.png"));

  const characterImageSource =
    treasure.characterImageSource ??
    (treasure.photo ? { uri: treasure.photo } : require("./Image1.png"));

  const group = treasure.group ?? "group";
  const title = treasure.name ?? "Title";
  const description = treasure.description ?? "Description";

  const images =[
      { id: "1", source: require("./Image1.png") },
      { id: "2", source: require("./Image1.png") },
      { id: "3", source: require("./Image1.png") },
      { id: "4", source: require("./Image1.png") },
      { id: "5", source: require("./Image1.png") },
      { id: "6", source: require("./Image1.png") },
      { id: "0", source: require("./Image1.png") },
      { id: "7", source: require("./Image1.png") },
      { id: "8", source: require("./Image1.png") },
      { id: "9", source: require("./Image1.png") },
      { id: "88", source: require("./Image1.png") },
      { id: "99", source: require("./Image1.png") },
    ];

  return (
    <View style={styles.page}>
      <View style={styles.topBar}>
       
        <Image source={groupImageSource} style={styles.groupImage} />
        <Text style={styles.title}>{group}</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profile}>
          <Image source={characterImageSource} style={styles.image} />

          <View style={styles.textBox}>
            <Text style={styles.name}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>
        </View>

        <View style={styles.middle}>
          <View style={styles.buttons}>
            <Button widthSize="medium" heightSize="small" onClick={() => {}}>
              Find
            </Button>
            <Button widthSize="medium" heightSize="small" onClick={() => {}}>
              Filter
            </Button>
          </View>
        </View>

        <View style={styles.imageGrid}>
          <ImageGrid images={images} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#FFF8F0",
  },
  topBar: {
    width: "100%",
    minHeight: 70,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "#FFF0C9",
  },
  backButtonWrapper: {
    position: "absolute",
    top: 10,
    left: 12,
    zIndex: 100,
  },
  groupImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  title: {
    fontSize: 20,
    marginLeft: 10,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  profile: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 9,
    backgroundColor: "#FFF8F0",
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 12,
  },
  textBox: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontSize: 32,
    fontWeight: "600",
  },
  description: {
    fontSize: 16,
    marginTop: 4,
  },
  middle: {
    alignItems: "center",
  },
  buttons: {
    flexDirection: "row",
    marginTop: 9,
    gap: 30,
    backgroundColor: "#FFF8F0",
  },
  imageGrid: {
    paddingTop: 10,
    alignItems: "center",
    backgroundColor: "#FFF8F0",
  },
});