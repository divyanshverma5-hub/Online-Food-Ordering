import express from "express"
import cors from "cors"
import env from "dotenv"

const app = express()
const port = 3000


//middleware:
app.use(express.json())
app.use(cors())


app.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})