import {asyncHandler} from "../utils/asyncHandler.js"

const registerUser = asyncHandler(async (req,res) => {/*
    asyncHandler:
    This is likely a middleware that simplifies error handling in async functions.
    It catches errors and passes them to Express’s next() function, preventing unhandled promise     rejections.

    async (req, res) => {}:
    This function is marked async to allow the use of await for asynchronous operations
    */
    res.status(200).json({/*res.status(200).json():
        Sends an HTTP response with status 200 (OK) and a JSON object { message: "ok" }.
        This indicates the request was successfully handled. 
        
        This code works well as a starting point for user registration. In production, you’ll need to:
        Add logic for user validation and saving to the database.
        Handle errors like duplicate users or invalid input.
        */
        message:"chai aur code "
    })
})

export {registerUser}