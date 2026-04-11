import React from "react";
import { View, Text, StyleSheet, Image, ImageSourcePropType,} from "react-native";
import Button from "../components/button";
import ImageGrid from "../components/imageGrid";

interface PostImages {
  id: string;
  source: ImageSourcePropType;
  onClick?: () => void;
}

interface TreasureProps {
  characterImageSource?: ImageSourcePropType;
  groupImageSource?: ImageSourcePropType;
  Title?: string;
  Description?: string;
  Group?: string;
  images?: PostImages[];
}

export default function Treasure({images = [
          { id: "1", source: require("./Image1.png") },
          { id: "2", source: require("./Image1.png") },
          { id: "3", source: require("./Image1.png") },
          { id: "4", source: require("./Image1.png") },
          { id: "5", source: require("./Image1.png") },
          { id: "6", source: require("./Image1.png") },
        ], characterImageSource= require("./Image1.png"), groupImageSource = require("./Image1.png"), Title = "Title", Description = "Description", Group = "group",}: TreasureProps) {
  
  return (
    <View style={styles.page}>

      <View style={styles.topBar}>

        <Image source={groupImageSource} style={styles.groupImage} />
        <Text style={styles.title}>{Group}</Text>
      </View>

      <View style={styles.profile}>
        <Image source={characterImageSource} style={styles.image} />

        <View style={styles.textBox}>
          <Text style={styles.name}>{Title}</Text>
          <Text style={styles.description}>{Description}</Text>
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
    height: "9%",
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 0,
    paddingLeft: 10,
    paddingRight: 0,
    backgroundColor: "#FFF0C9",
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