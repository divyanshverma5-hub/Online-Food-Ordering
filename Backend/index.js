import express from "express"
import cors from "cors"
import env from "dotenv"
env.config();

import pool from "./config/db.js"
import router from "./routes/auth.js"
import rMenuCrud from "./routes/RMenuCRUD.js"
import cart from "./routes/cartRelated.js";
import home from "./routes/landingPage.js";
import payment from "./routes/payment.js";
import orders from "./routes/orders.js";

const app = express()
const port = 3000

//middleware:
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

//authorization:
app.use(router)

// Restaurant Home Page: 
app.use(rMenuCrud);

// Cart Page
app.use(cart)

//home page handle
app.use(home);

//payment
app.use(payment);

//orders related:
app.use("/order",orders);


///////////////////////////////////////////////////////////////////////////////////////////////////////






///////////////////////////////////////////////////////////////////////////////////////////////////////



app.get("/", (req, res) => {
    res.json({
        success: true,
        msg: "backend working"
    })
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
