import { compareSync, genSaltSync, hashSync } from "bcrypt-ts";
export const comparePassword = async (password, hash) => {
    return compareSync(password, hash);
};
export const hashedPassword = (password) => {
    return hashSync(password, genSaltSync(10));
};
