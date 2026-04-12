import express from "express";
import { createPost, createCommunity, createTag } from "../controllers/postController.js";

const router = express.Router();

router.post("/create-post", createPost);
router.post("/create-community", createCommunity);
router.post("/create-tag", createTag);

export default router;
