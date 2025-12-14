import { Request, Response } from "express";
import { response } from "../utils/response.js";
import { getAllUserService, getUserBySearchQueryService, getUserByUsernameService, updateUserByIdService } from "../services/user.service.js";
import { findUserByIdService } from "../services/auth.service.js";
import { updateUserProfileSchema } from "../validations/user.validate.js";

export const getUserByUsername = async (req: Request, res: Response) => {
    const username = req.params.username
    try {
        const data = await getUserByUsernameService(username)
        if (!data) {
            return response({ res, status: 404, message: "User Not Found" })
        }
        return response({ res, message: "Get User By Username Successfully", status: 200, data })
    } catch {
        return response({ res, message: "Internal Server Error", status: 500 })
    }
}

export const getAllUserAndGetUserByQuery = async (req: Request, res: Response) => {
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

export const updateUserProfile = async (req: Request, res: Response) => {
    const { data, success, error } = updateUserProfileSchema.safeParse(req.body)
    if (!success) {
        const errors = error.issues.map(err => ({
            path: err.path.join('_'),
            message: err.message
        }))
        return response({ res, status: 400, message: "Invalid Input", errors })
    }

    try {
        // check user by id
        const user = await findUserByIdService(req.userId as string)
        if (!user) {
            return response({ res, status: 404, message: "User Not Found" })
        }

        // check username
        const userExist = await getUserByUsernameService(data.username)
        if (userExist && userExist.username != user.username) {
            return response({ res, status: 400, message: "Username Already Exist" })
        } else {
            const updated = await updateUserByIdService({
                data: { id: user.id, username: user.username, name: user.name, email: user.email },
                payload: { name: data.name, username: data.username, bio: data.bio }
            })
            return response({ res, status: 200, message: "Update User Successfully", data: updated })
        }
    } catch {
        return response({ res, status: 500, message: "Internal Server Error" })
    }
}