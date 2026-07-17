import pool from "../config/db.js";

export async function cityController(req, res) {
    const { city } = req.params;
    console.log(city);
    let result = await pool.query('SELECT * FROM restaurantusers WHERE city = $1', [city]);
    result = result.rows;

    res.json({
        success: true,
        msg: "We got the city",
        result: result
    });
}

export async function detailsController(req, res) {
    const { id } = req.query
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

export async function searchController(req, res) {
    const { category, city } = req.query
    // console.log(category)
    // console.log(city)

    let result = await pool.query("SELECT DISTINCT restaurantUsers.* FROM restaurantUsers JOIN food ON food.restaurant_id = restaurantUsers.id WHERE food.category = $1 AND restaurantUsers.city = $2", [category, city]);

    res.json({
        success: true,
        restaurants: result.rows
    })
}

export async function customerProfile(req, res) {
    const { customer_id } = req.query;
    const data = await pool.query("SELECT * FROM users WHERE id = ($1)", [customer_id]);

    res.json({
        success: true,
        data: data.rows
    })
}

export async function EDITcustomerProfile(req, res) {
    const { name, phone, id } = req.body
    console.log(name)
    console.log(phone)

    await pool.query("UPDATE users SET name = $1, phone = $2 WHERE id =$3", [name, phone, id])
    console.log("Done")

    res.json({
        success: true,
        msg: "Changed Successfully"
    })
}

export async function restaurantProfile(req, res) {
    const { restaurant_id } = req.query;
    const data = await pool.query("SELECT * FROM restaurantUsers WHERE id = ($1)", [restaurant_id]);

    res.json({
        success: true,
        data: data.rows
    })
}

export async function EDITrestaurantProfile(req, res) {
    const { owner_name, restaurant_name, phone, city, location, open_time, close_time, img_url, id } = req.body

    await pool.query(
        "UPDATE restaurantUsers SET owner_name = $1, restaurant_name = $2,phone = $3, city = $4, location = $5, open_time = $6, close_time = $7, img_url = $8 WHERE id =$9",
        [owner_name, restaurant_name, phone, city, location, open_time, close_time, img_url, id]
    );
    console.log("Done")

    res.json({
        success: true,
        msg: "Changed Successfully"
    })
}