import express from "express";
import { createPost, createCommunity, createTag, uploadImage } from "../controllers/postController.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.use(requireAuth);
router.post("/create-post", createPost);
router.post("/create-community", createCommunity);
router.post("/create-tag", createTag);
router.post("/upload-image", uploadImage);

export default router;
