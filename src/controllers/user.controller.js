import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"


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

export { registerUser }