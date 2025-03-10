import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/connectDB.js";

dotenv.config();

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`⚙️  Server listening on port ${process.env.PORT || 3000}`);
    });
  })
  .catch((error) => {
    console.error("🚀 ~ MongoDB connection error:", error);
  });
