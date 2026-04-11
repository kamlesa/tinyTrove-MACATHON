import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator,} from "react-native";
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
          treasure_tag (
            name
          )
        )
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
        <ActivityIndicator size="large" color="#7EA8D9" />
      </View>
    );
  }

  if (!postData) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error || "Post not found."}</Text>
      </View>
    );
  }

  const tagItems =
    postData?.post_tags
      ?.map((item) => item.treasure_tag?.name)
      .filter(Boolean) || [];

  const displayName = post?.profiles?.display_name || post?.display_name || "Name not available";
  const avatarUrl = post?.profiles?.avatar_url || post?.avatar_url || null;

  return (
    <View style={styles.page}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.userRow}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder} />
          )}
          <Text style={styles.userName}>{displayName}</Text>
        </View>

        {postData.photo_url ? (
          <View style={styles.photoFrame}>
            <Image source={{ uri: postData.photo_url }} style={styles.photo} />
          </View>
        ) : (
          <View style={styles.photoPlaceholder}>
            <Text style={styles.photoPlaceholderText}>No image available</Text>
          </View>
        )}

        <Text style={styles.caption}>
          {postData.caption || "Post description not available."}
        </Text>

        <View style={styles.storeCard}>
          <View style={styles.storeIconWrap}>
            <Text style={styles.storeIcon}>📍</Text>
          </View>

          <View style={styles.storeTextWrap}>
            <Text style={styles.storeName}>
              {postData.stores?.name || "Shop name"}
            </Text>

            {postData.stores?.address ? (
              <Text style={styles.storeAddress}>{postData.stores.address}</Text>
            ) : null}
          </View>
        </View>

        <View style={styles.tagsRow}>
          {tagItems.length > 0 ? (
            tagItems.map((tag) => (
              <View key={tag} style={styles.tagChip}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))
          ) : (
            <>
              <View style={styles.tagChip}>
                <Text style={styles.tagText}>Kuromi</Text>
              </View>
              <View style={styles.tagChip}>
                <Text style={styles.tagText}>Sanrio</Text>
              </View>
              <View style={styles.tagChip}>
                <Text style={styles.tagText}>Tag 1</Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#FFE6C9",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 18,
    paddingBottom: 28,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFE6C9",
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#ddd",
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f8d09e",
  },
  userName: {
    marginLeft: 10,
    fontSize: 22,
    color: "#2A211D",
  },
  photoFrame: {
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#8C5A3C",
    marginBottom: 16,
    
  },
  photo: {
    width: "100%",
    height: 320,
    resizeMode: "cover",
  },
  photoPlaceholder: {
    width: "100%",
    height: 320,
    borderRadius: 10,
    backgroundColor: "#f8d09e",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderColor: "#8C5A3C",
    borderWidth: 3,
  },
  photoPlaceholderText: {
    color: "#735635",
    fontSize: 16,
  },
  caption: {
    fontSize: 18,
    lineHeight: 30,
    color: "#1F1A17",
    marginBottom: 14,
  },
  storeBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFD09A",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 0,
    marginBottom: 14,
  },
  storeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFD09A",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 14,
    borderWidth: 1,
  },

  storeIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F4EAE0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  storeText: {
    fontSize: 16,
    color: "#2A211D",
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tagChip: {
    backgroundColor: "#7EA8D9",
    paddingHorizontal: 20,
    paddingVertical: 2,
    borderRadius: 20,
    height: 30,
    justifyContent: "center",
  },
  tagText: {
    color: "#fff",
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    color: "#B00020",
    textAlign: "center",
    paddingHorizontal: 20,
  },
});


// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Pressable,
//   Image,
//   ScrollView,
//   ActivityIndicator,
// } from "react-native";
// import { supabase } from "../lib/supabase";

// export default function PostDetail({ post, onBack }) {
//   const [postData, setPostData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (post?.id) {
//       fetchPost();
//     } else {
//       setPostData(null);
//       setLoading(false);
//     }
//   }, [post]);

//   const fetchPost = async () => {
//     setLoading(true);
//     setError(null);

//     const { data, error } = await supabase
//       .from("posts")
//       .select(`
//         id,
//         caption,
//         location,
//         photo_url,
//         stores ( name, address )
//       `)
//       .eq("id", post.id)
//       .single();

