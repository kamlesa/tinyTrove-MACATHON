import express from "express";
import { createPost, createCommunity } from "../controllers/postController.js";

const router = express.Router();

router.post("/create-post", createPost);
router.post("/create-community", createCommunity);

export default router;
