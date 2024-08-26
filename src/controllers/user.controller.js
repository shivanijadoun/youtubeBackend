import {asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"

import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/Cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"


const registerUser = asyncHandler( async(req,res)=>{
    //details
     const {fullName, email, username,password}=req.body
     console.log("email",email);


     //vaidation


    //  if(fullName ===""){
    //     throw new ApiError(400,"fullname is required")
    //  }



    //new way validation
    if(

        [fullName, email, username, passsword].some((field)=>field?.trim()==="")
    ){
        throw new ApiError(400,"All feilds are required")

    }
    

    //check user is already exist or not

    const existedUser = User.findOne({
        $or: [{username},{email}]

    })
    if(existedUser){
        throw new ApiError(409,"User with email or username already exist")
    }


    //check for cover images and avatar

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
         throw new ApiError(400,"Avatar file is required")
    }

    //upload them into cloudinary

    const avatar = await uploadOnCloudinary(avatarLocalPath)//await because uploading is time taking
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)



      //check upload haapend
      if(!avatar){
        throw new ApiError(400,"Avatar file is required")
      }


      //create entry in db

    const uset =  await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url||"",
        email,
        password,
        username:username.toLowerCase()

      })
            
    const createdUser =  await User.findById(user._id).select("-password -refreshToken")
    
    if(!createdUser){
        throw new ApiError(500 ,"Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"user registered successfully")
    )
})

export {registerUser}


//if we want to register the user


//1.) take input date(if you dont have frontend then take data from the postmen using get request)
//2.) check it is write or wrong(validation) -- not empty
//3.) check if user already exist (email ,username is unique)
//4.)check for images ,check for  avatar
//5.) upload them cloudinary
//6.) check upload happend or not
//7.) create user object -->create entry in db
//8.) remove password and refresh token file from response
//9.) cehck for user creation
//10.) return res
