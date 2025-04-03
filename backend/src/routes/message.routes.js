import Router from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getMessages, sendMessage } from "../controllers/message.controller.js";

const router = Router();

// To add comment
router.route("/send/:id").post(verifyJWT, sendMessage);

// To get all comments from a post
router.route("/all/:id").get(verifyJWT, getMessages);

export default router;
