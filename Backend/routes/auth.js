import express from "express"

import { authLogin, authRegister, authRestaurantLogin, authRestaurantRegister } from "../controllers/authController.js";

const router = express.Router()

router.post("/registeration", authRegister);

router.post("/login", authLogin);

router.post("/restaurantRegister", authRestaurantRegister);

router.post("/restaurantLogin", authRestaurantLogin);

export default router;