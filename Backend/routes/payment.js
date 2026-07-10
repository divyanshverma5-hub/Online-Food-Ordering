import express from "express"
import Razorpay from "razorpay"
import crypto from "crypto"
import env from "dotenv"
env.config();
import pool from "../config/db.js";
const router = express.Router();

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET
})

const pendingOrders = {};


router.post("/checkout", async (req, res) => {
    try {
        console.log(req.body);
        const order = await instance.orders.create({
            amount: Math.round(Number(req.body.amount) * 100),
            currency: "INR",
        });

        pendingOrders[order.id] = {
            customer_id: req.body.customer_id,
            restaurant_id: req.body.restaurant_id,
            address: req.body.address,
            amount: req.body.amount
        };

        res.json({
            success: true,
            order
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

router.post("/paymentVerification", async (req, res) => {

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest('hex');

    if (expectedSignature === razorpay_signature) {
        const details = pendingOrders[razorpay_order_id];

        let ordering = await pool.query(
            `INSERT INTO orders (customer_id, restaurant_id, total_price, address) VALUES ($1, $2, $3, $4) RETURNING *`,
            [details.customer_id, details.restaurant_id, Math.round(details.amount), details.address]
        );

        // let order_id = ordering.id;
        let order_id = ordering.rows[0].id;

        let allItems = await pool.query("SELECT cart.food_id, cart.quantity, food.price FROM cart JOIN food ON cart.food_id = food.id WHERE customer_id = ($1)",[details.customer_id])
        allItems = allItems.rows;
        for (let i of allItems){
            await pool.query("INSERT INTO orderItems (order_id, food_id, quantity, price_at_purchase) VALUES ($1, $2, $3, $4) ",[order_id, i.food_id, i.quantity,Math.round(i.price)])
        }
        await pool.query("DELETE FROM cart WHERE customer_id = ($1)",[details.customer_id])




        res.redirect(`http://localhost:5173/cart/confirmation?reference=${razorpay_payment_id}`)
    } else {
        res.status(400).json({
            success: false,
        })
    }
})

router.get("/razor_key", (req, res) => res.json({ key: process.env.RAZORPAY_KEY }));

export default router