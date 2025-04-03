import dotenv from "dotenv";
import { server } from "./app.js";
import connectDB from "./db/connectDB.js";

dotenv.config();

connectDB()
  .then(() => {
    server.listen(process.env.PORT || 3000, () => {
      console.log(`⚙️  Server listening on port ${process.env.PORT || 3000}`);
    });
  })
  .catch((error) => {
    console.error("🚀 ~ MongoDB connection error:", error);
  });
