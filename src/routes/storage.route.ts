import express from "express"
import { authMiddleware } from "../middlewares/auth.middleware.js"
import { Upload } from "../controllers/storage.controller.js"

const router = express.Router()
router.post("/upload", authMiddleware, Upload)

export default router