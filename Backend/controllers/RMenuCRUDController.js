import pool from "../config/db.js"

export async function homeRestaurant(req, res){
    
    const {id} = req.query
    let profile = await pool.query("SELECT * FROM restaurantUsers WHERE id = $1", [id]);
    profile = profile.rows[0];

    let food = await pool.query("SELECT * FROM food WHERE restaurant_id= $1", [id]);
    // console.log(food.rows);

    res.json({
        success: true,
        msg: "Backend of Restaurant dashboard",
        ans: profile,
        food_list: food.rows
    })
}

export async function addFood(req, res){
    let {data} = req.body;

    await pool.query("INSERT INTO food (food_name, description, is_veg, category, price, restaurant_id, availability, img_url) VALUES ($1, $2 ,$3, $4, $5, $6, $7, $8)",
        [data.name, data.description, data.is_veg, data.category, data.price, data.r_id, data.availability, data.img_url]);

    res.json({
        success: true,
        msg: "Successfully Added Items"
    })
}

export async function deleteItem(req, res){
    const {id_item} = req.params;

    // console.log(id_item);
    await pool.query("DELETE FROM food WHERE id = $1", [id_item]);
    
    res.json({
        success: true,
        msg: "Item deleted successfully",
    })
}

export async function editItem(req, res){
    const {data} = req.body;

    await pool.query("UPDATE food SET (food_name, description, is_veg, category, price, restaurant_id, availability, img_url) = ($1, $2, $3, $4, $5, $6, $7, $8) WHERE id = $9",
        [data.food_name, data.description, data.is_veg, data.category, data.price, data.restaurant_id, data.availability, data.img_url, data.id])

    res.json({
        success: true,
        msg: "Edited Successfully"
    })
}