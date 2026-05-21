import {Router} from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {Folder} from "../models/folder.model.js";
import { upload } from "../middlewares/multer.middleware.js";
import { createfolder,getalluserfolders,queryfolder,deletefolder,allsheetsinfolder, getchathistory } from "../controllers/folder.controller.js";

const router=Router();
router.route('/createfolder').post(verifyJWT,upload.none(),createfolder);
router.route('/getalluserfolders').get(verifyJWT,getalluserfolders);
router.route('/deletefolder/:folderid').delete(verifyJWT,deletefolder);
router.route('/getallsheetsinfolder/:folderid').get(verifyJWT,allsheetsinfolder);
router.route('/getchathistory/:folderid').get(verifyJWT,getchathistory);
router.route('/query/:folderid').post(verifyJWT,upload.none(),queryfolder);
export default router;