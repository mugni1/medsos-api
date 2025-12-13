import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();
export const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
};
export const decodeToken = (token) => {
    try {
        return jwt.verify(token, process.env.SECRET_KEY);
    }
    catch (error) {
        return null;
    }
};
