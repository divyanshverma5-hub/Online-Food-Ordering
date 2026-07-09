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


router.post("/checkout", async (req, res) => {

    const order = await instance.orders.create({
        amount: Number(req.body.amount)*100,
        currency: "INR",
    })

    res.json({
        success: true,
        order
    })
})

router.post("/paymentVerification", async (req,res)=>{

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest('hex');

    if (expectedSignature === razorpay_signature) {
        // await pool.query(
        //     `INSERT INTO orders (customer_id, restaurant_id, total_price, status, address) VALUES ($1, $2, $3)`,
        //     [, , ]
        // );
        res.redirect(`http://localhost:5173/cart/confirmation?reference=${razorpay_payment_id}`)
    } else {
        res.status(400).json({
            success: false,
        })
    }
})

router.get("/razor_key",(req,res)=> res.json({key: process.env.RAZORPAY_KEY}));

export default router