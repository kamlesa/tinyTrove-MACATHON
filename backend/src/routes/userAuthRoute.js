import express from "express";

const router = express.Router();

import { addUser } from "../controllers/userAuthController.js";

router.post("/create", addUser);

export default router;
