import {User} from "../models/user.model.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import jwt from "jsonwebtoken"

const generateAccessAndRefreshTokens = async(userId) => { /*async (userId):
  This is an asynchronous function that takes a user ID as input. */
  try {
    const user = await User.findById(userId) /*User.findById(userId):
    Finds a user in the database by their unique user ID. */
    const accessToken = user.generateAccessToken()/*user.generateAccessToken():
    Calls a method on the user model to generate a new access token (likely a JWT). */
    const refreshToken = user.generateRefreshToken()/*user.generateRefreshToken():
    Similarly, generates a new refresh token for long-term session management. */
    
    user.refreshToken = refreshToken/*user.refreshToken = refreshToken:
    Stores the generated refresh token in the user’s database record. */
    await user.save({validateBeforeSave: false})/*user.save({ validateBeforeSave: false }):
    Saves the updated user object in the database, skipping field validation to speed up the operation. */

    return {accessToken,refreshToken}/*return { accessToken, refreshToken }:
    Returns both the access token and refresh token as an object to the caller. */

  } catch (error) {
     throw new ApiError(500, "Something went wrong while generating refresh and access token ")
  }
}
const registerUser = asyncHandler(async (req, res) => {/*
    asyncHandler:
    This is likely a middleware that simplifies error handling in async functions.
    It catches errors and passes them to Express’s next() function, preventing unhandled promise     rejections.

    async (req, res) => {}:
    This function is marked async to allow the use of await for asynchronous operations
    */
    /*res.status(200).json({res.status(200).json():
        Sends an HTTP response with status 200 (OK) and a JSON object { message: "ok" }.
        This indicates the request was successfully handled. 
        
        This code works well as a starting point for user registration. In production, you’ll need to:
        Add logic for user validation and saving to the database.
        Handle errors like duplicate users or invalid input.
        */
        // message: "chai aur code "
    // })
    /*Below is the steps to register the user
    1.get user details from frontend
    2.validation -not empty
    3.check if user already exists: check through {username,email}
    4.check for images, check for avatar
    5.upload themm to cloudinary,avatar
    6.create user object - create entry in db
    7.remove password and refresh token field from response 
    8.check for user creation 
    9.return response. 
    */

    const { fullName, email, username, password } = req.body
    /*console.log("email: ", email);const { fullName, email, username, password } = req.body;
    Destructuring Assignment:
    This line extracts specific properties (fullName, email, username, password) from the req.body object.
    req.body contains the data sent by the client in the body of an HTTP request, typically through a POST or PUT request (e.g., from a form submission).
    for Example: 
    If a client sends the following data:
  {
  "fullName": "John Doe",
  "email": "john@example.com",
  "username": "john_doe",
  "password": "123456"
  }
  Then:
  fullName will store "John Doe".
  email will store "john@example.com".
  username will store "john_doe".
  password will store "123456".

  When and Why This Code is Used:
  >>This code snippet is typically used in a backend route handler when:
  >>Handling user registration or login requests.
  >>Debugging and verifying whether the data is accessible.
  >>Ensuring that the required data (like email and password) is properly received from the client.
    */
  console.log(req.body); //--.This console is for checking the data that what type of data came , so that we can study it.
    if(
        [fullName,email,username,password].some((field)=>field?.trim() === "")
    ){
      throw new ApiError(400, "All fields are required")
    }

   const existedUser = await User.findOne({
        $or: [{ username },{ email }]
    })/*User.findOne(...):
    This is a Mongoose query to search for a single document (user) from the MongoDB collection associated with the User model.
    The query returns the first match it finds (if any). 
    
    $or Query Operator:
The $or operator is used to match at least one condition from an array of conditions.
In this case, it checks if either the username or the email matches the input provided in the request.

[{ username }, { email }]:
This array of conditions ensures that the query looks for a document where:
username matches the input username, OR
email matches the input email.
    
Purpose:
This code is typically used to check if a user already exists during registration.
If a user with the same username or email already exists, the registration might be blocked to avoid duplicates.
    */
    
    
    if(existedUser){
        throw new ApiError(409, "User with email or username already exists")
    }

    console.log(req.files);
    

    const avatarLocalPath = req.files?.avatar[0]?.path;
    /*const coverImageLocalPath = req.files?.coverImage[0]?.path;req.files: is an object provided by multer, containing files uploaded through a form.
    Each field corresponds to a file (or array of files) uploaded under a specific key (e.g., "avatar" or "coverImage").

    Optional Chaining (?.):
?. : ensures that if req.files or its keys (avatar or coverImage) are undefined or don't exist, the code won’t throw an error. Instead, it will return undefined.
This is useful for error handling—if no file is uploaded, the application won't crash.

Accessing File Paths:
req.files?.avatar[0]?.path:
Retrieves the local file path for the first (and only) file uploaded with the key "avatar".

Similarly, req.files?.coverImage[0]?.path retrieves the path for the "coverImage" file.

Purpose:
>>These paths point to where the uploaded files are temporarily stored on the server’s file system.
>>The paths will typically be used to read, process, or upload the files elsewhere (e.g., uploading them to a cloud storage service like Cloudinary).
     */

 let coverImageLocalPath;
if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
   coverImageLocalPath = req.files.coverImage[0].path
}/* 
This code snippet checks if there is a cover image file uploaded.
- `let coverImageLocalPath`: Declares a variable to hold the path of the cover image.
- The `if` condition checks:
  1. `req.files`: Ensures that the `files` property exists on the request object.
  2. `Array.isArray(req.files.coverImage)`: Verifies that `coverImage` is an array.
  3. `req.files.coverImage.length > 0`: Confirms that there is at least one file in the `coverImage` array.
- If all conditions are true, it assigns the path of the first uploaded cover image to `coverImageLocalPath`.
*/

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required")
    }

  const avatar =  await uploadOnCloudinary(avatarLocalPath)
  const coverImage =  await uploadOnCloudinary(coverImageLocalPath)

  if(!avatar){
    throw new ApiError(400, "Avatar file is required")
  }

  const user = await User.create({
    fullName,
    avatar:avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username:username.toLowerCase()
  })

 const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
 )/*User.findById(user._id):

>>This part queries the database to find a user document by its unique ID.
>>user._id: represents the unique identifier (MongoDB's ObjectId) of a specific user that was passed or obtained earlier in the code (likely during registration, login, etc.).

select() Method:
>>This modifies the query to include or exclude specific fields from the result.
>>"-password": Excludes the password field from the query result.
>>"-refreshToken": Excludes the refreshToken field from the query result.

Purpose of Exclusion:
>>Security measure: The password and refresh tokens are sensitive data and should not be exposed in API responses.
>>It ensures that only necessary user data is returned, helping to prevent accidental leaks.
 
 */

 if(!createdUser) {
    throw new ApiError(500,"Something went wrong while registering the user")
 }

 return res.status(201).json(
    new ApiResponse(200,createdUser,"User registered successfully ")
 )/*res.status(201):
>>Sets the HTTP status code of the response to 201 (Created).
>>Status code 201 indicates that a resource (in this case, a user) was successfully created on the server.

res.json():
>>Sends a JSON-formatted response to the client.
>>This ensures the response contains data that is easy to parse by the frontend or API consumer.

new ApiResponse(200, createdUser, "User registered successfully"):
>>ApiResponse is a custom class or constructor (assumed to be defined elsewhere).
>>It is used to standardize API responses by including:
>>>200: Indicates success (status code for success within the application logic).
>>>createdUser: Contains the user details returned from the User.findById() query (excluding sensitive fields).
>>>"User registered successfully": A message informing the client that the registration was successful.
  */

})

