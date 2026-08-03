import express from "express"

import { addToCart, cartCount, cartMenu, cartQuantity } from "../controllers/cartController.js";

const router = express.Router();

router.post("/addToCart", addToCart)

router.get("/cart_menu", cartMenu)

router.patch("/cart/quantity", cartQuantity);

router.get("/cart/count", cartCount);

export default router