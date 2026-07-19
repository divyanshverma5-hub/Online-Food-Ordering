import express from "express"
import pool from "../config/db.js";

import { cityController, customerProfile, detailsController, EDITcustomerProfile, EDITrestaurantProfile, restaurantProfile, searchController } from "../controllers/landingPageController.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.get("/city/:city", cityController)

router.get("/details", detailsController)

router.get("/search", searchController)

router.get("/profileCustomer", customerProfile)
router.patch("/editCustomerProfile", EDITcustomerProfile)

router.get("/profileRestaurant", restaurantProfile)
router.patch("/editRestaurantProfile",upload.single("image"), EDITrestaurantProfile)

export default router;