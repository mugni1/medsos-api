import express from "express"
import fileUpload from "express-fileupload"
import RootRoute from "./routes/root.route.js"
import AuthRoute from "./routes/auth.route.js"
import UserRoute from "./routes/user.route.js"
import StorageRoute from "./routes/storage.route.js"

// initialization
const app = express()
app.use(express.json())
app.use(fileUpload({
    limits: { fileSize: 6 * 1024 * 1024 },
}));

// routes
const version = "/v1"
app.use(RootRoute)
app.use(`${version}/auth`, AuthRoute)
app.use(`${version}/user`, UserRoute)
app.use(`${version}/storage`, StorageRoute)

// lintening
app.listen(5051, () => {
    console.log("Server Up and Running")
})

export default app