import { UserGetPayload } from "../../generated/prisma/models.js"

export type UserWithoutPassword = UserGetPayload<{
    omit: {
        password: true
    }
}>

export interface UpdateUserByIdServiceParam {
    data: {
        id: string,
        username: string,
        name: string,
        email: string
    },
    payload: {
        name: string,
        username: string,
        bio: string
    }
}