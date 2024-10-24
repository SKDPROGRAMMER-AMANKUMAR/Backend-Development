import { Router } from "express";
import {loginUser,logoutUser,refreshAccessToken,registerUser} from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router()

router.route("/register").post(
    upload.fields([
      {
        name:"avatar",
        maxCount:1
      },
      {
        name:"coverImage",
        maxCount:1
      }
    ]),
    registerUser
)/*router.route("/register").post(...)

Setting up a Route:
This line defines an endpoint for handling POST requests at the /register route.
The route accepts form-data for user registration.

upload.fields(...)
Handling File Uploads with multer:
This middleware (upload.fields) enables uploading multiple files with different field names.
upload refers to a Multer configuration object that stores files on the server or in memory (depending on your config).

Explanation of fields Array:
{ name: "avatar", maxCount: 1 }
>This part specifies that the user can upload one file for the field named "avatar".
{ name: "coverImage", maxCount: 1 }
>This part allows uploading one file for the field named "coverImage".

registerUser
Route Handler:
This is the function that will process the request once the files and data are uploaded.
It typically extracts the uploaded files and other form data from the request, performs validation, and saves the user information to the database.


Explanation of the Code:
Code:
javascript
Copy code
router.route("/register").post(
    upload.fields([
      { name: "avatar", maxCount: 1 },
      { name: "coverImage", maxCount: 1 }
    ]),
    registerUser
);
Step-by-Step Breakdown:
router.route("/register").post(...)

Setting up a Route:
This line defines an endpoint for handling POST requests at the /register route.
The route accepts form-data for user registration.
upload.fields(...)

Handling File Uploads with multer:

This middleware (upload.fields) enables uploading multiple files with different field names.
upload refers to a Multer configuration object that stores files on the server or in memory (depending on your config).
Explanation of fields Array:

{ name: "avatar", maxCount: 1 }
This part specifies that the user can upload one file for the field named "avatar".
{ name: "coverImage", maxCount: 1 }
This part allows uploading one file for the field named "coverImage".
registerUser

Route Handler:
This is the function that will process the request once the files and data are uploaded.
It typically extracts the uploaded files and other form data from the request, performs validation, and saves the user information to the database.

Endpoints Explained:
POST /register
Method: POST
Purpose: Handles user registration by:
Accepting uploaded files (avatar and coverImage).
Processing other form data (like email, password, etc.).
Calling the registerUser function to store the user details and respond to the client.

*/

router.route("/login").post(loginUser)

// secured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)

export default router