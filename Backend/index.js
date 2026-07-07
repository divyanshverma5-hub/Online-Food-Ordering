import express from "express"
import cors from "cors"
import env from "dotenv"
env.config();

import pool from "./config/db.js"
import router from "./routes/auth.js"
import rMenuCrud from "./routes/RMenuCRUD.js"

const app = express()
const port = 3000

//middleware:
app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

//authorization:
app.use(router)

///////////////////////////////////////////////////////////////////////////////////////////////////////
//home page handle

app.get("/city/:city", async (req, res) => {
    let city = req.params.city;
    console.log(city);
    let result = await pool.query('SELECT * FROM restaurantusers WHERE city = $1', [city]);
    result = result.rows;

    res.json({
        success: true,
        msg: "We got the city",
        result: result
    });
})

app.get("/details", async(req,res)=>{
    let profile = await pool.query("SELECT * FROM restaurantUsers WHERE id = $1", [req.query.id]);
    profile = profile.rows[0];
    
    let menu = await pool.query("SELECT * FROM food WHERE restaurant_id = $1", [req.query.id]);
    menu = menu.rows;
    console.log(menu);

    res.json({
        success:true,
        msg:"Here's owner data",
        profile: profile,
        menu: menu
    })
})





///////////////////////////////////////////////////////////////////////////////////////////////////////

// Restaurant Home Page: 
app.use(rMenuCrud);


app.get("/", (req, res) => {
    res.json({
        success: true,
        msg: "backend working"
    })
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})