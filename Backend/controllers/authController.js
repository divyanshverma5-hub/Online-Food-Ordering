import pool from "../config/db.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { uploadToCloudinary } from "../utils/cloudinary.js";

const saltRounds = Number(process.env.SALTROUNDS);

export async function authRegister(req, res) {
    try {
        const { name, email, password, phone } = req.body;

        if (!email || !password || !phone) {
            return res.json({
                success: false,
                msg: "Essential details required"
            });
        }

        // Prevent duplicate email
        const check = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (check.rows.length > 0) {
            return res.json({
                success: false,
                msg: "Email already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Save hashed password
        const result = await pool.query(
            "INSERT INTO users (name, email, password, phone) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, email, hashedPassword, phone]
        );

        const user = result.rows[0];

        jwt.sign(
            {
                name: user.name,
                id: user.id,
                email: user.email
            },
            process.env.JWT_SECRETKEY,
            { expiresIn: "5d" },
            (error, token) => {

                if (error) {
                    return res.json({
                        success: false,
                        msg: "Token generation failed"
                    });
                }

                res.json({
                    success: true,
                    msg: "Signup done",
                    token,
                    id: user.id
                });
            }
        );

    } catch (err) {
        console.error(err.message);

        res.json({
            success: false,
            msg: "Signup failed"
        });
    }
}

export async function authLogin(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({
                success: false,
                msg: "Email and password required."
            });
        }

        // Find user only by email
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.json({
                success: false,
                msg: "Invalid email or password"
            });
        }

        const user = result.rows[0];

        // Compare entered password with stored hash
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.json({
                success: false,
                msg: "Invalid email or password"
            });
        }

        jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_SECRETKEY,
            { expiresIn: "5d" },
            (error, token) => {

                if (error) {
                    return res.json({
                        success: false,
                        msg: "Token generation failed"
                    });
                }

                res.json({
                    success: true,
                    msg: "Login done",
                    token,
                    id: user.id,
                    name: user.name
                });
            }
        );

    } catch (err) {
        console.error(err.message);

        res.json({
            success: false,
            msg: "Login failed"
        });
    }
}

export async function authRestaurantRegister(req, res) {
    try {
        const { owner_name, r_name, email, password, phone, location, city, img_url } = req.body;

        if (!email || !password || !city) {
            return res.json({
                success: false,
                msg: "Fill every necessary (*) detail"
            });
        }

        // Prevent duplicate email
        const check = await pool.query(
            "SELECT * FROM restaurantUsers WHERE email = $1",
            [email]
        );

        if (check.rows.length > 0) {
            return res.json({
                success: false,
                msg: "Email already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        //cloudinary:
        let imageUrl = "https://b.zmtcdn.com/data/pictures/7/22645887/48f15dd0608d788c0ab56d19bac1edb0.jpg";
        let publicId = null;

        if (req.file) {
            const image = await uploadToCloudinary(req.file.buffer);
            imageUrl = image.secure_url;
            publicId = image.public_id;
        }
        // const image = await uploadToCloudinary(req.file.buffer);

        // Save hashed password
        const result = await pool.query(
            "INSERT INTO restaurantUsers (owner_name,restaurant_name, email, password, phone, location, city, img_url, cloudinary_public_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
            [owner_name, r_name, email, hashedPassword, phone, location, city, imageUrl, publicId]
        );

        const user = result.rows[0];

        jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_SECRETKEY,
            { expiresIn: "5d" },
            (error, token) => {

                if (error) {
                    return res.json({
                        success: false,
                        msg: "Token generation failed"
                    });
                }

                res.json({
                    success: true,
                    msg: "Signup done",
                    id: user.id,
                    token
                });
            }
        );

    } catch (err) {
        console.error(err.message);

        res.json({
            success: false,
            msg: "Restaurant Signup failed"
        });
    }
}

export async function authRestaurantLogin(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({
                success: false,
                msg: "Email and password required."
            });
        }

        // Find user only by email
        const result = await pool.query(
            "SELECT * FROM restaurantUsers WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.json({
                success: false,
                msg: "Invalid email or password"
            });
        }

        const user = result.rows[0];

        // Compare entered password with stored hash
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.json({
                success: false,
                msg: "Invalid email or password"
            });
        }

        jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_SECRETKEY,
            { expiresIn: "5d" },
            (error, token) => {

                if (error) {
                    return res.json({
                        success: false,
                        msg: "Token generation failed",
                    });
                }

                res.json({
                    success: true,
                    msg: "Login done",
                    token,
                    id: user.id,
                    name: user.owner_name
                });
            }
        );

    } catch (err) {
        console.error(err.message);

        res.json({
            success: false,
            msg: "Login failed"
        });
    }
}