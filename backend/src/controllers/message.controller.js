import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Message } from "../models/message.model.js";
import { Conversation } from "../models/conversation.model.js";
import { io } from "../app.js";
import { getClientSocketId } from "../socket/socket.js";

export const sendMessage = asyncHandler(async (req, res) => {
  try {
    const receiverId = req.params.id;
    const { text } = req.body;
    const senderId = req.user._id;

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

export const getMessages = asyncHandler(async (req, res) => {
  try {
    const senderId = req.user._id;
    const receiverId = req.params.id;
    console.log("sender: ", senderId);
    console.log("receiver: ", receiverId);

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
