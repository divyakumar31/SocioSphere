import mongoose from "mongoose";
import { ApiResponse } from "../utils/ApiResponse.js";

const mongoPathValidator = (verifyId) => {
  if (!mongoose.Types.ObjectId.isValid(verifyId)) {
    return res
      .status(400)
      .json(new ApiResponse(200, "Invalid conversation ID"));
  }

  return verifyId;
};

export { mongoPathValidator };
