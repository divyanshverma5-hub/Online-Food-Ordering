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

    let r_id = req.user.id;

    const check = await pool.query("SELECT * FROM restaurantUsers WHERE id = $1", [r_id]);
    if (check.rows.length === 0) {
        return res.status(404).json({
            success: false,
            msg: "Restaurant not found"
        });
    }

    const { name, description, is_veg, category, price, availability } = req.body;

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

export async function changeAvailability(req, res) {

    try {
        const restaurantId = req.user.id;
        const { food_id, availability } = req.body;

        const result = await pool.query(`UPDATE food SET availability = $1 WHERE id = $2 AND restaurant_id = $3 RETURNING id, availability`,
            [availability, food_id, restaurantId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                msg: "Food not found or you are not authorised"
            });
        }

        res.json({
            success: true,
            msg: "Availability updated successfully",
            availability: result.rows[0].availability
        });

    } catch (error) {

        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Failed to update availability"
        });
    }
}

export async function editItem(req, res) {

    let restaurantId = req.user.id;

    const { category, availability, description, food_name, is_veg, price, id, cloudinary_public_id, img_url } = req.body;

    const foodCheck = await pool.query("SELECT restaurant_id FROM food WHERE id = $1",[id]);

    if (foodCheck.rows.length === 0) {
        return res.status(404).json({
            success: false,
            msg: "Food item not found"
        });
    }

    if (Number(foodCheck.rows[0].restaurant_id) !==Number(restaurantId)) {
        return res.status(403).json({
            success: false,
            msg: "You aren't authorised to edit this food item"
        });
    }

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
         SET food_name = $1, description = $2, is_veg = $3, category = $4, price = $5, availability = $6, img_url = $7, cloudinary_public_id = $8 WHERE id = $9`,
        [food_name, description, is_veg, category, price, availability, imageUrl, publicId, id]
    );

    res.json({
        success: true,
        msg: "Edited Successfully"
    });

}
