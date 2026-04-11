import { supabase } from "../UserAuth.js";

export const createPost = async (req, res) => {
  try {
    const { userId, image, description, location, tags } = req.body;
    console.log(userId);
    console.log(req.body);
    if (authData.user) {
      const { data: postData, error: postError } = await supabase
        .from("posts")
        .insert([
          {
            id: authData.user.id,
            photo_url: image,
            caption: description,
            treasure_tag: tags,
            location: location,
          },
        ])
        .select();

      console.log("made post");

      if (profileError) {
        return res.status(400).json({ error: profileError.message });
      }
    }

    res.json({ user: data.user, session: data.session });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
