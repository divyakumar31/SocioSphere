import Router from "express";
import {
  getChatList,
  getMessages,
  sendMessage,
} from "../controllers/message.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// To get All conversation of user
router.route("/list").get(verifyJWT, getChatList);

// To add Message
router.route("/send/:id").post(verifyJWT, sendMessage);

// To get all messages from conversation
router.route("/all/:id").get(verifyJWT, getMessages);

// To seen message and delete
// router.route("/seen/:conversationId").post(verifyJWT, markMessageAsSeen);

export default router;
