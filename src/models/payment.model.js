import mongoose from "mongoose";
const paymentSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true           
    } ,
    amount:{
        type:Number,
        required:true
    },
    paymentId:{
        type:String,
        unique:true,
        required:true
    },
    subscriptionType:{
        type:String,
        enum:["premiumlifetime","premiummonthly"],
        required:true
    },
    status:{
        type:String,
        enum:["success","failed"],
        required:true
    },
    subscriptionstartdate:{
        type:Date,
        required:true
    },
    subscriptionenddate:{
        type:Date,
        required:true   
    }
},{
    timestamps:true
})
