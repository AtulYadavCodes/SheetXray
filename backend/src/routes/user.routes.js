import {Router} from "express"
import { upload } from "../middlewares/multer.middleware.js"
import { loginuser, logoutuser, registerUser,refreshAccessToken, returnuserProfile,updateuseravatar,updateuserpassword,updateuseremail} from "../controllers/user.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

import { ratelimMiddleware } from "../middlewares/ratelim.middleware.js"
import { verifyotp } from "../middlewares/verifyotp.middleware.js"
import { createotpandmail } from "../controllers/otp.controller.js"
const router=Router()
//just gets user email and sends otp to email, no authentication required
router.route('/otpsender').post(upload.none(),ratelimMiddleware("otp"),createotpandmail) 
router.route('/register').post(
    upload.single('avatar'),verifyotp ,
    registerUser) //once user click verify otp then this is invoked 
                   //user is created only after otp verification
router.route('/login').post(upload.none(),ratelimMiddleware("login"), loginuser)


//secured routes 
router.route('/logout').post(verifyJWT,logoutuser);
router.route('/refreshAccessToken').post(refreshAccessToken);
router.route('/profile').get(verifyJWT,returnuserProfile);
router.route('/updateprofileavatar').patch(verifyJWT,upload.single('avatar'),updateuseravatar);
router.route('/updatepassword').post(verifyJWT,upload.none(),updateuserpassword);
router.route('/updateemail').patch(verifyJWT,upload.none(),updateuseremail);
export default router