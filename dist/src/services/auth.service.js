import { prisma } from "../lib/prisma.js";
export const registerService = async ({ payload }) => {
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
    });
};
export const findUserByEmailService = async (email) => {
    return await prisma.user.findUnique({
        where: {
            email: email
        }
    });
};
