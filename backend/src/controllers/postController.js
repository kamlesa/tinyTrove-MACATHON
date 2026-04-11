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
