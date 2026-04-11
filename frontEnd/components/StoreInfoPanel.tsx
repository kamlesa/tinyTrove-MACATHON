import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";

//todo: get real info
const tempImage1 = require("./profile_temp.png");
const tempImage2 = require("./gridimage_temp.jpg");

const samplePhotos = [
  { id: "1", uri: tempImage1, caption: "Kuromi" },
  { id: "2", uri: tempImage2, caption: "My Melody" },
  { id: "3", uri: tempImage1, caption: "Pom Purin" },
  { id: "4", uri: tempImage2, caption: "Baby Yoda" },
];

const gridPhotos = [
  { id: "1", uri: tempImage1 },
  { id: "2", uri: tempImage2 },
  { id: "3", uri: tempImage1 },
  { id: "4", uri: tempImage2 },
  { id: "5", uri: tempImage1 },
  { id: "6", uri: tempImage2 },
];

interface StoreInfoPanelProps {
  location: {
    id: string;
    title: string;
    address: string;
  };
  onClose?: () => void;
}

export default function StoreInfoPanel({ location, onClose }: StoreInfoPanelProps) {
  const screenWidth = Dimensions.get("window").width;
  const gridItemWidth = (screenWidth - 30) / 2;

  const renderPhotoCarousel = ({ item }) => (
    <View style={styles.carouselItem}>
      <Image source={item.uri} style={styles.carouselImage} />
      <Text style={styles.carouselCaption}>{item.caption}</Text>
    </View>
  );

  const renderGridPhoto = ({ item }) => (
    <Image
      source={item.uri}
      style={[styles.gridImage, { width: gridItemWidth, height: gridItemWidth }]}
    />
  );

  return (
    <View style={styles.panel}>
      <ScrollView showsVerticalScrollIndicator={true} style={styles.scrollContent}>
        {/* Header with Name and Address */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.storeName}>{location.title}</Text>
            {onClose && (
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.storeAddress}>{location.address}</Text>
        </View>

        {/* Horizontal Scrollable Photos */}
        <View style={styles.carouselSection}>
          <Text style={styles.sectionTitle}>Treasures</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.carousel}
          >
            {samplePhotos.map((photo) => (
              <View key={photo.id}>{renderPhotoCarousel({ item: photo })}</View>
            ))}
          </ScrollView>
        </View>

        {/* Grid of Photos */}
        <View style={styles.gridSection}>
          <Text style={styles.sectionTitle}>Posts</Text>
          <FlatList
            scrollEnabled={false}
            data={gridPhotos}
            renderItem={renderGridPhoto}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.gridRow}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: "65%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    marginBottom: 15,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  storeName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2e1d14",
    marginBottom: 5,
    flex: 1,
  },
  closeBtn: {
    padding: 8,
    marginLeft: 10,
  },
  closeBtnText: {
    fontSize: 20,
    color: "#999",
    fontWeight: "300",
  },
  storeAddress: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  carouselSection: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3d2b1f",
    marginBottom: 10,
  },
  carousel: {
    flexDirection: "row",
  },
  carouselItem: {
    marginRight: 12,
    alignItems: "center",
  },
  carouselImage: {
    width: 90,
    height: 90,
    borderRadius: 8,
  },
  carouselCaption: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
    textAlign: "center",
    width: 90,
  },
  gridSection: {
    marginBottom: 10,
  },
  gridRow: {
    justifyContent: "space-between",
    marginBottom: 10,
  },
  gridImage: {
    borderRadius: 8,
  },
});
