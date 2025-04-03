import Router from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getChatList,
  getMessages,
  sendMessage,
} from "../controllers/message.controller.js";

const router = Router();

// To get All conversation of user
router.route("/list").get(verifyJWT, getChatList);

// To add comment
router.route("/send/:id").post(verifyJWT, sendMessage);

// To get all comments from a post
router.route("/all/:id").get(verifyJWT, getMessages);

export default router;
