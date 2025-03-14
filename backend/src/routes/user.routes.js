import Router from "express";
import {
  createUser,
  loginUser,
  logoutUser,
  suggestUser,
  updateProfile,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

// To register and login/logout user
router.route("/register").post(createUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);

// To update user profile
router
  .route("/update")
  .post(verifyJWT, upload.single("profilePicture"), updateProfile);

// To get suggested users
router.route("/suggest").get(verifyJWT, suggestUser);

export default router;
