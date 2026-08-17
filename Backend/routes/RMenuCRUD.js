import express from "express"
import { addFood, changeAvailability, editItem, homeRestaurant } from "../controllers/RMenuCRUDController.js";
import upload from "../middleware/multer.js";
import { authMiddleware, roleMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router()

//home page for restaurant:
router.get("/homeRestaurant", homeRestaurant)

// Add item: 
// router.post("/addFood", addFood)
router.post("/addFood", authMiddleware, roleMiddleware("restaurant"), upload.single("foodImage"), addFood)

//Availability Change: 
router.patch("/homeRestaurant/availability", authMiddleware, roleMiddleware("restaurant"), changeAvailability);

//Edit Item:
router.patch("/homeRestaurant/edit", authMiddleware, roleMiddleware("restaurant"), upload.single("image"), editItem)

export default router