// const loginUser = asyncHandler(async (req, res)=>{
//   /*algorithm(steps) for loginUser:-
//    1.Take data from req.body
//    2.username or email
//    3.find the user
//    4.password check
//    5.acess and refresh token
//    6.send cookie
//   */
//  const {email, username, password} = req.body
//  console.log("Email is :- ",email);
 
//  if(!username && !email) {
//   console.log(email);
  
//    throw new ApiError(400, "username or email is required")
//  }

//    const user = await User.findOne({
//     $or: [{username}, {email}]
//    })

//    if(!user){
//     throw new ApiError(404, "User does not exist")
//    }

//    const isPasswordValid = await user.isPasswordCorrect(password)

//    if(!isPasswordValid){
//     throw new ApiError(401, "Invalid user credentials")
//    }

//    const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id)

//   const loggedInUser = User.findById(user._id).select("-password -refreshToken")

//   const options ={
//     httpOnly:true,
//     secure:true
//   }

//   return res.status(200)//res.status(200):Sets the HTTP status code to 200, indicating a successful request.
//   .cookie("accessToken",accessToken,options)/*cookie("accessToken", accessToken, options):
//   Stores the access token in a cookie named "accessToken" with the provided options (like expiration, security, etc.). */
//   .cookie("refreshToken",refreshToken,options)/*cookie("refreshToken", refreshToken, options):
//   Stores the refresh token in a cookie named "refreshToken" with the same options. */
//   .json(//json():Sends a JSON response to the client.
//     new ApiResponse(/*new ApiResponse():
//       Creates a new response object with:
//       Status: 200
//       Data: An object containing the user (loggedInUser), access token, and refresh token.
//       Message: "User logged In Successfully" */
//       200,
//       {
//         user:loggedInUser,accessToken,refreshToken
//       },
//       "User logged In Successfully"/*Final Output:
//       The client receives two cookies (accessToken and refreshToken) and a JSON response with the logged-in user details and tokens. This ensures secure session management by storing tokens in cookies. */
//     )
//   )
// })
// console.log(loginUser)  

