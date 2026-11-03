import { supabase, supabaseForToken } from "../UserAuth.js";

// Verifies the Supabase access token in the Authorization header.
// On success sets:
//   req.user     - the authenticated Supabase user
//   req.token    - the raw access token
//   req.supabase - a Supabase client acting as that user
export const requireAuth = async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Not signed in" });
  }

  try {
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({ error: "Session expired. Please sign in again." });
    }

    req.user = data.user;
    req.token = token;
    req.supabase = supabaseForToken(token);
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
