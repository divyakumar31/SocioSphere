import Router from "express";
import {
  getChatList,
  getMessages,
  markMessageAsSeen,
  sendMessage,
} from "../controllers/message.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// To get All conversation of user
router.route("/list").get(verifyJWT, getChatList);

// To add comment
router.route("/send/:id").post(verifyJWT, sendMessage);

// To get all comments from a post
router.route("/all/:id").get(verifyJWT, getMessages);

// To seen message and delete
router.route("/seen/:conversationId").post(verifyJWT, markMessageAsSeen);

export default router;
