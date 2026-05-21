import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const folderschema=new Schema({
    foldername:{
        type:String,
        unique:true,
        required:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    noofqueries:{
            type:Number,
            default:0
           }
},{
    timestamps:true
})
folderschema.plugin(mongooseAggregatePaginate);
export const Folder=mongoose.model("Folder",folderschema);