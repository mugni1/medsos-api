import express from "express"
import { getUserByUsername } from "../controllers/user.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"

const router = express.Router()
router.get("/:username", authMiddleware, getUserByUsername)

export default router