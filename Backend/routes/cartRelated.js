import express from "express"

import { addToCart, cartMenu, cartQuantity } from "../controllers/cartController.js";

const router = express.Router();

router.post("/addToCart", addToCart)

router.get("/cart_menu", cartMenu)

router.patch("/cart/quantity", cartQuantity);

export default router