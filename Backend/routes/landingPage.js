import express from "express"
import pool from "../config/db.js";

import { cityController, customerProfile, detailsController, EDITcustomerProfile, EDITrestaurantProfile, restaurantProfile, searchController } from "../controllers/landingPageController.js";
import upload from "../middleware/multer.js";
import { authMiddleware, roleMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/city/:city", cityController)

router.get("/details", detailsController)

router.get("/search", searchController)

router.get("/profileCustomer", authMiddleware, roleMiddleware("customer"), customerProfile)
router.patch("/editCustomerProfile", authMiddleware, roleMiddleware("customer"), EDITcustomerProfile)

router.get("/profileRestaurant", authMiddleware, roleMiddleware("restaurant"), restaurantProfile)
router.patch("/editRestaurantProfile", authMiddleware, roleMiddleware("restaurant"), upload.single("image"), EDITrestaurantProfile)

export default router;