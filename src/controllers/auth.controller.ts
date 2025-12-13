import { Request, Response } from "express";
import { response } from "../utils/response.js";
import { loginSchemaValidate, registerSchemaValidate } from "../validations/auth.validate.js";
import { comparePassword, hashedPassword } from "../utils/bcrypt.js";
import { findUserByEmailService, findUserByIdService, findUserByUsernameService, registerService } from "../services/auth.service.js";
import { generateToken } from "../utils/jwt.js";

export const register = async (req: Request, res: Response) => {
    const { success, error, data } = registerSchemaValidate.safeParse(req.body);
    if (!success) {
        const errors = error.issues.map((err: any) => ({
            path: err.path.join('.'),
            message: err.message,
        }));
        return response({ res, status: 400, message: 'Invalid input', errors });
    }

    // check email
    const emailExist = await findUserByEmailService(data.email)
    if (emailExist) {
        return response({ res, status: 400, message: 'Email Already Exist' });
    }

    // check username
    const usernameExist = await findUserByUsernameService(data.username)
    if (usernameExist) {
        return response({ res, status: 400, message: 'Username Already Exist' });
    }

    // hash password
    data.password = hashedPassword(data.password)

    // store
    const result = await registerService({ payload: data })
    if (!result) {
        return response({ res, status: 500, message: "Internal Server Error" })
    }

    // response
    return response({ res, status: 201, message: "Resgister Successfully", data: result })
}

export const login = async (req: Request, res: Response) => {
    const { data, success, error } = loginSchemaValidate.safeParse(req.body)
    if (!success) {
        const errors = error.issues.map((err: any) => ({
            path: err.path.join('.'),
            message: err.message,
        }));
        return response({ res, status: 400, message: 'Invalid input', errors });
    }

    // check email
    const user = await findUserByEmailService(data.email)
    if (!user) {
        return response({ res, status: 400, message: 'Invalid Email Or Password' });
    }

    // check password
    const verified = await comparePassword(data.password, user.password as string)
    if (!verified) {
        return response({ res, status: 400, message: 'Invalid Email Or Password' });
    }
    user.password = null

    // generate jwt token
    const token = generateToken({ id: user.id })

    // response
    return response({ res, message: "Login Successfully", data: { user, token } })
}

export const me = async (req: Request, res: Response) => {
    const userId = req.userId
    try {
        const user = await findUserByIdService(userId as string)
        return response({ res, status: 200, message: "Successfully get me", data: user })
    } catch {
        return response({ res, status: 500, message: "Internal Server Error" })
    }
}