import { prisma } from "../lib/prisma.js"
import { redis } from "../lib/redis.js"
import { UserWithoutPassword } from "../types/user.type.js"

export const getUserBySearchQueryService = async (keyword: string): Promise<UserWithoutPassword[] | null> => {
    const key = `GET_USER_BY_SEARCH_QUERY_SERVICE_${keyword}`

    // check from cache
    const cached = await redis.get(key)
    if (cached) {
        return cached as UserWithoutPassword[]
    }

    // query to db
    const result = await prisma.user.findMany({
        where: {
            OR: [
                { name: { contains: keyword, mode: 'insensitive' } },
                { email: { contains: keyword, mode: 'insensitive' } },
                { username: { contains: keyword, mode: 'insensitive' } },
            ]
        },
        omit: { password: true }
    })
    await redis.set(key, result, { ex: 60 * 5 })
    return result
}

export const getAllUserService = async (): Promise<UserWithoutPassword[] | null> => {
    const key = `GET_ALL_USER_SERVICE`

    // check from cache
    const cached = await redis.get(key)
    if (cached) {
        return cached as UserWithoutPassword[]
    }

    // query to db
    const result = await prisma.user.findMany({
        omit: { password: true }
    })
    await redis.set(key, result, { ex: 60 * 60 })
    return result
}

export const getUserByUsernameService = async (username: string): Promise<UserWithoutPassword | null> => {
    const key = `GET_USER_BY_USERNAME_SERVICE_${username}`

    // check from redis cache
    const cached = await redis.get(key)
    if (cached) {
        return cached as UserWithoutPassword
    }

    // query to DB
    const result = await prisma.user.findUnique({
        where: { username },
        omit: { password: true }
    })
    await redis.set(key, result, { ex: 60 * 30 })
    return result
}

export const updateUserByIdService = async (
    data: { id: string, username: string, name: string, email: string },
    payload: { name: string, username: string, bio: string }
) => {
    await redis.del(`GET_ALL_USER_SERVICE`)
    await redis.del(`FIND_USER_BY_ID_SERVICE_${data.id}`)
    await redis.del(`GET_USER_BY_USERNAME_SERVICE_${data.username}`)

    const searchKeys = await redis.keys(`GET_USER_BY_SEARCH_QUERY_SERVICE_*`)
    if (searchKeys.length > 0) { await redis.del(...searchKeys) }

    // query to db
    return await prisma.user.update({
        where: { id: data.id },
        data: {
            name: payload.name,
            bio: payload.bio,
            username: payload.username
        }
    })
}