import z from "zod";

export const updateUserProfileSchema = z.object({
    name: z.string("name is required").min(2, "minimum name must have 2 characters").max(50, "maximum name must have 50 characters"),
    username: z.string("username is required").min(4, "minimum username must have 4 characters").max(20, "maximum username must have 20 characters"),
    bio: z.string("bio is required").min(5, "minimum bio must have 5 characters").max(225, "maximum bio must have 225 characters")
})