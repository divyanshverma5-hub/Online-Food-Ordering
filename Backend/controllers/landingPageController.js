import pool from "../config/db.js";

export async function cityController(req,res) {
    const {city}= req.params;
    console.log(city);
    let result = await pool.query('SELECT * FROM restaurantusers WHERE city = $1', [city]);
    result = result.rows;

    res.json({
        success: true,
        msg: "We got the city",
        result: result
    });
}

export async function detailsController(req,res) {
    const {id} = req.query
    let profile = await pool.query("SELECT * FROM restaurantUsers WHERE id = $1", [id]);
    profile = profile.rows[0];

    let menu = await pool.query("SELECT * FROM food WHERE restaurant_id = $1", [id]);
    menu = menu.rows;
    console.log(menu);

    res.json({
        success: true,
        msg: "Here's owner data",
        profile: profile,
        menu: menu
    })
}