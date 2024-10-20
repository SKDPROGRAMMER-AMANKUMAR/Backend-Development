import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"})) /* Breakdown:
express.urlencoded():  Parses incoming requests with URL-encoded payloads.
Use case:   It’s mainly useful when data is sent from HTML forms via POST requests.
Example:   Converts name=John+Doe&age=30 into { name: "John Doe", age: 30 }.
 */

app.use(express.static("public"))/*Explanation:
Purpose: It enables your Express app to serve static assets, making it easier to deliver files like HTML, CSS, JavaScript, images, and other media directly to the client.
Directory: The "public" directory is where these static files are stored. You can create this directory in your project root and place any assets you want to serve in it.
Example: If you have a file called style.css in the public folder, you can access it in your browser via http://localhost:your-port/style.css after starting your server.
 */

app.use(cookieParser())/*allows your Express app to read cookies from incoming requests and makes them accessible via req.cookies. This is useful for tasks like session management, user preferences tracking, and authentication. Without this middleware, you’d need to manually parse the Cookie header.
 */

const app = express()

export { app }

//Most of the time you'll only be on Request and Response ['https://expressjs.com/en/5x/api.html']

// You've to only use app.use() in case of CORS , middlewares and configuration 