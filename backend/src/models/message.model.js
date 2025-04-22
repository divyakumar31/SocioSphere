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

// messageSchema.index({ seenAt: 1 }, { expireAfterSeconds: 100 });

// messageSchema.post("findOneAndDelete", async function (doc) {
//   console.log("Deleted Message Document:", doc);
//   if (doc) {
//     await Conversation.updateMany(
//       { messages: doc._id }, // Find conversations containing the deleted message
//       { $pull: { messages: doc._id } } // Remove message from messages array
//     );
//     console.log(`Updated Conversations:`, result);
//   }
// });

export const Message = mongoose.model("Message", messageSchema);