const loginUser = asyncHandler(async (req, res) => {/*Purpose: Declares an asynchronous login function wrapped by asyncHandler to handle errors without try-catch.*/
  const { email, username, password } = req.body;/*Extracts email, username, and password from the request body sent by the client.
  */
  if (!email && !username) {
    throw new ApiError(400, "Email or username is required");
  }/*If both email and username are missing, it throws an error with status 400 (Bad Request). */

  const user = await User.findOne(
    { $or: [{ email }, { username }] },
    'username email password'
  ).exec();/*Finds a user in the database where the email or username matches.
  $or: Checks if either email or username matches.
  'username email password': Returns only those fields (projection).
  .exec(): Ensures the query is executed as a promise. */

  if (!user) {
    throw new ApiError(404, "User not found");
  }/*If no user is found, it throws a 404 (Not Found) error.
 */

  // Validate the password
  const isPasswordValid = await user.isPasswordCorrect(password);/*Compares the provided password with the one in the database using isPasswordCorrect(). */
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }/*If the password is incorrect, it throws a 401 (Unauthorized) error. */

  
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);/*Generates access and refresh tokens using the user’s _id.*/

  const options = {
    httpOnly: true,
    secure: true, 
  };/*httpOnly: Prevents access to cookies via JavaScript (reduces XSS attacks).
  secure: Ensures cookies are sent only over HTTPS.*/

  return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, { username: user.username }, "Login successful"));/*Sets status code 200 (OK).
    >>Stores tokens in cookies (accessToken and refreshToken) using the provided options.
    >>Sends JSON response containing:
    >>>The user’s username.
    >>>A message confirming login success.*/
});  // --->>> This code will work for loginUser and the above  commented "loginUser" code will not 



