import mongoose from "mongoose";
import { Conversation } from "./conversation.model.js";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    seen: {
      type: Boolean,
      default: false,
    },
    seenAt: {
      type: Date,
      expires: 60,
    },
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
