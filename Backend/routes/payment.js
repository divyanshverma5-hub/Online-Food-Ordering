import express from "express"

import { checkout, paymentVerification } from "../controllers/paymentController.js";
const router = express.Router();

router.post("/checkout", checkout);

router.post("/paymentVerification", paymentVerification)

router.get("/razor_key", (req, res) => res.json({ key: process.env.RAZORPAY_KEY }));

export default router