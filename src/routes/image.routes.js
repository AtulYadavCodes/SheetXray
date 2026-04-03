import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { getalluserimages,uploadimage } from '../controllers/image.controller.js';
import { upload } from '../middlewares/multer.middleware.js';

const router=Router();
router.route('/uploadimage').post(verifyJWT,upload.single('file'),uploadimage);
router.route('/getalluserimages').get(verifyJWT,getalluserimages);
export default router;