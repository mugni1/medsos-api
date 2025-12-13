import { NextFunction, Request, Response } from "express";
import { response } from "../utils/response.js";
import { decodeToken } from "../utils/jwt.js";
import { findUserByIdService } from "../services/auth.service.js";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization
    if (!header) {
        return response({ res, status: 401, message: "Missing Token" })
    }

    const token = header.split(" ")[1]
    if (!token) {
        return response({ res, status: 401, message: "Missing Token" })
    }

    const decoded = decodeToken(token)
    if (!decoded) {
        return response({ res, status: 401, message: "Invalid Token" })
    }

    // check user
    const user = await findUserByIdService(decoded.id)
    if (!user) {
        return response({ res, status: 401, message: "Invalid Token" })
    }
    req.userId = user.id
    next()
}