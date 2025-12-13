import z from "zod";

export const registerSchemaValidate = z.object({
    name: z.string().min(2).max(50),
    username: z.string().min(4).max(20),
    email: z.email().min(2).max(225),
    password: z.string().min(8).max(12)
})
export type RegisterPayload = z.infer<typeof registerSchemaValidate>;

export const loginSchemaValidate = z.object({
    email: z.email().min(2).max(225),
    password: z.string().min(8).max(12)
})
export type LoginPayload = z.infer<typeof loginSchemaValidate>;


