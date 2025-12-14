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
        const result = await new Promise<any>((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: "profile/images",
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
                },
                (error, result) => {
                    if (error) reject(error)
                    else resolve(result)
                }
            ).end(file.data)
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