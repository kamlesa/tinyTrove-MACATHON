import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { supabase } from "../lib/supabase";

export default function PostDetail({ post, onBack }) {
  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (post?.id) {
      fetchPost();
    } else {
      setPostData(null);
      setLoading(false);
    }
  }, [post]);

  const fetchPost = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("posts")
      .select(`
        id,
        caption,
        location,
        photo_url,
        stores ( name, address ),
        post_tags ( 
          treasure_tag ( name ) 
        ) // Junction link (multiple)
      `)
      .eq("id", post.id)
      .single();

    if (error) {
      console.error("Post detail fetch error", error);
      setError(error.message);
      setPostData(null);
    } else {
      setPostData(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF8FAB" />
      </View>
    );
  }

  if (!postData) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </Pressable>
        </View>
        <View style={styles.content}>
          <Text style={styles.errorText}>{error || "Post not found."}</Text>
        </View>
      </View>
    );
  }

  const tagItems = postData?.post_tags?.map(item => item.treasure_tag?.name).filter(Boolean) || [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Post Details</Text>

        {postData.photo_url ? (
          <Image source={{ uri: postData.photo_url }} style={styles.photo} />
        ) : (
          <View style={styles.photoPlaceholder}>
            <Text style={styles.photoPlaceholderText}>No image available</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Caption</Text>
          <Text style={styles.sectionText}>{postData.caption || 'No caption provided.'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Location</Text>
          <Text style={styles.sectionText}>{postData.location || 'No location provided.'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Store</Text>
          <Text style={styles.sectionText}>{postData.stores?.name || 'Unknown store'}</Text>
          {postData.stores?.address ? (
            <Text style={styles.sectionSubText}>{postData.stores.address}</Text>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Tags</Text>
          <View style={styles.tagsRow}>
            {tagItems.length > 0 ? (
              tagItems.map((tag) => (
                <View key={tag} style={styles.tagChip}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.sectionText}>No tags available.</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffbf5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fffbf5',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FF8FAB',
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2e1d14',
    marginBottom: 18,
  },
  photo: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    marginBottom: 18,
  },
  photoPlaceholder: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    backgroundColor: '#f3e6dd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  photoPlaceholderText: {
    color: '#a28778',
    fontSize: 16,
  },
  section: {
    marginBottom: 18,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2e1d14',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 16,
    color: '#5e4a53',
    lineHeight: 24,
  },
  sectionSubText: {
    fontSize: 14,
    color: '#6e5a68',
    marginTop: 4,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagChip: {
    backgroundColor: '#FFE8EE',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: '#D9417D',
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: '#b00020',
    margin: 20,
    textAlign: 'center',
  },
});