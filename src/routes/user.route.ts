import express from "express"
import { getAllUserAndGetUserByQuery, getUserByUsername } from "../controllers/user.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"

const router = express.Router()
router.get("/:username", authMiddleware, getUserByUsername)
router.get("/", authMiddleware, getAllUserAndGetUserByQuery)

export default router