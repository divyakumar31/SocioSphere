import { Comment } from "../models/comment.model.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";

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

/**
 * Fetch All posts for user feed.
 * @route GET /api/v1/post/
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - Array of Post object.
 * @throws {ApiError} - If fetching post fails.
 */
const getAllPosts = asyncHandler(async (req, res) => {
  try {
    // const posts = await Post.find()
    //   .sort({ createdAt: -1 })
    //   .populate({
    //     path: "author",
    //     select: "username profilePicture",
    //   })
    //   .populate({
    //     path: "comments",
    //     populate: {
    //       path: "author",
    //       select: "username profilePicture",
    //     },
    //   });
    const posts = await Post.aggregate([
      // stage 1: Sort posts based on creation time
      {
        $sort: {
          createdAt: -1,
        },
      },
      // Stage 2: Poulate author and get username, name & profilePicture
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
          pipeline: [
            {
              $project: {
                username: 1,
                name: 1,
                profilePicture: 1,
              },
            },
          ],
        },
      },
      // Stage 3: Unwind author
      {
        $unwind: {
          path: "$author",
        },
      },
      // Stage 4: Populate comments and author of comment and unwind author with sorting comments based on creation time
      {
        $lookup: {
          from: "comments",
          localField: "comments",
          foreignField: "_id",
          as: "comments",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "author",
                foreignField: "_id",
                as: "author",
                pipeline: [
                  {
                    $project: {
                      username: 1,
                      name: 1,
                      profilePicture: 1,
                    },
                  },
                ],
              },
            },
            {
              $unwind: {
                path: "$author",
              },
            },
            {
              $sort: {
                createdAt: -1,
              },
            },
          ],
        },
      },
    ]);

    if (posts.length === 0) {
      throw new ApiError(404, "Posts not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "Posts fetched successfully", posts));
  } catch (error) {
    console.log(error);
    throw new ApiError(
      error?.statusCode || 500,
      error?.message || "Something went wrong while fetching posts"
    );
  }
});

/**
 * Fetch All posts for user feed.
 * @route DELETE /api/v1/post/:postId
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {String} - Success Message .
 * @throws {ApiError} - If post deletion fails.
 */
const deletePost = asyncHandler(async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById({ _id: postId });
    if (!post) {
      throw new ApiError(404, "Post not found");
    }
    let imageUrl = post.image;

    if (post.author.toString() !== userId.toString()) {
      throw new ApiError(403, "You are not authorized to delete this post");
    }

    await post.deleteOne();

    // delete post from user
    let user = await User.findById(userId);
    user.posts.pull(postId);

    await user.save();

    // delete comments related to post
    await Comment.deleteMany({ post: postId });

    await deleteOnCloudinary(imageUrl);

    return res
      .status(200)
      .json(new ApiResponse(200, "Post deleted successfully"));
  } catch (error) {
    console.error(error);
    throw new ApiError(
      error?.statusCode || 500,
      error?.message || "Something went wrong while deleting post"
    );
  }
});

/**
 * Fetch All posts for user feed.
 * @route POST /api/v1/post/like/:postId
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {String} - Success Message.
 * @throws {ApiError} - If liking post fails.
 */
const likePost = asyncHandler(async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findByIdAndUpdate(postId, {
      $addToSet: { likes: userId },
    });
    if (!post) {
      throw new ApiError(404, "Post not found");
    }

    // Like-Dislike logic
    // if (post.likes.includes(userId)) {
    //   post.likes.pull(userId);
    // } else {
    //   post.likes.push(userId);
    // }

    // implementing socket io for real time notification

    return res
      .status(200)
      .json(new ApiResponse(200, "Post liked successfully"));
  } catch (error) {
    console.log(error);
    throw new ApiError(
      error?.statusCode || 500,
      error?.message || "Something went wrong while interacting with post"
    );
  }
});

/**
 * Fetch All posts for user feed.
 * @route GET /api/v1/post/
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {String} - Success Message.
 * @throws {ApiError} - If disliking post fails.
 */
const dislikePost = asyncHandler(async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findByIdAndUpdate(postId, {
      $pull: { likes: userId },
    });
    if (!post) {
      throw new ApiError(404, "Post not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "Post disliked successfully"));
  } catch (error) {
    console.log(error);
    throw new ApiError(
      error?.statusCode || 500,
      error?.message || "Something went wrong while interacting with post"
    );
  }
});

export { createPost, deletePost, dislikePost, getAllPosts, likePost };
