import { Comment } from "../models/comment.model.js";
import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * Fetch All posts for user feed.
 * @route POST /api/v1/comment/add/:postId
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - Single Comment which is added.
 * @throws {ApiError} - If adding comment fails.
 */
const addComment = asyncHandler(async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;
    const { text } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      throw new ApiError(404, "Post not found");
    }

    if (!text) {
      throw new ApiError(400, "Text is required");
    }

    const comment = await Comment.create({
      post: postId,
      author: userId,
      text: text,
    });

    post.comments.push(comment._id);
    await post.save();

    await comment.populate({
      path: "author",
      select: "username profilePicture",
    });

    return res
      .status(200)
      .json(new ApiResponse(200, "Comment added successfully", comment));
  } catch (error) {
    console.log(error);
    throw new ApiError(
      error?.statusCode || 500,
      error?.message || "Something went wrong while adding comment"
    );
  }
});

/**
 * Fetch All posts for user feed.
 * @route GET /api/v1/comment/getall/:postId
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - Array of Comments on post.
 * @throws {ApiError} - If fetching comments from post fails.
 */
const getAllComments = asyncHandler(async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId })
      .populate({
        path: "author",
        select: "username profilePicture",
      })
      .sort({ createdAt: -1 });

    if (!comments) {
      throw new ApiError(404, "Comments not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "Comments fetched successfully", comments));
  } catch (error) {
    console.log(error);
    throw new ApiError(
      error?.statusCode || 500,
      error?.message || "Something went wrong while fetching comments"
    );
  }
});

export { addComment, getAllComments };
