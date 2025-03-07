import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config({});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //upload the file on cloudinary

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      invalidate: true,
    });

    // file has been uploaded successfully
    //console.log("file is uploaded on cloudinary ", response.url);
    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
    return null;
  }
};

const deleteOnCloudinary = async (url) => {
  // const publicId = url.split("/").pop().split(".")[0];
  // console.log("public Id", publicId);

  try {
    const regex = /v\d+\/(.*?)\./;
    const match = url.match(regex);

    if (!match) {
      throw new Error("Invalid URL format");
    }

    await cloudinary.uploader.destroy(match[1]);
    // const res = await cloudinary.uploader.destroy(match[1]);
    //console.log("Cloudinary response", res); // { result: 'not found' }
  } catch (error) {
    console.log(error);
  }
};

export { uploadOnCloudinary, deleteOnCloudinary };
