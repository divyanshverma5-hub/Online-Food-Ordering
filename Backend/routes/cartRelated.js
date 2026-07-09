import express from "express"
import pool from "../config/db.js";

const router = express.Router();

router.post("/addToCart", async (req, res) => {

    let customer_id = req.body.customer_id;
    let food_id = req.body.food_id;

    // let twoRestaurants = await pool.query("SELECT * FROM cart WHERE restaurant_id!=")

    let isPresent = await pool.query("SELECT * FROM cart WHERE customer_id = $1 AND food_id = $2", [customer_id, food_id])
    // console.log(isPresent.rows);

    if (isPresent.rows.length == 0) {
        await pool.query("INSERT INTO cart (customer_id, food_id) VALUES ($1,$2)", [customer_id, food_id]);
    }
    else {
        let qty = isPresent.rows[0].quantity;
        await pool.query("UPDATE cart set quantity = $1 WHERE customer_id = $2 AND food_id = $3", [qty + 1, customer_id, food_id]);
    }

    res.json({
        success: true,
        msg: "Successfully Added to cart"
    })
})

router.get("/cart_menu", async (req, res) => {
    
    let customer_id = req.query.customer_id;
    let result = await pool.query(
        "SELECT cart.id, cart.quantity ,food.food_name ,food.price ,food.img_url ,food.description ,food.is_veg, food.id, food.restaurant_id FROM cart JOIN food ON cart.food_id = food.id WHERE cart.customer_id = $1 ORDER BY cart.id",
        [customer_id]);

    let total = await pool.query("SELECT food.food_name , food.price , cart.quantity FROM cart JOIN food ON food.id = cart.food_id")

    res.json({
        success: true,
        msg: "Successfully Added to cart",
        food: result.rows,
        total: total.rows
    })
})

router.patch("/cart/quantity", async (req,res)=>{
    let term = 1;
    if (req.body.sign == '-') term = -1;

    await pool.query("UPDATE cart SET quantity = $1 WHERE food_id = $2",[req.body.qty + term, req.body.food_id]);
    await pool.query("DELETE FROM cart WHERE quantity = ($1)", [0]);
    res.json({
        success:true,
        msg:"Updated Successfully"
    })
})

export default router