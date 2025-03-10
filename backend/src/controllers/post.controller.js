import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

/**
 * Creates a new post.
 * @route POST /api/v1/post/create
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - Post object.
 * @throws {ApiError} - If post creation fails.
 */
const createPost = asyncHandler(async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.user._id;

    console.log("Author ID:", req.user._id);
    console.log("IMG:", image);
    console.log("CAPTION:", caption);

    if (!image) {
      throw new ApiError(400, "Image is required");
    }

    const user = await User.findById(authorId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    // Image modification
    // const optimizedImageBuffer = await sharp(image.path)
    //   .resize({ width: 800, height: 800, fit: "inside" })
    //   .toFormat("jpeg", { quality: 80 })
    //   .toBuffer();

    // console.log("***************");
    // console.log("Optimized buffer", optimizedImageBuffer);
    // const fileURL = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
    //   "base64"
    // )}`;

    // console.log("***************");
    // console.log("Optimizede file url", fileURL);

    const cloudinaryResponse = await uploadOnCloudinary(image.path);
    // const cloudinaryResponse = await uploadOnCloudinary(fileURL);

    if (!cloudinaryResponse) {
      throw new ApiError(400, "Error while uploading post");
    }
    const post = await Post.create({
      caption,
      image: cloudinaryResponse.url,
      author: authorId,
    });

    // set post to user
    user.posts.push(post._id);
    await user.save();

    await post.populate({
      path: "author",
      select: "username profilePicture",
    });

    return res
      .status(201)
      .json(new ApiResponse(201, "Post created successfully", post));
  } catch (error) {
    console.log(error);
    throw new ApiError(
      error?.statusCode || 500,
      error?.message || "Something went wrong while creating post"
    );
  }
});

export { createPost };
