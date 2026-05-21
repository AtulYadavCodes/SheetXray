import cron from 'node-cron';
import {User} from '../models/user.model.js'

cron.schedule("0 0 * * *",async()=>{
       try {
        const result= await User.updateMany(
             {usertype:"premiummonthly",
             subscriptionExpiryDate:{$lte:new Date()}}
         ,
     {
        $set:{ waspremium:true,
         usertype:"free"
        }
     })
     console.log("users :",result.modifiedCount);
       } catch (error) {
      console.log("Error in cron job:",error);
       }
    })

    
//runs every day to update the users subscription status