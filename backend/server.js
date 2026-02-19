import express from "express"
import "dotenv/config"
import mongoose from "mongoose";
import userRoute from "./routes/userRoute.js"
import productRoute from "./routes/productRoute.js"
import cartRoute from "./routes/cartRoute.js"
import orderRoute from "./routes/orderRoute.js"

import cors from 'cors'


const app = express()
const PORT = process.env.PORT || 3000


app.use(express.json())
app.use(cors({
    origin: 'https://bazario-e-commerce-frontend.onrender.com', 
    credentials: true
}))

app.use("/api/user", userRoute)
app.use("/api/product", productRoute)
app.use("/api/cart", cartRoute)
app.use("/api/orders", orderRoute)


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
         console.log("MongoDB Connceted successfully")
        
    } catch (error) {
    
     console.log("MongoDB connection failed", error)   
    }
}


app.listen(PORT, () => {
    connectDB()
    console.log(`Server is Listening on : ${PORT}`)
})