const logoutUser = asyncHandler(async(req, res)=>{ /*asyncHandler:
  This is a utility to handle asynchronous functions and catch errors without needing try-catch blocks.
  */
  await User.findByIdAndUpdate(/*User.findByIdAndUpdate():
    findByIdAndUpdate() is a Mongoose method used to find a user by their _id and update their data. */
    req.user._id,/*req.user._id:
    It assumes that the authenticated user's data is available in req.user (likely populated by authentication middleware). */
    {
      $set:{ /*$set: { refreshToken: undefined }:
        $set is a MongoDB operator that updates the value of a field.
        Here, it sets the refreshToken field to undefined to clear the user's refresh token from the database during logout. */
        refreshToken:undefined
      }
    },
    {
      new: true
    }
  )
  const options = {
    httpOnly:true,
    secure:true,
  }

  return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(new ApiResponse(200, {}, "User logged Out"))/*new ApiResponse(200, {}, "User logged Out"):
  Constructs a custom response object using the ApiResponse class.
  200: Status code.
  {}: Empty object, meaning no additional data is returned.
  "User logged Out": A success message to indicate the operation was successful. */
})

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =  req.cookies.refreshAccessToken || req.body.refreshAccessToken/*we named it incoming because we've also a refreshToken in our database. 
  
  req.cookies.refreshAccessToken:  
  >>This checks if the refresh token is stored in the cookies (common for security reasons).
  >>Storing tokens in HTTP-only cookies protects them from client-side JavaScript access and Cross-Site Scripting (XSS) attacks.

  req.body.refreshAccessToken:
  If the token isn’t found in cookies, it tries to retrieve it from the request body.
  This approach allows flexibility—e.g., when the client sends the token via a POST request payload.
  */

  if(!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request")
  }

  try {
    const decodedToken = jwt.verify(/*jwt.verify():
      >>This function verifies the JWT (JSON Web Token) using a secret key.
      >>It checks whether the incomingRefreshToken is valid, has not been tampered with, and is still within its expiry time. */
      incomingRefreshToken,/*incomingRefreshToken: The token provided by the client, typically from cookies or the request body.*/
      process.env.REFRESH_TOKEN_SECRET/*process.env.REFRESH_TOKEN_SECRET: The secret key stored in your environment variables. This is used to decode and verify the token’s signature.*/
    )
  
    const user = await User.findById(decodedToken?._id)/*decodedToken?._id:
    >>This uses optional chaining (?.) to safely access the _id field from the decodedToken.
    >>If the decodedToken is undefined or null (perhaps because token verification failed), the expression will return undefined instead of throwing an error.
    
    User.findById():
    >>This method is part of Mongoose, a popular MongoDB object modeling library.
    >>It looks up a document (user) in the MongoDB collection using the provided _id field.*/
  
    if(!user) {
      throw new ApiError(401, "Invalid refresh token")
    }
  
    if(incomingRefreshToken !== user?.refreshToken){/*incomingRefreshToken !== user?.refreshToken:
      >>Comparing the tokens: It checks if the incomingRefreshToken (sent by the client) matches the stored refreshToken in the user’s database record.
      >>Optional chaining (?.): Ensures that if user is null or undefined (e.g., the user was not found), it won’t throw an error and instead will return undefined.*/
      throw new ApiError(401,"Refresh token is expired or used")
    }
  
    const options = {/*These options are typically applied to authentication cookies, like tokens, to enhance security in production environments. They ensure the cookies are securely transmitted and cannot be accessed by malicious client-side scripts.*/
      httpOnly:true,
      secure:true,
    }/*This combination is essential when storing sensitive data (e.g., tokens) on the client for authentication systems using cookies.*/
  
    const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
  
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",newRefreshToken,options)
    .json(
      new ApiResponse(
        200,
        {
          accessToken,refreshToken: newRefreshToken
        },
        "Access token refreshed"
      )
    )
  } catch (error) {
     throw new ApiError(401, error?.message || "Invalid refresh token")
  }
})

