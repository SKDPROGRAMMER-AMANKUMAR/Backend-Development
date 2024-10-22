import mongoose,{Schema} from "mongoose";
import  jwt  from "jsonwebtoken";
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
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
        },
        fullName:{
            type:String,
            required:true,
            trim:true,
            index:true
        },
        avatar:{
            type:String, //cloudinary url
            required:true,
        },
        coverImage:{
            type:String, //cloudinary url
            
        },
        watchHistory:[
            {
                type:Schema.Types.ObjectId,
                ref:"Video"
            }
        ],
        password:{
            type:String,
            required:[true, 'Password is required']
        },
        refreshToken:{
            type:String
        }
    },
    {
        timestamps:true
    }
)

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

   this.password = await bcrypt.hash(this.password, 10)
    next()
})  /*
userSchema.pre("save", ...):

This middleware function runs before saving a user document to the database.
if (!this.isModified("password")) return next();:

If the password field is not modified, skip the hashing process and move to the next middleware.
this.password = await bcrypt.hash(this.password, 10);:

If the password was modified, it hashes the password using bcrypt with a salt round of 10 for security.
next();:

Moves to the next operation or middleware after completing the hashing.

Purpose:
This ensures that the password is securely hashed before saving to the database, and prevents re-hashing it if the password hasn’t changed.
 */

userSchema.methods.isPasswordCorrect = async function(password){
   return await bcrypt.compare(password,this.password)
}/*
userSchema.methods.isPasswordCorrect:
This adds a custom method to the user schema, allowing all instances of the user model to use it.

async function (password):
The method takes a password input to compare with the stored hashed password.

bcrypt.compare(password, this.password):
Uses bcrypt to compare the plain-text password provided during login with the hashed password stored in the database.

return await:
The comparison is asynchronous, and it returns true if the passwords match, or false otherwise.
 */

userSchema.methods.generateAccessToken = function(){
  return  jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username:this.username,
            fullname:this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}/*
     generateAccessToken Method:

     Generates a JWT Access Token containing user information (_id, email, username, fullname).
     Uses the ACCESS_TOKEN_SECRET to sign the token.
     Token is valid for the duration specified by ACCESS_TOKEN_EXPIRY (like 1 day).

     Purpose:
     Access Token: Short-lived token for secure access to protected routes.
     Refresh Token: Long-lived token used to obtain new access tokens when the current one  expires.
     This setup ensures secure and smooth user authentication.
 */
userSchema.methods.generateRefreshToken = function(){
    return  jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}/*
    generateRefreshToken Method:

    Generates a Refresh Token containing only the user’s _id.
    Signed using the REFRESH_TOKEN_SECRET.
    Valid for the period defined by REFRESH_TOKEN_EXPIRY (like 10 days).

    Purpose:
    Access Token: Short-lived token for secure access to protected routes.
    Refresh Token: Long-lived token used to obtain new access tokens when the current one expires.
    This setup ensures secure and smooth user authentication.
*/

export const User = mongoose.model("User",userSchema)/*
This method is used during login to validate the user's password securely by comparing it with the stored hash.
*/