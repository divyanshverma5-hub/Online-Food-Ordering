import express from "express"
import { addFood, deleteItem, editItem, homeRestaurant } from "../controllers/RMenuCRUDController.js";

const router = express.Router()

//home page for restaurant:
router.get("/homeRestaurant", homeRestaurant)

// Add item: 
router.post("/addFood", addFood)

//Delete Item: 
router.delete("/homeRestaurant/delete/:id_item", deleteItem)

//Edit Item:
router.patch("/homeRestaurant/edit", editItem)

export default router