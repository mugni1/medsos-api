import { Request, Response } from "express";
import { response } from "../utils/response.js";
import { findUserByUsernameService } from "../services/auth.service.js";
import { redis } from "../lib/redis.js";

export const getUserByUsername = async (req: Request, res: Response) => {
    const username = req.params.username
    const key = `userbyusername:${username}`

    // check params
    if (!username) {
        return response({ res, message: "Missing Parameter", status: 400 })
    }

    try {
        // check cache 
        const userCache = await redis.get(key)
        if (userCache) {
            return response({ res, message: "Get User By Username From Redis Successfully", status: 200, data: userCache })
        }

        // query to db
        const user = await findUserByUsernameService(username)
        if (!user) {
            return response({ res, message: "Not Found", status: 404 })
        }
        await redis.set(key, user, { ex: 60 * 30 })
        return response({ res, message: "Get User By Username From DB Successfully", status: 200, data: user })
    } catch {
        return response({ res, message: "Internal Server Error", status: 500 })
    }
}