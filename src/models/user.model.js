import mongoose ,{Schema} from mongoose;
import { JsonWebTokenError } from "jsonwebtoken";
import bcrypt from "bcrypt"


const userSchema = new Schema(
  {
      username:{
         type:String,
         required:true,
         unique:true,
         lowercase:true,
         trim:true,
         index:true
      },
      
      fullname:{
         type:String,
         required:true,
         trim:true,
         index:true
        
      },
      avatar:{
        type:String,  //cloudinary url
        required:true
      },
      coverImage:{
        type:String,  //cloudinary url
      },
      watchHistory:[
        {
        type:Schema.Types.ObjectId,
        ref:"Video"
        }
      ],
      password:{
        type:String,
        required:[true,'Password is required']
      },
       refreshToken:{
        type:String,

       }
  },{
      timestamps:true
  }
)



//if you want todo something prior data then use pre function

//we are using this function to hash our password
userSchema.pre("save",async function(next){
    if(this.isModified("password")) return next();//check ki password modified hua h ya nhi


    this.password = bcrypt.hash(this.password,10)
    next()
    

})


// password is correct or not
userSchema.methods.isPasswordCorrect = async function(password){
   return await bcrypt.compare(password,this.password)
}


userSchema.methods.generateAccessToken = function(){
   return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
   return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullname
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User  = mongoose.model("User",userSchema)

//becrypt helps you to hash your password
//jwt --- is a bearre tokens (it is like a key)