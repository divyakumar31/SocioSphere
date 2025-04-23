import { User } from "../models/user.model.js";
import { getClientSocketId } from "../socket/socket.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { io } from "../app.js";

/**
 * Sign up a user and generates an access token.
 * @route POST /api/v1/user/register
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - User object with access token.
 * @throws {ApiError} - If user credentials are invalid.
 */
const createUser = asyncHandler(async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      throw new ApiError(400, "All fields are required");
    }

    const isUserExist = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (isUserExist) {
      throw new ApiError(
        409,
        "User with same email or username already exists"
      );
    }

    let user = await User.create({
      username,
      email,
      password,
    });

    // NOTE: check if user is created
    // Directly return user with access
    const accessToken = user.generateAccessToken();
    const options = {
      httpOnly: true,
      samesite: "strict",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    };

    user = user["_doc"];
    delete user.password;

    return res
      .status(201)
      .cookie("accessToken", accessToken, options)
      .json(
        new ApiResponse(200, "User created successfully", {
          ...user,
          accessToken,
        })
      );
  } catch (error) {
    // console.error("Error creating user:", error);
    throw new ApiError(
      error?.statusCode || 500,
      error?.message || "Something went wrong while creating user"
    );
  }
});

/**
 * Logs in a user and generates an access token.
 * @route POST /api/v1/user/login
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - User object with access token.
 * @throws {ApiError} - If user credentials are invalid.
 */
const loginUser = asyncHandler(async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username) {
      throw new ApiError(400, "Please provide username or email");
    }
    if (!password) {
      throw new ApiError(400, "Please provide password");
    }

    let user = await User.findOne({
      $or: [{ username }, { email: username }],
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const isValidPassword = await user.isPasswordCorrect(password);
    if (!isValidPassword) {
      throw new ApiError(409, "Invalid credentials");
    }

    const accessToken = user.generateAccessToken();
    const options = {
      httpOnly: true,
      samesite: "strict",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    };

    user = user["_doc"];
    delete user.password;

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .json(
        new ApiResponse(200, "User logged in successfully", {
          ...user,
          accessToken,
        })
      );
  } catch (error) {
    throw new ApiError(
      error?.statusCode || 500,
      error?.message || "Something went wrong while Login user"
    );
  }
});

/**
 * Logs out the user by clearing the authentication cookie.
 *
 * @route POST /api/v1/user/logout
 *
 * @param {Object} _ - Express request object (not used)
 * @param {Object} res - Express response object
 *
 * @returns {Object} - JSON response confirming successful logout
 *
 * @throws {ApiError} 401 - If unauthorized user attempted to log out
 */
const logoutUser = asyncHandler(async (_, res) => {
  try {
    return res
      .status(200)
      .clearCookie("accessToken")
      .json(new ApiResponse(200, "User logged out successfully"));
  } catch (error) {
    throw new ApiError(
      error?.statusCode || 500,
      error?.message || "Something went wrong while logging out user"
    );
  }
});

/**
 * Updates user profile.
 * @route POST /api/v1/user/update
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - User object with updated profile.
 * @throws {ApiError} - If unable to update profile.
 */
const updateProfile = asyncHandler(async (req, res) => {
  try {
    const { bio, gender, name, email, profileType } = req.body;
    const avatarLocalPath = req.file?.path;

    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    let avatar;
    if (avatarLocalPath) {
      avatar = await uploadOnCloudinary(avatarLocalPath);
      if (!avatar.url) {
        throw new ApiError(400, "Error while uploading on avatar");
      }
    }
    if (bio !== "undefined") user.bio = bio;
    if (gender !== "undefined") user.gender = gender;
    if (name !== "undefined") user.name = name;
    if (email) user.email = email;
    if (profileType !== "undefined") user.profileType = profileType;
    if (avatar?.url) {
      if (user.profilePicture) await deleteOnCloudinary(user?.profilePicture); // remove old profilepicture
      user.profilePicture = avatar.url; // add new picture
    }

    await user.save();

    return res
      .status(200)
      .json(new ApiResponse(200, "Profile updated successfully", user));
  } catch (error) {
    throw new ApiError(
      error?.statusCode || 500,
      error?.message || "Something went wrong while updating profile"
    );
  }
});

