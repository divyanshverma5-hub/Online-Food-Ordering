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

//home page for restaurant:
app.get("/homeRestaurant", async (req,res)=>{
    console.log(req.query.id);
    let ans = await pool.query("SELECT * FROM restaurantUsers WHERE id = $1",[req.query.id]);
    ans = ans.rows[0];
    res.json({
        success: true,
        msg: "Backend of Restaurant dashboard",
        ans: ans
    })
})

app.get("/", (req,res)=>{
    res.json({
        success: true,
        msg: "backend working"
    })
})

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})