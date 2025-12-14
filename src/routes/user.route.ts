import express from "express"
import { getAllUserAndGetUserByQuery, getUserByUsername, updateUserProfile } from "../controllers/user.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"

const router = express.Router()
router.get("/:username", authMiddleware, getUserByUsername)
router.get("/", authMiddleware, getAllUserAndGetUserByQuery)
router.put("/profile", authMiddleware, updateUserProfile)

export default router