const changeCurrentPassword = asyncHandler(async(req,res)=>{
  const {oldPassword, newPassword} = req.body/*Extracting Data from the Request Body:
  >>This line destructures the oldPassword and newPassword properties from the request’s body (req.body).
  */

  /*if there is one more options like :- (confirmPassword)
  then you've to like this:-
  if(!(newPassword === confirmPassword)){
    throw new error;
  }
  */

  const user = await User.findById(req.user?._id)/*The code looks for a user in the database using the user's ID from the req.user object.*/
  await user.isPasswordCorrect(oldPassword)/*The isPasswordCorrect method compares the provided oldPassword with the stored (hashed) password.
  
  This is likely a custom method defined on the user model, which internally:
  >>Uses a password-hashing library like bcrypt to compare the oldPassword with the hashed password in the database.
  >>Returns true or false based on the comparison.
  */
 if(!isPasswordCorrect) {
   throw new ApiError(400, "Invalid password")
 }
 
 user.password = newPassword/*This line replaces the user's current password with the new password from the request body.
 */
 await user.save({validateBeforeSave:false})/*The save() method commits changes to the database.
 >validateBeforeSave: false ensures that Mongoose skips schema validations before saving.
 
 This is useful when you want to avoid validation errors temporarily (e.g., if only some fields are updated, but others may fail schema validation).*/

 return res
 .status(200)/*This sets the HTTP status code to 200, which indicates a successful request (OK).*/
 .json(new ApiResponse(200, {} , "Password changed successully"))/*This sends a JSON response to the client.
 new ApiResponse(200, {}, "Password changed successfully"):
 200: Status code indicating success.
 {}: An empty object representing the data payload (could hold user details or other relevant info if needed).
 Message: "Password changed successfully" provides feedback to the client about the operation.*/
})

const getCurrentUser = asyncHandler(async(req,res)=>{
  return res
  .status(200)
  .json(200, req.user, "Current User fetched Successfully")
})

const updateAccountDetails = asyncHandler(async(req,res)=>{
  const {fullName, email} = req.body

  if(!(fullName || email)) {
    throw new ApiError(400, "All fields are required")
  }

 const user = User.findByIdAndUpdate( req.user?._id,/*User.findByIdAndUpdate():
  This method finds a user by their _id and updates their information.
  req.user?._id: Accesses the user's ID from the request object, assuming the user is authenticated and their ID is available.*/
  {
    $set:{
      fullName,//(fullName:fullName)
      email,//(email:email)

    }/*$set Operator:
The $set operator is used to update specific fields in the document.
Here, it updates the fullName and email of the user.
Shorthand syntax: Since the object key and value are the same (fullName: fullName and email: email), the shorthand fullName and email are used.*/
  },
  {new: true}/*{ new: true }:
  This option ensures that the updated user document is returned (instead of the old one).*/
 ).select("-password")/*.select("-password"):
 Excludes the password field from the returned user object for security reasons.*/

 return res
 .status(200)
 .json(new ApiResponse(200,user,"Account details updated successfully"))

})

const updateUserAvatar = asyncHandler(async(req,res) => {
   const avatarLocalPath = req.file?.path/*You can save it directly to the database(MongoDB) without using cloudinary*/

   if(!avatarLocalPath){
    throw new ApiError(400, "Avatar file is missing")
   }

   const avatar = await uploadOnCloudinary(avatarLocalPath)

   if(!avatar.url) {
      throw new ApiError(400, "Error while uploading on avatar")
   }

   const user = await User.findByIdAndUpdate(
       req.user?._id,
       {
        $set:{
          avatar:avatar.url
        }
       },
       {new:true}
   ).select("-password")
   
   return res
   .status(200)
   .json(
      new ApiResponse(200,user,"avatar image updated successfully ")
   )
})

const updateUserCoverImage = asyncHandler(async(req,res) => {
   const coverImageLocalPath = req.file?.path/*You can save it directly to the database(MongoDB) without using cloudinary*/

   if(!coverImageLocalPath){
    throw new ApiError(400, "coverImage file is missing")
   }

   const coverImage = await uploadOnCloudinary(coverImageLocalPath)

   if(!coverImage.url) {
      throw new ApiError(400, "Error while uploading on coverImage")
   }

   const user = await User.findByIdAndUpdate(
       req.user?._id,
       {
        $set:{
          coverImage:coverImage.url
        }
       },
       {new:true}
   ).select("-password")

   return res
   .status(200)
   .json(
      new ApiResponse(200,user,"Cover image updated successfully ")
   )
})

/*Note:- One advice for production level by Hitesh Sir :- whenever you try to update the file through user, write the controller of it  separetely and endpoints too */

export { registerUser,loginUser,logoutUser,refreshAccessToken,changeCurrentPassword,getCurrentUser,updateAccountDetails, updateUserAvatar,updateUserCoverImage }