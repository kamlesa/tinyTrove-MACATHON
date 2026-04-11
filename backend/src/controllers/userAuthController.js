import { supabase } from "../UserAuth.js";

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    res.json({ user: data.user, session: data.session });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const signUp = async (req, res) => {
  try {
    const { email, password, username, displayName } = req.body;

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    // Create profile
    if (authData.user) {
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: authData.user.id,
          username: username.toLowerCase(),
          display_name: displayName,
          avatar_url: "",
        },
      ]);

      if (profileError) {
        return res.status(400).json({ error: profileError.message });
      }
    }

    res.json({ user: authData.user, message: "Sign up successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const signOut = async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: "Signed out successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch Profile Info
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (profileError) {
      return res.status(404).json({ error: profileError.message });
    }

    res.json(profileData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch User's Posts
    const { data: postsData, error: postsError } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (postsError) {
      return res.status(404).json({ error: postsError.message });
    }

    res.json(postsData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createPost = async (req, res) => {
  try {
    const { userId, image, description, location, tags } = req.body;
    console.log(userId);
    console.log(req.body);
    console.log(authData);
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
