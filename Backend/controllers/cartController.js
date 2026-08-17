import pool from "../config/db.js";

export async function addToCart(req, res) {

    const customer_id = req.user.id;
    const { food_id } = req.body;

    let twoRestaurants = await pool.query("SELECT food.restaurant_id FROM cart JOIN food ON food.id = cart.food_id WHERE cart.customer_id=$1 LIMIT 1", [customer_id]);
    let currentRestaurant = await pool.query("SELECT restaurant_id FROM food WHERE id = $1", [food_id]);

    //COMPARING:
    if (twoRestaurants.rows.length > 0 && twoRestaurants.rows[0].restaurant_id !== currentRestaurant.rows[0].restaurant_id) {
        return res.json({
            success: false,
            msg: "You can order from only one restaurant at a time."
        });
    }

    let isavailable = await pool.query("SELECT availability FROM food WHERE id = $1",[food_id]);
   
    if(!isavailable.rows[0].availability){
        res.json({
            success:false,
            msg: "Item is currently unavailable."
        })
    }

    let isPresent = await pool.query("SELECT * FROM cart WHERE customer_id = $1 AND food_id = $2", [customer_id, food_id])
    // console.log(isPresent.rows);

    if (isPresent.rows.length == 0) {
        await pool.query("INSERT INTO cart (customer_id, food_id) VALUES ($1,$2)", [customer_id, food_id]);
    }
    else {
        let qty = isPresent.rows[0].quantity;
        await pool.query("UPDATE cart set quantity = $1 WHERE customer_id = $2 AND food_id = $3", [qty + 1, customer_id, food_id]);
    }

    res.json({
        success: true,
        msg: "Item Added"
    })
}

export async function cartMenu(req, res) {
    const customer_id = req.user.id;
    let result = await pool.query(
        "SELECT cart.id, cart.quantity ,food.food_name ,food.price ,food.img_url ,food.description ,food.is_veg, food.id, food.restaurant_id, restaurantUsers.restaurant_name FROM cart JOIN food ON cart.food_id = food.id JOIN restaurantUsers ON food.restaurant_id = restaurantUsers.id      WHERE cart.customer_id = $1 ORDER BY cart.id",
        [customer_id]);

    let total = await pool.query(
        "SELECT food.food_name, food.price, cart.quantity FROM cart JOIN food ON food.id = cart.food_id WHERE cart.customer_id = $1",
        [customer_id]
    );

    let detail = await pool.query(
        "SELECT name, email, phone FROM users WHERE id= ($1)",
        [customer_id]
    )

    res.json({
        success: true,
        msg: "Successfully Added to cart",
        food: result.rows,
        total: total.rows,
        detail: detail.rows[0]
    })
}

export async function cartQuantity(req, res) {
    let term = 1;
    const customer_id = req.user.id;
    const { sign, qty, food_id } = req.body
    if (sign == '-') term = -1;

    await pool.query("UPDATE cart SET quantity = $1 WHERE food_id = $2 AND customer_id = $3", [qty + term, food_id, customer_id]);
    await pool.query("DELETE FROM cart WHERE quantity = ($1)", [0]);
    res.json({
        success: true,
        msg: "Updated Successfully"
    })
}

export async function cartCount(req,res) {

    const customer_id = req.user.id;

    let cnt = await pool.query('SELECT id FROM cart WHERE customer_id = $1', [customer_id]);

    res.send({
        success: true,
        cnt: cnt.rowCount
    })
}
