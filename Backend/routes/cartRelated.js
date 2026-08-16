import express from "express"

import { addToCart, cartCount, cartMenu, cartQuantity } from "../controllers/cartController.js";
import { authMiddleware, roleMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/addToCart", authMiddleware, roleMiddleware("customer"), addToCart)

router.get("/cart_menu", authMiddleware, roleMiddleware("customer"), cartMenu)

router.patch("/cart/quantity", authMiddleware, roleMiddleware("customer"), cartQuantity);

router.get("/cart/count", authMiddleware, roleMiddleware("customer"), cartCount);

export default router