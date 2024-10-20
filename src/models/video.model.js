import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema({
    videoFile:{
        type:String, //cloudinary url
        required:[true,'video is required']
    },
    thumbnail:{
        type:String, //cloudinary url
        required:[true,'Thumbnail is required']
    },
    title:{
        type:String, 
        required:true
    },
    description:{
        type:String, 
        required:true
    },
    duration:{
        type:Number, //cloudinary url
        required:true
    },
    views:{
        type:Number,
        default:0
    },
    isPublished:{
        type:Boolean,
        default:true
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

videoSchema.plugin(mongooseAggregatePaginate)/*
plugin(): The plugin function in Mongoose allows you to extend the schema functionality by adding reusable logic.

mongooseAggregatePaginate: This is a Mongoose plugin that enables pagination on aggregate queries.

Normally, aggregate queries return large sets of data, and pagination allows breaking that data into smaller, more manageable chunks.
With this plugin, you can easily paginate the results by specifying the page number, size, etc., when querying the database.
Usage: This is particularly helpful when your data set grows over time, and you want to support paginated results (e.g., showing videos 10 at a time on a webpage).

In summary, this line enables pagination functionality for Mongoose aggregate queries used in your videoSchema.
 */

export const Video = mongoose.model("Video",videoSchema)