import express from "express"
import pool from "../config/db.js";

const router = express.Router();

router.get("/details", async (req, res) => {
    let { id } = req.query;
    console.log(id);

    let result = await pool.query("SELECT orders.address, orders.id, orders.order_at, orders.restaurant_id , orders.status, orders.total_price, restaurantUsers.restaurant_name FROM orders JOIN restaurantUsers ON orders.restaurant_id = restaurantUsers.id WHERE customer_id = ($1)", [id]);
    result = result.rows
    // console.log(result);

    res.json({
        success: true,
        msg: "Sent Successfully",
        detail: result
    })
})

router.get("/restaurant/details", async (req, res) => {
    let { id } = req.query;
    console.log(id);

    let result = await pool.query("SELECT orders.address, orders.id, orders.order_at, users.name , orders.status, orders.total_price, users.phone FROM orders JOIN users ON orders.customer_id = users.id WHERE restaurant_id = ($1)", [id]);
    result = result.rows
    // console.log(result);

    res.json({
        success: true,
        msg: "Sent Successfully",
        detail: result
    })
})

router.get("/seeDishes", async(req,res)=>{
    console.log(req.query.id)
    let result = await pool.query("SELECT orderItems.price_at_purchase, orderItems.quantity, food.food_name FROM orderItems JOIN food ON orderItems.food_id = food.id WHERE order_id = $1", [req.query.id]);
    result = result.rows;

    res.json({
        success:true,
        dishes:result
    })
})

router.patch("/changeStatus", async (req,res)=>{
    // console.log(req.body);
    await pool.query("UPDATE orders SET status = $1 WHERE id = $2",[req.body.choice , req.body.order_id])

    res.json({
        success:true
    })
})

export default router;