/**
 * Updates user profile.
 * @route GET /api/v1/user/suggest
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - Array of Suggested Users.
 * @throws {ApiError} - If unable to fetch suggested profiles.
 */
const suggestUser = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select(
      "_id username profilePicture name"
    );
    if (!users) {
      throw new ApiError(404, "Users not found to suggest");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, "Suggested users fetched successfully", users)
      );
  } catch (error) {
    console.error(error);
    throw new ApiError(
      error?.statusCode || 500,
      error?.message || "Something went wrong while fetching suggested users"
    );
  }
});

/**
 * get User's profile based on username
 * @route GET /api/v1/user/:username
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - User object.
 * @throws {ApiError} - If unable to fetch user profile.
 */
const getUserProfile = asyncHandler(async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username })
      .select("-password -email -savedPosts -createdAt -updatedAt -__v")
      .populate({
        path: "posts",
        select: "caption image likes comments",
      });
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "Profile fetched successfully", user));
  } catch (error) {
    console.error(error);
    throw new ApiError(
      error?.statusCode || 500,
      error?.message || "Something went wrong while fetching user profile"
    );
  }
});

/**
 * To follow or unfollow a user.
 * @route POST /api/v1/user/follow-unfollow/:id
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {String} - Success Message.
 * @throws {ApiError} - If unable to follow or unfollow user or following self.
 */
const followOrUnfollowUser = asyncHandler(async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const user = await User.findById(req.user._id);
    if (!user || !userToFollow) {
      throw new ApiError(404, "User not found");
    }
    if (req.params.id == req.user._id) {
      throw new ApiError(400, "You can't follow yourself");
    }
    if (user.following.includes(userToFollow._id)) {
      userToFollow.followers.pull(user._id);
      user.following.pull(userToFollow._id);
      await userToFollow.save({ validateBeforeSave: false });
      await user.save({ validateBeforeSave: false });
      return res
        .status(200)
        .json(new ApiResponse(200, "User unfollowed successfully"));
    } else {
      userToFollow.followers.push(user._id);
      user.following.push(userToFollow._id);

      // Set notification to userToFollow
      userToFollow.notifications.push(
        `${user.username} started following you.`
      );

      // Send notification to userToFollow
      const userToFollowSocket = getClientSocketId(userToFollow._id);
      if (userToFollowSocket) {
        io.to(userToFollowSocket).emit("notification", {
          message: `${user.username} started following you.`,
        });
      }

      await userToFollow.save({ validateBeforeSave: false });
      await user.save({ validateBeforeSave: false });
      return res
        .status(200)
        .json(new ApiResponse(200, "User followed successfully"));
    }
  } catch (error) {
    throw new ApiError(
      error?.statusCode || 500,
      error?.message || "Something went wrong while following/unfollowing user"
    );
  }
});

/**
 * Searches for users based on the provided searchQuery.
 * @route GET /api/v1/user/search
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - Array of User objects.
 * @throws {ApiError} - If unable to search for users.
 */
const searchUsers = asyncHandler(async (req, res) => {
  try {
    const { query: searchQuery, page = 1, limit = 10 } = req.query;

    if (!searchQuery) {
      throw new ApiError(400, "Search query is required");
    }

    // Regex pattern to match only names that START with the searchQuery (case-insensitive)
    const regex = new RegExp(`^${searchQuery}`, "i");

    const users = await User.find(
      { $or: [{ username: regex }, { name: regex }] },
      "username name profilePicture"
    )
      .limit(parseInt(limit))
      .skip((page - 1) * limit)
      .lean();

    return res
      .status(200)
      .json(new ApiResponse(200, "Users fetched successfully", users));
  } catch (error) {
    throw new ApiError(500, error.message || "Error while searching users");
  }
});

/**
 * Marks all notifications as seen by the user.
 * @route POST /api/v1/user/notifications
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {String} - Success Message.
 * @throws {ApiError} - If unable to mark notifications as seen.
 */
const seenUserNotifications = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.notifications = [];

    await user.save();

    return res
      .status(200)
      .json(new ApiResponse(200, "Notifications updated successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error.message || "Error while removing user notifications"
    );
  }
});

export {
  createUser,
  followOrUnfollowUser,
  getUserProfile,
  loginUser,
  logoutUser,
  searchUsers,
  seenUserNotifications,
  suggestUser,
  updateProfile,
};
