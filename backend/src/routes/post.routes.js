import Router from "express";
import {
  createPost,
  deletePost,
  dislikePost,
  getAllPosts,
  likePost,
} from "../controllers/post.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

// To create a new post
router.route("/create").post(verifyJWT, upload.single("postImage"), createPost);

// To get All posts for user feed
router.route("/").get(verifyJWT, getAllPosts);

// To delete post
router.route("/:postId").delete(verifyJWT, deletePost);

// To like and dislike
router.route("/like/:postId").post(verifyJWT, likePost);
router.route("/dislike/:postId").post(verifyJWT, dislikePost);

export default router;
