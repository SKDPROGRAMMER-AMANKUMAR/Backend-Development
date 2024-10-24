import { ApiError} from "../utils/ApiError.js";
import  jwt  from "jsonwebtoken";
import {asyncHandler} from "../utils/asyncHandler.js"
import {User} from "../models/user.model.js" 

export const verifyJWT = asyncHandler(async(req, _, next) => {
    
    try {
        const token = await req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")/*
        req.cookies?.accessToken:
        Tries to retrieve the access token from cookies (if it exists).
        The ?. (optional chaining) prevents errors if cookies is undefined or missing. 
    
        || (Logical OR):
        If the access token is not found in cookies, it checks the Authorization header.
        
        req.header("Authorization")?.replace("Bearer ", ""):
        Extracts the token from the Authorization header by removing the "Bearer " prefix (if present).
    
        Final Value:
        The token variable will contain:
        The token from cookies if available, or
        The token from the Authorization header if not.
    
        This pattern ensures flexibility: the token can come either from cookies (for browser sessions) or the Authorization header (for API requests).
        */
       console.log(token);
    
        if(!token) {
            throw new ApiError(401,"Unauthorized request")
        }
    
        const decodedToken =  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)/*
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        Uses the jsonwebtoken library to verify the provided token.
        token: The access token to verify.
        process.env.ACCESS_TOKEN_SECRET: A secret key from your environment variables used to sign the token. If the token is altered, verification will fail.
        
        Verification Process:
        It checks the integrity (i.e., whether the token was tampered with) and expiration of the token.
        If the token is valid, it decodes and returns the payload (user data) stored inside the token.
    
        decodedToken:
        The decoded object typically contains user information (like userId, email, etc.) or whatever was  signed into the token.
    
        Error Handling:
        If the token is invalid or expired, the method will throw an error, usually requiring you to handle it with try-catch.
        */
    
        const user =   User.findById(decodedToken?._id).select("-password, -refreshToken")/*decodedToken?._id:
        This uses optional chaining to safely access the _id from decodedToken.
        If decodedToken is null or undefined, it avoids errors and simply returns undefined.

        User.findById(decodedToken?._id):
        findById is a Mongoose method that retrieves a user from the database based on their unique MongoDB ID (_id).

        select("-password -refreshToken"):
         The .select() method is used to exclude specific fields from the retrieved document.
         Here, it excludes the password and refreshToken fields to avoid exposing sensitive information.

         user:
         The result is an object containing the user's data but without the password or refresh token.
         */
    
        if(!user) {
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user;
        next()
    
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})

