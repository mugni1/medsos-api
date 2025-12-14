import { userAllKey, userByIdKey, userBySearchQueryKey, userByUsernameKey } from "../keys/user.key.js"
import { prisma } from "../lib/prisma.js"
import { redis } from "../lib/redis.js"
import { UpdateUserByIdServiceParam, UserWithoutPassword } from "../types/user.type.js"

export const getUserBySearchQueryService = async (keyword: string): Promise<UserWithoutPassword[] | null> => {
    // check from cache
    const cached = await redis.get(userBySearchQueryKey(keyword))
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
    await redis.set(userBySearchQueryKey(keyword), result, { ex: 60 * 5 })
    return result
}

export const getAllUserService = async (): Promise<UserWithoutPassword[] | null> => {
    // check from cache
    const cached = await redis.get(userAllKey())
    if (cached) {
        return cached as UserWithoutPassword[]
    }

    // query to db
    const result = await prisma.user.findMany({
        omit: { password: true }
    })
    await redis.set(userAllKey(), result, { ex: 60 * 60 })
    return result
}

export const getUserByUsernameService = async (username: string): Promise<UserWithoutPassword | null> => {
    // check from redis cache
    const cached = await redis.get(userByUsernameKey(username))
    if (cached) {
        return cached as UserWithoutPassword
    }

    // query to DB
    const result = await prisma.user.findUnique({
        where: { username },
        omit: { password: true }
    })
    await redis.set(userByUsernameKey(username), result, { ex: 60 * 30 })
    return result
}

export const updateUserByIdService = async ({ data, payload }: UpdateUserByIdServiceParam) => {
    // delete keys
    const searchKeys = await redis.keys(userBySearchQueryKey("*"))
    if (searchKeys.length > 0) { await redis.del(...searchKeys) }
    await redis.del(userAllKey())
    await redis.del(userByIdKey(data.id))
    await redis.del(userByUsernameKey(data.username))

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