import express from "express"
import { getUserBySeachQuery, getUserByUsername } from "../controllers/user.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"

const router = express.Router()
router.get("/:username", authMiddleware, getUserByUsername)
router.get("/", authMiddleware, getUserBySeachQuery)

export default router