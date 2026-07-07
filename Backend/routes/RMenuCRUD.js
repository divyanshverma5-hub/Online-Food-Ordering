import express from "express"
import pool from "../config/db.js"

const router = express.Router()

//home page for restaurant:

router.get("/homeRestaurant", async (req, res) => {
    console.log(req.query.id);
    let profile = await pool.query("SELECT * FROM restaurantUsers WHERE id = $1", [req.query.id]);
    profile = profile.rows[0];

    let food = await pool.query("SELECT * FROM food WHERE restaurant_id= $1", [req.query.id]);
    // console.log(food.rows);

    res.json({
        success: true,
        msg: "Backend of Restaurant dashboard",
        ans: profile,
        food_list: food.rows
    })
})

// Add item: 

router.post("/addFood", async (req, res) => {
    let result = req.body.data;

    await pool.query("INSERT INTO food (food_name, description, is_veg, category, price, restaurant_id, availability, img_url) VALUES ($1, $2 ,$3, $4, $5, $6, $7, $8)",
        [result.name, result.description, result.is_veg, result.category, result.price, result.r_id, result.availability, result.img_url]);

    res.json({
        success: true,
        msg: "Successfully Added Items"
    })
})

//Delete Item: 

router.delete("/homeRestaurant/delete/:id_item", async (req, res) => {
    let id_item = req.params.id_item;

    console.log("id_item: ");
    console.log(id_item);
    await pool.query("DELETE FROM food WHERE id = $1", [id_item]);
    //not deleted by verifying that it was sent by restraunt owner.
    res.json({
        success: true,
        msg: "Item deleted successfully",
    })
})

//Edit Item:

router.patch("/homeRestaurant/edit", async (req, res) => {
    let data = req.body.data;
    // console.log("id: ");
    // console.log(data.id);

    await pool.query("UPDATE food SET (food_name, description, is_veg, category, price, restaurant_id, availability, img_url) = ($1, $2, $3, $4, $5, $6, $7, $8) WHERE id = $9",
        [data.food_name, data.description, data.is_veg, data.category, data.price, data.restaurant_id, data.availability, data.img_url, data.id])

    res.json({
        success: true,
        msg: "Edited Successfully"
    })
})

export default router