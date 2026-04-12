import { supabase } from "../UserAuth.js";

export const createPost = async (req, res) => {
  try {
    // 1. Extract the incoming data
    const { userId, image, description, location, tags } = req.body;

    // 2. Safety check: make sure we have a user ID before proceeding
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // 3. Insert into the database
    const { data: postData, error: postError } = await supabase
      .from("posts")
      .insert([
        {
          user_id: userId, // Corrected: Links the post to the user
          photo_url: image,
          caption: description,
          treasure_tag: tags,
          location: location,
        },
      ])
      .select();

    // 4. Check for database errors specific to THIS query
    if (postError) {
      console.error("Database Error:", postError);
      return res.status(400).json({ error: postError.message });
    }

    console.log("Successfully made post");

    // 5. Send the newly created post data back to the app
    res.status(201).json(postData);

  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ error: err.message });
  }
};
export const createCommunity = async (req, res) => {
  try {
    // 1. Extract the incoming data
    const { 
      userId, 
      name, 
      description, 
      photo_url, 
      banner_url, 
      tags, 
      theme_color 
    } = req.body;

    // 2. Safety check: need an ID and a Name
    if (!userId || !name) {
      return res.status(400).json({ error: "User ID and Community Name are required" });
    }

    // 3. STEP ONE: Create the Community (with safe null fallbacks)
    const { data: communityData, error: communityError } = await supabase
      .from("communities")
      .insert([
        {
          creator_id: userId,
          name: name,
          description: description || null,
          photo_url: photo_url || null,
          banner_url: banner_url || null,
          tags: tags && tags.length > 0 ? tags : null,
          theme_color: theme_color || null,
          number_of_members: 1 // Start at 1 because the creator is about to join!
        },
      ])
      .select();

    // Check if community creation failed
    if (communityError) {
      console.error("Database Error (Community):", communityError);
      return res.status(400).json({ error: communityError.message });
    }

    const newCommunity = communityData[0];

    // 4. STEP TWO: Auto-Join the Creator
    // We use the ID of the community we just created above!
    const { error: memberError } = await supabase
      .from("community_members")
      .insert([
        {
          community_id: newCommunity.id,
          user_id: userId,
          // 'joined_at' will be set automatically by Supabase defaults
        }
      ]);

    if (memberError) {
      // We log this, but we don't crash the server because the community WAS created successfully.
      console.error("Failed to auto-join creator to community:", memberError);
    } else {
      console.log(`Successfully created '${name}' and added creator!`);
    }

    // 5. Send the new community back to the mobile app
    res.status(201).json(newCommunity);

  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// postController.js

export const createTag = async (req, res) => {
  try {
    // 1. Added communityId to the extraction
    const { userId, name, description, photo_url, communityId } = req.body;

    if (!userId || !name || !communityId) {
      return res.status(400).json({ error: "User ID, Name, and Community ID are required" });
    }

    // 2. Create the Tag in the master list
    const { data: tagData, error: tagError } = await supabase
      .from("treasure_tag") 
      .insert([{ name, descriptor: description || null, photo: photo_url || null }])
      .select();

    if (tagError) return res.status(400).json({ error: tagError.message });

    const newTagId = tagData[0].id;

    // 3. CRITICAL: Link this tag to the specific community
    const { error: linkError } = await supabase
      .from("community_treasures")
      .insert([{ 
        community_id: communityId.replace(/^community-/, ""), // Ensure clean ID
        treasure_id: newTagId 
      }]);

    if (linkError) {
      console.error("Failed to link tag to community:", linkError);
    }

    res.status(201).json(tagData[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
