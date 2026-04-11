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

    // Fetch User's Posts with linked Store and Tag data
    const { data: postsData, error: postsError } = await supabase
      .from('posts')
      .select(`
        *,
        stores ( name, address ),
        treasure_tag ( name )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (postsError) {
      return res.status(404).json({ error: postsError.message });
    }

    res.json(postsData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserCommunities = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch communities the user is a member of AND get the total member count for each
    const { data: membershipData, error: membershipError } = await supabase
      .from('community_members')
      .select(`
        communities (
          *,
          member_count:community_members(count)
        )
      `)
      .eq('user_id', userId);

    if (membershipError) {
      return res.status(404).json({ error: membershipError.message });
    }

    // Flatten the data and safely extract the count number
    const communitiesData = membershipData.map(membership => {
      const community = membership.communities;
      
      return {
        ...community,
        // Supabase returns count as [{ count: X }]. This extracts just the number X!
        member_count: community.member_count?.[0]?.count || 0 
      };
    });

    res.json(communitiesData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};