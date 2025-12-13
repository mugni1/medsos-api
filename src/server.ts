import express from "express"
import RootRoute from "./routes/root.route.js"
import AuthRoute from "./routes/auth.route.js"

// initialization
const app = express()
app.use(express.json())

// routes
const version = "/v1"
app.use(RootRoute)
app.use(`${version}/auth`, AuthRoute)

// lintening
app.listen(5050, () => {
    console.log("Server Up and Running")
})