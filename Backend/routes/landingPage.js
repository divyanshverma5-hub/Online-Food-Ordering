import express from "express"
import pool from "../config/db.js";

const router = express.Router();

router.get("/city/:city", async (req, res) => {
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

router.get("/details", async (req, res) => {
    let profile = await pool.query("SELECT * FROM restaurantUsers WHERE id = $1", [req.query.id]);
    profile = profile.rows[0];

    let menu = await pool.query("SELECT * FROM food WHERE restaurant_id = $1", [req.query.id]);
    menu = menu.rows;
    console.log(menu);

    res.json({
        success: true,
        msg: "Here's owner data",
        profile: profile,
        menu: menu
    })
})

export default router;