import { prisma } from "../lib/prisma.js"
import { redis } from "../lib/redis.js"

export const getUserBySearchQueryService = async (keyword: string) => {
    const key = `GET_USER_BY_SEARCH_QUERY_SERVICE_${keyword}`

    // check from cache
    const cached = await redis.get(key)
    if (cached) {
        return cached
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
        omit: {
            password: true
        }
    })
    await redis.set(key, result, { ex: 60 * 5 })
    return result
}

export const getAllUserService = async () => {
    const key = `GET_ALL_USER_SERVICE`

    // check from cache
    const cached = await redis.get(key)
    if (cached) {
        return cached
    }

    // query to db
    const result = await prisma.user.findMany({
        omit: { password: true }
    })
    await redis.set(key, result, { ex: 60 * 60 })
    return result
}

export const getUserByUsernameService = async (username: string) => {
    const key = `GET_USER_BY_USERNAME_SERVICE_${username}`

    // check from redis cache
    const cached = await redis.get(key)
    if (cached) {
        return cached
    }

    // query to DB
    const result = await prisma.user.findUnique({
        where: { username },
        omit: { password: true }
    })
    await redis.set(key, result, { ex: 60 * 30 })
    return result
}