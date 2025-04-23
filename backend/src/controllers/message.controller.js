import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Message } from "../models/message.model.js";
import { Conversation } from "../models/conversation.model.js";
import { io } from "../app.js";
import { getClientSocketId } from "../socket/socket.js";
import { mongoPathValidator } from "../validators/mongodb.validator.js";

/**
 * Send Message to a user.
 * @route POST /api/v1/message/send/:id
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - New Created Message object.
 * @throws {ApiError} - If message sending fails.
 */
const sendMessage = asyncHandler(async (req, res) => {
  try {
    const receiverId = req.params.id;
    const { text } = req.body;
    const senderId = req.user._id;

    console.log("Sender ID: ", senderId);
    console.log("recev ID: ", receiverId);

    if (!text) {
      throw new ApiError(400, "All fields are required");
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    // establish conversation if it doesn't exist
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      message: text,
    });
    if (!message) {
      throw new ApiError(400, "Error while sending message");
    }

    await conversation.updateOne({
      $set: { lastMessage: message._id },
      $push: { messages: message._id },
    });
    await Promise.all([conversation.save(), message.save()]);

    // implementing socket io for real time message transfer
    const receiverSockeId = getClientSocketId(receiverId);
    if (receiverSockeId) {
      io.to(receiverSockeId).emit("message", message);
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "Message sent successfully", message));
  } catch (error) {
    console.log(error);
    throw new ApiError(
      error?.statusCode || 500,
      error?.message || "Something went wrong while sending message"
    );
  }
});

/**
 * Get all messages from the conversation.
 * @route GET /api/v1/message/all/:id
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Array} - Array of Messages object from the conversation.
 * @throws {ApiError} - If conversation has no messages.
 */
const getMessages = asyncHandler(async (req, res) => {
  try {
    const senderId = req.user._id;
    const receiverId = req.params.id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate({
      path: "messages",
    });
    // const { conversationId } = req.params;
    // const userId = req.user._id;

    // const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.messages) {
      return res
        .status(200)
        .json(new ApiResponse(404, "Conversation not found"));
      // throw new ApiError(404, "No Messages found. Conversation not found");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Messages fetched successfully",
          conversation?.messages
        )
      );
  } catch (error) {
    console.log(error);
    throw new ApiError(
      error?.statusCode || 500,
      error?.message || "Something went wrong while fetching messages"
    );
  }
});

/**
 * Get Chat List of a user.
 * @route GET /api/v1/message/list
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Array} - Array of Conversations done by user.
 * @throws {ApiError} - If unable to fetch chat list.
 */
const getChatList = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const conversations = await Conversation.find(
      {
        participants: { $in: [userId] },
      },
      { messages: 0 }
    ).populate({
      path: "participants",
      select: "username profilePicture name",
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, "Chat list fetched successfully", conversations)
      );
  } catch (error) {
    console.error(error);
    throw new ApiError(
      error?.statusCode || 500,
      error?.message || "Something went wrong while fetching chat list"
    );
  }
});

/**
 * Mark a message as seen.
 * @route POST /api/v1/message/seen/:conversationId
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - Updated Message object.
 * @throws {ApiError} - If message marking fails.
 */
// const markMessageAsSeen = asyncHandler(async (req, res) => {
//   try {
//     const { conversationId } = req.params;

//     mongoPathValidator(conversationId);

//     const conversation =
//       await Conversation.findById(conversationId).populate("messages");

//     if (!conversation) {
//       throw new ApiError(404, "Conversation not found");
//     }
//     console.log("COnvo: ", conversation);
//     const unseenMessages = conversation.messages.filter(
//       (msg) => !msg.seen && msg.sender.toString() !== req.user._id.toString()
//     );
//     console.log("UnseenMsg: ", unseenMessages);

//     if (unseenMessages.length === 0) {
//       return res
//         .status(200)
//         .json(new ApiResponse(200, "All messages already seen"));
//     }

//     const messageIds = unseenMessages.map((msg) => msg._id);
//     await Message.updateMany(
//       { _id: { $in: messageIds } },
//       { $set: { seen: true, seenAt: new Date() } }
//     );

//     return res
//       .status(200)
//       .json(
//         new ApiResponse(200, `${messageIds.length} messages marked as seen`)
//       );
//   } catch (error) {
//     console.log(error);
//     throw new ApiError(
//       error?.statusCode || 500,
//       error?.message || "Something went wrong while updating message status"
//     );
//   }
// });

export { sendMessage, getMessages, getChatList };
