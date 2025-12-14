import { Request, Response } from "express";
import { response } from "../utils/response.js";
import { getAllUserService, getUserBySearchQueryService, getUserByUsernameService } from "../services/user.service.js";

export const getUserByUsername = async (req: Request, res: Response) => {
    const username = req.params.username
    try {
        const data = await getUserByUsernameService(username)
        return response({ res, message: "Get User By Username Successfully", status: 200, data })
    } catch {
        return response({ res, message: "Internal Server Error", status: 500 })
    }
}

export const getUserBySeachQuery = async (req: Request, res: Response) => {
    const search = req.query.search as string

    if (!search) {
        try {
            const data = await getAllUserService()
            return response({ res, status: 200, message: "Get All User Successfully", data })
        } catch {
            return response({ res, message: "Internal Server Error", status: 500 })
        }
    }

    try {
        const data = await getUserBySearchQueryService(search)
        return response({ res, status: 200, message: "Get User By Search Query Successfully", data })
    } catch {
        return response({ res, message: "Internal Server Error", status: 500 })
    }
}