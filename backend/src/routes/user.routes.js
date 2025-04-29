import Router from "express";
import {
  createUser,
  followOrUnfollowUser,
  getUserProfile,
  loginUser,
  logoutUser,
  searchUsers,
  seenUserNotifications,
  suggestUser,
  updateProfile,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

// To register and login/logout user
router.route("/register").post(createUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);

// To update user profile
router
  .route("/update")
  .post(verifyJWT, upload.single("profilePicture"), updateProfile);

// To get suggested users
router.route("/suggest").get(verifyJWT, suggestUser);

// Get Search Users
router.route("/search").get(verifyJWT, searchUsers);

// Get User Profile
router.route("/:username").get(getUserProfile);

// To follow and unfollow users
router.route("/follow-unfollow/:id").post(verifyJWT, followOrUnfollowUser);

// seen notifications by user
router.route("/notifications").post(verifyJWT, seenUserNotifications);

export default router;
