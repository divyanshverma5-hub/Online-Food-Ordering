import express from "express"
import {restaurantOrderDetails, orderDetails, changeOrderStatus, seeOrderDishes } from "../controllers/ordersController.js";

const router = express.Router();

router.get("/details", orderDetails)

router.get("/restaurant/details", restaurantOrderDetails)

router.get("/seeDishes", seeOrderDishes)

router.patch("/changeStatus", changeOrderStatus);

export default router;