import { UserGetPayload } from "../../generated/prisma/models.js"

export type UserWithoutPassword = UserGetPayload<{
    omit: {
        password: true
    }
}>