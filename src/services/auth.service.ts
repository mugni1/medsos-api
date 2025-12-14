import { prisma } from "../lib/prisma.js";
import { redis } from "../lib/redis.js";
import { UserWithoutPassword } from "../types/user.type.js";
import { RegisterPayload } from "../validations/auth.validate.js";

export const registerService = async ({ payload }: { payload: RegisterPayload }) => {
    return await prisma.user.create({
        data: {
            name: payload.name,
            email: payload.email,
            username: payload.username,
            password: payload.password
        },
        omit: { password: true }
    })
}

export const findUserByEmailService = async (email: string) => {
    return await prisma.user.findUnique({
        where: { email: email }
    })
}

export const findUserByUsernameService = async (username: string) => {
    return await prisma.user.findUnique({
        where: { username: username },
        omit: { password: true }
    })
}

export const findUserByIdService = async (id: string): Promise<UserWithoutPassword | null> => {
    const key = `FIND_USER_BY_ID_SERVICE_${id}`

    // check from redis cache
    const cached = await redis.get(key)
    if (cached) {
        console.log(`${key} from Redis`)
        return cached as UserWithoutPassword
    }

    // query to DB
    console.log(`${key} from DB`)
    const result = await prisma.user.findUnique({
        where: { id: id },
        omit: { password: true }
    })
    await redis.set(key, result, { ex: 60 * 30 })
    return result
}