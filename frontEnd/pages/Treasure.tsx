import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Footer from "../Components/footer";
import Button from "../Components/button";
import ImageGrid from "../Components/imageGrid";

export default function Home() {
  return (
    <View style={styles.page}>
      <View style={styles.topBar}>
        <Image source={require("./Image1.png")} />
        <Text style={styles.title}>Kuromi</Text>
      </View>

        
    <View style={styles.profile}>
      <Image source={require("./Image1.png")} style={styles.image} />

      <View style={styles.textBox}>
        <Text style={styles.name}>Kuromi</Text>
        <Text style={styles.description}>
          Kuromi is a mischievous bunny blah blah
        </Text>


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
      <ImageGrid
        images={[
          { id: "1", source: require("./Image1.png"), onClick: () =>{}},
          { id: "2", source: require("./Image1.png"), onClick: () =>{}},
          { id: "3", source: require("./Image1.png"), onClick: () =>{}},
          { id: "4", source: require("./Image1.png"), onClick: () =>{}},
          { id: "5", source: require("./Image1.png"), onClick: () =>{}},
          { id: "6", source: require("./Image1.png"), onClick: () =>{}},
        ]}
      />
    </View>

    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#FFF8F0",
  },
  title: {
    fontSize: 20,
    marginLeft: 10,
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
  middle: {
    alignItems: "center",
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

  }
});