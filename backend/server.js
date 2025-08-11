import express from "express"
import cors from "cors"
import "dotenv/config"
import connectDB from "./config/mongodb.js"
import connectCloudinary from "./config/cloudinary.js"
import adminRouter from "./routes/admin.route.js"


//   APP CONFIG 
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()




// MIDDLEWARE
app.use(express.json())
app.use(cors())  




                               

//  API END POINT
app.use('/api/admin' ,adminRouter)
//   localhost:4000/api/admin/add-doctor



app.get("/" , (req,res) => {
    res.send("API WORKING Greate ......")
})

app.listen(port , ()=>{
    console.log("Server Started at" , port);
    
})





//  npm run server  run by using this (nodemon)




