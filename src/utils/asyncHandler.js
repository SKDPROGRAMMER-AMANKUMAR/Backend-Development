const asyncHandler = (requestHandler) => { /* const asyncHandler = (requestHandler) => {
    >>This line defines a higher-order function named asyncHandler.
    >>It takes a function (requestHandler) as an argument, which is intended to be an asynchronous route handler (e.g., a controller function in an Express route). */
  return   (req,res,next) => {/*(req, res, next) => {
        This returns a new function that takes three parameters:
        req: The request object from the client.
        res: The response object to send data back to the client.
        next: A function that passes control to the next middleware if needed.
         */
        Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err))/*Promise.resolve(requestHandler(req, res, next))
        >>This ensures that the requestHandler (which could be an async function) is executed within a promise.
        >>If the handler runs successfully, the promise resolves without issues.

        .catch((err) => next(err))
        >>If any error occurs during the execution of the requestHandler, the .catch() block catches the error.
        >>The error is passed to next(err), which triggers Express’s error-handling middleware.
         */
    }
}

// The above code  by using "Promise" method ☝️☝️☝️

export {asyncHandler}

// const asyncHandler = () => {}
// const asyncHandler = (func) => {() => {}}
// const asyncHandler = (func) => async() => {}













    // below the code by using "tye-catch" method 👇👇

// const asyncHandler = (fn) => async(req,res,next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
      //  res.status(err.code || 500).json({ 
            /*
              res.status(err.code || 500):
        Sets the HTTP status code to the error's code, or 500 if no code is provided(the phrase "if no code is provided" means that if the err object does not contain a specific HTTP status code (like 404, 401, or 400), the code will default to 500.).

           json({...}):
        Sends a JSON response to the client.

           success: false:
        Indicates that the operation was unsuccessful.

           message: err.message:
        Includes the specific error message for debugging or display purposes.
            */
     //       success: false,
    //        message:err.message
    //    })
    // }
// }