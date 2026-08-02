import express from "express"
import { addFood, deleteItem, editItem, homeRestaurant } from "../controllers/RMenuCRUDController.js";
import upload from "../middleware/multer.js";

const router = express.Router()

//home page for restaurant:
router.get("/homeRestaurant", homeRestaurant)

// Add item: 
// router.post("/addFood", addFood)
router.post("/addFood",upload.single("foodImage"), addFood)

//Delete Item: 
router.delete("/homeRestaurant/delete/:id_item", deleteItem)

//Edit Item:
router.patch("/homeRestaurant/edit",upload.single("image"), editItem)

export default router