import express from "express"
import cors from "cors"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import env from "dotenv"
env.config();

import pool from "./config/db.js"
const saltRounds= 10

const app = express()
const port = 3000


//middleware:
app.use(express.json())
app.use(cors())

//authorization:
app.post("/registeration", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!email || !password) {
            return res.json({
                success: false,
                msg: "Email and password required"
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
            "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
            [name, email, hashedPassword]
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
                    token
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
});

app.get("/", (req,res)=>{
    res.json({
        success: true,
        msg: "backend working"
    })
})


app.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})