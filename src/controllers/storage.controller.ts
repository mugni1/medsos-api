import { Request, Response } from "express";
import { response } from "../utils/response.js";
import cloudinary from "../lib/cloudinary.js";
import fileUpload from "express-fileupload";

export const Upload = async (req: Request, res: Response) => {
    const file = req.files?.file as fileUpload.UploadedFile
    if (!file) {
        return response({ res, message: "Missing File", status: 400 })
    }
    try {
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: "profile/images",
            resource_type: "image",
            transformation: [
                {
                    width: 300,
                    height: 300,
                    crop: "fill",
                    gravity: "face",
                    quality: "auto",
                    fetch_format: "auto",
                },
            ],
        })
        const data = {
            secure_url: result.secure_url,
            public_id: result.public_id
        }
        return response({ res, message: "Upload Successfully", data })
    } catch {
        return response({ res, status: 500, message: "Internal Server Error" })
    }
}