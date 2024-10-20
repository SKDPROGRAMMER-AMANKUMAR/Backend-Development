import connectDB from "./db/Database.js"
import dotenv from "dotenv"
dotenv.config({
    path:'./env'
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT ||8000,() => {
        console.log(`Server is running at port: ${process.env.PORT}`);
    })
}) //Because in this case we import connectDB() from Database.js and in database.js , there is async function so it'll return a promise , and we  handle that promise over here . 
.catch((error)=>{
  console.log("MONGO db connection failed !!! ", error);
})



















/*  The below  commented code is first method to connect with database professionaly for production grade  within index.js file 

(async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`) //"process.env" helps access environment variables securely. //"mongoose.connect()" establishes a connection to the MongoDB server using the provided URI and database name.

        app.on("error",(error)=>{ //listens for errors in the app and runs the provided callback when an error occurs, allowing for proper error handling.
            console.log("ERROR: ",error);
            throw error
        })

        app.listen(process.env.port,()=>{
            console.log(`App is listening on port ${process.env.PORT}`);
            
        })
    } catch (error) {
        console.log("ERROR",error);
        throw err
    }
})()

*/