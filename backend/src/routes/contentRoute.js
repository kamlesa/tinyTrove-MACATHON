import express from "express";
import {
  search,
  getPost,
  getTreasures,
  getTreasurePosts,
  getTreasureCommunity,
  getCommunityContent,
  getStores,
  createStore,
} from "../controllers/contentController.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.use(requireAuth);
router.get("/search", search);
router.get("/posts/:postId", getPost);
router.get("/treasures", getTreasures);
router.get("/treasures/:treasureId/posts", getTreasurePosts);
router.get("/treasures/:treasureId/community", getTreasureCommunity);
router.get("/communities/:communityId/content", getCommunityContent);
router.get("/stores", getStores);
router.post("/stores", createStore);

export default router;
