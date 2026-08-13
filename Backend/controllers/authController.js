import pool from "../config/db.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { uploadToCloudinary } from "../utils/cloudinary.js";

import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const saltRounds = Number(process.env.SALTROUNDS);

export const googleLogin = async (req, res) => {
    try {
        const { token } = req.body;

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        const { email, name } = payload;

        let result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        let user;

        //Existing user
        if (result.rows.length > 0) {
            user = result.rows[0];

            const jwtToken = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                },
                process.env.JWT_SECRETKEY,
                {
                    expiresIn: "7d",
                }
            );

            return res.status(200).json({
                success: true,
                token: jwtToken,
                user,
            });
        }

        //New User

        result = await pool.query(`INSERT INTO users(name,email,password,auth_provider) VALUES($1,$2,NULL,'google') RETURNING *`, [name, email]);

        user = result.rows[0];

        const jwtToken = jwt.sign(
            {
                id: user.id,
                email: user.email,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        return res.json({
            success: true,
            msg: "Login done",
            token: jwtToken,
            id: user.id,
            name: user.name,
            email: user.email
        });
    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export async function authRegister(req, res) {
    try {
        const { name, email, password, phone } = req.body;

        if (!email || !password || !phone) {
            return res.json({
                success: false,
                msg: "Essential details required"
            });
        }

        // Preventing duplicate email
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
            "INSERT INTO users (name, email, password, phone, auth_provider) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [name, email, hashedPassword, phone, 'local']
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


        if (user.auth_provider === "google") {
            return res.status(400).json({
                message: "This account was created using Google. Please sign in with Google."
            });
        }

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