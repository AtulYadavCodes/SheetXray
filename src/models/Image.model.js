import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const imageschema=new Schema({
    imagelink:{
        type:String,
        required:true
    },
    imagename:{
        type:String,
        required:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    filesize:{
        type:Number,
        required:true
    }, 
    filepreviewimages:{
        type: String , //url cloudinary
        default:"https://res.cloudinary.com/dzcmadjlq/image/upload/v1696543783/ClauseValidator/default_pdf_oyh3v0.png"
    }
},{
    timestamps:true
})
imageschema.plugin(mongooseAggregatePaginate);
export const Image=mongoose.model("Image",imageschema);