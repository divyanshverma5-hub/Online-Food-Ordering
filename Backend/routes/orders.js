import express from "express"
import { restaurantOrderDetails, orderDetails, changeOrderStatus, seeOrderDishes } from "../controllers/ordersController.js";
import { authMiddleware, roleMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/details", authMiddleware, roleMiddleware("customer"), orderDetails)

router.get("/restaurant/details", authMiddleware, roleMiddleware("restaurant"), restaurantOrderDetails)

router.get("/seeDishes", authMiddleware, roleMiddleware("customer"), seeOrderDishes)

router.patch("/changeStatus", authMiddleware, roleMiddleware("restaurant"), changeOrderStatus);

export default router;