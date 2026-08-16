import pool from "../config/db.js";
import { emitToUser } from "../socket/socket.js";

export async function changeOrderStatus(req, res) {

    const { choice, order_id } = req.body;
    const restaurantId = req.user.id

    const orderCheck = await pool.query("SELECT restaurant_id FROM orders WHERE id = $1", [order_id]);
    if (orderCheck.rows.length === 0) {
        return res.status(404).json({
            success: false,
            msg: "Order not found"
        });
    }
    if (Number(orderCheck.rows[0].restaurant_id) !== Number(restaurantId)) {
        return res.status(403).json({
            success: false,
            msg: "You are not allowed to modify this order"
        });
    }

    await pool.query("UPDATE orders SET status = $1 WHERE id = $2", [choice, order_id]);

    const result = await pool.query("SELECT customer_id FROM orders WHERE id = $1", [order_id]);

    const customerId = result.rows[0].customer_id;

    console.log("STATUS UPDATE:", {
        orderId: order_id,
        customerId: customerId,
        status: choice
    });

    emitToUser(
        "customer",
        customerId,
        "order-status-updated",
        {
            orderId: order_id,
            status: choice
        }
    );

    res.json({
        success: true
    });
}

export async function seeOrderDishes(req, res) {
    const { id } = req.query;
    const userId = req.user.id;

    //now checking if authenticated user and user_in_urlRequest are same or not:

    const orderCheck = await pool.query("SELECT * FROM orders WHERE id = $1", [id]);

    if (orderCheck.rows.length === 0) {
        return res.status(404).json({
            success: false,
            msg: "Order not found"
        });
    }

    // console.log(orderCheck.rows);

    if (orderCheck.rows[0].customer_id !== userId) {
        return res.status(403).json({
            success: false,
            msg: "You are not allowed to view this order"
        });
    }


    let result = await pool.query("SELECT orderItems.price_at_purchase, orderItems.quantity, food.food_name FROM orderItems JOIN food ON orderItems.food_id = food.id WHERE order_id = $1", [id]);
    result = result.rows;

    res.json({
        success: true,
        dishes: result
    })
}

export async function restaurantOrderDetails(req, res) {
    // let { id } = req.query;
    let id = req.user.id;

    let result = await pool.query("SELECT orders.address, orders.id, orders.order_at, users.name , orders.status, orders.total_price, users.phone FROM orders JOIN users ON orders.customer_id = users.id WHERE restaurant_id = ($1) ORDER BY orders.order_at DESC", [id]);
    result = result.rows

    res.json({
        success: true,
        msg: "Sent Successfully",
        detail: result
    })
}

export async function orderDetails(req, res) {
    // let { id } = req.query;
    let id = req.user.id;
    console.log(id);

    let result = await pool.query("SELECT orders.address, orders.id, orders.order_at, orders.restaurant_id , orders.status, orders.total_price, restaurantUsers.restaurant_name FROM orders JOIN restaurantUsers ON orders.restaurant_id = restaurantUsers.id WHERE customer_id = ($1)", [id]);
    result = result.rows
    // console.log(result);

    res.json({
        success: true,
        msg: "Sent Successfully",
        detail: result
    })
}