//     if (error) {
//       console.error("Post detail fetch error", error);
//       setError(error.message);
//       setPostData(null);
//     } else {
//       setPostData(data);
//     }
//     setLoading(false);
//   };

//   if (loading) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color="#FF8FAB" />
//       </View>
//     );
//   }

//   if (!postData) {
//     return (
//       <View style={styles.container}>
//         <View style={styles.header}>
//           <Pressable onPress={onBack} style={styles.backButton}>
//             <Text style={styles.backButtonText}>← Back</Text>
//           </Pressable>
//         </View>
//         <View style={styles.content}>
//           <Text style={styles.errorText}>{error || "Post not found."}</Text>
//         </View>
//       </View>
//     );
//   }
  
//   const tagItems = postData?.post_tags?.map(item => item.treasure_tag?.name).filter(Boolean) || [];

//   return (
//     <View style={styles.container}>


//       <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
//         <Text style={styles.title}>Post Details</Text>

//         {postData.photo_url ? (
//           <Image source={{ uri: postData.photo_url }} style={styles.photo} />
//         ) : (
//           <View style={styles.photoPlaceholder}>
//             <Text style={styles.photoPlaceholderText}>No image available</Text>
//           </View>
//         )}

//         <View style={styles.section}>
//           <Text style={styles.sectionLabel}>Caption</Text>
//           <Text style={styles.sectionText}>{postData.caption || 'No caption provided.'}</Text>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.sectionLabel}>Location</Text>
//           <Text style={styles.sectionText}>{postData.location || 'No location provided.'}</Text>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.sectionLabel}>Store</Text>
//           <Text style={styles.sectionText}>{postData.stores?.name || 'Unknown store'}</Text>
//           {postData.stores?.address ? (
//             <Text style={styles.sectionSubText}>{postData.stores.address}</Text>
//           ) : null}
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.sectionLabel}>Tags</Text>
//           <View style={styles.tagsRow}>
//             {tagItems.length > 0 ? (
//               tagItems.map((tag) => (
//                 <View key={tag} style={styles.tagChip}>
//                   <Text style={styles.tagText}>{tag}</Text>
//                 </View>
//               ))
//             ) : (
//               <Text style={styles.sectionText}>No tags available.</Text>
//             )}
//           </View>
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fffbf5',
//   },
//   centered: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fffbf5',
//   },
//   header: {
//     paddingTop: 50,
//     paddingHorizontal: 16,
//     backgroundColor: 'rgba(255, 255, 255, 0.95)',
//   },
//   backButton: {
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     backgroundColor: '#FF8FAB',
//     borderRadius: 20,
//     alignSelf: 'flex-start',
//   },
//   backButtonText: {
//     color: '#fff',
//     fontWeight: '600',
//   },
//   content: {
//     flex: 1,
//   },
//   scrollContent: {
//     padding: 16,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: '700',
//     color: '#2e1d14',
//     marginBottom: 18,
//   },
//   photo: {
//     width: '100%',
//     height: 220,
//     borderRadius: 16,
//     marginBottom: 18,
//   },
//   photoPlaceholder: {
//     width: '100%',
//     height: 220,
//     borderRadius: 16,
//     backgroundColor: '#f3e6dd',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 18,
//   },
//   photoPlaceholderText: {
//     color: '#a28778',
//     fontSize: 16,
//   },
//   section: {
//     marginBottom: 18,
//   },
//   sectionLabel: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: '#2e1d14',
//     marginBottom: 8,
//   },
//   sectionText: {
//     fontSize: 16,
//     color: '#5e4a53',
//     lineHeight: 24,
//   },
//   sectionSubText: {
//     fontSize: 14,
//     color: '#6e5a68',
//     marginTop: 4,
//   },
//   tagsRow: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//   },
//   tagChip: {
//     backgroundColor: '#FFE8EE',
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 16,
//     marginRight: 8,
//     marginBottom: 8,
//   },
//   tagText: {
//     fontSize: 14,
//     color: '#D9417D',
//     fontWeight: '600',
//   },
//   errorText: {
//     fontSize: 16,
//     color: '#b00020',
//     margin: 20,
//     textAlign: 'center',
//   },
// });