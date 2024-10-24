import { v2 as cloudinary } from 'cloudinary';
import { log } from 'console';
import fs from "fs" /*import fs from "fs" imports the File System (fs) module, which is built into Node.js. It allows reading, writing, updating, and deleting files directly from your code.

Example use:
Reading a file: fs.readFile()
Writing a file: fs.writeFile()
Deleting a file: fs.unlink()

No installation needed—just import and use!
*/

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret:process.env.CLOUDINARY_API_SECRET  // Click 'View API Keys' above to copy your API secret
});
    
    // Upload an image
const uploadOnCloudinary = async (localFilePath,publicId = null) => {/*Added publicId Parameter:
    This allows the existing avatar to be replaced when updating the image.
    If publicId is provided, it uses it for overwriting the previous image.*/
    try {
        if (!localFilePath) return null;

        // Cloudinary upload options with public_id for replacement
        const options = {
            resource_type:"auto", //Detect file type automatically
            ...(publicId && {public_id:publicId,overwrite:true}),/*overwrite: true Option:
            Ensures that the new image replaces the old one seamlessly on Cloudinary without duplicating files.*/
        };
        //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath,options, {
            resource_type:"auto"  //it'll automatically detect what is the type of file(is it video,image,pdf etc.)
        })
        //file has been uploaded successfully 
        // console.log("file is uploaded on cloudinary",response.url);
        fs.unlinkSync(localFilePath) //In the future if any file came to localfilePath , then after sending it to cloudinary , it'll remove the file from localfilePath, and similarly in the case of error , means if file not come to localfilePath, then because of some error, then it'll also get removed from localfilePath.
        console.log("File uploaded",response); //--.This console is for checking the data that what type of data came , so that we can study it. 
        return response;
        
    } catch (error) {
        fs.unlinkSync(localFilePath) //remove the locallly saved temporary file as the upload operation got failed
        console.error("Upload failed:",error)
        return null;
    }
} 

export {uploadOnCloudinary}