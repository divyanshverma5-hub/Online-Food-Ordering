import Razorpay from "razorpay"
import crypto from "crypto"
import env from "dotenv"
env.config();

import pool from "../config/db.js";
import { emitToUser } from "../socket/socket.js";

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET
})

const pendingOrders = {};

export async function checkout(req, res) {
    try {
        const customer_id = req.user.id;
        const { address } = req.body;

        const cartResult = await pool.query(`SELECT cart.food_id, cart.quantity, food.price, food.restaurant_id
             FROM cart JOIN food
             ON cart.food_id = food.id
             WHERE cart.customer_id = $1`,
            [customer_id]
        );

        if (cartResult.rows.length === 0) {
            return res.status(400).json({
                success: false,
                msg: "Cart is empty"
            });
        }
        const cartItems = cartResult.rows;
        const restaurant_id = cartItems[0].restaurant_id;

        let amount = 0;
        for (const item of cartItems) {
            amount += Number(item.price) * Number(item.quantity);
        }

        // console.log(req.body);
        const order = await instance.orders.create({
            amount: Math.round(Number(amount) * 100),
            currency: "INR",
        });

        pendingOrders[order.id] = {
            customer_id,
            restaurant_id,
            address,
            amount
        };
        //used ES6 shorthand!
        // pendingOrders[order.id] = {
        //     customer_id: customer_id,
        //     restaurant_id: restaurant_id,
        //     address: address,
        //     amount: amount
        // };

        res.json({
            success: true,
            order
        });

    } catch (err) {
        res.status(500).status(500).json({
            success: false,
            error: err.message
        });
    }
}

export async function paymentVerification(req, res) {
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
        const order_id = ordering.rows[0].id;

        console.log("Sending new-order to restaurant", details.restaurant_id);
        emitToUser(
            "restaurant",
            details.restaurant_id,
            "new-order",
            {
                orderId: order_id
            }
        );

        let allItems = await pool.query("SELECT cart.food_id, cart.quantity, food.price FROM cart JOIN food ON cart.food_id = food.id WHERE customer_id = ($1)", [details.customer_id])
        allItems = allItems.rows;
        for (let i of allItems) {
            await pool.query("INSERT INTO orderItems (order_id, food_id, quantity, price_at_purchase) VALUES ($1, $2, $3, $4) ", [order_id, i.food_id, i.quantity, Math.round(i.price)])
        }
        await pool.query("DELETE FROM cart WHERE customer_id = ($1)", [details.customer_id])


        res.redirect(`http://localhost:5173/cart/confirmation?reference=${razorpay_payment_id}`)
    } else {
        res.status(400).json({
            success: false,
        })
    }
}