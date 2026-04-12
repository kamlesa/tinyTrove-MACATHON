import { supabase } from "../UserAuth.js";

export const createPost = async (req, res) => {
  try {
    // 1. Extract the incoming data
    const { userId, image, description, location, tags } = req.body;

    // 2. Safety check: make sure we have a user ID before proceeding
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    if (!tags || tags.length === 0) {
      return res.status(400).json({ error: "At least one tag is required" });
    }

    if (!location) {
      return res.status(400).json({ error: "Location is required" });
    }

    console.log(req.body);
    // 3. Insert into the database
    const { data: postData, error: postError } = await supabase
      .from("posts")
      .insert([
        {
          user_id: userId, // Corrected: Links the post to the user
          photo_url: image,
          caption: description,
          location: location,
        },
      ])
      .select();

    // 4. Check for database errors specific to THIS query
    if (postError) {
      console.error("Database Error:", postError);
      return res.status(400).json({ error: postError.message });
    }

    console.log("tagss", tags);
    if (tags?.length) {
      const tagRows = tags.map(
        (tag) => (
          console.log("postdata", postData[0].id),
          console.log("tag", tag.id),
          {
            post_id: postData[0].id,
            tag_id: tag.id,
          }
        )
      );

      const { error: tagError } = await supabase
        .from("post_tags")
        .insert(tagRows);

      if (tagError) throw tagError;
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

export const createTag = async (req, res) => {
  try {
    // 1. Extract the incoming data
    const { 
      userId, 
      name, 
      description, 
      photo_url 
    } = req.body;

    // 2. Safety check: need an ID and a Name
    if (!userId || !name) {
      return res.status(400).json({ error: "User ID and Tag Name are required" });
    }

    // 3. STEP ONE: Insert into 'treasure_tag' table
    // Note: Column names changed to match your schema (descriptor/photo)
    const { data: tagData, error: tagError } = await supabase
      .from("treasure_tag") 
      .insert([
        {
          name: name,
          descriptor: description || null, // Matches 'descriptor' in your schema
          photo: photo_url || null,       // Matches 'photo' in your schema
          // If you have a 'creator_id' column, add it here:
          // creator_id: userId 
        },
      ])
      .select();

    // 4. Check for database errors
    if (tagError) {
      console.error("Database Error (Treasure Tag):", tagError);
      return res.status(400).json({ error: tagError.message });
    }

    console.log(`Successfully created tag: ${name}`);

    // 5. Send the newly created tag data back to the app
    // We return tagData[0] because .insert().select() returns an array
    res.status(201).json(tagData[0]);

  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ error: err.message });
  }
};