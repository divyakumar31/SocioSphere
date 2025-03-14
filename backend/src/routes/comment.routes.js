import Router from "express";
import {
  addComment,
  getAllComments,
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

// To add comment
router.route("/add/:postId").post(verifyJWT, addComment);

// To get all comments from a post
router.route("/getall/:postId").get(verifyJWT, getAllComments);

export default router;
