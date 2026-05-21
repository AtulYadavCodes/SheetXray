import { asyncHandler } from "../utils/asyncHandler.js";
import errorhandler from "../utils/errorhandler.js";
import redis from "../db/redis.js";

export const ratelimMiddleware=(type)=>asyncHandler(async(req,res,next)=>{
    const key=`${type}${req.body.email}:${req.ip}`;
    const attempts=Number(await redis.get(key) || 0);
    /*if(attempts===1){
        await redis.expire(key,60);
    }
        */
     if(attempts>=5)
      if(type==="login")
         throw new errorhandler(429,"Too many login attempts. Please try again later.",);
      else
         throw new errorhandler(429,"Too many otp attempts. Please try again later.",);

    next();
})