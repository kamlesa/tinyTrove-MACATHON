import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  FlatList,
} from "react-native";
import Button from "../components/button";
import { supabase } from "../lib/supabase";

export default function CommunityDetail({ community, onBack, onTreasureSelect, onPostSelect }) {
  const [treasures, setTreasures] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (community?.id) {
      fetchCommunityContent();
    }
  }, [community]);

  async function fetchCommunityContent() {
    const communityId = community.id.replace(/^community-/, "");
    console.log(community);

    try {
      const { data: communityTreasures, error: communityTreasuresError } = await supabase
        .from("community_treasures")
        .select("treasure_id")
        .eq("community_id", communityId);

      if (communityTreasuresError) throw communityTreasuresError;

      const treasureIds = (communityTreasures || []).map((row) => row.treasure_id);
      if (treasureIds.length > 0) {
        const { data: treasureData, error: treasureError } = await supabase
          .from("treasure_tag")
          .select("id,name,descriptor,photo")
          .in("id", treasureIds);

        if (treasureError) throw treasureError;
        setTreasures(treasureData || []);

        const { data: postTags, error: postTagsError } = await supabase
          .from("post_tags")
          .select("post_id")
          .in("tag_id", treasureIds);

        if (postTagsError) throw postTagsError;

        const postIds = Array.from(new Set((postTags || []).map((row) => row.post_id)));
        if (postIds.length > 0) {
          const { data: postsData, error: postsError } = await supabase
            .from("posts")
            .select("id,photo_url")
            .in("id", postIds);

          if (postsError) throw postsError;
          setPosts(postsData || []);
        } else {
          setPosts([]);
        }
      } else {
        setTreasures([]);
        setPosts([]);
      }
    } catch (error) {
      console.error("Error fetching community treasures/posts:", error);
      setTreasures([]);
      setPosts([]);
    }
  }

  if (!community) return null;
  console.log(community.photo)
  const photo_url = community.photo ?? "";
  const banner_url = community.banner_url ?? "";
  const title = community.name ?? "Community Name";
  const members = community.number_of_members ?? "0";

  const treasureItems = treasures.map((item) => ({
    id: `treasure-${item.id}`,
    source: { uri: item.photo || "https://via.placeholder.com/80" },
    onClick: () => onTreasureSelect?.({
      ...item,
      id: `treasure-${item.id}`,
      photo: item.photo,
      descriptor: item.descriptor,
    }),
  }));

  const postImages = posts.map((item) => ({
    id: item.id,
    source: { uri: item.photo_url || "https://via.placeholder.com/100" },
    onClick: () => onPostSelect?.(item),
  }));

  const headerComponent = (
    <>
      <View style={styles.topSection}>
        <View style={styles.frame}>
<Image
  source={{ uri: banner_url }}
  style={styles.banner_url}
  resizeMode="cover"
/>

        </View>

        <View style={styles.profileSection}>
<Image
  source={{ uri: photo_url }}
  style={styles.photo_url}
  resizeMode="cover"
/>
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
            {treasureItems.map((item) => (
              <Pressable key={item.id} onPress={item.onClick} style={styles.treasureItem}>
                <Image source={item.source} style={styles.treasureImage} resizeMode="cover" />
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Community Treasure Posts</Text>
      </View>
    </>
  );

  return (
    <FlatList
      data={postImages}
      keyExtractor={(item) => item.id}
      numColumns={3}
      renderItem={({ item }) => (
        <Pressable style={styles.gridItem} onPress={item.onClick}>
          <Image source={item.source} style={styles.gridImage} />
        </Pressable>
      )}
      ListHeaderComponent={headerComponent}
      ListEmptyComponent={
        <Text style={styles.emptyText}>No posts yet!</Text>
      }
      contentContainerStyle={styles.gridContainer}
      style={styles.page}
    />
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
  banner_url: {
    width: "100%",
    height: "100%",
  },
  profileSection: {
    marginTop: -50,
    paddingHorizontal: 20,
  },
  photo_url: {
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
  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: "#FFF8F0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  gridItem: {
    flex: 1 / 3,
    aspectRatio: 1,
    padding: 1,
  },
  gridImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  gridContainer: {
    padding: 10,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    color: "#999",
  },
});