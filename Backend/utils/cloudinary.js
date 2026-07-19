import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export function uploadToCloudinary(buffer) {

    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({}, (error, result) => {

            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        });

        streamifier.createReadStream(buffer).pipe(stream);
    });

}