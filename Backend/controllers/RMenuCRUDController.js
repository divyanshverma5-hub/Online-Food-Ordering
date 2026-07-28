import cloudinary from "../config/cloudinary.js";
import pool from "../config/db.js"
import { uploadToCloudinary } from "../utils/cloudinary.js";

export async function homeRestaurant(req, res) {

    const { id } = req.query
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

export async function addFood(req, res) {

    const { name, description, is_veg, category, price, r_id, availability } = req.body;

    let imageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQL2a8mpGPRqqiVGmjV-XuhpdE5n3duNtapPiz6jeR_mQwzqWQWHTCham0&s=10";
    let publicId = null;

    if (req.file) {
        const image = await uploadToCloudinary(req.file.buffer);
        imageUrl = image.secure_url;
        publicId = image.public_id;
    }

    await pool.query("INSERT INTO food (food_name, description, is_veg, category, price, restaurant_id, availability, img_url, cloudinary_public_id) VALUES ($1, $2 ,$3, $4, $5, $6, $7, $8, $9)",
        [name, description, is_veg, category, price, r_id, availability, imageUrl, publicId]);

    res.json({
        success: true,
        msg: "Successfully Added Items"
    })
}

export async function deleteItem(req, res) {
    const { id_item } = req.params;

    // console.log(id_item);
    await pool.query("DELETE FROM food WHERE id = $1", [id_item]);

    res.json({
        success: true,
        msg: "Item deleted successfully",
    })
}

export async function editItem(req, res) {

    const { category, availability, description, food_name, is_veg, price, id, restaurant_id, cloudinary_public_id, img_url } = req.body;

    let imageUrl = img_url;
    let publicId = cloudinary_public_id;

    if (req.file) {
        const image = await uploadToCloudinary(req.file.buffer);

        // Delete old image
        if (cloudinary_public_id) {
            await cloudinary.uploader.destroy(cloudinary_public_id);
        }

        imageUrl = image.secure_url;
        publicId = image.public_id;
    }

    await pool.query(
        `UPDATE food
         SET food_name = $1, description = $2, is_veg = $3, category = $4, price = $5, restaurant_id = $6, availability = $7, img_url = $8, cloudinary_public_id = $9 WHERE id = $10`,
        [food_name, description, is_veg, category, price, restaurant_id, availability, imageUrl, publicId, id]
    );

    res.json({
        success: true,
        msg: "Edited Successfully"
    });

}
