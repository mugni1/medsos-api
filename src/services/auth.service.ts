import { prisma } from "../lib/prisma.js";
import { LoginPayload, RegisterPayload } from "../validations/auth.validate.js";

export const registerService = async ({ payload }: { payload: RegisterPayload }) => {
    return await prisma.user.create({
        data: {
            name: payload.name,
            email: payload.email,
            username: payload.username,
            password: payload.password
        },
        omit: {
            password: true,
        }
    })
}

export const findUserByEmailService = async (email: string) => {
    return await prisma.user.findUnique({
        where: {
            email: email
        }
    })
}

export const findUserByUsernameService = async (username: string) => {
    return await prisma.user.findUnique({
        where: {
            username: username
        },
        omit: {
            password: true
        }
    })
}

export const findUserByIdService = async (id: string) => {
    return await prisma.user.findUnique({
        where: {
            id: id
        },
        omit: {
            password: true
        }
    })
}