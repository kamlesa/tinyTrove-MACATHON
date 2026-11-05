const MAX_COMMENT_LENGTH = 500;
const CHECK_STATUSES = ["validated", "sold_out"];
const RECENT_DAYS = 7; // sold-out reports newer than this count as "recent"

// Embed this from `posts` to get what summarizeChecks needs
export const CHECKS_SELECT = "post_checks ( user_id, status, updated_at )";

// Turns a post's checks into what the app displays:
//   validation_count / sold_out_count - how many people currently say each
//   recent_sold_out_count - sold-out reports from the last RECENT_DAYS days
//   stock_status     - "validated" | "sold_out" | null, from the most recent check
//   stock_updated_at - when that most recent check happened
//   my_status        - the viewer's own check, if any
export const summarizeChecks = (checks = [], userId = null) => {
  const recentCutoff = new Date(Date.now() - RECENT_DAYS * 864e5).toISOString();
  let latest = null;
  let validationCount = 0;
  let soldOutCount = 0;
  let recentSoldOutCount = 0;
  let myStatus = null;

  for (const check of checks) {
    if (check.status === "validated") validationCount++;
    if (check.status === "sold_out") {
      soldOutCount++;
      if (check.updated_at > recentCutoff) recentSoldOutCount++;
    }
    if (userId && check.user_id === userId) myStatus = check.status;
    if (!latest || check.updated_at > latest.updated_at) latest = check;
  }

  return {
    validation_count: validationCount,
    sold_out_count: soldOutCount,
    recent_sold_out_count: recentSoldOutCount,
    stock_status: latest?.status ?? null,
    stock_updated_at: latest?.updated_at ?? null,
    my_status: myStatus,
  };
};

const getCheckSummary = async (db, postId, userId) => {
  const { data, error } = await db
    .from("post_checks")
    .select("user_id, status, updated_at")
    .eq("post_id", postId);
  if (error) throw error;
  return summarizeChecks(data, userId);
};

// --- CHECKS ---
// PUT { status: "validated" | "sold_out" }. Replaces the user's previous check on
// this post. Anyone can report sold out; only other people can validate.
export const setCheck = async (req, res) => {
  try {
    const { postId } = req.params;
    const { status } = req.body;

    if (!CHECK_STATUSES.includes(status)) {
      return res.status(400).json({ error: `status must be one of: ${CHECK_STATUSES.join(", ")}` });
    }

    const { data: post, error: postError } = await req.supabase
      .from("posts")
      .select("user_id")
      .eq("id", postId)
      .maybeSingle();

    if (postError) return res.status(400).json({ error: postError.message });
    if (!post) return res.status(404).json({ error: "Post not found" });
    if (status === "validated" && post.user_id === req.user.id) {
      return res.status(400).json({ error: "You can't validate your own post" });
    }

    const { error } = await req.supabase
      .from("post_checks")
      .upsert(
        [{ post_id: postId, user_id: req.user.id, status, updated_at: new Date().toISOString() }],
        { onConflict: "post_id,user_id" }
      );

    if (error) return res.status(400).json({ error: error.message });

    res.json(await getCheckSummary(req.supabase, postId, req.user.id));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const clearCheck = async (req, res) => {
  try {
    const { postId } = req.params;

    const { error } = await req.supabase
      .from("post_checks")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", req.user.id);

    if (error) return res.status(400).json({ error: error.message });

    res.json(await getCheckSummary(req.supabase, postId, req.user.id));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- COMMENTS ---
export const getComments = async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from("post_comments")
      .select("id, body, created_at, user_id, profiles ( username, display_name, avatar_url )")
      .eq("post_id", req.params.postId)
      .order("created_at", { ascending: true });

    if (error) return res.status(400).json({ error: error.message });

    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const body = String(req.body.body || "").trim();

    if (!body) {
      return res.status(400).json({ error: "Comment can't be empty" });
    }
    if (body.length > MAX_COMMENT_LENGTH) {
      return res.status(400).json({ error: `Comments are limited to ${MAX_COMMENT_LENGTH} characters` });
    }

    const { data, error } = await req.supabase
      .from("post_comments")
      .insert([{ post_id: req.params.postId, user_id: req.user.id, body }])
      .select("id, body, created_at, user_id, profiles ( username, display_name, avatar_url )")
      .single();

    if (error) return res.status(400).json({ error: error.message });

    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
