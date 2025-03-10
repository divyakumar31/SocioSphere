import Router from "express";
import { createPost } from "../controllers/post.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

// To create a new post
router.route("/create").post(verifyJWT, upload.single("postImage"), createPost);

export default router;
