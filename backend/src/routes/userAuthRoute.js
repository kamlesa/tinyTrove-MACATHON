import express from "express";
import { signIn, signUp, signOut, getProfile, getUserPosts, getUserCommunities } from "../controllers/userAuthController.js";

const router = express.Router();

router.post("/sign-in", signIn);
router.post("/sign-up", signUp);
router.post("/sign-out", signOut);
router.get("/profile/:userId", getProfile);
router.get("/posts/:userId", getUserPosts);
router.get("/communities/:userId", getUserCommunities);

export default router;
