import Router from "express";
import {
  createPost,
  deletePost,
  dislikePost,
  getAllPosts,
  getSinglePost,
  likePost,
  savePost,
} from "../controllers/post.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

// To create a new post
router.route("/create").post(verifyJWT, upload.single("postImage"), createPost);

// To get All posts for user feed
router.route("/").get(verifyJWT, getAllPosts);

// To get single post and delete post
router
  .route("/:postId")
  .get(verifyJWT, getSinglePost)
  .delete(verifyJWT, deletePost);

// To like and dislike
router.route("/like/:postId").post(verifyJWT, likePost);
router.route("/dislike/:postId").post(verifyJWT, dislikePost);

// To save / unsave post
router.route("/save/:postId").post(verifyJWT, savePost);

export default router;
