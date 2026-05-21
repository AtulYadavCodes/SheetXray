import mongoose from "mongoose";
import { Schema } from "mongoose";

const qachatSchema=new Schema({
    userid:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:"User"
    },
    folderid:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:"Folder"
    },
    userquery:{
        type:String,
        required:true
    },
    llmresponse:{
        type:String,
        required:true
    }
},{timestamps:true});

const Qachat=mongoose.model("Qachat",qachatSchema);

export {Qachat};