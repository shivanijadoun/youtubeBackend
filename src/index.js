//require('dotenv').config({path:./env})
import dotenv from "dotenv"
// import mongoose from "mongoose";
// import {DB_NAME} from "./constants"


import connectDB from "./db/index.js";

dotenv.config({
    path: './env'
})


connectDB()
.then(()=>{

    //write app handle error in this assignment from app.on
    app.listen(process.env.PORT || 8000 ,()=>{
      console.log(`Server is running at port : ${process.env.PORT}`);
    })
})
.catch(()=>{
    console.log(`MONGO db connection failed !!!`,error);

})







/*
import express from "express"
const app = express()

(async()=>{
  try {
   await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    app.on("error",(error)=>{
        console.log("ERROR:",error);
        throw error
    })

    app.listen(process.env.PORT,()=>{
        console.log(`App is listening on port ${process.env.PORT}`);

    })
  } catch (error) {
    console.error("ERROR:",error)
    throw err
  }
})()

*/








// function connectDB(){}

// connectDB();


//when data is coming from url then we use req.params

//we can take data from cookies as well from data.cookies

//we use middlewares with the help  use