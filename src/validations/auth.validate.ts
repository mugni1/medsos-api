import z from "zod";

export const registerSchemaValidate = z.object({
    name: z.string("name is required").min(2, "minimum name must have 2 characters").max(50, "maximum name must have 50 characters"),
    username: z.string("username is required").min(4, "minimum username must have 4 characters").max(20, "maximum username must have 20 characters"),
    email: z.email("invalid email").min(2, "minimum email must have 2 characters").max(225, "maximum email must have 225 characters"),
    password: z.string("password is required").min(8, "minimum password must have 8 characters").max(12, "maximum password must have 12 characters")
})
export type RegisterPayload = z.infer<typeof registerSchemaValidate>;

export const loginSchemaValidate = z.object({
    email: z.email("invalid email").min(2, "minimum email must have 2 characters").max(225, "maximum email must have 225 characters"),
    password: z.string("password is required").min(8, "minimum password must have 8 characters").max(12, "maximum password must have 12 characters")
})
export type LoginPayload = z.infer<typeof loginSchemaValidate>;


