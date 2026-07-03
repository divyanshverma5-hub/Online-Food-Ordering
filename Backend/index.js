import express from "express"
import cors from "cors"
import env from "dotenv"
env.config();

import pool from "./config/db.js"
import router from "./routes/auth.js"

const app = express()
const port = 3000

//middleware:
app.use(express.json())
app.use(cors())

//authorization:
app.use(router)

//home page handle

app.get("/", (req,res)=>{
    res.json({
        success: true,
        msg: "backend working"
    })
})

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})