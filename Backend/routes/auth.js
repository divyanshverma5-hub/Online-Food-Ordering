import express from "express"

import { authLogin, authRegister, authRestaurantLogin, authRestaurantRegister } from "../controllers/authController.js";
import upload from "../middleware/multer.js";

const router = express.Router()

router.post("/registeration", authRegister);

router.post("/login", authLogin);

router.post("/restaurantRegister",upload.single("image"), authRestaurantRegister);

router.post("/restaurantLogin", authRestaurantLogin);

export default router;