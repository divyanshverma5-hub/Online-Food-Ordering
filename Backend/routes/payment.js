import express from "express"

import { checkout, paymentVerification } from "../controllers/paymentController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/checkout",authMiddleware, checkout);

router.post("/paymentVerification",authMiddleware, paymentVerification)

router.get("/razor_key", (req, res) => res.json({ key: process.env.RAZORPAY_KEY }));

export default router